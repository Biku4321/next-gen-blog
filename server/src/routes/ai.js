import express from "express";
import { body } from "express-validator";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import {
  generateContent,
  improveWriting,
  generateSEOSuggestions,
  generateBlogIdeas,
  generateAltText,
  generateSocialPosts,
  analyzeContent,
  generateTranslation,
  generateContentOutline,
  generateMetaTags,
  checkPlagiarism,
  generateVoiceToText,
  generateImageFromText,
  handleAiStudio,
  handleAiEditor,
  handleAiAssistant,
} from "../controllers/aiController.js";

const router = express.Router();

router.get("/models", (req, res) => {
  res.status(200).json({
    success: true,
    models: [
      { 
        id: "gemini-2.5-flash", 
        name: "Gemini 2.5 Flash", 
        type: "Fast & Efficient (Standard)", 
        available: true,
        description: "Best for high-volume tasks, chat, and quick edits."
      },
      { 
        id: "gemini-2.5-pro", 
        name: "Gemini 2.5 Pro", 
        type: "Complex Reasoning", 
        available: true,
        description: "Best for deep analysis, coding, and creative writing."
      },
      { 
        id: "gemini-3.0-pro-preview", 
        name: "Gemini 3.0 Pro (Preview)", 
        type: "Next-Gen Intelligence", 
        available: true, 
        description: "Experimental model with advanced reasoning."
      },
      { 
        id: "gpt-4-turbo", 
        name: "GPT-4 Turbo", 
        type: "Creative writing", 
        available: false // ❌ Shows "Available in future"
      },
      { 
        id: "claude-3-opus", 
        name: "Claude 3 Opus", 
        type: "Analytical text", 
        available: false // ❌ Shows "Available in future"
      },
    ],
  });
});
router.post('/generate', protect, handleAiAssistant);
router.post("/studio", protect, handleAiStudio);
router.post("/editor", protect, handleAiEditor);
router.post("/assistant", protect, handleAiAssistant);

router.post(
  "/generate-content",
  protect,
  [
    body("prompt").isString().isLength({ min: 10, max: 500 }),
    body("style").optional().isIn(["realistic", "artistic", "minimal", "vintage", "modern"]),
    body("size").optional().isIn(["small", "medium", "large"]),
  ],
  validate,
  generateContent
);

router.post(
  "/improve-writing",
  protect,
  [
    body("content").isString().isLength({ min: 50, max: 10000 }),
    body("targetAudience").optional().isString(),
  ],
  validate,
  improveWriting
);

router.post(
  "/seo-suggestions",
  protect,
  [
    body("title").isString(),
    body("content").isString(),
    body("targetKeywords").optional().isArray(),
  ],
  validate,
  generateSEOSuggestions
);

router.post(
  "/blog-ideas",
  protect,
  [body("topic").isString(), body("count").optional().isInt({ min: 1, max: 10 })],
  validate,
  generateBlogIdeas
);

router.post("/generate-alt-text", protect, [body("imageDescription").isString()], validate, generateAltText);

router.post(
  "/social-posts",
  protect,
  [body("title").isString(), body("excerpt").isString()],
  validate,
  generateSocialPosts
);

router.post("/analyze-content", protect, [body("content").isString()], validate, analyzeContent);

router.post(
  "/translate",
  protect,
  [body("content").isString(), body("targetLanguage").isString().isLength({ min: 2, max: 2 })],
  validate,
  generateTranslation
);

router.post("/generate-outline", protect, [body("topic").isString()], validate, generateContentOutline);

router.post("/generate-meta-tags", protect, [body("title").isString()], validate, generateMetaTags);

router.post("/check-plagiarism", protect, [body("content").isString()], validate, checkPlagiarism);

router.post("/voice-to-text", protect, generateVoiceToText);

router.post("/generate-image", protect, [body("prompt").isString()], validate, generateImageFromText);

export default router;
