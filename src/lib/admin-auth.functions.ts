import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { getAdminSession, requireAdminSession } from "./admin-session.server";

function hashPassword(pw: string): string {
  const salt = randomBytes(16);
  const key = scryptSync(pw, salt, 32);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

function verifyPassword(pw: string, stored: string): boolean {
  const [saltHex, keyHex] = stored.split(":");
  if (!saltHex || !keyHex) return false;
  try {
    const key = scryptSync(pw, Buffer.from(saltHex, "hex"), 32);
    const expected = Buffer.from(keyHex, "hex");
    if (key.length !== expected.length) return false;
    return timingSafeEqual(key, expected);
  } catch {
    return false;
  }
}

async function getStoredHash(): Promise<string | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("admin_auth")
    .select("password_hash")
    .eq("id", 1)
    .maybeSingle();
  return (data?.password_hash as string | null) ?? null;
}

async function currentPasswordMatches(pw: string): Promise<boolean> {
  const stored = await getStoredHash();
  if (stored) return verifyPassword(pw, stored);
  const envPw = process.env.ADMIN_PASSWORD;
  if (!envPw) return false;
  // constant-time compare against env value
  const a = Buffer.from(pw);
  const b = Buffer.from(envPw);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const checkAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  return { authenticated: !!session.data.unlocked };
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) =>
    z.object({ password: z.string().min(1).max(200) }).parse(d),
  )
  .handler(async ({ data }) => {
    const ok = await currentPasswordMatches(data.password);
    if (!ok) {
      await new Promise((r) => setTimeout(r, 400));
      return { ok: false as const };
    }
    const session = await getAdminSession();
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getAdminSession();
  await session.clear();
  return { ok: true as const };
});

export const changeAdminPassword = createServerFn({ method: "POST" })
  .middleware([requireAdminSession])
  .inputValidator((d: { current: string; next: string }) =>
    z
      .object({
        current: z.string().min(1).max(200),
        next: z.string().min(6, "סיסמה חדשה חייבת להכיל לפחות 6 תווים").max(200),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const ok = await currentPasswordMatches(data.current);
    if (!ok) return { ok: false as const, error: "הסיסמה הנוכחית שגויה" };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const hash = hashPassword(data.next);
    const { error } = await supabaseAdmin
      .from("admin_auth")
      .upsert({ id: 1, password_hash: hash, updated_at: new Date().toISOString() });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });
