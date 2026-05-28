import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout?.();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        .nav-link-reset { text-decoration: none !important; }
        .nav-link-reset:hover { text-decoration: none !important; }
        .btn-logout:hover { background: rgba(255,255,255,0.08) !important; }
      `}</style>

      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#071426",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
          }}
        >
          {/* LEFT — Brand */}
          <Link to="/" className="nav-link-reset" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "#0d9488",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#ffffff",
                  fontFamily: "'Sora', sans-serif",
                  letterSpacing: "-0.2px",
                }}
              >
                Reservasi Dokter
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.2px",
                }}
              >
                Platform Kesehatan Digital
              </p>
            </div>
          </Link>

          {/* RIGHT */}
          {!user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link
                to="/login"
                className="nav-link-reset"
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: 500,
                  transition: "background 0.15s",
                }}
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="nav-link-reset"
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "#0d9488",
                  fontSize: "13px",
                  color: "#ffffff",
                  fontWeight: 600,
                  transition: "opacity 0.15s",
                }}
              >
                Daftar
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* User info */}
              <div style={{ textAlign: "right", display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff", lineHeight: 1.3 }}>
                  {user.name}
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "capitalize", lineHeight: 1.3 }}>
                  {user.role}
                </span>
              </div>

              {/* Avatar */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(13,148,136,0.2)",
                  border: "1.5px solid rgba(13,148,136,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#5eead4",
                  flexShrink: 0,
                }}
              >
                {user.name?.[0]?.toUpperCase()}
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="btn-logout"
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "background 0.15s",
                }}
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}