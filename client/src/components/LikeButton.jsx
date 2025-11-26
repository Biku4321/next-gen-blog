import React, { useState, useEffect } from "react";
import API from "../services/api";

const LikeButton = ({ postId }) => {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await API.get(`/likes/${postId}`);
        if (!mounted) return;
        setCount(data.count || 0);
        setLiked(data.userLiked || false);
      } catch (e) {
        console.error("Failed to fetch likes", e);
      }
    })();

    return () => (mounted = false);
  }, [postId]);

  const toggle = async () => {
    const oldLiked = liked;
    const oldCount = count;

    setLiked(!oldLiked);
    setCount(oldLiked ? oldCount - 1 : oldCount + 1);

    try {
      const { data } = await API.post(`/likes/toggle`, { postId });
      setCount(data.count);
      setLiked(data.userLiked);
    } catch (e) {
      // revert UI if failed
      setLiked(oldLiked);
      setCount(oldCount);
      console.error("Toggle failed", e);
    }
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-md border"
    >
      <span>{liked ? "♥" : "♡"}</span>
      <span>{count}</span>
    </button>
  );
};

export default LikeButton;
