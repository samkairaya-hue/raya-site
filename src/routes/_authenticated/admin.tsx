import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  loadSite,
  saveContent,
  saveCard,
  deleteCard,
  saveFaq,
  deleteFaq,
  reorderFaqs,
} from "@/lib/cms.functions";
import type { SiteData, Card, MagazineCard, Faq } from "@/lib/cms-types";
import { ImageUpload } from "@/components/ImageUpload";

export const Route = createFileRoute("/_authenticated/admin")({
  component: Admin,
});

const HERO_RES = "רזולוציה מומלצת: 760×960 פיקסלים (יחס 4:5), עד 500KB.";
const EMID_RES = "רזולוציה מומלצת: 800×900 פיקסלים, עד 500KB.";
const ABOUT_RES = "רזולוציה מומלצת: 800×800 פיקסלים (ריבוע), עד 500KB.";
const CARD_RES = "רזולוציה מומלצת: 600×400 פיקסלים (יחס 3:2), עד 300KB.";
const TARGET_RES = "רזולוציה מומלצת: 1200×675 פיקסלים (יחס 16:9), עד 500KB.";
const MAG_RES = "רזולוציה מומלצת: 800×500 פיקסלים (יחס 16:10), עד 400KB.";
const ARTICLE_RES = "רזולוציה מומלצת: 1200×675 פיקסלים (יחס 16:9), עד 500KB.";

