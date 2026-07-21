import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { loadSite, getCardBySlug } from "@/lib/cms.functions";
import { ThemeStyle } from "@/components/ThemeStyle";
import type { SiteData } from "@/lib/cms-types";

export const Route = createFileRoute("/expertise/$slug")({
  loader: async ({ params }) => {
    const site = await loadSite();
    // Try matrix first, then outcomes
    let card =
      site.matrix.find((c) => c.slug === params.slug) ||
      site.outcomes.find((c) => c.slug === params.slug);
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
        <h1 className="mb-6" style={{ fontSize: "2.6rem", lineHeight: 1.2 }}>{title}</h1>
        {image && (
          <img src={image} alt="" className="w-full mb-10" style={{ maxHeight: 420, objectFit: "cover", borderRadius: 16 }} />
        )}
        <article className="text-lg leading-8" style={{ whiteSpace: "pre-wrap" }}>{card.target_body}</article>
      </SubpageLayout>
    </>
  );
}

export function SubpageLayout({ children, siteFooter }: { children: React.ReactNode; siteFooter: { right: string; center: string } }) {
  return (
    <>
      <section style={{ background: "var(--bg-cream)", padding: "80px 0 100px" }}>
        <div className="container-x" style={{ maxWidth: 820 }}>
          <Link to="/" className="inline-block mb-8 font-bold" style={{ color: "var(--accent-primary)" }}>→ חזרה לדף הבית</Link>
          {children}
        </div>
      </section>
      <footer style={{ background: "var(--footer-bg)", color: "#94A3B8", padding: "48px 24px", textAlign: "center", fontSize: ".9rem" }}>
        <div className="container-x flex items-center justify-between flex-wrap gap-4">
          <div className="font-bold" style={{ color: "#fff" }}>{siteFooter.right}</div>
          <div>{siteFooter.center}</div>
        </div>
      </footer>
    </>
  );
}
