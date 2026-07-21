import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: Layout,
});

function Layout() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email || ""));
  }, []);
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
