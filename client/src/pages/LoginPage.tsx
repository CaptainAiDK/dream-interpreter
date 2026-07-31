import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function LoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login fejlede");
        setLoading(false);
        return;
      }

      // Reload the page to trigger re-auth
      window.location.href = "/";
    } catch {
      setError("Kunne ikke forbinde til serveren");
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
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "20px",
          padding: "40px",
          width: "100%",
          maxWidth: "380px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌙</div>
          <h1
            style={{
              color: "white",
              fontSize: "24px",
              fontWeight: 700,
              margin: "0 0 6px",
            }}
          >
            Drømmetolker
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 }}>
            Log ind for at tolke dine drømme
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                color: "rgba(255,255,255,0.7)",
                fontSize: "13px",
                marginBottom: "6px",
                fontWeight: 500,
              }}
            >
              Brugernavn
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "10px",
                color: "white",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                color: "rgba(255,255,255,0.7)",
                fontSize: "13px",
                marginBottom: "6px",
                fontWeight: 500,
              }}
            >
              Kodeord
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Indtast kodeord fra .env filen"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "10px",
                color: "white",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          {error && (
            <div
              style={{
                background: "rgba(255,80,80,0.15)",
                border: "1px solid rgba(255,80,80,0.3)",
                borderRadius: "10px",
                padding: "12px 16px",
                color: "#ff8080",
                fontSize: "13px",
                marginBottom: "16px",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading
                ? "rgba(139,92,246,0.4)"
                : "linear-gradient(135deg, #8b5cf6, #6366f1)",
              border: "none",
              borderRadius: "10px",
              color: "white",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Logger ind..." : "Log ind 🌙"}
          </button>
        </form>
      </div>
    </div>
  );
}
