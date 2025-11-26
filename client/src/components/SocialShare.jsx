// // components/SocialShare.jsx
// import React from 'react';
// import { Twitter, Linkedin, Facebook, Link2 } from 'lucide-react';

// const SocialShare = ({ url, title, description }) => {
//   const shareData = {
//     title,
//     text: description,
//     url
//   };

//   const handleShare = async (platform) => {
//     if (platform === 'native' && navigator.share) {
//       try {
//         await navigator.share(shareData);
//       } catch (err) {
//         console.log('Error sharing:', err);
//       }
//     } else {
//       const shareUrls = {
//         twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
//         linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
//         facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
//       };
      
//       window.open(shareUrls[platform], '_blank', 'width=600,height=400');
//     }
//   };

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(url);
//       // Show toast notification
//     } catch (err) {
//       console.log('Failed to copy:', err);
//     }
//   };

//   return (
//     <div className="flex items-center space-x-3">
//       <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Share:</span>
      
//       <button
//         onClick={() => handleShare('twitter')}
//         className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
//       >
//         <Twitter className="w-4 h-4" />
//       </button>
      
//       <button
//         onClick={() => handleShare('linkedin')}
//         className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors"
//       >
//         <Linkedin className="w-4 h-4" />
//       </button>
      
//       <button
//         onClick={() => handleShare('facebook')}
//         className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
//       >
//         <Facebook className="w-4 h-4" />
//       </button>
      
//       <button
//         onClick={copyToClipboard}
//         className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
//       >
//         <Link2 className="w-4 h-4" />
//       </button>
//     </div>
//   );
// };

// // PWA Configuration - manifest.json
// const manifest = {
//   "name": "BlogPro - Professional Blogging Platform",
//   "short_name": "BlogPro",
//   "description": "A modern, professional blogging platform",
//   "start_url": "/",
//   "display": "standalone",
//   "background_color": "#ffffff",
//   "theme_color": "#2563eb",
//   "icons": [
//     {
//       "src": "/icons/icon-192x192.png",
//       "sizes": "192x192",
//       "type": "image/png"
//     },
//     {
//       "src": "/icons/icon-512x512.png",
//       "sizes": "512x512",
//       "type": "image/png"
//     }
//   ]
// };

// // Service Worker for offline support
// const serviceWorkerCode = `
// const CACHE_NAME = 'blogpro-v1';
// const urlsToCache = [
//   '/',
//   '/static/css/main.css',
//   '/static/js/main.js'
// ];

// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then((cache) => cache.addAll(urlsToCache))
//   );
// });

// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request)
//       .then((response) => {
//         return response || fetch(event.request);
//       })
//   );
// });
// `;

// components/SocialShare.jsx
import React, { useState } from "react";
import { Twitter, Linkedin, Facebook, Link2, MessageCircle } from "lucide-react";

const SocialShare = ({ url, title, description }) => {
  const [copied, setCopied] = useState(false);

  const shareData = {
    title: title || "Check this out!",
    text: description || "Read this amazing post!",
    url,
  };

  // --- Handle platform sharing ---
  const handleShare = async (platform) => {
    if (platform === "native" && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share canceled or failed:", err);
      }
      return;
    }

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp:
        /Android|iPhone/i.test(navigator.userAgent)
          ? `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`
          : `https://web.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    };

    window.open(shareUrls[platform], "_blank", "width=600,height=500");
  };

  // --- Copy link ---
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log("Failed to copy:", err);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
      <span className="font-medium text-gray-600 dark:text-gray-400">
        Share this post:
      </span>

      {/* Twitter */}
      <button
        onClick={() => handleShare("twitter")}
        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
        title="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
      </button>

      {/* LinkedIn */}
      <button
        onClick={() => handleShare("linkedin")}
        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </button>

      {/* Facebook */}
      <button
        onClick={() => handleShare("facebook")}
        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
        title="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </button>

      {/* WhatsApp */}
      <button
        onClick={() => handleShare("whatsapp")}
        className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
        title="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </button>

      {/* Copy Link */}
      <button
        onClick={copyToClipboard}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
        title="Copy link"
      >
        <Link2 className="w-4 h-4" />
      </button>

      {/* Native Share for mobile browsers */}
      {navigator.share && (
        <button
          onClick={() => handleShare("native")}
          className="px-3 py-2 text-sm rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition-colors"
        >
          Share
        </button>
      )}

      {copied && (
        <span className="text-xs text-green-600 font-medium ml-2">
          Link copied!
        </span>
      )}
    </div>
  );
};

export default SocialShare;
