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
      { title: "רעיה הדר" },
      { name: "description", content: "טיפול רגשי ממוקד וקצר מועד בשיטת EMID לשחרור חרדה, טראומה, תקיעות ודפוסים אוטומטיים." },
      { property: "og:title", content: "רעיה הדר" },
      { property: "og:description", content: "טיפול רגשי ממוקד וקצר מועד בשיטת EMID לשחרור חרדה, טראומה, תקיעות ודפוסים אוטומטיים." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "רעיה הדר" },
      { name: "twitter:description", content: "טיפול רגשי ממוקד וקצר מועד בשיטת EMID לשחרור חרדה, טראומה, תקיעות ודפוסים אוטומטיים." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c915ad7a-8381-46f7-bc7d-15c160ff7648/id-preview-fa1af00e--fb059848-b4a6-4ad9-b2a1-79b9ea520e65.lovable.app-1784650107071.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c915ad7a-8381-46f7-bc7d-15c160ff7648/id-preview-fa1af00e--fb059848-b4a6-4ad9-b2a1-79b9ea520e65.lovable.app-1784650107071.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700;800&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
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
