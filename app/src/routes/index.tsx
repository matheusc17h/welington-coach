import { createFileRoute } from "@tanstack/react-router";

import { Landing } from "@/components/wgt/landing";

export const Route = createFileRoute("/")({
  // The home page inherits title/description/og from the root route
  // (app-meta.json), so shared links show the site's own values.
  component: Index,
});

// The page is composed in components/wgt; the scroll-scrub film sits in the
// middle of it (section 6), not at the top.
function Index() {
  return <Landing />;
}