function Admin() {
  const load = useServerFn(loadSite);
  const [site, setSite] = useState<SiteData | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => { load().then(setSite); }, [load]);

  if (!site) return <div className="p-10 text-center">טוען…</div>;

  const refresh = () => load().then(setSite);
  const flashMsg = (m: string) => flash(setMsg, m);

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-4">
      {msg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg text-sm z-50">
          {msg}
        </div>
      )}

      <Panel title="🎨 ערכת צבעים" defaultOpen>
        <ThemePanel site={site} onSaved={flashMsg} onRefresh={refresh} />
      </Panel>

      <Panel title="🏠 עמוד 1 – Hero">
        <JsonPanel
          site={site}
          k="hero"
          fields={[
            ["subtitle", "כותרת עליונה"],
            ["title", "כותרת ראשית", "textarea"],
            ["subheading", "תת-כותרת", "textarea"],
            ["body", "פסקת פתיחה", "textarea"],
            ["button_text", "טקסט כפתור"],
            ["image_url", "תמונת עמוד ראשי", "image", HERO_RES],
          ]}
          onSaved={flashMsg}
          onRefresh={refresh}
        />
      </Panel>

      <Panel title="🧠 עמוד 2 – שיטת EMID">
        <JsonPanel
          site={site}
          k="emid"
          fields={[
            ["title", "כותרת"],
            ["body", "טקסט", "textarea"],
            ["image_url", "תמונת העמוד", "image", EMID_RES],
          ]}
          onSaved={flashMsg}
          onRefresh={refresh}
        />
      </Panel>

      <Panel title="🎯 עמוד 3 – כותרות מטריצה">
        <JsonPanel site={site} k="matrix_header" fields={[
          ["title", "כותרת"],
          ["subtitle", "תת-כותרת", "textarea"],
        ]} onSaved={flashMsg} onRefresh={refresh} />
      </Panel>
      <Panel title="🎯 עמוד 3 – ריבועי מטריצה (לחיצים ליעד)">
        <CardsPanel kind="matrix" cards={site.matrix} onSaved={flashMsg} onRefresh={refresh} />
      </Panel>

      <Panel title="🌉 עמוד 4 – Bridge (טקסט מעבר)">
        <JsonPanel site={site} k="bridge" fields={[
          ["title", "כותרת"],
          ["body", "טקסט", "textarea"],
        ]} onSaved={flashMsg} onRefresh={refresh} />
      </Panel>

      <Panel title="✅ עמוד 5 – כותרות תוצאות">
        <JsonPanel site={site} k="outcomes_header" fields={[
          ["title", "כותרת"],
          ["subtitle", "תת-כותרת", "textarea"],
        ]} onSaved={flashMsg} onRefresh={refresh} />
      </Panel>
      <Panel title="✅ עמוד 5 – ריבועי תוצאות (לחיצים ליעד)">
        <CardsPanel kind="outcome" cards={site.outcomes} onSaved={flashMsg} onRefresh={refresh} />
      </Panel>

      <Panel title="📰 עמוד 6 – כותרות מגזין">
        <JsonPanel site={site} k="magazine_header" fields={[
          ["title", "כותרת"],
          ["subtitle", "תת-כותרת", "textarea"],
        ]} onSaved={flashMsg} onRefresh={refresh} />
      </Panel>
      <Panel title="📰 עמוד 6 – כרטיסי מגזין">
        <MagazinePanel cards={site.magazine} onSaved={flashMsg} onRefresh={refresh} />
      </Panel>

      <Panel title="👤 עמוד 7 – אודות">
        <JsonPanel
          site={site}
          k="about"
          fields={[
            ["title", "כותרת"],
            ["body", "טקסט", "textarea"],
            ["credentials", "הסמכות", "textarea"],
            ["image_url", "תמונת אודות", "image", ABOUT_RES],
          ]}
          onSaved={flashMsg}
          onRefresh={refresh}
        />
      </Panel>

      <Panel title="❓ עמוד 8 – כותרות FAQ">
        <JsonPanel site={site} k="faq_header" fields={[
          ["title", "כותרת"],
          ["subtitle", "תת-כותרת", "textarea"],
        ]} onSaved={flashMsg} onRefresh={refresh} />
      </Panel>
      <Panel title="❓ עמוד 8 – שאלות ותשובות (המספור מוצג עיצובית אוטומטית)">
        <FaqPanel faqs={site.faqs} onSaved={flashMsg} onRefresh={refresh} />
      </Panel>

      <Panel title="✉️ עמוד 9 – צור קשר (טקסטים)">
        <JsonPanel site={site} k="contact" fields={[
          ["title", "כותרת"],
          ["subtitle", "תת-כותרת", "textarea"],
          ["name_label", "תווית שם"],
          ["phone_label", "תווית טלפון"],
          ["message_label", "תווית הודעה"],
        ]} onSaved={flashMsg} onRefresh={refresh} />
      </Panel>

      <Panel title="⚙️ עמוד 9 – הגדרות כלליות + מייל מנהל">
        <SettingsPanel site={site} onSaved={flashMsg} onRefresh={refresh} />
      </Panel>

      <Panel title="🔻 Footer">
        <JsonPanel site={site} k="footer" fields={[
          ["right", "צד ימין (שם)"],
          ["center", "צד מרכז (זכויות)"],
        ]} onSaved={flashMsg} onRefresh={refresh} />
      </Panel>

      <div className="h-16" />
    </div>
  );
}

function flash(setMsg: (s: string) => void, m: string) {
  setMsg(m);
  setTimeout(() => setMsg(""), 2000);
}

function Panel({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card-surface" style={{ padding: 0 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-5 text-right bg-transparent border-0 cursor-pointer"
      >
        <h3 style={{ fontSize: "1.05rem" }}>{title}</h3>
        <span style={{ color: "var(--accent-primary)", transform: open ? "rotate(45deg)" : "none", transition: "transform .2s", fontSize: "1.3rem" }}>+</span>
      </button>
      {open && <div className="p-6 pt-2 border-t" style={{ borderColor: "rgba(0,0,0,.06)" }}>{children}</div>}
    </div>
  );
}

// ===== Panels =====

type FieldDef = [string, string, ("input" | "textarea" | "image")?, string?];

