// server/src/utils/seoService.js
import slugify from "slugify";
import logger from "./logger.js";

/**
 * Generate a clean URL slug for a post title
 */
export const generateSlug = (title) => {
  return slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

/**
 * Generate SEO meta tags
 */
export const generateMetaTags = (title, description, keywords = []) => {
  return {
    title,
    description: description.slice(0, 160),
    keywords: keywords.join(", "),
    meta: [
      { name: "description", content: description },
      { name: "keywords", content: keywords.join(", ") },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "twitter:title", content: title },
      { property: "twitter:description", content: description },
    ],
  };
};

/**
 * Analyze readability & keyword density
 */
export const analyzeSEO = (content, targetKeyword) => {
  const wordCount = content.split(/\s+/).length;
  const keywordCount = (content.match(new RegExp(targetKeyword, "gi")) || []).length;
  const density = ((keywordCount / wordCount) * 100).toFixed(2);

  logger.info(`🔍 SEO Analysis: ${wordCount} words, ${density}% keyword density`);
  return { wordCount, keywordCount, density };
};
