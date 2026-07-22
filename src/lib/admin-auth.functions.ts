import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const checkAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const { checkAdminSessionState } = await import("./admin-auth.server");
  return checkAdminSessionState();
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) =>
    z.object({ password: z.string().min(1).max(200) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { loginAdmin } = await import("./admin-auth.server");
    return loginAdmin(data.password);
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { logoutAdmin } = await import("./admin-auth.server");
  return logoutAdmin();
});

export const changeAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((d: { current: string; next: string }) =>
    z
      .object({
        current: z.string().min(1).max(200),
        next: z.string().min(6, "סיסמה חדשה חייבת להכיל לפחות 6 תווים").max(200),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { updateAdminPassword } = await import("./admin-auth.server");
    return updateAdminPassword(data.current, data.next);
  });
