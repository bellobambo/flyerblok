export const dynamic = "force-dynamic";

import React from "react";
import { getStoryblokApi, StoryblokStory } from "@storyblok/react/rsc";

const fetchHomePage = async () => {
  const client = getStoryblokApi();
  const response = await client.getStory(`home`, {
    version: "draft",
  });
  return response.data.story;
};

const Page = async (props: any) => {
  const blok = await fetchHomePage();

  return <StoryblokStory story={blok} />;
};

export default Page;
