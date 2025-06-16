import React from "react";
import Link from "next/link";

const Page = ({ blok }: any) => {
  const detailsBlocks = blok.body?.filter(
    (block: any) => block.component === "Details"
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Flyerblok</h1>
      {blok.body?.map((block: any) => (
        <section key={block._uid} className="mb-12 last:mb-0">
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

          {block.headline && (
            <h1 className="text-3xl font-bold mb-8 text-center">
              {block.headline}
            </h1>
          )}
          {block.component === "Hero" && (
            <>
              {detailsBlocks.length > 0 && (
                <div className="flex flex-col items-center w-full">
                  <div className="flex justify-center items-center w-full max-w-7xl px-4 py-8">
                    {detailsBlocks.length > 0 && (
                      <div className="flex flex-col items-center w-full">
                        <div className="flex flex-wrap justify-center gap-6 w-full max-w-7xl px-4 py-8">
                          {detailsBlocks.map((detailBlock: any) => (
                            <div
                              key={detailBlock._uid}
                              className="bg-[#F1DEDE] rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
                              style={{
                                width: "calc(100% - 1.5rem)",
                                maxWidth: "300px",
                              }} // Adjust maxWidth as needed
                            >
                              {/* Image with fixed size */}
                              <div
                                className="w-full"
                                style={{ height: "200px", overflow: "hidden" }}
                              >
                                <img
                                  src={detailBlock.icon.filename}
                                  alt={detailBlock.details || "Section image"}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>

                              {/* Text Content */}
                              <div className="p-5 text-center flex flex-col flex-grow">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                  {detailBlock.title || "Category Title"}
                                </h3>
                                <p className="text-gray-500 text-sm mb-4">
                                  {detailBlock.details ||
                                    "A brief description of this section goes here."}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Browse Button */}
              {blok.button?.cached_url && (
                <div className="mt-6 flex justify-center w-full">
                  <Link
                    href={`/${blok.button.cached_url}`}
                    className="px-6 py-2.5  text-black rounded-lg bg-[#F1DEDE] hover:bg-[#d5adad]  transition-colors shadow-sm hover:shadow-md font-medium"
                  >
                    Browse All
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
