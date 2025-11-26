
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import AIEditor from "../components/AIEditor";
import { useAI } from "../context/AIContext";
import API from "../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";

const Editor = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const postId = params.get("id");

  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "technology",
    tags: [],
    featuredImage: "",
    status: "draft",
  });

  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autosaveTimer, setAutosaveTimer] = useState(null);
  const { generateContent } = useAI();

  /** -----------------------
   * Load Existing Post (if editing)
   ------------------------ */
  useEffect(() => {
    if (postId) loadPost();
  }, [postId]);

  /** -----------------------
   * Auto-Save (after 5s inactivity)
   ------------------------ */
  useEffect(() => {
    if (autosaveTimer) clearTimeout(autosaveTimer);
    const timer = setTimeout(() => {
      if (form.title || form.content) autosave();
    }, 5000);
    setAutosaveTimer(timer);
    return () => clearTimeout(timer);
  }, [form.title, form.content]);

  /** -----------------------
   * Load Post from Backend
   ------------------------ */
  const loadPost = async () => {
    try {
      const { data } = await API.get(`/posts/${postId}`);
      const post = data.post || data;

      setForm({
        title: post.title || "",
        content: post.content || "",
        excerpt: post.excerpt || "",
        category: post.category || "technology",
        tags: post.tags || [],
        featuredImage: post.featuredImage || "",
        status: post.status || "draft",
      });
    } catch (err) {
      console.error("❌ Failed to load post:", err.message);
    }
  };

  /** -----------------------
   * Auto-Save Draft
   ------------------------ */
  const autosave = async () => {
    if (!form.title && !form.content) return;
    console.info("📝 Autosaving draft...");
    try {
      if (postId) {
        await API.put(`/posts/${postId}`, { ...form, status: "draft" });
      } else {
        const { data } = await API.post("/posts", { ...form, status: "draft" });
        const savedPost = data.post || data;
        window.history.replaceState(null, "", `/editor?id=${savedPost._id}`);
      }
    } catch (err) {
      console.warn("⚠️ Autosave failed:", err.message);
    }
  };

  /** -----------------------
   * Manual Save (Draft / Publish)
   ------------------------ */
  const handleSave = async (status = "draft") => {
    setSaving(true);
    try {
      const postData = { ...form, status };
      let savedPost;

      if (postId) {
        const { data } = await API.put(`/posts/${postId}`, postData);
        savedPost = data.post || data;
      } else {
        const { data } = await API.post("/posts", postData);
        savedPost = data.post || data;
      }

      if (status === "published") {
        navigate(`/posts/${savedPost.slug || savedPost._id}`);
      } else {
        alert("✅ Draft saved successfully!");
      }
    } catch (err) {
      console.error("💥 Save failed:", err);
      alert("Failed to save post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /** -----------------------
   * Generate AI Excerpt
   ------------------------ */
  const generateExcerpt = async () => {
    if (!form.content.trim()) return alert("Write some content first!");
    try {
      const excerptText = await generateContent(
        `Summarize the following blog post into a concise, engaging meta description under 150 characters:\n\n${form.content}`
      );
      setForm((prev) => ({ ...prev, excerpt: excerptText.trim() }));
    } catch (err) {
      console.error("AI Excerpt generation failed:", err);
      alert("AI could not generate an excerpt. Try again later.");
    }
  };

  /** -----------------------
   * UI Rendering
   ------------------------ */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            {postId ? "Edit Post" : "Create New Post"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {saving ? "Saving..." : "All changes saved ✅"}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSettings(true)}
            className="glass-button p-3 rounded-xl hover:bg-white/20"
            aria-label="Post settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="btn-secondary px-4 py-2"
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>

          <button
            onClick={() => handleSave("published")}
            disabled={saving || !form.title || !form.content}
            className="btn-primary px-4 py-2"
          >
            Publish
          </button>
        </div>
      </div>

      {/* AI Editor */}
      <AIEditor
        title={form.title}
        setTitle={(title) => setForm((p) => ({ ...p, title }))}
        content={form.content}
        setContent={(content) => setForm((p) => ({ ...p, content }))}
      />

      {/* Settings Modal */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowSettings(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 rounded-2xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Post Settings</h3>

            <div className="space-y-4">
              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium mb-2">Excerpt</label>
                <div className="flex items-center space-x-2">
                  <textarea
                    value={form.excerpt}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, excerpt: e.target.value }))
                    }
                    placeholder="Brief summary of your post..."
                    className="textarea-field h-20"
                  />
                  <button
                    onClick={generateExcerpt}
                    className="btn-primary px-3 py-2 text-sm"
                  >
                    AI
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  className="input-field"
                >
                  <option value="technology">Technology</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="ai">AI</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <input
                  type="text"
                  value={form.tags.join(", ")}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      tags: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="Enter tags separated by commas"
                  className="input-field"
                />
              </div>

              {/* Featured image */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={form.featuredImage}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, featuredImage: e.target.value }))
                  }
                  placeholder="https://example.com/image.jpg"
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="btn-ghost px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="btn-primary px-4 py-2"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Editor;
