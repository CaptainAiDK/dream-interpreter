import { Capacitor } from "@capacitor/core";
import { useState } from "react";

const getApiBaseUrl = () => {
  const apiUrl =
    import.meta.env.VITE_API_URL ||
    "https://dream-interpreter-production-c407.up.railway.app";
  return apiUrl.replace(/\/$/, "");
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      window.location.href = `${getApiBaseUrl()}/api/auth/google/start`;
    } catch (err) {
      console.error("[GoogleAuth] start failed", err);
      setError(err instanceof Error ? err.message : "Kunne ikke starte Google login");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        fontFamily: "'Inter', sans-serif",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 24,
          padding: 32,
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 54, marginBottom: 12 }}>🌙</div>
          <h1 style={{ color: "white", fontSize: 28, fontWeight: 700, margin: 0 }}>
            Drømmetolker
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, marginTop: 8 }}>
            Log ind med Google for at fortsætte
          </p>
        </div>

        <button
          onClick={startGoogleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: 12,
            border: "none",
            background: loading ? "rgba(255,255,255,0.18)" : "#ffffff",
            color: "#111827",
            fontSize: 16,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <span>🔵</span>
          {loading ? "Åbner Google..." : "Fortsæt med Google"}
        </button>

        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 16, textAlign: "center" }}>
          {Capacitor.isNativePlatform()
            ? "På telefonen åbner login i browseren og vender tilbage til appen."
            : "Du bliver sendt til Googles login og tilbage til appen bagefter."}
        </p>

        {error && (
          <div
            style={{
              marginTop: 16,
              background: "rgba(255,80,80,0.15)",
              border: "1px solid rgba(255,80,80,0.3)",
              borderRadius: 10,
              padding: "12px 16px",
              color: "#ff9b9b",
              fontSize: 13,
            }}
          >
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}
