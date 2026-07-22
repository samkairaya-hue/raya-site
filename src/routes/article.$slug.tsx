import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { loadSite } from "@/lib/cms.functions";
import { HtmlPageFrame } from "./expertise.$slug";
import type { SiteData } from "@/lib/cms-types";

export const Route = createFileRoute("/article/$slug")({
  loader: async ({ params }) => {
    const site = await loadSite();
    const card = site.magazine.find((c) => c.slug === params.slug);
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
