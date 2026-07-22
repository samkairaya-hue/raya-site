import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import type { SiteData } from "./cms-types";

function serverPublicClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const loadSite = createServerFn({ method: "GET" }).handler(async (): Promise<SiteData> => {
  const sb = serverPublicClient();
  const [content, matrix, outcomes, magazine, faqs] = await Promise.all([
    sb.from("site_content").select("key, data"),
    sb.from("matrix_cards").select("*").order("sort_order"),
    sb.from("outcome_cards").select("*").order("sort_order"),
    sb.from("magazine_cards").select("*").order("sort_order"),
    sb.from("faqs").select("*").order("sort_order"),
  ]);
  const map: Record<string, any> = {};
  for (const row of content.data ?? []) map[row.key] = row.data;
  return {
    theme: map.theme,
    settings: map.settings,
    hero: map.hero,
    emid: map.emid,
    matrix_header: map.matrix_header,
    bridge: map.bridge,
    outcomes_header: map.outcomes_header,
    magazine_header: map.magazine_header,
    about: map.about,
    faq_header: map.faq_header,
    contact: map.contact,
    footer: map.footer,
    matrix: (matrix.data ?? []) as any,
    outcomes: (outcomes.data ?? []) as any,
    magazine: (magazine.data ?? []) as any,
    faqs: (faqs.data ?? []) as any,
  };
});

export const getCardBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { kind: "matrix" | "outcome" | "magazine"; slug: string }) =>
    z.object({ kind: z.enum(["matrix", "outcome", "magazine"]), slug: z.string() }).parse(d),
  )
  .handler(async ({ data }) => {
    const sb = serverPublicClient();
    const table =
      data.kind === "matrix"
        ? "matrix_cards"
        : data.kind === "outcome"
          ? "outcome_cards"
          : "magazine_cards";
    const { data: row } = await sb.from(table).select("*").eq("slug", data.slug).maybeSingle();
    return row as any;
  });

// ===== ADMIN =====

export const saveContent = createServerFn({ method: "POST" })
  .inputValidator((d: { key: string; data: unknown }) =>
    z.object({ key: z.string().min(1), data: z.record(z.string(), z.any()) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { requireAdminUnlocked } = await import("./admin-session.server");
    await requireAdminUnlocked();
    const sb = await admin();
    const { error } = await sb
      .from("site_content")
      .upsert({ key: data.key, data: data.data as any, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const cardSchema = z.object({
  id: z.string().uuid().optional(),
  sort_order: z.number().int(),
  slug: z.string().min(1),
  title: z.string(),
  description: z.string(),
  image_url: z.string().nullable().optional(),
  target_title: z.string(),
  target_body: z.string(),
  target_image_url: z.string().nullable().optional(),
});

export const saveCard = createServerFn({ method: "POST" })
  .inputValidator((d: { kind: "matrix" | "outcome" | "magazine"; card: any }) =>
    z
      .object({
        kind: z.enum(["matrix", "outcome", "magazine"]),
        card: cardSchema.extend({ tag: z.string().optional() }),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { requireAdminUnlocked } = await import("./admin-session.server");
    await requireAdminUnlocked();
    const table =
      data.kind === "matrix"
        ? "matrix_cards"
        : data.kind === "outcome"
          ? "outcome_cards"
          : "magazine_cards";
    const sb = await admin();
    const payload: any = { ...data.card, updated_at: new Date().toISOString() };
    const { error } = await sb.from(table).upsert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteCard = createServerFn({ method: "POST" })
  .inputValidator((d: { kind: "magazine"; id: string }) =>
    z.object({ kind: z.literal("magazine"), id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    const { requireAdminUnlocked } = await import("./admin-session.server");
    await requireAdminUnlocked();
    const sb = await admin();
    const { error } = await sb.from("magazine_cards").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const faqSchema = z.object({
  id: z.string().uuid().optional(),
  sort_order: z.number().int(),
  question: z.string(),
  answer: z.string(),
});

export const saveFaq = createServerFn({ method: "POST" })
  .inputValidator((d: any) => faqSchema.parse(d))
  .handler(async ({ data }) => {
    const { requireAdminUnlocked } = await import("./admin-session.server");
    await requireAdminUnlocked();
    const sb = await admin();
    const { error } = await sb
      .from("faqs")
      .upsert({ ...data, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteFaq = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { requireAdminUnlocked } = await import("./admin-session.server");
    await requireAdminUnlocked();
    const sb = await admin();
    const { error } = await sb.from("faqs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderFaqs = createServerFn({ method: "POST" })
  .inputValidator((d: { ids: string[] }) => z.object({ ids: z.array(z.string().uuid()) }).parse(d))
  .handler(async ({ data }) => {
    const { requireAdminUnlocked } = await import("./admin-session.server");
    await requireAdminUnlocked();
    const sb = await admin();
    for (let i = 0; i < data.ids.length; i++) {
      await sb
        .from("faqs")
        .update({ sort_order: i + 1, updated_at: new Date().toISOString() })
        .eq("id", data.ids[i]);
    }
    return { ok: true };
  });

// Upload media (image) to private cms-media bucket and return a long-lived signed URL
export const uploadMedia = createServerFn({ method: "POST" })
  .inputValidator((d: { filename: string; contentType: string; base64: string }) =>
    z
      .object({
        filename: z.string().min(1).max(200),
        contentType: z.string().min(1).max(100),
        base64: z.string().min(1),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { requireAdminUnlocked } = await import("./admin-session.server");
    await requireAdminUnlocked();
    const sb = await admin();
    const cleanName = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${cleanName}`;
    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const { error: upErr } = await sb.storage
      .from("cms-media")
      .upload(path, bytes, { contentType: data.contentType, upsert: false });
    if (upErr) throw new Error(upErr.message);
    const { data: signed, error: sErr } = await sb.storage
      .from("cms-media")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 100);
    if (sErr || !signed) throw new Error(sErr?.message ?? "signed url failed");
    return { url: signed.signedUrl, path };
  });

// Contact form -> admin email via Lovable Emails
export const sendContact = createServerFn({ method: "POST" })
  .inputValidator((d: { name: string; phone: string; message: string }) =>
    z
      .object({
        name: z.string().trim().min(1).max(100),
        phone: z.string().trim().min(1).max(50),
        message: z.string().trim().max(2000).optional().default(""),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const sb = serverPublicClient();
    const { data: settingsRow } = await sb
      .from("site_content")
      .select("data")
      .eq("key", "settings")
      .maybeSingle();
    const settings = (settingsRow?.data ?? {}) as any;
    const to = (settings.admin_email as string | undefined) ?? "(not configured)";

    const firstName = data.name.split(/\s+/)[0] || data.name;
    const subject = `פניה באתר: ${firstName}`;
    const bodyText = `שם: ${data.name}\nטלפון: ${data.phone}\n\n${data.message}`;

    // MOCK EMAIL SENDING — real delivery will be wired up once an email domain is configured.
    console.log("[mock-email] contact form submission", {
      to,
      subject,
      body: bodyText,
      timestamp: new Date().toISOString(),
    });
    await new Promise((r) => setTimeout(r, 300));
    return { sent: true, mocked: true, to, subject };
  });
