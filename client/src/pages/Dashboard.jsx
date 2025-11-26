import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Edit,
  Trash2,
  BarChart3,
  Eye,
  Heart,
  MessageCircle,
} from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="glass-card p-6 rounded-2xl">
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-blue-500/10 rounded-lg">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get("/posts/my-posts");
      setPosts(data.posts || []);
      const totalViews = data.posts.reduce((a, b) => a + (b.views || 0), 0);
      const totalLikes = data.posts.reduce((a, b) => a + (b.likes || 0), 0);
      const totalComments = data.posts.reduce((a, b) => a + (b.comments?.length || 0), 0);
      setStats({ totalViews, totalLikes, totalComments });
    } catch (err) {
      console.error("Fetch posts failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Post deleted");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete post");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's a summary of your blog.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/dashboard/analytics" className="btn-secondary">
            <BarChart3 className="w-5 h-5 mr-2" /> View Analytics
          </Link>
          <Link to="/editor" className="btn-primary">
            <PlusCircle className="w-5 h-5 mr-2" /> Create New Post
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Views" value={stats.totalViews} icon={Eye} />
        <StatCard title="Total Likes" value={stats.totalLikes} icon={Heart} />
        <StatCard
          title="Total Comments"
          value={stats.totalComments}
          icon={MessageCircle}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Manage Posts</h2>
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-slate-800/50">
                <tr>
                  <th className="p-4 font-semibold">Title</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Stats (V/L/C)</th>
                  <th className="p-4 font-semibold">Created</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post._id}
                    className="border-t border-gray-200 dark:border-slate-700"
                  >
                    <td className="p-4 font-medium">{post.title}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {post.views}/{post.likes}/{post.comments?.length || 0}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        {/* ✅ FIX: Remove nested <Link> tags. Keep just one. */}
                        <Link
                          to={`/editor?id=${post._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>

                        <button
                          onClick={() => handleDelete(post._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
