import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bold, Italic, Underline, Link as LinkIcon, Image as ImageIcon, Code, List,
  Quote, Heading, Eye, Wand2, Lightbulb, CheckCircle, Loader,
  Mic, MicOff, Maximize, Minimize, Share2, Download, Languages,
  Palette, RefreshCw, FileText, Sparkles
} from "lucide-react";
import { useAI } from "../context/AIContext";
import api from "../services/api"; // For direct calls to image/translation endpoints
import AIAssistant from "../components/AIAssistant.jsx";
import SEOAnalyzer from "./SEOAnalyzer";
import ImageUploader from "./ImageUploader";
import toast from "react-hot-toast"; // Assuming you have this installed, else use alert

const AIEditor = ({ content, setContent, title, setTitle }) => {
  const location = useLocation();
  const { generateContent } = useAI();
  const editorRef = useRef(null);

  // --- State ---
  const [activeModel, setActiveModel] = useState("gemini-2.5-flash");
  const [isPreview, setIsPreview] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  
  // Stats
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [seoScore, setSeoScore] = useState(0);

  // New Features State
  const [isRecording, setIsRecording] = useState(false);
  const [socialPreviews, setSocialPreviews] = useState(null);
  const [showImageGen, setShowImageGen] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");

  // --- Initialization ---
  useEffect(() => {
    if (location.state?.aiModel) {
      setActiveModel(location.state.aiModel);
    }
  }, [location.state]);

  useEffect(() => {
    if (content) {
      const text = content.replace(/<[^>]*>/g, "");
      const words = text.split(/\s+/).filter((word) => word.length > 0).length;
      setWordCount(words);
      setReadingTime(Math.ceil(words / 200));
    }
  }, [content]);

  // --- Core Editor Functions ---
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) setContent(editorRef.current.innerHTML);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection.toString().trim()) {
      setSelectedText(selection.toString());
      setShowAIPanel(true);
    }
  };

  // --- 🎙️ Voice to Text ---
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      window.speechRecognition?.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      // Append to editor
      document.execCommand("insertText", false, transcript + " ");
      if (editorRef.current) setContent(editorRef.current.innerHTML);
    };

    window.speechRecognition = recognition;
    recognition.start();
  };

  // --- 🧠 AI Features ---
  const getAISuggestions = async () => {
    if (!content || content.length < 50) return toast.error("Write more content first!");
    setIsAIThinking(true);
    try {
      const res = await generateContent(
        `Analyze this blog post and provide 3 critical improvements. Format as JSON array: [{"type": "grammar|flow|seo", "suggestion": "..."}]`,
        { model: activeModel }
      );
      // Clean JSON if AI wraps it in markdown
      const jsonStr = res.replace(/```json/g, "").replace(/```/g, "").trim();
      setAiSuggestions(JSON.parse(jsonStr) || []);
    } catch (error) {
      console.error("Suggestion Error", error);
      toast.error("Failed to get suggestions");
    }
    setIsAIThinking(false);
  };

  const improveWithAI = async (type, extraParam = "") => {
    if (!selectedText) return;
    setIsAIThinking(true);
    
    let prompt = "";
    switch (type) {
      case "tone":
        prompt = `Rewrite this text in a ${extraParam} tone: "${selectedText}"`;
        break;
      case "translate":
        prompt = `Translate this text to ${extraParam}: "${selectedText}"`;
        break;
      case "expand":
        prompt = `Expand this text with more details and examples: "${selectedText}"`;
        break;
      case "summarize":
        prompt = `Summarize this text concisely: "${selectedText}"`;
        break;
      default:
        prompt = `Improve this text: "${selectedText}"`;
    }

    try {
      const improved = await generateContent(prompt, { model: activeModel });
      document.execCommand("insertText", false, improved);
      if (editorRef.current) setContent(editorRef.current.innerHTML);
      setShowAIPanel(false);
    } catch (err) {
      toast.error("AI Improvement failed");
    }
    setIsAIThinking(false);
  };

  const generateAIImage = async () => {
    if (!imagePrompt) return toast.error("Enter an image description");
    setIsAIThinking(true);
    try {
      const res = await api.post("/ai/generate-image", { prompt: imagePrompt, style: "realistic" });
      if (res.data?.imageUrl) {
        formatText("insertImage", res.data.imageUrl);
        setShowImageGen(false);
        setImagePrompt("");
      }
    } catch (err) {
      toast.error("Image generation failed");
    }
    setIsAIThinking(false);
  };

  const generateSocials = async () => {
    if (!title || content.length < 100) return toast.error("Title and content required");
    setIsAIThinking(true);
    try {
      const res = await api.post("/ai/social-posts", { title, excerpt: content.substring(0, 500) });
      setSocialPreviews(res.data?.data || {});
    } catch (err) {
      console.error(err);
    }
    setIsAIThinking(false);
  };

  // --- Toolbar Config ---
  const tools = [
    { icon: Bold, cmd: "bold", tip: "Bold" },
    { icon: Italic, cmd: "italic", tip: "Italic" },
    { icon: Underline, cmd: "underline", tip: "Underline" },
    { icon: Heading, cmd: "formatBlock", val: "h2", tip: "Heading 2" },
    { icon: Quote, cmd: "formatBlock", val: "blockquote", tip: "Quote" },
    { icon: Code, cmd: "formatBlock", val: "pre", tip: "Code Block" },
    { icon: List, cmd: "insertUnorderedList", tip: "List" },
    { icon: LinkIcon, cmd: "createLink", prompt: "Enter URL:", tip: "Link" },
  ];

  return (
    <div className={`space-y-6 transition-all duration-500 ${isFullScreen ? "fixed inset-0 z-50 bg-white dark:bg-gray-900 p-8 overflow-y-auto" : ""}`}>
      
      {/* 🟢 TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {isFullScreen ? "Focus Mode" : "Content Editor"}
          </h2>
          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
            <span className={`px-2 py-0.5 rounded-full ${activeModel.includes('pro') ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
              ⚡ Model: {activeModel}
            </span>
            <span>• {wordCount} words</span>
            <span>• {readingTime} min read</span>
            <span className={seoScore > 80 ? "text-green-500" : "text-orange-500"}>• SEO: {seoScore}/100</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Toggle Full Screen"
          >
            {isFullScreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={getAISuggestions}
            disabled={isAIThinking}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isAIThinking ? <Loader className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
            Analyze
          </motion.button>

          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {/* 🟠 TITLE INPUT */}
      {!isFullScreen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 rounded-xl">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter an engaging title..."
            className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-600"
          />
        </motion.div>
      )}

      {/* 🔵 MAIN GRID */}
      <div className={`grid grid-cols-1 ${isFullScreen ? "max-w-4xl mx-auto" : "lg:grid-cols-4"} gap-6`}>
        
        {/* EDITOR COLUMN */}
        <div className={isFullScreen ? "w-full" : "lg:col-span-3 space-y-4"}>
          
          {/* TOOLBAR */}
          <div className="glass-card p-2 rounded-xl flex flex-wrap items-center gap-1 sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            {tools.map((t, i) => (
              <button
                key={i}
                onClick={() => t.prompt ? formatText(t.cmd, prompt(t.prompt)) : formatText(t.cmd, t.val)}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                title={t.tip}
              >
                <t.icon className="w-4 h-4" />
              </button>
            ))}
            <div className="w-px h-6 bg-gray-300 mx-2" />
            
            {/* Voice Input */}
            <button
              onClick={toggleRecording}
              className={`p-2 rounded transition ${isRecording ? "bg-red-100 text-red-600 animate-pulse" : "hover:bg-gray-100"}`}
              title="Voice Typing"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* AI Image Gen Toggle */}
            <button
              onClick={() => setShowImageGen(!showImageGen)}
              className="p-2 rounded hover:bg-blue-50 text-blue-600"
              title="Generate AI Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          {/* AI IMAGE GENERATOR PANEL */}
          <AnimatePresence>
            {showImageGen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="glass-card p-4 rounded-xl bg-blue-50/50 overflow-hidden">
                <div className="flex gap-2">
                  <input 
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe the image you want (e.g. 'Cyberpunk city at night')..." 
                    className="flex-1 p-2 rounded border bg-white"
                  />
                  <button onClick={generateAIImage} disabled={isAIThinking} className="btn-primary">
                    {isAIThinking ? "Generating..." : "Create"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* EDITOR AREA */}
          <div className="relative glass-card min-h-[500px] p-6 rounded-2xl">
            {isPreview ? (
              <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="prose prose-lg dark:prose-invert max-w-none outline-none min-h-[450px]"
                onInput={(e) => setContent(e.currentTarget.innerHTML)}
                onBlur={(e) => setContent(e.currentTarget.innerHTML)}
                onMouseUp={handleTextSelection}
                onKeyUp={handleTextSelection}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}

            {/* FLOATING AI MENU */}
            <AnimatePresence>
              {showAIPanel && selectedText && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute z-50 right-4 top-20 w-64 glass-card p-4 rounded-xl shadow-2xl border border-white/40 backdrop-blur-xl"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">AI Edit</span>
                    <button onClick={() => setShowAIPanel(false)} className="text-gray-400 hover:text-red-500">&times;</button>
                  </div>
                  
                  <div className="space-y-2">
                    <button onClick={() => improveWithAI('expand')} className="w-full text-left text-sm p-2 hover:bg-blue-50 rounded flex items-center gap-2"><Sparkles className="w-3 h-3 text-blue-500"/> Expand Text</button>
                    <button onClick={() => improveWithAI('summarize')} className="w-full text-left text-sm p-2 hover:bg-blue-50 rounded flex items-center gap-2"><FileText className="w-3 h-3 text-green-500"/> Summarize</button>
                    
                    <div className="group relative">
                      <button className="w-full text-left text-sm p-2 hover:bg-blue-50 rounded flex items-center gap-2"><Palette className="w-3 h-3 text-purple-500"/> Change Tone</button>
                      <div className="hidden group-hover:block absolute left-full top-0 ml-2 bg-white shadow-lg rounded-lg p-2 w-32 border">
                        {['Professional', 'Casual', 'Humorous', 'Persuasive'].map(t => (
                          <button key={t} onClick={() => improveWithAI('tone', t)} className="block w-full text-left text-xs p-2 hover:bg-gray-100">{t}</button>
                        ))}
                      </div>
                    </div>

                    <div className="group relative">
                      <button className="w-full text-left text-sm p-2 hover:bg-blue-50 rounded flex items-center gap-2"><Languages className="w-3 h-3 text-orange-500"/> Translate</button>
                      <div className="hidden group-hover:block absolute left-full top-0 ml-2 bg-white shadow-lg rounded-lg p-2 w-32 border">
                        {['Spanish', 'French', 'German', 'Hindi', 'Japanese'].map(l => (
                          <button key={l} onClick={() => improveWithAI('translate', l)} className="block w-full text-left text-xs p-2 hover:bg-gray-100">{l}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* SIDEBAR COLUMN */}
        {!isFullScreen && (
          <div className="space-y-6">
            
            {/* AI Suggestions Box */}
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card p-5 rounded-xl">
              <h3 className="font-bold flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-yellow-500" /> AI Insights
              </h3>
              {isAIThinking && aiSuggestions.length === 0 ? (
                <div className="flex justify-center p-4"><Loader className="animate-spin text-blue-500"/></div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {aiSuggestions.length > 0 ? aiSuggestions.map((s, i) => (
                    <div key={i} className="text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded border-l-2 border-blue-500">
                      {s.suggestion}
                    </div>
                  )) : (
                    <p className="text-xs text-gray-400">Click "Analyze" to get feedback.</p>
                  )}
                </div>
              )}
            </motion.div>

            {/* SEO Analyzer Component */}
            <SEOAnalyzer title={title} content={content} onScoreUpdate={setSeoScore} />
            
            {/* Social Previews */}
            <div className="glass-card p-5 rounded-xl">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold flex items-center gap-2"><Share2 className="w-4 h-4 text-blue-500"/> Socials</h3>
                <button onClick={generateSocials} className="text-xs text-blue-600 hover:underline">Generate</button>
              </div>
              {socialPreviews?.twitter && (
                <div className="mb-3 text-xs p-3 bg-blue-50 rounded border border-blue-100">
                  <p className="font-bold text-blue-800 mb-1">Twitter/X</p>
                  {socialPreviews.twitter}
                </div>
              )}
              {socialPreviews?.linkedin && (
                <div className="text-xs p-3 bg-indigo-50 rounded border border-indigo-100">
                  <p className="font-bold text-indigo-800 mb-1">LinkedIn</p>
                  {socialPreviews.linkedin}
                </div>
              )}
            </div>

            {/* Manual Image Uploader */}
            <ImageUploader onImageUpload={(url) => formatText("insertImage", url)} />
          </div>
        )}
      </div>

      {/* CHATBOT - Placed Outside Layout for Fixed Position */}
      <AIAssistant />
    </div>
  );
};

export default AIEditor;