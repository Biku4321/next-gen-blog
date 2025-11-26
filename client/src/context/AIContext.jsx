
import React, { createContext, useContext, useState, useCallback } from "react";
import api from "../services/api"; // ✅ Import Axios instance to handle Auth tokens

/**
 * AIContext
 * - Uses backend proxy (/api/ai/generate) to protect API keys.
 * - Uses Axios to automatically attach JWT tokens.
 */

const AIContext = createContext(null);

export const useAI = () => {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error("useAI must be used within AIProvider");
  return ctx;
};

const AIProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Centralized function to call Backend AI
  const callServerAI = useCallback(async (prompt, opts = {}) => {
    try {
      setIsLoading(true);
      
      // ✅ Axios (api.post) automatically adds "Authorization: Bearer token"
      const res = await api.post('/ai/generate', { 
        prompt, 
        ...opts 
      });

      // Handle server response structure: { success: true, data: { content: "..." } }
      const content = res.data?.data?.content ?? res.data?.content ?? null;

      return typeof content === 'string' ? content : JSON.stringify(content);
    } catch (e) {
      console.error('AI call failed:', e.response?.data?.message || e.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateContent = useCallback(async (prompt, options = {}) => {
    // Pass { prompt, model: "gemini-2.5-pro" } to backend
    const result = await callServerAI(prompt, options);
    if (result === null) return "AI service unavailable.";
    return result;
  }, [callServerAI]);

  const improveWriting = useCallback(async ({ content, style }) => {
    const p = `Improve this text${style ? ` (${style})` : ""}:\n\n${content}`;
    const out = await callServerAI(p);
    return out ?? content; // Return original if failed
  }, [callServerAI]);

  const analyzeContent = useCallback(async ({ query, context }) => {
    const p = `${query}\n\nContext:\n${context || ""}`;
    const out = await callServerAI(p);
    return out ?? "";
  }, [callServerAI]);

  const generateBlogIdeas = useCallback(async (topic) => {
    const prompt = `Generate 5 creative blog post ideas for: ${topic}`;
    const result = await callServerAI(prompt);
    if (!result) return [`Top 10 Tips for ${topic}`, `Why ${topic} Matters`, `The Future of ${topic}`];
    
    return result.split(/\r?\n/).map((s) => s.replace(/^[-*]\s*/, "").trim()).filter(Boolean);
  }, [callServerAI]);

  const optimizeReadability = useCallback(async (text) => {
    const prompt = `Simplify this text:\n\n${text}`;
    const result = await callServerAI(prompt);
    return result ?? text;
  }, [callServerAI]);

  const generateSocialPosts = useCallback(async (title) => {
    const prompt = `Write 3 tweets for: "${title}"`;
    const result = await callServerAI(prompt);
    if (!result) return [`Check out ${title}!`, `New post: ${title}`];
    return result.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  }, [callServerAI]);

  const value = {
    generateContent,
    improveWriting,
    analyzeContent,
    generateBlogIdeas,
    optimizeReadability,
    generateSocialPosts,
    isLoading,
    isAvailable: true, // Backend handles availability now
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export default AIProvider;