import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { loadSite, sendContact } from "@/lib/cms.functions";
import { ThemeStyle } from "@/components/ThemeStyle";
import { ExpandableText } from "@/components/ExpandableText";
import type { SiteData } from "@/lib/cms-types";

export const Route = createFileRoute("/")({
  loader: () => loadSite(),
  component: Home,
  errorComponent: ({ error }) => <pre className="p-8">{String(error)}</pre>,
});

function Home() {
  const data = Route.useLoaderData() as SiteData;
  return (
    <>
      <ThemeStyle theme={data.theme} />
      <Hero data={data} />
      <EmidSection data={data} />
      <MatrixSection data={data} />
      <BridgeSection data={data} />
      <OutcomesSection data={data} />
      <MagazineSection data={data} />
      <AboutSection data={data} />
      <FaqSection data={data} />
      <ContactSection data={data} />
      <Footer data={data} />
    </>
  );
}

function scrollToContact(e: React.MouseEvent) {
  e.preventDefault();
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

function Hero({ data }: { data: SiteData }) {
  const h = data.hero;
  return (
    <section className="hero-section-mobile" style={{ background: "var(--bg-cream)", padding: "120px 0 90px" }}>
      <div className="container-x responsive-2col grid gap-16 items-center" style={{ gridTemplateColumns: "1.2fr 0.8fr" }}>
        <div>
          <div className="font-bold mb-3" style={{ color: "var(--accent-primary)", fontSize: "1.1rem" }}>
            {h.subtitle}
          </div>
          <h1 className="mb-4 hero-h1-mobile" style={{ fontSize: "3rem", lineHeight: 1.2 }}>{h.title}</h1>
          <h2 className="mb-7 hero-h2-mobile" style={{ color: "var(--text-muted)", fontSize: "1.3rem", fontWeight: 600, lineHeight: 1.6 }}>
            {h.subheading}
          </h2>
          <p className="hero-body-mobile" style={{ fontSize: "1.15rem", lineHeight: 1.8 }}>{h.body}</p>
        </div>
        <div className="flex justify-center hero-image-order">
          {h.image_url && (
            <img
              src={h.image_url}
              alt=""
              className="w-full responsive-img"
              style={{ maxWidth: 380, height: 480, objectFit: "cover", borderRadius: 16, boxShadow: "0 20px 40px rgba(30,41,59,.08)" }}
            />
          )}
        </div>
        <div className="text-center mt-6" style={{ gridColumn: "1 / -1" }}>
          <a href="#contact" onClick={scrollToContact} className="cta">{h.button_text}</a>
        </div>
      </div>
    </section>
  );
}

function EmidSection({ data }: { data: SiteData }) {
  const e = data.emid;
  return (
    <section className="section-padded-mobile" style={{ background: "var(--bg-sand)", padding: "110px 0" }}>
      <div className="container-x responsive-2col grid gap-16 items-center" style={{ gridTemplateColumns: "1.1fr 0.9fr" }}>
        <div>
          <h2 className="mb-5 section-title-mobile" style={{ fontSize: "2.3rem" }}>{e.title}</h2>
          <ExpandableText text={e.body} lines={8} className="text-lg leading-8" />
        </div>
        <div className="flex justify-center">
          {e.image_url ? (
            <img
              src={e.image_url}
              alt=""
              className="w-full responsive-img"
              style={{ maxWidth: 380, height: 420, objectFit: "cover", borderRadius: 24, boxShadow: "0 12px 36px rgba(30,41,59,.08)" }}
            />
          ) : (
            <div className="p-12 flex items-center justify-center" style={{ background: "#fff", borderRadius: 24, boxShadow: "0 12px 36px rgba(30,41,59,.03)", border: "1px solid rgba(224,122,95,.15)" }}>
              <svg viewBox="0 0 200 200" width="240" height="240" style={{ color: "var(--accent-primary)" }} fill="none">
                <path d="M 30 100 C 30 50, 70 50, 70 100 C 70 150, 110 150, 110 100 C 110 70, 130 70, 140 100 L 180 100" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="30" cy="100" r="6" fill="currentColor" opacity="0.5" />
                <circle cx="180" cy="100" r="6" fill="currentColor" />
                <path d="M 50 100 A 50 50 0 0 1 150 100" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const iconClass = "w-6 h-6";
const matrixIcons = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass}><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass}><path d="M12 21l-1.5-1.3C5.4 15.3 2 12.3 2 8.5 2 5.4 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1C13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.4 22 8.5c0 3.8-3.4 6.8-8.5 11.5L12 21z" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass}><path d="M18.4 5.6a9 9 0 1 1-12.7 0" /><line x1="12" y1="2" x2="12" y2="12" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass}><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass}><path d="M5 22h14" /><path d="M5 2h14" /><path d="M17 22v-4.2a2 2 0 0 0-.6-1.4L12 12l-4.4 4.4A2 2 0 0 0 7 17.8V22" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.9" /><path d="M16 3.1a4 4 0 0 1 0 7.8" /></svg>,
];

