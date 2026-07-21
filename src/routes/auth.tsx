import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/auth" },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (err: any) {
      setError(err?.message || "שגיאה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-cream)" }}>
      <div className="w-full max-w-md p-10 card-surface">
        <h1 className="text-2xl mb-2 text-center">כניסת מנהל</h1>
        <p className="text-center mb-6 text-sm">{mode === "signup" ? "יצירת מנהל ראשוני" : "התחברות למערכת הניהול"}</p>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="field">
            <label htmlFor="e">אימייל</label>
            <input id="e" type="email" required value={email} onChange={(ev) => setEmail(ev.target.value)} dir="ltr" />
          </div>
          <div className="field">
            <label htmlFor="p">סיסמה</label>
            <input id="p" type="password" required minLength={6} value={password} onChange={(ev) => setPassword(ev.target.value)} dir="ltr" />
          </div>
          {error && <p className="text-sm" style={{ color: "var(--destructive)" }}>{error}</p>}
          <button type="submit" className="cta" disabled={loading}>
            {loading ? "…" : mode === "signup" ? "צור חשבון" : "כניסה"}
          </button>
          <button type="button" onClick={() => setMode(mode === "signup" ? "login" : "signup")} className="text-sm bg-transparent border-0 cursor-pointer" style={{ color: "var(--accent-primary)" }}>
            {mode === "signup" ? "כבר יש חשבון? כניסה" : "אין עדיין חשבון? יצירה"}
          </button>
        </form>
      </div>
    </div>
  );
}
