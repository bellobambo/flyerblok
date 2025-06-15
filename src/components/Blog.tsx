import React from "react";

const Blog = ({ blok, createdAt }: any) => {
  const { title, author, image, descirption } = blok;

  const createdDate = new Date(createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>

      {image?.filename && (
        <img
          src={image.filename}
          alt={image.alt || title}
          className="w-full h-auto rounded-lg mb-6"
        />
      )}

      <div className="flex justify-end items-end flex-col ">
        <p className="text-gray-600 mb-2">By {author}</p>
        <p className="text-sm text-gray-500 mb-6">Published on {createdDate}</p>
      </div>

      {descirption?.content && (
        <div className="prose max-w-none">
          {descirption.content.map((block: any, index: number) => {
            if (block.type === "paragraph") {
              return (
                <p key={index}>
                  {block.content
                    ?.map((textNode: any) => textNode.text)
                    .join("")}
                </p>
              );
            }
            return null;
          })}
        </div>
      )}
    </article>
  );
};

export default Blog;
