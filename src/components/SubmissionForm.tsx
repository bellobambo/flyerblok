"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

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
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFileName(file.name);

      if (file.size > 3 * 1024 * 1024) {
        toast.error("Image size must be less than 3MB");
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      toast.success("Image selected");
    } else {
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

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial="hidden"
      animate="visible"
    >
      <motion.div custom={0} variants={itemVariant}>
        <label
          htmlFor="title"
          className=" block mb-1 font-normal text-[#ae7796] font-mono"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded focus:ring-2 focus:ring-[#ae7796] outline-none"
        />
      </motion.div>

      <motion.div custom={1} variants={itemVariant}>
        <label
          htmlFor="description"
          className="block mb-1 font-normal text-[#ae7796] font-mono"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded focus:ring-2 focus:ring-[#ae7796] outline-none"
          rows={4}
        />
      </motion.div>

      <motion.div custom={2} variants={itemVariant}>
        <span className="block mb-1 font-normal text-[#ae7796] font-mono">
          Photo <small> (max 3MB, optional)</small>
        </span>
        {imageFileName && (
          <p className="mb-2 text-sm text-[#c59ab0] italic">
            Uploaded: {imageFileName}
          </p>
        )}
        <div className="w-full">
          <label
            htmlFor="image"
            className="block w-full p-2 text-center cursor-pointer text-[#ae7796] rounded hover:text-white border-2 border-[#ae7796] hover:bg-[#9e667f] transition"
          >
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </motion.div>

      <motion.div custom={3} variants={itemVariant}>
        <label
          htmlFor="author"
          className="block mb-1 font-normal text-[#ae7796] font-mono"
        >
          Author
        </label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded focus:ring-2 focus:ring-[#ae7796] outline-none"
        />
      </motion.div>

      <motion.div custom={4} variants={itemVariant}>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`cursor-pointer px-4 py-2 text-white bg-[#ae7796]  rounded ${
            isSubmitting ? "bg-gray-400" : "bg-[#F2E9E4]   hover:bg-[#8a5272]"
          }`}
        >
          {isSubmitting ? "Flying..." : "Create"}
        </button>
      </motion.div>
    </motion.form>
  );
}
