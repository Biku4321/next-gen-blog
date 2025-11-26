
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   Sparkles,
//   BookOpen,
//   Zap,
//   BarChart3,
//   Users,
//   Brain,
//   PenTool,
//   LifeBuoy,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";
// import PostCard from "../components/PostCard.jsx";
// // import BlogPost from "../components/BlogPost.jsx";
// import { useTranslation } from "react-i18next"; // 🟢 Added
// import FeaturedPost from "../components/FeaturedPost.jsx";
// import CategoryFilter from "../components/CategoryFilter.jsx";
// import TrendingTopics from "../components/TrendingTopics.jsx";
// import NewsletterSignup from "../components/NewsletterSignup.jsx";
// import StatsCounter from "../components/StatsCounter.jsx";
// import AIShowcase from "../components/AIShowcase.jsx";

// const Home = () => {
//   const [posts, setPosts] = useState([]);
//   const [featuredPost, setFeaturedPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [error, setError] = useState(null);
//   const { t } = useTranslation(); // 🟢 Hook for translations
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchPosts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedCategory, searchQuery]);

//   const fetchPosts = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { data } = await API.get("/posts", {
//         params: { category: selectedCategory, search: searchQuery },
//       });

//       if (data) {
//         setPosts(data.posts || data);
//         if (data.featured) setFeaturedPost(data.featured);
//       } else {
//         setPosts([]);
//       }
//     } catch (err) {
//       console.error("❌ Error fetching posts:", err.message);
//       setError(t("home.error_load"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { delayChildren: 0.3, staggerChildren: 0.2 },
//     },
//   };
//   const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

//   return (
//     <motion.div
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       className="min-h-screen"
//     >
//       {/* 🌟 Hero Section */}
//       <motion.section variants={itemVariants} className="relative py-24 px-4 overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
//         <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-purple-500/20 rounded-full blur-3xl"></div>

//         <div className="relative max-w-7xl mx-auto text-center">
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ type: "spring", stiffness: 260, damping: 20 }}
//             className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-6"
//           >
//             <Sparkles className="w-4 h-4 text-blue-600" />
//             <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
//               {t("home.hero_badge")}
//             </span>
//           </motion.div>

//           <motion.h1
//             variants={itemVariants}
//             className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent"
//           >
//             {t("home.hero_title")}
//           </motion.h1>

//           <motion.p
//             variants={itemVariants}
//             className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
//           >
//             {t("home.hero_subtitle")}
//           </motion.p>

//           {/* CTA Buttons */}
//           <motion.div
//             variants={itemVariants}
//             className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
//           >
//             <button
//               onClick={() => navigate("/editor")}
//               className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2"
//             >
//               <PenTool className="w-5 h-5" /> {t("home.btn_write")}
//             </button>

//             <button
//               onClick={() => navigate("/dashboard")}
//               className="px-8 py-4 glass-card hover:bg-white/20 rounded-2xl font-semibold transition-all flex items-center gap-2"
//             >
//               <BarChart3 className="w-5 h-5" /> {t("home.btn_dashboard")}
//             </button>

//             <button
//               onClick={() => navigate("/help")}
//               className="px-8 py-4 glass-card hover:bg-white/20 rounded-2xl font-semibold transition-all flex items-center gap-2"
//             >
//               <LifeBuoy className="w-5 h-5" /> {t("home.btn_help")}
//             </button>
//           </motion.div>

//           <StatsCounter />
//         </div>
//       </motion.section>

//       {/* 🧠 AI Showcase */}
//       <motion.section variants={itemVariants} className="px-4">
//         <div className="max-w-7xl mx-auto">
//           <AIShowcase />
//         </div>
//       </motion.section>

//       {/* 🌟 Tools */}
//       <motion.section
//         variants={itemVariants}
//         className="py-16 px-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20"
//       >
//         <div className="max-w-7xl mx-auto text-center">
//           <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("home.tools_title")}</h2>
//           <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
//             {t("home.tools_desc")}
//           </p>
//         </div>
//       </motion.section>
//     </motion.div>
//   );
// };

// export default Home;
// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  BarChart3,
  PenTool,
  LifeBuoy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import PostCard from "../components/PostCard.jsx";
import { useTranslation } from "react-i18next";
import FeaturedPost from "../components/FeaturedPost.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";
import TrendingTopics from "../components/TrendingTopics.jsx";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import StatsCounter from "../components/StatsCounter.jsx";
import AIShowcase from "../components/AIShowcase.jsx";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get("/posts", {
        params: {
          category: selectedCategory !== "all" ? selectedCategory : undefined,
        },
      });

      if (data) {
        setPosts(data.posts || []);
        setFeaturedPost(data.featured || data.posts?.[0] || null);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error("❌ Error fetching posts:", err.message);
      setError(t("home.error_load") || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.3, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
    >
      {/* 🌟 Hero Section */}
      <motion.section
        variants={itemVariants}
        className="relative py-24 px-4 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              {t("home.hero_badge", "Discover Trending Ideas")}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent"
          >
            {t("home.hero_title", "Your Ideas, Amplified by AI")}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            {t(
              "home.hero_subtitle",
              "Create, explore, and grow your digital presence with smart tools."
            )}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <button
              onClick={() => navigate("/editor")}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              <PenTool className="w-5 h-5" />{" "}
              {t("home.btn_write", "Write a Post")}
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 glass-card hover:bg-white/20 rounded-2xl font-semibold transition-all flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />{" "}
              {t("home.btn_dashboard", "View Dashboard")}
            </button>

            <button
              onClick={() => navigate("/help")}
              className="px-8 py-4 glass-card hover:bg-white/20 rounded-2xl font-semibold transition-all flex items-center gap-2"
            >
              <LifeBuoy className="w-5 h-5" /> {t("home.btn_help", "Get Help")}
            </button>
          </motion.div>

          <StatsCounter />
        </div>
      </motion.section>

      {/* 🧭 Category Filter */}
      <motion.section
        variants={itemVariants}
        className="max-w-7xl mx-auto px-4 my-10"
      >
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </motion.section>

      {/* 🌟 Featured Post */}
      {featuredPost && (
        <motion.section
          variants={itemVariants}
          className="max-w-6xl mx-auto px-4 mb-16"
        >
          <FeaturedPost post={featuredPost} />
        </motion.section>
      )}

      {/* 🔥 Trending Topics */}
      <motion.section
        variants={itemVariants}
        className="max-w-6xl mx-auto px-4 mb-16"
      >
        <TrendingTopics />
      </motion.section>

      {/* 📰 Posts Section */}
      <motion.section
        variants={itemVariants}
        className="max-w-7xl mx-auto px-4 pb-20"
      >
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading posts...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No posts found.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post._id || post.slug} post={post} />
            ))}
          </div>
        )}
      </motion.section>

      {/* 🧠 AI Showcase */}
      <motion.section variants={itemVariants} className="px-4">
        <div className="max-w-7xl mx-auto">
          <AIShowcase />
        </div>
      </motion.section>

      {/* 💌 Newsletter Signup */}
      <motion.section
        variants={itemVariants}
        className="max-w-5xl mx-auto px-4 my-20"
      >
        <NewsletterSignup />
      </motion.section>
    </motion.div>
  );
};

export default Home;
