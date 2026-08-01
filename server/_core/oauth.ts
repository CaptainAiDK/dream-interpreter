import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { ENV } from "./env";
import { createRemoteJWKSet, jwtVerify } from "jose";
import crypto from "node:crypto";
import { parse as parseCookieHeader } from "cookie";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

function getCookieValue(req: Request, key: string): string | undefined {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return undefined;
  return parseCookieHeader(cookieHeader)[key];
}

const GOOGLE_ISSUERS = ["accounts.google.com", "https://accounts.google.com"];
const GOOGLE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs")
);

function getPublicBaseUrl(req: Request) {
  const forwardedHost = req.headers["x-forwarded-host"];
  const host = Array.isArray(forwardedHost)
    ? forwardedHost[0]
    : forwardedHost || req.get("host");
  const forwardedProto = req.headers["x-forwarded-proto"];
  const proto = Array.isArray(forwardedProto)
    ? forwardedProto[0]
    : forwardedProto || req.protocol;
  return `${proto}://${host}`;
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/auth/google/start", (req: Request, res: Response) => {
    if (!ENV.googleClientId) {
      res.status(500).json({ error: "GOOGLE_CLIENT_ID is missing" });
      return;
    }

    const state = crypto.randomBytes(24).toString("hex");
    const redirectUri =
      ENV.googleRedirectUri ||
      `${getPublicBaseUrl(req)}/api/auth/google/callback`;
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", ENV.googleClientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "openid email profile");
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("prompt", "select_account");
    authUrl.searchParams.set("access_type", "online");

    res.cookie("google_oauth_state", state, {
      ...getSessionCookieOptions(req),
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });

    res.redirect(authUrl.toString());
  });

  // ─── Local Login (replaces Manus OAuth) ───────────────────────────────────
  // Simple username + password login stored in .env
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body ?? {};
      console.info("[Auth] Login attempt", {
        username,
        localAuthEnabled: ENV.localAuthEnabled,
        hasLocalPassword: Boolean(ENV.localAuthPassword),
        localAuthUsername: ENV.localAuthUsername,
      });

      if (!ENV.localAuthEnabled) {
        console.warn("[Auth] Local auth disabled");
        res.status(404).json({ error: "Local auth is disabled" });
        return;
      }

      if (!ENV.localAuthPassword) {
        console.error("[Auth] LOCAL_AUTH_PASSWORD is missing");
        res.status(500).json({
          error:
            "LOCAL_AUTH_PASSWORD er ikke sat i .env filen. Tilføj: LOCAL_AUTH_PASSWORD=dit-kodeord",
        });
        return;
      }

      if (
        username !== ENV.localAuthUsername ||
        password !== ENV.localAuthPassword
      ) {
        console.warn("[Auth] Invalid credentials", {
          username,
          expectedUsername: ENV.localAuthUsername,
        });
        res.status(401).json({ error: "Forkert brugernavn eller kodeord" });
        return;
      }

      const openId = `local:${ENV.localAuthUsername}`;

      // Ensure user exists in database
      await db.upsertUser({
        openId,
        name: ENV.localAuthUsername,
        email: null,
        loginMethod: "local",
        role: "admin",
        lastSignedIn: new Date().toISOString(),
      });

      const sessionToken = await sdk.createSessionToken(openId, {
        name: ENV.localAuthUsername,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      console.info("[Auth] Login success", { openId });
      res.json({ success: true, name: ENV.localAuthUsername });
    } catch (error) {
      console.error("[Auth] Login failed:", error);
      res.status(500).json({ error: "Login fejlede på serveren" });
    }
  });

  app.get("/api/auth/google/callback", async (req: Request, res: Response) => {
    try {
      const code = getQueryParam(req, "code");
      const state = getQueryParam(req, "state");
      const cookieState = getCookieValue(req, "google_oauth_state");
      const redirectUri =
        ENV.googleRedirectUri ||
        `${getPublicBaseUrl(req)}/api/auth/google/callback`;

      if (!ENV.googleClientId || !ENV.googleClientSecret) {
        res.status(500).send("Google auth is not configured");
        return;
      }

      if (!code || !state || !cookieState || state !== cookieState) {
        res.status(400).send("Invalid Google login state");
        return;
      }

      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: ENV.googleClientId,
          client_secret: ENV.googleClientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenResponse.ok) {
        const body = await tokenResponse.text();
        console.error("[GoogleAuth] token exchange failed", tokenResponse.status, body);
        res.status(500).send("Google token exchange failed");
        return;
      }

      const tokenData = (await tokenResponse.json()) as {
        id_token?: string;
        access_token?: string;
      };

      if (!tokenData.id_token) {
        res.status(500).send("Google id_token missing");
        return;
      }

      const { payload } = await jwtVerify(tokenData.id_token, GOOGLE_JWKS, {
        audience: ENV.googleClientId,
        issuer: GOOGLE_ISSUERS,
      });

      const googleSub = payload.sub;
      const email = typeof payload.email === "string" ? payload.email : null;
      const name = typeof payload.name === "string" ? payload.name : email ?? "Google user";

      if (!googleSub) {
        res.status(500).send("Google subject missing");
        return;
      }

      const openId = `google:${googleSub}`;

      await db.upsertUser({
        openId,
        name,
        email,
        loginMethod: "google",
        lastSignedIn: new Date().toISOString(),
      });

      const sessionToken = await sdk.createSessionToken(openId, {
        name,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.clearCookie("google_oauth_state", { ...cookieOptions, maxAge: 0 });
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[GoogleAuth] callback failed", error);
      res.status(500).send("Google login failed");
    }
  });

  // ─── Logout ────────────────────────────────────────────────────────────────
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME);
    res.json({ success: true });
  });

  // ─── Manus OAuth callback (kept for backwards compatibility) ───────────────
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date().toISOString(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
