import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

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
        {
          success: false,
          error: "Server configuration error - please contact support",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const author = formData.get("author")?.toString() || "";
    const image = formData.get("image") as File | null;

    // Validation
    if (!title || !description || !author || !image) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    if (image.size > 3 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Image size must be less than 3MB" },
        { status: 400 }
      );
    }

    console.log("Signing asset upload request...");
    const signResponse = await axios.post(
      `https://api.storyblok.com/v1/spaces/${spaceId}/assets`,
      {
        filename: image.name,
        size: null,
        asset_folder_id: null,
      },
      {
        headers: {
          Authorization: oauthToken,
          "Content-Type": "application/json",
        },
      }
    );

    const signedRequest = signResponse.data;

    console.log("Uploading file to signed URL...");
    const uploadForm = new FormData();

    // Add all fields from the signed request
    for (const key in signedRequest.fields) {
      uploadForm.append(key, signedRequest.fields[key]);
    }

    // Convert the File to a Buffer and append to form
    const imageBuffer = await image.arrayBuffer();
    uploadForm.append("file", Buffer.from(imageBuffer), image.name);

    // Calculate content length
    const contentLength = await new Promise<number>((resolve, reject) => {
      uploadForm.getLength((err, length) => {
        if (err) reject(err);
        else resolve(length);
      });
    });

    // Upload the file
    const uploadResponse = await axios.post(
      signedRequest.post_url,
      uploadForm,
      {
        headers: {
          ...uploadForm.getHeaders(),
          "Content-Length": contentLength.toString(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    if (uploadResponse.status !== 204) {
      throw new Error(
        "File upload failed with status: " + uploadResponse.status
      );
    }

    const fileUrl = `https://a.storyblok.com/${signedRequest.fields.key}`;
    console.log("File uploaded successfully:", fileUrl);

    // Create the story in Storyblok
    const storyData = {
      story: {
        name: title,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        parent_id: 687846830,
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
            id: signedRequest.id,
            alt: title,
            name: image.name,
            focus: "",
            title: title,
            source: "",
            copyright: "",
            fieldtype: "asset",
            filename: fileUrl,
          },
        },
      },
    };

    console.log("Creating story in Storyblok...");
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
      message: "Blog post created successfully!",
      storyId: storyResponse.data?.story?.id,
      assetId: signedRequest.id,
      imageUrl: fileUrl,
    });
  } catch (error: any) {
    console.error("Error processing request:", error);

    let errorMessage = "Failed to create blog post";
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        errorMessage;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error message:", error.message);
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: error.response?.data || undefined,
      },
      { status: error.response?.status || 500 }
    );
  }
}
