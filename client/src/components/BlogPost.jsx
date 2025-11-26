import React, { useState, useEffect, useRef } from "react";
import SocialShare from "./SocialShare.jsx"; // ✅ Floating Share buttons

const estimateReadingTime = (text) => {
  if (!text) return 0;
  const words = text
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200)); // 200 WPM
};

const generateTOC = (container) => {
  if (!container) return [];
  const headings = Array.from(container.querySelectorAll("h1, h2, h3"));
  return headings.map((h) => ({
    id:
      h.id ||
      (h.id = h.textContent
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")),
    text: h.textContent,
    level: Number(h.tagName[1]),
  }));
};

const BlogPost = ({ post }) => {
  const contentRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [toc, setToc] = useState([]);
  const [zoomImage, setZoomImage] = useState(null);

  const readingTime = estimateReadingTime(post?.content || "");
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const description = post?.excerpt || post?.title || "Read this amazing article!";

  useEffect(() => {
    const container = contentRef.current;
    if (container) {
      setToc(generateTOC(container));
    }

    const onScroll = () => {
      if (!contentRef.current) return;
      const el = contentRef.current;
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight;
      const total = rect.height;
      if (total <= 0) return setProgress(0);
      const scrolled = Math.min(Math.max(0, winH - rect.top), total);
      setProgress(Math.round((scrolled / total) * 100));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [post]);

  // Enable image zoom
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const imgs = Array.from(container.querySelectorAll("img"));
    imgs.forEach((img) => {
      img.style.cursor = "zoom-in";
      const handler = () => setZoomImage(img.src);
      img.addEventListener("click", handler);
      img._handler = handler;
    });
    return () => {
      imgs.forEach(
        (img) => img._handler && img.removeEventListener("click", img._handler)
      );
    };
  }, [post]);

  return (
    <article className="relative max-w-5xl mx-auto flex flex-col md:flex-row gap-8 p-4 md:p-6">
      {/* Floating Share Bar (desktop only) */}
      <aside className="hidden md:flex flex-col items-center space-y-3 sticky top-32 h-min">
        <SocialShare
          url={pageUrl}
          title={post?.title || "Untitled Post"}
          description={description}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="fixed top-0 left-0 right-0 h-1 z-50">
          <div
            className="h-1 bg-blue-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Title */}
        <header className="mb-4 text-center mt-6">
          <h1 className="text-3xl font-bold mb-2">{post?.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(post?.createdAt).toLocaleDateString()} • {readingTime} min read
          </p>
        </header>

        {/* Featured Image */}
        {post?.featuredImage?.url && (
          <div className="mb-6">
            <img
              src={post.featuredImage.url}
              alt={post.title}
              className="w-full rounded-lg shadow-md object-cover max-h-96 cursor-zoom-in"
              onClick={() => setZoomImage(post.featuredImage.url)}
            />
          </div>
        )}

        {/* TOC and Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* TOC */}
          {toc.length > 0 && (
            <aside className="hidden md:block w-60 sticky top-20 h-[70vh] overflow-auto pr-4">
              <nav className="text-sm">
                <div className="font-semibold mb-2">On this page</div>
                <ul>
                  {toc.map((item) => (
                    <li
                      key={item.id}
                      style={{ marginLeft: `${(item.level - 1) * 12}px` }}
                    >
                      <a href={`#${item.id}`} className="hover:underline">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}

          {/* Article Body */}
          <div
            ref={contentRef}
            className="article-content prose prose-lg dark:prose-invert"
            dangerouslySetInnerHTML={{
              __html: post?.content || "<p>No content</p>",
            }}
          />
        </div>

        {/* Bottom Share Buttons for mobile only */}
        <div className="mt-8 flex justify-center md:hidden">
          <SocialShare
            url={pageUrl}
            title={post?.title || "Untitled Post"}
            description={description}
          />
        </div>
      </div>

      {/* Image Zoom Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            className="max-h-[90vh] max-w-[90vw] rounded-md shadow-lg"
            alt="Zoomed"
          />
        </div>
      )}
    </article>
  );
};

export default BlogPost;
