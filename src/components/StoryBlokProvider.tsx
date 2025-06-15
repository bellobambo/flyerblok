"use client";

import type { PropsWithChildren } from "react";
import { storyblokInit } from "@storyblok/react/rsc";
import Blog from "./Blog";
import Page from "./Page";

storyblokInit({
  components: {
    blog: Blog,
    home: Page,
  },

  enableFallbackComponent: true,
});

export const StoryblokProvider = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};
