import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
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

const SITE_URL = "https://cimilcharly.vercel.app";
const OG_IMAGE = `${SITE_URL}/og-image.png`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Cimil Charly",
  url: SITE_URL,
  sameAs: [
    "https://github.com/cimilcharly",
    "https://linkedin.com/in/cimil-charly",
  ],
  jobTitle: "AI/ML Engineer & Full-Stack Developer",
  description:
    "Final-year B.Tech student in Computer Science (AI & ML) at CHRIST University. Building intelligent, full-stack products — from LLM-driven systems to production ERP modules.",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "CHRIST (Deemed to be University)",
    address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
  },
  knowsAbout: ["Machine Learning", "LLMs", "Full-Stack Development", "Python", "Android", "Django"],
  email: "cimilcharly@gmail.com",
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Cimil Charly — AI/ML Engineer & Full-Stack Developer" },
      {
        name: "description",
        content:
          "Portfolio of Cimil Charly — AI/ML Engineer and Full-Stack Developer. B.Tech CS (AI & ML) at CHRIST University, Bengaluru. Building LLM systems, SaaS platforms, and mobile apps.",
      },
      {
        name: "keywords",
        content:
          "Cimil Charly, cimilcharly, AI ML Engineer, Full Stack Developer, CHRIST University, Bengaluru, Python, Django, LLM, Machine Learning, Android, Portfolio",
      },
      { name: "author", content: "Cimil Charly" },
      { name: "robots", content: "index, follow" },
      { name: "googlebot", content: "index, follow" },
      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:title", content: "Cimil Charly — AI/ML Engineer & Full-Stack Developer" },
      {
        property: "og:description",
        content:
          "Portfolio of Cimil Charly — AI/ML Engineer and Full-Stack Developer building LLM systems, SaaS platforms, and mobile apps.",
      },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:site_name", content: "Cimil Charly Portfolio" },
      { property: "og:locale", content: "en_IN" },
      // Twitter / X
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Cimil Charly — AI/ML Engineer & Full-Stack Developer" },
      {
        name: "twitter:description",
        content: "Portfolio of Cimil Charly — AI/ML Engineer and Full-Stack Developer.",
      },
      { name: "twitter:image", content: OG_IMAGE },
      // JSON-LD — injected as a raw script tag via links workaround
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: SITE_URL },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(jsonLd),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
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
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
