"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-hot-toast";

interface FormData {
  title: string;
  description: string;
  image: File | null;
  author: string;
}

export default function SubmissionForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    image: null,
    author: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Client-side validation
      if (file.size > 3 * 1024 * 1024) {
        toast.error("Image size must be less than 3MB");
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      toast.success("Image selected");
    } else {
      // Clear the image if the user removes the selection
      setFormData((prev) => ({ ...prev, image: null }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("author", formData.author);

      // Only append image if it exists
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch("/api/blog", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      toast.success("Blog post created successfully!");
      setFormData({
        title: "",
        description: "",
        image: null,
        author: "",
      });

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to create blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-1 font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="description" className="block mb-1 font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
          rows={4}
        />
      </div>

      <div>
        <label htmlFor="image" className="block mb-1 font-medium">
          Featured Image (max 3MB, optional)
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="author" className="block mb-1 font-medium">
          Author
        </label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`px-4 py-2 text-white rounded ${
          isSubmitting ? "bg-gray-400" : "bg-[#B4869F] hover:bg-[#ae7796]"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Submit Post"}
      </button>
    </form>
  );
}