function MatrixSection({ data }: { data: SiteData }) {
  return (
    <section style={{ background: "var(--bg-cream)", padding: "110px 0" }}>
      <div className="container-x">
        <div className="section-header">
          <h2>{data.matrix_header.title}</h2>
          <p>{data.matrix_header.subtitle}</p>
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {data.matrix.map((c, i) => {
            const clickable = !!c.target_body?.trim();
            const inner = (
              <div className="card-surface h-full" style={{ padding: "36px 28px" }}>
                <div className="mb-5 flex items-center justify-center" style={{ width: 52, height: 52, borderRadius: 14, background: "color-mix(in oklab, var(--accent-primary) 12%, transparent)", color: "var(--accent-primary)" }}>
                  {matrixIcons[i % matrixIcons.length]}
                </div>
                <h3 className="mb-3" style={{ fontSize: "1.2rem" }}>{c.title}</h3>
                <p style={{ fontSize: ".98rem", lineHeight: 1.7 }}>{c.description}</p>
              </div>
            );
            return clickable ? (
              <Link key={c.id} to="/expertise/$slug" params={{ slug: c.slug }} className="block">
                {inner}
              </Link>
            ) : (
              <div key={c.id}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BridgeSection({ data }: { data: SiteData }) {
  const b = data.bridge;
  return (
    <section style={{ background: "var(--bg-sand)", padding: "100px 0" }}>
      <div className="container-x">
        <div className="mx-auto text-center" style={{ maxWidth: 900, padding: "56px 48px", background: "#fff", borderRadius: 24, border: "1px solid rgba(224,122,95,.2)", boxShadow: "0 10px 30px rgba(30,41,59,.02)" }}>
          <h2 className="mb-6" style={{ color: "var(--accent-primary)", fontSize: "2.2rem" }}>{b.title}</h2>
          <ExpandableText text={b.body} lines={6} className="text-lg" />
        </div>
      </div>
    </section>
  );
}

function OutcomesSection({ data }: { data: SiteData }) {
  return (
    <section style={{ background: "var(--bg-cream)", padding: "110px 0" }}>
      <div className="container-x">
        <div className="section-header">
          <h2>{data.outcomes_header.title}</h2>
          <p>{data.outcomes_header.subtitle}</p>
        </div>
        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {data.outcomes.map((c) => {
            const clickable = !!c.target_body?.trim();
            const inner = (
              <div className="card-surface h-full flex flex-col items-center text-center" style={{ padding: "36px 20px" }}>
                <div className="mb-4 flex items-center justify-center" style={{ width: 48, height: 48, borderRadius: "50%", background: "color-mix(in oklab, var(--accent-primary) 12%, transparent)", color: "var(--accent-primary)" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><circle cx="12" cy="12" r="9" /><path d="M12 7v10" /></svg>
                </div>
                <h3 style={{ fontSize: "1.05rem", marginBottom: 8 }}>{c.title}</h3>
                <p style={{ fontSize: ".92rem", lineHeight: 1.6 }}>{c.description}</p>
              </div>
            );
            return clickable ? (
              <Link key={c.id} to="/expertise/$slug" params={{ slug: c.slug }} className="block">{inner}</Link>
            ) : (
              <div key={c.id}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MagazineSection({ data }: { data: SiteData }) {
  return (
    <section style={{ background: "var(--bg-sand)", padding: "110px 0" }}>
      <div className="container-x">
        <div className="section-header">
          <h2>{data.magazine_header.title}</h2>
          <p>{data.magazine_header.subtitle}</p>
        </div>
        <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {data.magazine.map((c) => {
            const clickable = !!c.target_body?.trim();
            const inner = (
              <div className="card-surface overflow-hidden flex flex-col h-full" style={{ padding: 0 }}>
                <div style={{ height: 200 }}>
                  {c.image_url && <img src={c.image_url} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="p-7 flex flex-col flex-grow">
                  <div className="font-bold mb-2" style={{ color: "var(--accent-primary)", fontSize: ".85rem" }}>{c.tag}</div>
                  <h3 className="mb-3" style={{ fontSize: "1.25rem", lineHeight: 1.4 }}>{c.title}</h3>
                  <p className="mb-5" style={{ fontSize: ".95rem", lineHeight: 1.65 }}>{c.description}</p>
                  {clickable && <span className="font-bold mt-auto" style={{ color: "var(--text-dark)" }}>להמשך קריאה ←</span>}
                </div>
              </div>
            );
            return clickable ? (
              <Link key={c.id} to="/article/$slug" params={{ slug: c.slug }}>{inner}</Link>
            ) : (
              <div key={c.id}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AboutSection({ data }: { data: SiteData }) {
  const a = data.about;
  return (
    <section style={{ background: "var(--bg-cream)", padding: "110px 0" }}>
      <div className="container-x grid gap-16 items-center" style={{ gridTemplateColumns: "0.8fr 1.2fr" }}>
        <div className="flex justify-center">
          {a.image_url && (
            <img src={a.image_url} alt="" className="w-full" style={{ maxWidth: 380, height: 480, objectFit: "cover", borderRadius: 16, boxShadow: "0 20px 40px rgba(30,41,59,.06)" }} />
          )}
        </div>
        <div>
          <h2 className="mb-5" style={{ fontSize: "2.3rem" }}>{a.title}</h2>
          <ExpandableText text={a.body} lines={6} className="text-lg leading-8" />
          <div className="mt-6 font-bold pr-4" style={{ color: "var(--text-dark)", borderRight: "3px solid var(--accent-primary)" }}>
            {a.credentials}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection({ data }: { data: SiteData }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <section style={{ background: "var(--bg-sand)", padding: "110px 0" }}>
      <div className="container-x" style={{ maxWidth: 850 }}>
        <div className="section-header">
          <h2>{data.faq_header.title}</h2>
          <p>{data.faq_header.subtitle}</p>
        </div>
        <div className="flex flex-col gap-4">
          {data.faqs.map((f, i) => {
            const open = openId === f.id;
            return (
              <div key={f.id} className="card-surface overflow-hidden" style={{ padding: 0, borderColor: open ? "var(--accent-primary)" : undefined }}>
                <button
                  onClick={() => setOpenId(open ? null : f.id)}
                  className="w-full flex items-center justify-between text-right p-6 bg-transparent border-0 cursor-pointer"
                  aria-expanded={open}
                >
                  <div className="flex items-center gap-4 flex-1 text-right">
                    <span
                      className="flex items-center justify-center font-bold shrink-0"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: open ? "var(--accent-primary)" : "var(--bg-cream)",
                        color: open ? "#fff" : "var(--accent-primary)",
                        fontSize: "0.95rem",
                        transition: "background .2s, color .2s",
                      }}
                    >
                      {i + 1}
                    </span>
                    <h3 style={{ fontSize: "1.1rem", color: open ? "var(--accent-primary)" : "var(--text-dark)" }}>{f.question}</h3>
                  </div>
                  <span style={{ color: "var(--accent-primary)", fontSize: "1.5rem", transform: open ? "rotate(45deg)" : "none", transition: "transform .3s" }}>+</span>
                </button>
                <div style={{ maxHeight: open ? 1000 : 0, overflow: "hidden", transition: "max-height .4s ease" }}>
                  <div className="px-8 pb-7">
                    <ExpandableText text={f.answer} lines={100} className="text-base leading-7" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ data }: { data: SiteData }) {
  const c = data.contact;
  const s = data.settings;
  const send = useServerFn(sendContact);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (resetTimer.current) clearTimeout(resetTimer.current); }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const fd = new FormData(e.currentTarget);
    setStatus("sending");
    setErrorMsg("");
    try {
      await send({
        data: {
          name: String(fd.get("name") || ""),
          phone: String(fd.get("phone") || ""),
          message: String(fd.get("message") || ""),
        },
      });
      setStatus("success");
      formRef.current?.reset();
      resetTimer.current = setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "שליחה נכשלה");
      resetTimer.current = setTimeout(() => setStatus("idle"), 4000);
    }
  }

  const btnText =
    status === "success" ? s.submit_success_text :
    status === "sending" ? "שולח…" :
    s.submit_button_text;

  return (
    <section id="contact" style={{ background: "var(--bg-cream)", padding: "100px 0" }}>
      <div className="container-x" style={{ maxWidth: 650 }}>
        <div className="section-header">
          <h2 style={{ fontSize: "2.2rem" }}>{c.title}</h2>
          <p>{c.subtitle}</p>
        </div>
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="flex flex-col gap-5"
          style={{ background: "#fff", padding: "48px 40px", borderRadius: 24, border: "1px solid rgba(226,232,240,.6)", boxShadow: "0 10px 40px rgba(30,41,59,.02)" }}
        >
          <div className="field">
            <label htmlFor="name">{c.name_label}</label>
            <input id="name" name="name" required maxLength={100} />
          </div>
          <div className="field">
            <label htmlFor="phone">{c.phone_label}</label>
            <input id="phone" name="phone" type="tel" required maxLength={50} />
          </div>
          <div className="field">
            <label htmlFor="message">{c.message_label}</label>
            <textarea id="message" name="message" maxLength={2000} />
          </div>
          <button
            type="submit"
            className={`cta ${status === "success" ? "cta-green" : ""}`}
            disabled={status === "sending"}
          >
            {btnText}
          </button>
          {status === "error" && <p className="text-center text-sm" style={{ color: "var(--destructive)" }}>{errorMsg}</p>}
        </form>
      </div>
    </section>
  );
}

function Footer({ data }: { data: SiteData }) {
  const navigate = useNavigate();
  return (
    <footer style={{ background: "var(--footer-bg)", color: "#94A3B8", padding: "48px 24px", textAlign: "center", fontSize: ".9rem" }}>
      <div className="container-x flex items-center justify-between flex-wrap gap-4">
        <div className="font-bold" style={{ color: "#fff" }}>{data.footer.right}</div>
        <div>{data.footer.center}</div>
        <button
          onClick={() => navigate({ to: "/admin" })}
          className="text-xs opacity-60 hover:opacity-100 bg-transparent border-0 cursor-pointer"
          style={{ color: "#94A3B8" }}
        >
          ניהול
        </button>

      </div>
    </footer>
  );
}
