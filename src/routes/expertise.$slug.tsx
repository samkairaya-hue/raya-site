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
  const { card } = Route.useLoaderData() as { site: SiteData; card: any };
  return <HtmlPageFrame html={card.target_body} />;
}

export function HtmlPageFrame({ html }: { html: string }) {
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", background: "#fff" }}>
      <div
        style={{
          padding: "10px 20px",
          borderBottom: "1px solid rgba(0,0,0,.08)",
          background: "#fff",
          direction: "rtl",
          fontFamily: "Assistant, system-ui, sans-serif",
        }}
      >
        <Link to="/" style={{ color: "#DC5A5A", fontWeight: 700, textDecoration: "none" }}>
          → חזרה לדף הבית
        </Link>
      </div>
      <iframe
        title="content"
        srcDoc={html}
        style={{ flex: 1, width: "100%", border: 0 }}
        sandbox="allow-same-origin allow-popups allow-forms allow-scripts"
      />
    </div>
  );
}
