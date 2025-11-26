import React, { useState } from "react";
import { Send } from "lucide-react";
import API from "../services/api"; // ✅ fixed capitalization

const ContactSupport = () => {
  const [form, setForm] = useState({
    email: "",
    category: "",
    message: "",
    file: null,
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.message || !form.category) {
      setStatus({ type: "error", msg: "All fields are required." });
      return;
    }

    try {
      setLoading(true);
      setStatus(null);

      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => data.append(key, val));

      // ✅ fixed route & content type
      await API.post("/api/support/ticket", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus({ type: "success", msg: "✅ Your message has been sent!" });
      setForm({ email: "", category: "", message: "", file: null });
    } catch (error) {
      console.error("Support submission failed:", error);
      setStatus({
        type: "error",
        msg: error.response?.data?.message || "❌ Failed to send message.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact-support"
      className="glass-card p-8 mt-16 rounded-2xl shadow-lg max-w-3xl mx-auto"
      aria-labelledby="contact-support-title"
    >
      <h2
        id="contact-support-title"
        className="text-3xl font-bold mb-4 text-center"
      >
        Contact Support
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        aria-live="polite"
        encType="multipart/form-data"
      >
        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block mb-1 font-medium">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            <option value="">Select category</option>
            <option value="technical">Technical Issue</option>
            <option value="billing">Billing</option>
            <option value="feedback">Feedback</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block mb-1 font-medium">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Describe your issue or feedback..."
            className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* File upload */}
        <div>
          <label htmlFor="file" className="block mb-1 font-medium">
            Screenshot / File (optional)
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept="image/*,.pdf"
            onChange={handleChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {loading ? (
            <span>Sending...</span>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Message
            </>
          )}
        </button>
      </form>

      {status && (
        <p
          className={`mt-4 text-center text-sm ${
            status.type === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {status.msg}
        </p>
      )}
    </section>
  );
};

export default ContactSupport;
