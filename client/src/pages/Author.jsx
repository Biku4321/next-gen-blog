import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from '../services/api';
import PostCard from "../components/PostCard.jsx";

const Author = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/users/${id}`);
        if (!mounted) return;
        setAuthor(data.user ?? data);
        const postsRes = await API.get("/posts", { params: { author: id } });
        const postsData = postsRes?.data?.posts ?? postsRes?.data ?? [];
        if (!mounted) return;
        setPosts(Array.isArray(postsData) ? postsData : []);
      } catch (err) {
        console.warn("Author load failed", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!author) return <div className="p-6 text-center">Author not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex gap-4 items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 grid place-items-center text-2xl">
          {author.username?.[0] ?? "A"}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{author.username}</h2>
          <p className="text-sm text-gray-500">{author.bio}</p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-3">Posts by {author.username}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.length ? posts.map((p) => <PostCard key={p._id ?? p.slug} post={p} />) : <div>No posts yet</div>}
      </div>
    </div>
  );
};

export default Author;
