// import React, { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { MessageCircle, X, Send, Sparkles, Loader } from "lucide-react";
// import { useAI } from "../context/AIContext.jsx";

// const AIAssistant = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { type: "ai", content: "👋 Hi! I'm your AI writing assistant. How can I help?" },
//   ]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const endRef = useRef(null);
//   const ai = useAI();
//   const isLoading = ai?.isLoading;

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isOpen]);

//   const sendMessage = async (text) => {
//     if (!text || !text.trim()) return;
//     const trimmed = text.trim();
//     const userMsg = { type: "user", content: trimmed };
//     setMessages((m) => [...m, userMsg]);
//     setInput("");
//     setIsTyping(true);

//     try {
//       const result = await ai.generateContent(trimmed);
//       const reply = result ?? "Sorry — AI is not available right now.";
//       setMessages((m) => [...m, { type: "ai", content: reply }]);
//     } catch (err) {
//       console.error("AI error:", err);
//       setMessages((m) => [...m, { type: "ai", content: "An error occurred. Try again." }]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   return (
//     <div className="fixed bottom-6 right-6 z-50">
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: 12, scale: 0.98 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 12, scale: 0.98 }}
//             className="ai-chat-bubble mb-4 p-4 w-80 max-h-[60vh] flex flex-col glass-card rounded-2xl shadow-lg"
//             role="dialog"
//             aria-label="AI Assistant"
//           >
//             <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/20">
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 grid place-items-center text-white">
//                   <Sparkles className="w-4 h-4" />
//                 </div>
//                 <div className="font-semibold">AI Assistant</div>
//               </div>
//               <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-white/10">
//                 <X className="w-4 h-4" />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto space-y-2 mb-3 pr-1">
//               {messages.map((m, i) => (
//                 <div
//                   key={i}
//                   className={`p-2 rounded-lg text-sm ${m.type === "user" ? "bg-blue-600 text-white ml-8" : "bg-white/10 text-white/90 mr-8"}`}
//                 >
//                   {m.content}
//                 </div>
//               ))}

//               {isTyping && (
//                 <div className="p-2 rounded-lg bg-white/10 mr-8 text-sm">
//                   <div className="flex space-x-1">
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "120ms" }} />
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "240ms" }} />
//                   </div>
//                 </div>
//               )}

//               <div ref={endRef} />
//             </div>

//             <div className="flex items-center gap-2">
//               <input
//                 className="flex-1 p-2 rounded-lg bg-white/10 border-0 text-sm outline-none"
//                 placeholder="Ask me anything..."
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     e.preventDefault();
//                     sendMessage(input);
//                   }
//                 }}
//               />
//               <button
//                 onClick={() => sendMessage(input)}
//                 disabled={!input.trim() || isLoading}
//                 className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white disabled:opacity-50"
//                 aria-label="Send"
//               >
//                 {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <motion.button
//         onClick={() => setIsOpen((v) => !v)}
//         className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white"
//         style={{ background: "linear-gradient(90deg,#8b5cf6,#ec4899)" }}
//       >
//         {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
//       </motion.button>
//     </div>
//   );
// };

// export default AIAssistant;
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, Sparkles, Loader2,
  Maximize2, Minimize2, Trash2, Bot, User
} from "lucide-react";
import { useAI } from "../context/AIContext.jsx";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Toggle window size
  const [messages, setMessages] = useState([
    { type: "ai", content: "👋 Hi! I'm your AI assistant. Ask me to write, edit, or brainstorm ideas!" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const endRef = useRef(null);
  const inputRef = useRef(null);
  
  const ai = useAI();
  const isLoading = ai?.isLoading;

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, isTyping]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input.trim();
    setMessages(prev => [...prev, { type: "user", content: userText }]);
    setInput("");
    setIsTyping(true);

    try {
      const result = await ai.generateContent(userText);
      const reply = result || "I couldn't generate a response. Please try again.";
      setMessages(prev => [...prev, { type: "ai", content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { type: "ai", content: "Sorry, something went wrong with the AI." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([{ type: "ai", content: "Chat cleared. How can I help now?" }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`
              flex flex-col shadow-2xl overflow-hidden
              bg-white dark:bg-gray-900 
              border border-gray-200 dark:border-gray-700
              ${isExpanded 
                ? "fixed bottom-24 right-6 w-[90vw] h-[80vh] md:w-[600px] md:h-[700px] rounded-2xl" 
                : "absolute bottom-20 right-0 w-[380px] h-[550px] rounded-2xl"
              }
            `}
          >
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">AI Companion</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
                    <span className="text-[10px] opacity-90">Online</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                 <button 
                  onClick={clearChat}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  title="Clear Chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  title={isExpanded ? "Minimize" : "Expand"}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* --- MESSAGES AREA --- */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950/50">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`flex gap-3 ${msg.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    ${msg.type === "user" ? "bg-gray-200 dark:bg-gray-700" : "bg-violet-100 dark:bg-violet-900/30"}
                  `}>
                    {msg.type === "user" ? 
                      <User className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : 
                      <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    }
                  </div>

                  {/* Message Bubble */}
                  <div className={`
                    max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${msg.type === "user" 
                      ? "bg-violet-600 text-white rounded-tr-none" 
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-none"
                    }
                  `}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* --- INPUT AREA --- */}
            <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <div className="relative flex items-end gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-xl border border-transparent focus-within:border-violet-300 dark:focus-within:border-violet-700 transition-colors">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask anything..."
                  className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-800 dark:text-gray-100 max-h-32 min-h-[44px] py-3 px-2 resize-none scrollbar-hide placeholder:text-gray-400"
                  rows={1}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className={`
                    p-2.5 rounded-lg mb-0.5 transition-all duration-200
                    ${input.trim() && !isLoading 
                      ? "bg-violet-600 text-white shadow-md hover:bg-violet-700 hover:scale-105 active:scale-95" 
                      : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    }
                  `}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
              <div className="text-center mt-2">
                 <span className="text-[10px] text-gray-400">Powered by Gemini AI</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FLOATING TOGGLE BUTTON --- */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-center w-14 h-14 rounded-full shadow-xl 
          bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white 
          hover:shadow-violet-500/30 transition-shadow duration-300
        `}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <MessageCircle className="w-7 h-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default AIAssistant;