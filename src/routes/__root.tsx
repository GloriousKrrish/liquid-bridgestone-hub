import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useMatch,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LanguageProvider } from "../lib/LanguageContext";
import { ModalProvider } from "../lib/ModalContext";
import { InteractiveModals } from "../components/InteractiveModals";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Bridgestone India — Engineered to Control the Elements" },
      { name: "description", content: "Bridgestone India's enterprise digital platform — smart tyre selection, dealer locator, fleet intelligence, and vehicle specification matching." },
      { property: "og:title", content: "Bridgestone India — Engineered to Control the Elements" },
      { property: "og:description", content: "Bridgestone India's enterprise digital platform — smart tyre selection, dealer locator, fleet intelligence, and vehicle specification matching." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Bridgestone India — Engineered to Control the Elements" },
      { name: "twitter:description", content: "Bridgestone India's enterprise digital platform — smart tyre selection, dealer locator, fleet intelligence, and vehicle specification matching." },
      { property: "og:image", content: "/bridgestone-global-logo.png" },
      { name: "twitter:image", content: "/bridgestone-global-logo.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ModalProvider>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
          <InteractiveModals />
          <BridyFAB />
        </ModalProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

/** Floating Action Button — navigates to /bridy-ai. Hidden when already on that page. */
function BridyFAB() {
  // Hide the FAB when the user is already on /bridy-ai
  let isOnBridyPage = false;
  try {
    useMatch({ from: "/bridy-ai" });
    isOnBridyPage = true;
  } catch {
    isOnBridyPage = false;
  }

  if (isOnBridyPage) return null;

  return (
    <Link
      to="/bridy-ai"
      aria-label="Open Bridy AI"
      className="fixed bottom-6 right-6 z-[200] w-16 h-16 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(215,25,32,0.45)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_40px_rgba(215,25,32,0.6)] cursor-pointer group"
      style={{ background: "linear-gradient(135deg, #1a0000 0%, #2d0508 50%, #1a0000 100%)" }}
    >
      {/* Outer red ring glow */}
      <div className="absolute inset-0 rounded-full border-2 border-[#D71920]/70 group-hover:border-[#D71920] transition-colors duration-300" />
      {/* Hover glow ring */}
      <div className="absolute inset-0 rounded-full bg-[#D71920]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Bridgestone Logo — full, uncropped, centered */}
      <img
        src="/bridgestone-logo.png"
        alt="Bridgestone Birdy AI"
        className="relative z-10 w-[82%] h-[82%] object-contain select-none"
        draggable={false}
      />
      {/* AI sparkle badge */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="absolute top-0.5 right-0.5 z-20 text-[#D71920] animate-pulse drop-shadow-md"
      >
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
      </svg>
    </Link>
  );
}

