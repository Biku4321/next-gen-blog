import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, User, Clock, PenTool } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="visible"
      className="relative flex items-center justify-center overflow-hidden min-h-[85vh] px-6 md:px-12 py-20"
      aria-label="Featured article section"
    >
      {/* 🔮 Gradient & Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900"></div>
      <div className="absolute -top-24 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-purple-500/20 rounded-full blur-3xl"></div>

      {/* 💡 Content */}
      <div className="relative z-10 grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-center">
        {/* Text Section */}
        <motion.div variants={item} className="space-y-8">
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
            <span>Editor’s Pick</span>
          </div>

          <motion.h1
            variants={item}
            className="text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent"
          >
            The Future of Web Development in 2025
          </motion.h1>

          <motion.p
            variants={item}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl"
          >
            Discover the latest trends, technologies, and best practices that are
            shaping the future of web development — from AI integration to the
            next-gen frameworks empowering creators.
          </motion.p>

          {/* Author & Meta Info */}
          <motion.div
            variants={item}
            className="flex items-center flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400"
          >
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>John Doe</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>8 min read</span>
            </div>
            <span>Dec 15, 2024</span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <button
              onClick={() => navigate("/posts/the-future-of-web-dev")}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              <span>Read Full Article</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate("/create")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 glass-card hover:bg-white/20 rounded-2xl font-semibold transition-all"
            >
              <PenTool className="w-5 h-5" /> Write Your Own
            </button>
          </motion.div>
        </motion.div>

        {/* 🌠 Featured Image */}
        <motion.div
          variants={item}
          className="relative w-full flex justify-center"
        >
          <div className="relative glass-card p-4 md:p-8 rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200"
              alt="Future of Web Development"
              className="w-full h-80 md:h-96 object-cover rounded-2xl"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
