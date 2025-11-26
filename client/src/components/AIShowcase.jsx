import React from "react";
import { motion } from "framer-motion";
import { Mic, FileText, SpellCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <Mic className="w-10 h-10 text-blue-500" />,
    title: "Voice-to-Text",
    desc: "Speak and convert instantly into written text.",
    link: "/ai-studio",
  },
  {
    icon: <FileText className="w-10 h-10 text-purple-500" />,
    title: "Auto Summarizer",
    desc: "Summarize long articles into concise points.",
    link: "/ai/editor",
  },
  {
    icon: <SpellCheck className="w-10 h-10 text-green-500" />,
    title: "Grammar Corrector",
    desc: "Polish your writing with AI-powered grammar fixes.",
    link: "/ai/editor",
  },
  {
    icon: <Sparkles className="w-10 h-10 text-yellow-500" />,
    title: "AI Assistant",
    desc: "Ask, brainstorm, and get content ideas instantly.",
    link: "/ai/assistant",
  },
];

const AIShowcase = () => {
  const navigate = useNavigate();

  return (
    <section className="mt-24">
      <h2 className="text-3xl font-bold text-center mb-8">
        Explore Our AI Tools
      </h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="glass-card p-6 rounded-2xl shadow-md cursor-pointer hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate(f.link)}
            role="button"
            tabIndex={0}
            aria-label={`Go to ${f.title}`}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              {f.icon}
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {f.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default AIShowcase;
