import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg-cream)" }}>
      <div className="max-w-md text-center px-4">
        <h1 className="text-7xl">404</h1>
        <p className="mt-4 text-lg">הדף לא נמצא</p>
        <a href="/" className="cta mt-6 inline-block">חזרה לדף הבית</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--bg-cream)" }}>
      <div className="max-w-md text-center">
        <h1 className="text-xl">משהו השתבש</h1>
        <p className="mt-2 text-sm">נסה לרענן את הדף.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="cta mt-6"
        >
          נסה שוב
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "רעיה ברכה | קליניקה בוטיק לטיפול רגשי בשיטת EMID" },
      { name: "description", content: "טיפול רגשי ממוקד וקצר מועד בשיטת EMID לשחרור חרדה, טראומה, תקיעות ודפוסים אוטומטיים." },
      { property: "og:title", content: "רעיה ברכה | קליניקה לטיפול רגשי בשיטת EMID" },
      { property: "og:description", content: "טיפול רגשי ממוקד בשיטת EMID." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700;800&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