function JsonPanel({
  site, k, fields, onSaved, onRefresh,
}: {
  site: SiteData; k: keyof SiteData; fields: FieldDef[];
  onSaved: (m: string) => void; onRefresh: () => void;
}) {
  const initial = (site as any)[k] ?? {};
  const [state, setState] = useState<Record<string, string>>(initial);
  const save = useServerFn(saveContent);
  const [saving, setSaving] = useState(false);
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
          await save({ data: { key: k as string, data: state } });
          onSaved("נשמר");
          onRefresh();
        } catch (err: any) {
          onSaved("שגיאה: " + err.message);
        } finally { setSaving(false); }
      }}
    >
      {fields.map(([key, label, type, hint]) => (
        <div className="field" key={key}>
          <label>{label}</label>
          {type === "textarea" ? (
            <textarea rows={4} value={state[key] ?? ""} onChange={(e) => setState({ ...state, [key]: e.target.value })} />
          ) : type === "image" ? (
            <ImageUpload
              value={state[key]}
              onChange={(url) => setState({ ...state, [key]: url })}
              hint={hint}
            />
          ) : (
            <input value={state[key] ?? ""} onChange={(e) => setState({ ...state, [key]: e.target.value })} />
          )}
        </div>
      ))}
      <button className="cta self-start" disabled={saving} type="submit">{saving ? "…" : "שמור"}</button>
    </form>
  );
}

function SettingsPanel({ site, onSaved, onRefresh }: { site: SiteData; onSaved: (m: string) => void; onRefresh: () => void }) {
  return (
    <JsonPanel site={site} k="settings" fields={[
      ["admin_email", "מייל מנהל (כתובת יעד לטופס)"],
      ["submit_button_text", "טקסט כפתור שליחה"],
      ["submit_success_text", "טקסט כפתור לאחר שליחה מוצלחת"],
    ]} onSaved={onSaved} onRefresh={onRefresh} />
  );
}

function ThemePanel({ site, onSaved, onRefresh }: { site: SiteData; onSaved: (m: string) => void; onRefresh: () => void }) {
  const [t, setT] = useState({ ...site.theme });
  const save = useServerFn(saveContent);
  const swatches: [keyof typeof t, string][] = [
    ["bg_cream", "רקע ראשי (Cream)"],
    ["bg_sand", "רקע משני (Sand)"],
    ["text_dark", "טקסט כהה"],
    ["text_muted", "טקסט משני"],
    ["accent_primary", "צבע הדגשה ראשי (כפתורים)"],
    ["accent_hover", "צבע הדגשה בעת ריחוף"],
    ["footer_bg", "רקע פוטר"],
  ];
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        await save({ data: { key: "theme", data: t } });
        onSaved("נשמר");
        onRefresh();
      }}
    >
      {swatches.map(([k, label]) => (
        <div key={k} className="flex items-center gap-3">
          <label className="w-56 text-sm" style={{ color: "var(--text-dark)", fontWeight: 700 }}>{label}</label>
          <input type="color" value={t[k]} onChange={(e) => setT({ ...t, [k]: e.target.value })} style={{ width: 48, height: 36, border: 0, background: "transparent" }} />
          <input value={t[k]} onChange={(e) => setT({ ...t, [k]: e.target.value })} dir="ltr" style={{ width: 120 }} />
        </div>
      ))}
      <button className="cta self-start mt-3" type="submit">שמור צבעים</button>
    </form>
  );
}

function CardsPanel({ kind, cards, onSaved, onRefresh }: {
  kind: "matrix" | "outcome";
  cards: Card[];
  onSaved: (m: string) => void; onRefresh: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        אם השדה "טקסט עמוד יעד" ריק – הריבוע לא יהיה לחיץ.
      </p>
      {cards.map((c) => (
        <CardRow key={c.id} kind={kind} card={c} onSaved={onSaved} onRefresh={onRefresh} />
      ))}
    </div>
  );
}

