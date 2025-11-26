
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ImagePlus, Send, Loader2 } from "lucide-react";
import API from "../services/api";

const CreatePost = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Technology");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      setError("Please select a valid image file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      if (image) formData.append("image", image);

      const { data } = await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data) {
        setSuccess("✅ Post created successfully!");
        setTimeout(() => navigate(`/post/${data.slug || data._id}`), 1500);
      }
    } catch (err) {
      console.error("❌ Error creating post:", err.message);
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 space-y-6 glass-card"
      >
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t("createPost.title", "Create a New Post")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              {t("createPost.postTitle", "Post Title")}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("createPost.placeholder_title", "Enter your post title...")}
              className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white/10 dark:bg-gray-800/60 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              {t("createPost.category", "Category")}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white/10 dark:bg-gray-800/60 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option>Technology</option>
              <option>Design</option>
              <option>Business</option>
              <option>AI</option>
              <option>Travel</option>
              <option>Lifestyle</option>
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              {t("createPost.content", "Content")}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="8"
              placeholder={t("createPost.placeholder_content", "Write your content here...")}
              className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white/10 dark:bg-gray-800/60 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Image Upload */}
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <ImagePlus className="w-6 h-6 text-blue-500" />
              <span>{image ? image.name : t("createPost.uploadLabel", "Upload an image (optional)")}</span>
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {/* Buttons */}
          <div className="flex justify-center">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {t("createPost.publish", "Publish Post")}
            </motion.button>
          </div>
        </form>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
      </motion.div>
    </div>
  );
};

export default CreatePost;
