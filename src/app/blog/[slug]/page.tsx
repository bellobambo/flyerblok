import React from "react";
import { getStoryblokApi } from "@storyblok/react/rsc";
import Blog from "@/components/Blog";
const fetchBlogPage = async (slug: string) => {
  const client = getStoryblokApi();
  const response = await client.getStory(`blog/${slug}`, {
    version: "published",
  });
  return response.data.story;
};

const BlogPagePage = async (props: any) => {
  const story = await fetchBlogPage(props.params.slug);
  // console.log("Blog Page Data:", story);

  return <Blog blok={story.content} createdAt={story.created_at} />;
};

export default BlogPagePage;
