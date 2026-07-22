import { useSession } from "@tanstack/react-start/server";

export type AdminSessionData = { unlocked?: boolean };

export function sessionConfig() {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error("SESSION_SECRET is not set (needs 32+ chars).");
  }
  return {
    password,
    name: "cms-admin",
    maxAge: 60 * 60 * 24 * 7,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none" as const,
      path: "/",
    },
  };
}

export async function getAdminSession() {
  return useSession<AdminSessionData>(sessionConfig());
}

export async function requireAdminUnlocked() {
  const session = await getAdminSession();
  if (!session.data.unlocked) {
    throw new Error("Unauthorized");
  }
  return session;
}
