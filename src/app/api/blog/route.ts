import { NextResponse } from "next/server";
import axios from "axios";

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "3mb",
  },
};

export async function POST(request: Request) {
  try {
    const spaceId = process.env.STORYBLOK_SPACE_ID;
    const oauthToken = process.env.STORYBLOK_OAUTH;

    if (!spaceId || !oauthToken) {
      return NextResponse.json(
        { success: false, error: "Missing Storyblok credentials" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const author = formData.get("author")?.toString() || "";
    const image = formData.get("image") as File | null;

    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image is required" },
        { status: 400 }
      );
    }

    // Validate image
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedMimeTypes.includes(image.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Incorrect format",
          details: {
            filename: ["Only JPEG, PNG, GIF, and WebP formats are allowed"],
          },
        },
        { status: 422 }
      );
    }

    if (!image.name || !image.name.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid filename",
          details: { filename: ["Image must have a valid filename"] },
        },
        { status: 422 }
      );
    }

    // Step 1: Request Signed Response
    const signedRes = await axios.post(
      `https://mapi.storyblok.com/v1/spaces/${spaceId}/assets/`,
      {
        filename: image.name,
        size: image.size.toString(),
        validate_upload: 1,
      },
      {
        headers: {
          Authorization: oauthToken,
          "Content-Type": "application/json",
        },
      }
    );

    const { fields, post_url, id } = signedRes.data;

    // Step 2: Upload the file to the signed post_url
    const uploadForm = new FormData();
    for (const key in fields) {
      uploadForm.append(key, fields[key]);
    }
    uploadForm.append("file", image); // Use original file

    const uploadResponse = await axios.post(post_url, uploadForm);
    console.log("Upload response:", uploadResponse.data);

    // Step 3: Finalize upload
    await axios.get(
      `https://mapi.storyblok.com/v1/spaces/${spaceId}/assets/${id}/finish_upload`,
      {
        headers: { Authorization: oauthToken },
      }
    );

    // Final image URL
    const imageUrl = `https://a.storyblok.com/${fields.key}`;

    // Create story
    const storyData = {
      story: {
        name: title,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        content: {
          component: "blog",
          title,
          descirption: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    text: description,
                    type: "text",
                  },
                ],
              },
            ],
          },
          author,
          image: {
            id,
            alt: title,
            name: image.name,
            focus: "",
            title: title,
            source: "",
            copyright: "",
            fieldtype: "asset",
            filename: imageUrl,
            meta_data: {
              alt: title,
              title: title,
              source: "",
            },
          },
        },
      },
    };

    const storyResponse = await axios.post(
      `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories/`,
      storyData,
      {
        headers: {
          Authorization: oauthToken,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Story created successfully",
      storyId: storyResponse.data.story.id,
      assetId: id,
    });
  } catch (error: any) {
    console.error("Upload error:", error.response?.data || error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.response?.data?.message || "Upload failed",
        details: error.response?.data || {},
      },
      { status: error.response?.status || 500 }
    );
  }
}
