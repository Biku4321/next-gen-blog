
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import { io } from "socket.io-client";

import BlogPost from "../components/BlogPost.jsx";
import CommentList from "../components/CommentList.jsx";
import LikeButton from "../components/LikeButton.jsx";
import BookmarkButton from "../components/BookmarkButton.jsx";
import RelatedPosts from "../components/RelatedPosts.jsx";

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let socket;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/posts/${slug}`);
        const p = data?.post || data; // support both shapes
        if (!mounted) return;
        if (!p) {
          setPost(null);
          setComments([]);
          setLoading(false);
          return;
        }
        setPost(p);
        setComments(Array.isArray(p.comments) ? p.comments : []);

        document.title = `${p.title || "Post"} — Blogging`;

        // init socket connection after we've the post id
        try {
          socket = io(
            import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, "") ||
              "http://localhost:5000",
            {
              auth: { token: localStorage.getItem("token") || undefined },
              transports: ["websocket", "polling"],
            }
          );

          // join the post room
          socket.on("connect", () => {
            if (p?._id) socket.emit("join_post_room", p._id);
          });

          // listen for new comments
          socket.on("new_comment", (newComment) => {
            setComments((prev) => {
              // avoid duplicate
              if (!newComment || !newComment._id) return prev;
              if (prev.some((c) => c._id === newComment._id)) return prev;
              return Array.isArray(prev) ? [...prev, newComment] : [newComment];
            });
          });
        } catch (err) {
          console.warn("Socket init failed:", err);
        }
      } catch (err) {
        console.error("Failed to fetch post:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPost();

    return () => {
      mounted = false;
      try {
        if (socket) {
          if (post?._id) socket.emit("leave_post_room", post._id);
          socket.disconnect();
        }
      } catch (e) {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]); // re-run on slug change

  if (loading) return <div className="p-6 text-center">Loading post...</div>;
  if (!post) return <div className="p-6 text-center">Post not found.</div>;

  return (
    <article className="max-w-5xl mx-auto px-4 py-8">
      {/* small author strip */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg">
          {post.author?.username?.[0] ?? "U"}
        </div>
        <div>
          <Link
            to={`/author/${post.author?._id}`}
            className="font-medium hover:underline"
          >
            {post.author?.username || "Unknown author"}
          </Link>
          <div className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      {/* main article */}
      <BlogPost post={post} />

      {/* Like / Bookmark */}
      <div className="flex items-center gap-4 mt-8">
        <LikeButton postId={post._id} />
        <BookmarkButton postId={post._id} />
      </div>

      {/* Comments */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <CommentList postId={post._id} initialComments={comments} />
      </section>

      {/* Related */}
      <section className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-4">Related Posts</h2>
        <RelatedPosts tags={post.tags || []} currentId={post._id} />
      </section>
    </article>
  );
};

export default PostDetail;
