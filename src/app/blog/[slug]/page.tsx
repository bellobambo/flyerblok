import React from "react";
import { getStoryblokApi, StoryblokStory } from "@storyblok/react/rsc";

const fetchBlogPage = async (slug: string) => {
  const client = getStoryblokApi();
  const response = await client.getStory(`blog/${slug}`, {
    version: "draft",
  });
  return response.data.story;
};

const BlogPagePage = async (props: any) => {
  const blok = await fetchBlogPage(props.params.slug);
  console.log("Blog Page Data:", blok);

  return <StoryblokStory story={blok} />;
};

export default BlogPagePage;
