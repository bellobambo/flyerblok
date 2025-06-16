export const dynamic = "force-dynamic";

import React from "react";
import { getStoryblokApi } from "@storyblok/react/rsc";

const fetchBlogsPage = async () => {
  const client = getStoryblokApi();
  const response = await client.getStory(`blog`, {
    version: "draft",
  });
  return response.data.story;
};

const fetchAllBlogs = async () => {
  const client = getStoryblokApi();
  const response = await client.getStories({
    content_type: "blog",
    version: "draft",
  });
  return response.data.stories;
};

const BlogPage = async () => {
  // const blok = await fetchBlogsPage();
  const blogs = await fetchAllBlogs();

  const formatImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("//")) return `https:${url}`;
    if (!url.startsWith("http")) return `https://${url}`;
    return url;
  };

  console.log("Blogs Data:", blogs);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-8">All Blogs</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <a href={`/blog/${blog.slug}`} className="block">
                {/* Blog Image */}
                {blog.content?.image?.filename && (
                  <img
                    src={formatImageUrl(blog.content.image.filename)}
                    alt={blog.content.image.alt || blog.name}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-6">
                  <h3 className="text-xl font-medium mb-2">{blog.name}</h3>

                  {/* Blog Author */}
                  {blog.content?.author && (
                    <p className="text-sm text-gray-500 mb-2">
                      By {blog.content.author}
                    </p>
                  )}

                  {/* Blog Excerpt or Fallback */}
                  <p className="text-gray-600 line-clamp-2">
                    {blog.content?.excerpt ||
                      blog.content?.intro ||
                      "Read more..."}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
