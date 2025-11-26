import React from "react";

const FeaturedPost = ({ post }) => {
  if (!post) return null;

  return (
    <div className="featured-post glass-card rounded-2xl p-6 shadow-xl mb-8">
      <img
        src={post.image || "/default-thumbnail.jpg"}
        alt={post.title}
        className="w-full h-60 object-cover rounded-xl mb-4"
      />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {post.title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400">{post.excerpt}</p>
    </div>
  );
};

export default FeaturedPost;
