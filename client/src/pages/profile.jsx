import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard.jsx";
import { Edit, Loader } from "lucide-react";
import API from "../services/api";

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Fetch profile and posts
  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const [profileRes, postRes] = await Promise.all([
          API.get("/users/me"),
          API.get("/users/my-posts"),
        ]);

        const userData = profileRes.data.user;
        setProfile(userData);
        setUsername(userData.username || "");
        setEmail(userData.email || "");
        setAvatarUrl(userData.avatarUrl || "");
        setPosts(postRes.data.posts || []);
      } catch (err) {
        console.error("❌ Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchProfileAndPosts();
  }, [user?._id]);

  // Update profile
  const handleUpdate = async () => {
    if (!username.trim()) return alert("Username cannot be empty!");
    setSaving(true);
    try {
      await API.put("/users/me", { username, email, avatarUrl });
      alert("✅ Profile updated successfully!");
      await refreshUser?.();
    } catch (err) {
      console.error("Profile update failed:", err);
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );

  if (!user)
    return <p className="text-center mt-10">Please log in to view your profile.</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      {/* --- Profile Header --- */}
      <div className="glass-card p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8">
        <motion.img
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          src={
            avatarUrl ||
            profile?.avatarUrl ||
            `https://ui-avatars.com/api/?name=${username}&background=random&color=fff&size=128`
          }
          alt={username}
          className="w-32 h-32 rounded-full ring-4 ring-offset-4 ring-offset-gray-100 dark:ring-offset-slate-800 ring-blue-500"
        />

        <div className="flex-grow text-center md:text-left">
          <h1 className="text-4xl font-bold mb-2">{username}</h1>
          <p className="text-gray-500 text-lg mb-4">{email}</p>

          {/* Editable fields */}
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border rounded-md p-2 w-64"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-md p-2 w-64"
            />
            <input
              type="url"
              placeholder="Avatar Image URL"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="border rounded-md p-2 w-64"
            />
          </div>

          <button
            onClick={handleUpdate}
            disabled={saving}
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* --- My Posts --- */}
      <section>
        <h2 className="text-3xl font-bold mb-8">My Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">You haven’t written any posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default ProfilePage;
