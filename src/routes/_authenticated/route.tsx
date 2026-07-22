import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { checkAdminSession, adminLogin, adminLogout } from "@/lib/admin-auth.functions";

export const Route = createFileRoute("/_authenticated")({
  component: Layout,
});

function Layout() {
  const nav = useNavigate();
  const check = useServerFn(checkAdminSession);
  const login = useServerFn(adminLogin);
  const logout = useServerFn(adminLogout);
  const [status, setStatus] = useState<"loading" | "locked" | "unlocked">("loading");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    check().then((r) => setStatus(r.authenticated ? "unlocked" : "locked"));
  }, [check]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await login({ data: { password } });
      if (r.ok) {
        setPassword("");
        setStatus("unlocked");
      } else {
        setError("סיסמה שגויה");
      }
    } catch (err: any) {
      setError(err?.message || "שגיאה");
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8F9FA" }}>
        <div className="text-sm" style={{ color: "var(--text-muted)" }}>טוען…</div>
      </div>
    );
  }

  if (status === "locked") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-cream)", direction: "rtl" }}>
        <div className="w-full max-w-md p-10 card-surface">
          <h1 className="text-2xl mb-2 text-center">כניסת מנהל</h1>
          <p className="text-center mb-6 text-sm">הזן/י את סיסמת הניהול</p>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="field">
              <label htmlFor="p">סיסמה</label>
              <input
                id="p"
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
              />
            </div>
            {error && <p className="text-sm" style={{ color: "var(--destructive)" }}>{error}</p>}
            <button type="submit" className="cta" disabled={busy}>
              {busy ? "…" : "כניסה"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8F9FA", direction: "rtl" }}>
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b" style={{ borderColor: "rgba(0,0,0,.08)" }}>
        <div className="font-bold" style={{ color: "var(--text-dark)" }}>CMS · ניהול תוכן</div>
        <div className="flex items-center gap-4 text-sm">
          <a href="/" className="font-bold" style={{ color: "var(--accent-primary)" }}>צפייה באתר</a>
          <button
            onClick={async () => {
              await logout();
              setStatus("locked");
              nav({ to: "/admin" });
            }}
            className="bg-transparent border-0 cursor-pointer text-sm"
            style={{ color: "var(--destructive)" }}
          >יציאה</button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
