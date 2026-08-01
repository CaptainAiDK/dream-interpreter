export const ENV = {
  appId: process.env.VITE_APP_ID ?? "dream-interpreter",
  cookieSecret: process.env.JWT_SECRET ?? "change-this-secret-in-production",
  databasePath: process.env.DATABASE_PATH ?? "./dream-interpreter.db",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  googleRedirectUri:
    process.env.GOOGLE_REDIRECT_URI ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  // Google Gemini API (free tier – get key at https://aistudio.google.com/apikey)
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  // Local auth settings (used when Manus OAuth is not available)
  localAuthEnabled: process.env.LOCAL_AUTH_ENABLED !== "false",
  localAuthUsername: process.env.LOCAL_AUTH_USERNAME ?? "admin",
  localAuthPassword: process.env.LOCAL_AUTH_PASSWORD ?? "",
};
