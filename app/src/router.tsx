import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // Off: the landing manages its own scroll on load (wgt/smooth-scroll.ts).
    // Restoring a saved offset before GSAP, the film and Lenis have laid the
    // page out left a reload landing in the wrong place.
    scrollRestoration: false,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
