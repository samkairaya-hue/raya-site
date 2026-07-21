import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  component: Layout,
});

function Layout() {
  const nav = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      if (!data.user) {
        nav({ to: "/auth" });
        return;
      }
      setEmail(data.user.email || "");
      setReady(true);
    });
    return () => { cancelled = true; };
  }, [nav]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8F9FA" }}>
        <div className="text-sm" style={{ color: "var(--text-muted)" }}>טוען…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8F9FA", direction: "rtl" }}>
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b" style={{ borderColor: "rgba(0,0,0,.08)" }}>
        <div className="font-bold" style={{ color: "var(--text-dark)" }}>CMS · ניהול תוכן</div>
        <div className="flex items-center gap-4 text-sm">
          <span style={{ color: "var(--text-muted)" }}>{email}</span>
          <a href="/" className="font-bold" style={{ color: "var(--accent-primary)" }}>צפייה באתר</a>
          <button
            onClick={async () => { await supabase.auth.signOut(); nav({ to: "/auth" }); }}
            className="bg-transparent border-0 cursor-pointer text-sm"
            style={{ color: "var(--destructive)" }}
          >יציאה</button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
