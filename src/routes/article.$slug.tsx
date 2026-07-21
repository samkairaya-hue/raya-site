import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { loadSite } from "@/lib/cms.functions";
import { ThemeStyle } from "@/components/ThemeStyle";
import { SubpageLayout } from "./expertise.$slug";
import type { SiteData } from "@/lib/cms-types";

export const Route = createFileRoute("/article/$slug")({
  loader: async ({ params }) => {
    const site = await loadSite();
    const card = site.magazine.find((c) => c.slug === params.slug);
    if (!card || !card.target_body?.trim()) throw notFound();
    return { site, card };
  },
  head: ({ loaderData }) =>
    loaderData ? { meta: [{ title: `${loaderData.card.target_title || loaderData.card.title} | רעיה ברכה` }] } : {},
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
  const image = card.target_image_url || card.image_url;
  const title = card.target_title || card.title;
  return (
    <>
      <ThemeStyle theme={site.theme} />
      <SubpageLayout siteFooter={site.footer}>
        {card.tag && (
          <div className="font-bold mb-3" style={{ color: "var(--accent-primary)", fontSize: ".95rem" }}>{card.tag}</div>
        )}
        <h1 className="mb-4" style={{ fontSize: "2.8rem", lineHeight: 1.2 }}>{title}</h1>
        <p className="mb-8" style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>{card.description}</p>
        {image && (
          <img src={image} alt="" className="w-full mb-10" style={{ maxHeight: 480, objectFit: "cover", borderRadius: 20 }} />
        )}
        <article className="text-lg leading-8" style={{ whiteSpace: "pre-wrap" }}>{card.target_body}</article>
      </SubpageLayout>
    </>
  );
}
