import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { ENV } from "./env";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
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
