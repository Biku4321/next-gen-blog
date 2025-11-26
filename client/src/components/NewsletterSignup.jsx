import React, { useState } from "react";
import { Mail } from "lucide-react";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with: ${email}`);
    setEmail("");
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="font-bold mb-4 text-lg flex items-center"><Mail className="w-5 h-5 mr-2" /> Join our Newsletter</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Get weekly insights on tech and design directly to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="input-field !rounded-r-none"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-r-xl font-semibold"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
