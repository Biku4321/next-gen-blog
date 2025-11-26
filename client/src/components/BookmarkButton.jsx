import React, { useState, useEffect } from "react";
import API from "../services/api";

const BookmarkButton = ({ postId }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch bookmark status when postId changes
  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      if (!postId) return;
      try {
        const { data } = await API.get(`/bookmarks/${postId}`);
        setBookmarked(data.bookmarked || false);
      } catch (err) {
        console.warn(
          "Bookmark fetch error:",
          err.response?.data?.message || err.message
        );
      }
    };
    fetchBookmarkStatus();
  }, [postId]);

  // 🔹 Toggle bookmark state (uses /bookmarks/toggle route)
  const toggleBookmark = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const { data } = await API.post("/bookmarks/toggle", { postId });
      setBookmarked(data.bookmarked);
    } catch (err) {
      console.error(
        "Bookmark toggle error:",
        err.response?.data?.message || err.message
      );
      alert("⚠️ Failed to update bookmark. Please log in again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
        bookmarked
          ? "bg-yellow-100 border-yellow-400 text-yellow-700 hover:bg-yellow-200"
          : "bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-700"
      }`}
    >
      <span>{bookmarked ? "🔖" : "📑"}</span>
      <span>{loading ? "..." : bookmarked ? "Saved" : "Save"}</span>
    </button>
  );
};

export default BookmarkButton;
