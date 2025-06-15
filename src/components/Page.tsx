import React from "react";
import Link from "next/link";

const Page = ({ blok }: any) => {
  const detailsBlocks = blok.body?.filter(
    (block: any) => block.component === "Details"
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      {blok.body?.map((block: any) => (
        <section key={block._uid} className="mb-12 last:mb-0">
          {block.headline && (
            <h1 className="text-3xl font-bold mb-8 text-center">
              {block.headline}
            </h1>
          )}

          {block.image?.filename && (
            <div className="flex justify-center mb-8">
              <div className="w-100 h-100 overflow-hidden rounded-md">
                <img
                  src={block.image.filename}
                  alt={block.headline || "Section image"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {block.component === "Hero" && (
            <>
              {detailsBlocks.length > 0 && (
                <div className="flex justify-between items-center max-w-4xl mx-auto mt-8">
                  {detailsBlocks.map((detailBlock: any) => (
                    <div key={detailBlock._uid} className="text-md font-medium">
                      {detailBlock.details}
                    </div>
                  ))}
                </div>
              )}

              {/* Blog Button */}
              {blok.button?.cached_url && (
                <div className="mt-8 flex justify-center">
                  <Link
                    href={`/${blok.button.cached_url}`}
                    className="px-6 py-3 text-white rounded  transition"
                  >
                    Browse
                  </Link>
                </div>
              )}
            </>
          )}
        </section>
      ))}
    </main>
  );
};

export default Page;
