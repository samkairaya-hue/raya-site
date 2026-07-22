import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { loadSite } from "@/lib/cms.functions";
import type { SiteData } from "@/lib/cms-types";

export const Route = createFileRoute("/expertise/$slug")({
  loader: async ({ params }) => {
    const site = await loadSite();
    const card =
      site.matrix.find((c) => c.slug === params.slug) ||
      site.outcomes.find((c) => c.slug === params.slug);
    if (!card || !card.target_body?.trim()) throw notFound();
    return { site, card };
  },
  head: ({ loaderData }) =>
    loaderData ? { meta: [{ title: `${loaderData.card.title} | רעיה ברכה` }] } : {},
  component: Page,
  errorComponent: ({ error }) => <pre className="p-8">{String(error)}</pre>,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1>לא נמצא</h1>
        <Link to="/" className="cta mt-4 inline-block">חזרה לדף הבית</Link>
      </div>
    </div>
  ),
});

function Page() {
  const { site, card } = Route.useLoaderData() as { site: SiteData; card: any };
  return (
    <HtmlPageFrame
      html={card.target_body}
      siteTitle={site.settings.site_title || "רעיה ברכה | EMID"}
      ctaText={site.hero.button_text}
    />
  );
}

export function HtmlPageFrame({
  html,
  siteTitle,
  ctaText,
}: {
  html: string;
  siteTitle: string;
  ctaText: string;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", background: "#fff" }}>
      <header
        style={{
          padding: "10px 20px",
          borderBottom: "1px solid rgba(0,0,0,.08)",
          background: "#fff",
          direction: "rtl",
          fontFamily: "Assistant, system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "var(--text-dark)", fontWeight: 800, fontSize: "1.25rem" }}>
            {siteTitle}
          </span>
          <a href="/#contact" className="cta" style={{ padding: "10px 22px", fontSize: "0.95rem", borderRadius: "9999px" }}>
            {ctaText}
          </a>
        </div>
        <Link to="/" style={{ color: "#DC5A5A", fontWeight: 700, textDecoration: "none" }}>
          → חזרה לדף הבית
        </Link>
      </header>
      <iframe
        title="content"
        srcDoc={html}
        style={{ flex: 1, width: "100%", border: 0 }}
        sandbox="allow-same-origin allow-popups allow-forms allow-scripts"
      />
    </div>
  );
}
