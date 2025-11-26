import geminiService from '../services/geminiService.js';
import { validationResult } from 'express-validator';

const handleAIRequest = (serviceMethod) => async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const result = await serviceMethod(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateContent = handleAIRequest(geminiService.generateContent);
export const improveWriting = handleAIRequest(geminiService.improveWriting);
export const generateSEOSuggestions = handleAIRequest(geminiService.generateSEOOptimizations);
export const generateBlogIdeas = handleAIRequest(geminiService.generateBlogIdeas);
export const generateAltText = handleAIRequest(geminiService.generateAltText);
export const generateSocialPosts = handleAIRequest(geminiService.generateSocialPosts);
export const analyzeContent = handleAIRequest(geminiService.analyzeContent);
export const generateTranslation = handleAIRequest(geminiService.translateContent);
export const generateContentOutline = (req, res) => res.status(501).json({ message: 'Not Implemented' });
export const generateMetaTags = (req, res) => res.status(501).json({ message: 'Not Implemented' });
export const checkPlagiarism = (req, res) => res.status(501).json({ message: 'Not Implemented' });
export const generateVoiceToText = (req, res) => res.status(501).json({ message: 'Not Implemented' });

export const handleAiStudio = async (req, res) => {
  try {
    const { prompt, model } = req.body; 
    if (model === 'gpt-4-turbo' || model === 'claude-3-opus') {
      return res.status(400).json({ success: false, message: "This model is coming soon!" });
    }

    const result = await geminiService.generateContent(prompt, model || "gemini-1.5-flash");
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleAiEditor = async (req, res) => {
  try {
    const { content, style } = req.body;
    const result = await geminiService.improveWriting({ content, style });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleAiAssistant = async (req, res) => {
  try {
    const { prompt, query } = req.body;
    const userMessage = prompt || query || '';

    // Switch Assistant to Gemini 2.5 Flash for speed
    const result = await geminiService.generateContent(userMessage, "gemini-2.5-flash");
    
    res.json({ success: true, data: result }); 
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const generateImageFromText = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { prompt, style, size } = req.body;
    const result = await geminiService.generateImage(prompt, style, size);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};