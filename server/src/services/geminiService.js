import { GoogleGenerativeAI } from '@google/generative-ai';
import natural from 'natural';
import sentiment from 'sentiment';
import logger from '../utils/logger.js';

class GeminiService {
  constructor() {
    this.isInitialized = false;
    
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;

    if (!apiKey || apiKey.includes('your_key')) {
      logger.warn('⚠️ No valid AI API Key found (GEMINI_API_KEY or GOOGLE_AI_KEY). AI features disabled.');
      return;
    }
    
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      
      // We don't hardcode 'this.model' here anymore. We create it per request.
      
      this.sentimentAnalyzer = new sentiment();
      this.tokenizer = new natural.WordTokenizer();

      this.isInitialized = true;
      logger.info('✅ Gemini AI Service Initialized Successfully.');

    } catch (error) {
        logger.error('🔴 Failed to initialize Gemini AI Service:', error.message);
        this.isInitialized = false;
    }
  }

  _checkInitialized() {
    if (!this.isInitialized) {
      throw new Error('AI Service is not configured. Check your API Key.');
    }
  }
/**
   * Generate content with dynamic model selection
   * @param {string} prompt 
   * @param {string} modelName - e.g., "gemini-1.5-flash"
   */
  async generateContent(prompt, modelName = "gemini-2.5-flash") {
    this._checkInitialized();
    try {
      // Allow fallback if frontend sends an old model ID
      const safeModel = modelName.includes('1.5') ? 'gemini-2.5-flash' : modelName;

      const model = this.genAI.getGenerativeModel({ 
        model: safeModel,
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 8192,
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return {
        success: true,
        content: response.text(),
        usage: result.usage || {}
      };
    } catch (error) {
      // Log the specific model that failed
      logger.error(`AI Error (${modelName}):`, error.message);
      throw new Error(`AI generation failed. Model: ${modelName}`);
    }
  }

  async improveWriting(content, improvements = ['clarity', 'engagement']) {
    this._checkInitialized();
    const prompt = `Improve the following content for ${improvements.join(', ')}: "${content}"`;
    return this.generateContent(prompt);
  }

  async generateSEOOptimizations(title, content, targetKeywords = []) {
    this._checkInitialized();
    const prompt = `As an SEO expert, analyze this content titled "${title}" with keywords "${targetKeywords.join(', ')}" and provide a JSON response with fields: "seoScore", "titleSuggestions", "metaDescription".`;
    try {
      const response = await this.generateContent(prompt);
      return JSON.parse(response.content);
    } catch (error) {
      logger.error('SEO optimization error:', error);
      return this.getFallbackSEOAnalysis(title, content);
    }
  }

async generateBlogIdeas(topic, audience = 'general', count = 5) {
    this._checkInitialized();
    const prompt = `
      Generate ${count} creative blog post ideas about "${topic}" for a ${audience} audience.
      Format as a JSON array of objects, each with "title", "description", and "keywords" fields.
    `;
    try {
      const response = await this.generateContent(prompt);
      return JSON.parse(response.content);
    } catch (error) {
      logger.error('Blog idea generation error:', error);
      return [];
    }
  }

  async generateAltText(imageDescription, context = '') {
    this._checkInitialized();
    const prompt = `
      Generate SEO-friendly alt text under 125 characters for an image described as: "${imageDescription}".
      Context: ${context}.
      Return only the alt text.
    `;
    const response = await this.generateContent(prompt);
    return response.content.trim().replace(/['"]/g, '');
  }

  async generateSocialPosts(title, excerpt, platforms = ['twitter', 'linkedin']) {
    this._checkInitialized();
    const results = {};
    for (const platform of platforms) {
      const prompt = `
        Create an engaging ${platform} post for this article:
        Title: "${title}"
        Excerpt: "${excerpt}"
        Return only the post content with hashtags.
      `;
      try {
        const response = await this.generateContent(prompt);
        results[platform] = response.content;
      } catch (error) {
        logger.error(`Social post generation error for ${platform}:`, error);
        results[platform] = `Check out our latest post: ${title}`;
      }
    }
    return results;
  }
  async analyzeContent(content) {
    const words = this.tokenizer.tokenize(content.replace(/<[^>]*>/g, '')) || [];
    const sentimentResult = this.sentimentAnalyzer.analyze(content);
    
    let aiAnalysis = {};
    if (this.isInitialized) {
        try {
            const analysisPrompt = `Analyze this content and provide scores (0-100) for "quality", "engagement", and "clarity". Return strictly JSON. Content: "${content.substring(0, 1000)}..."`;
            const response = await this.generateContent(analysisPrompt);
  
            const jsonStr = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
            aiAnalysis = JSON.parse(jsonStr);
        } catch (error) {
            logger.warn('AI analysis skipped:', error.message);
        }
    }

    return {
      wordCount: words.length,
      readingTime: Math.ceil(words.length / 200),
      sentiment: sentimentResult,
      aiScores: aiAnalysis
    };
  }

  async translateContent(content, targetLanguage) {
    this._checkInitialized();
    const prompt = `Translate to ${targetLanguage}: "${content}"`;
    return await this.generateContent(prompt);
  }
  buildPrompt(basePrompt, context) {
    let enhancedPrompt = basePrompt;
    if (context.tone) enhancedPrompt += `\n(Tone: ${context.tone})`;
    return enhancedPrompt;
  }

  getFallbackSEOAnalysis(title, content) {
    return {
      seoScore: 50,
      titleSuggestions: [title],
      metaDescription: content.substring(0, 155) + '...'
    };
  }
}

export default new GeminiService();