function CardRow({ kind, card, onSaved, onRefresh }: { kind: "matrix" | "outcome"; card: Card; onSaved: (m: string) => void; onRefresh: () => void }) {
  const [open, setOpen] = useState(false);
  const [c, setC] = useState<Card>(card);
  const save = useServerFn(saveCard);
  return (
    <div className="border rounded-lg" style={{ borderColor: "rgba(0,0,0,.08)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-right bg-transparent border-0 cursor-pointer"
      >
        <span className="font-bold">{c.title || "(ללא כותרת)"} <span className="text-xs opacity-60">#{c.sort_order}</span></span>
        <span style={{ color: "var(--accent-primary)" }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <form
          className="p-4 pt-0 flex flex-col gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            await save({ data: { kind, card: c } });
            onSaved("נשמר");
            onRefresh();
          }}
        >
          <Row label="כותרת"><input value={c.title} onChange={(e) => setC({ ...c, title: e.target.value })} /></Row>
          <Row label="תיאור קצר"><textarea rows={2} value={c.description} onChange={(e) => setC({ ...c, description: e.target.value })} /></Row>
          <Row label="Slug (URL)"><input dir="ltr" value={c.slug} onChange={(e) => setC({ ...c, slug: e.target.value })} /></Row>
          <Row label="תמונת הריבוע (רשות)">
            <ImageUpload value={c.image_url} onChange={(url) => setC({ ...c, image_url: url })} hint={CARD_RES} />
          </Row>
          <hr />
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>עמוד יעד – מוצג לאחר לחיצה על הריבוע</p>
          <Row label="כותרת עמוד היעד"><input value={c.target_title} onChange={(e) => setC({ ...c, target_title: e.target.value })} /></Row>
          <Row label="תוכן עמוד היעד"><textarea rows={6} value={c.target_body} onChange={(e) => setC({ ...c, target_body: e.target.value })} /></Row>
          <Row label="תמונת עמוד היעד">
            <ImageUpload value={c.target_image_url} onChange={(url) => setC({ ...c, target_image_url: url })} hint={TARGET_RES} />
          </Row>
          <button className="cta self-start" type="submit">שמור</button>
        </form>
      )}
    </div>
  );
}

function MagazinePanel({ cards, onSaved, onRefresh }: { cards: MagazineCard[]; onSaved: (m: string) => void; onRefresh: () => void }) {
  const save = useServerFn(saveCard);
  const del = useServerFn(deleteCard);
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>אם "תוכן עמוד היעד" ריק – הכרטיס לא יהיה לחיץ.</p>
      {cards.map((c) => (
        <MagCardRow key={c.id} card={c} onSaved={onSaved} onRefresh={onRefresh} onDelete={async () => {
          if (confirm("למחוק?")) { await del({ data: { kind: "magazine", id: c.id } }); onRefresh(); }
        }} />
      ))}
      <button
        className="cta self-start"
        style={{ background: "var(--text-dark)" }}
        onClick={async () => {
          const nextOrder = cards.length + 1;
          await save({
            data: {
              kind: "magazine",
              card: {
                sort_order: nextOrder,
                slug: "new-" + Date.now(),
                title: "",
                description: "",
                image_url: "",
                target_title: "",
                target_body: "",
                target_image_url: "",
                tag: "",
              },
            },
          });
          onRefresh();
        }}
      >+ הוסף כרטיס מגזין</button>
    </div>
  );
}

