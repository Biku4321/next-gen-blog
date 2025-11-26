// server/src/utils/sanitizer.js
import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize string inputs for safe HTML rendering
 */
export const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "ul", "ol", "li", "br", "code", "pre"],
    ALLOWED_ATTR: ["href", "title", "target"],
  });
};

/**
 * Sanitize a request object (req.body, req.query, req.params)
 */
export const sanitizeRequest = (data) => {
  const sanitized = {};
  Object.keys(data).forEach((key) => {
    let value = data[key];
    if (typeof value === "string") {
      value = value.trim().replace(/[<>]/g, "");
    }
    sanitized[key] = value;
  });
  return sanitized;
};

/**
 * Sanitize content before saving to DB
 */
export const sanitizeContent = (content) => {
  if (!content) return "";
  return sanitizeHTML(content);
};