function MagCardRow({ card, onSaved, onRefresh, onDelete }: { card: MagazineCard; onSaved: (m: string) => void; onRefresh: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const [c, setC] = useState<MagazineCard>(card);
  const save = useServerFn(saveCard);
  return (
    <div className="border rounded-lg" style={{ borderColor: "rgba(0,0,0,.08)" }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-right bg-transparent border-0 cursor-pointer">
        <span className="font-bold">{c.title || "(ללא כותרת)"} <span className="text-xs opacity-60">#{c.sort_order}</span></span>
        <span style={{ color: "var(--accent-primary)" }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <form className="p-4 pt-0 flex flex-col gap-3" onSubmit={async (e) => {
          e.preventDefault();
          await save({ data: { kind: "magazine", card: c } });
          onSaved("נשמר"); onRefresh();
        }}>
          <Row label="תג (Tag)"><input value={c.tag} onChange={(e) => setC({ ...c, tag: e.target.value })} /></Row>
          <Row label="כותרת"><input value={c.title} onChange={(e) => setC({ ...c, title: e.target.value })} /></Row>
          <Row label="תיאור"><textarea rows={3} value={c.description} onChange={(e) => setC({ ...c, description: e.target.value })} /></Row>
          <Row label="Slug"><input dir="ltr" value={c.slug} onChange={(e) => setC({ ...c, slug: e.target.value })} /></Row>
          <Row label="תמונת הכרטיס">
            <ImageUpload value={c.image_url} onChange={(url) => setC({ ...c, image_url: url })} hint={MAG_RES} />
          </Row>
          <Row label="סדר"><input type="number" value={c.sort_order} onChange={(e) => setC({ ...c, sort_order: Number(e.target.value) })} /></Row>
          <hr />
          <Row label="כותרת עמוד המאמר"><input value={c.target_title} onChange={(e) => setC({ ...c, target_title: e.target.value })} /></Row>
          <Row label="תוכן המאמר"><textarea rows={8} value={c.target_body} onChange={(e) => setC({ ...c, target_body: e.target.value })} /></Row>
          <Row label="תמונת המאמר">
            <ImageUpload value={c.target_image_url} onChange={(url) => setC({ ...c, target_image_url: url })} hint={ARTICLE_RES} />
          </Row>
          <div className="flex gap-3">
            <button className="cta" type="submit">שמור</button>
            <button className="cta" style={{ background: "var(--destructive)" }} type="button" onClick={onDelete}>מחק</button>
          </div>
        </form>
      )}
    </div>
  );
}

function FaqPanel({ faqs, onSaved, onRefresh }: { faqs: Faq[]; onSaved: (m: string) => void; onRefresh: () => void }) {
  const save = useServerFn(saveFaq);
  const del = useServerFn(deleteFaq);
  const reorder = useServerFn(reorderFaqs);
  const [items, setItems] = useState(faqs);
  useEffect(() => setItems(faqs), [faqs]);

  async function move(idx: number, dir: -1 | 1) {
    const next = [...items];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setItems(next);
    await reorder({ data: { ids: next.map((f) => f.id) } });
    onSaved("סדר עודכן");
    onRefresh();
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((f, i) => (
        <FaqRow
          key={f.id}
          index={i}
          faq={f}
          onSave={async (updated) => { await save({ data: updated }); onSaved("נשמר"); onRefresh(); }}
          onDelete={async () => { if (confirm("למחוק?")) { await del({ data: { id: f.id } }); onRefresh(); } }}
          onUp={() => move(i, -1)}
          onDown={() => move(i, 1)}
          isFirst={i === 0}
          isLast={i === items.length - 1}
        />
      ))}
      <button
        className="cta self-start"
        style={{ background: "var(--text-dark)" }}
        onClick={async () => {
          await save({ data: { sort_order: items.length + 1, question: "", answer: "" } as any });
          onRefresh();
        }}
      >+ הוסף שאלה</button>
    </div>
  );
}

function FaqRow({ faq, index, onSave, onDelete, onUp, onDown, isFirst, isLast }: {
  faq: Faq;
  index: number;
  onSave: (f: Faq) => Promise<void>;
  onDelete: () => void;
  onUp: () => void; onDown: () => void; isFirst: boolean; isLast: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(faq);
  useEffect(() => setF(faq), [faq]);
  return (
    <div className="border rounded-lg" style={{ borderColor: "rgba(0,0,0,.08)" }}>
      <div className="flex items-center justify-between p-3">
        <button onClick={() => setOpen(!open)} className="flex-1 text-right bg-transparent border-0 cursor-pointer">
          <span className="font-bold">{index + 1}. {f.question || "(שאלה ריקה)"}</span>
        </button>
        <div className="flex gap-1">
          <button className="px-2" disabled={isFirst} onClick={onUp} type="button">↑</button>
          <button className="px-2" disabled={isLast} onClick={onDown} type="button">↓</button>
          <button className="px-2" onClick={onDelete} type="button" style={{ color: "var(--destructive)" }}>✕</button>
        </div>
      </div>
      {open && (
        <form className="p-4 pt-0 flex flex-col gap-3" onSubmit={async (e) => { e.preventDefault(); await onSave(f); }}>
          <Row label="שאלה (ללא מספור – יופיע אוטומטית)"><input value={f.question} onChange={(e) => setF({ ...f, question: e.target.value })} /></Row>
          <Row label="תשובה"><textarea rows={5} value={f.answer} onChange={(e) => setF({ ...f, answer: e.target.value })} /></Row>
          <button className="cta self-start" type="submit">שמור</button>
        </form>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}
