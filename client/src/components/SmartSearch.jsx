// client/src/components/SmartSearch.jsx
import React, { useState, useEffect, useRef } from "react";
import API from '../services/api';
import { useNavigate } from "react-router-dom";

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

const SmartSearch = ({ onSelect }) => {
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const doSearch = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      // backend search: GET /posts?search=...&limit=6
      const res = await API.get("/posts", {
        params: { search: query, limit: 6 },
      });
      const data = res?.data?.posts ?? res?.data ?? [];
      if (!mountedRef.current) return;
      setSuggestions(Array.isArray(data) ? data : []);
    } catch (err) {
      // If backend has no handler, fallback to empty suggestions
      console.warn("SmartSearch: search error or backend missing", err);
      if (mountedRef.current) setSuggestions([]);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const debounced = useRef(debounce(doSearch, 300)).current;

  useEffect(() => {
    debounced(q.trim());
  }, [q, debounced]);

  const handleSelect = (item) => {
    onSelect?.(item);
    if (item?.slug) navigate(`/posts/${item.slug}`);
    else if (item?._id) navigate(`/posts/${item._id}`);
    setQ("");
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search posts, topics..."
        className="input-field w-full"
        aria-label="Search posts"
      />
      {loading && <div className="absolute right-2 top-2 text-sm">...</div>}
      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white dark:bg-gray-800 border rounded mt-2 max-h-64 overflow-auto shadow">
          {suggestions.map((s) => (
            <li
              key={s._id || s.slug || Math.random()}
              onClick={() => handleSelect(s)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <div className="font-medium text-sm">{s.title || s.name}</div>
              <div className="text-xs text-gray-500">{s.excerpt ? s.excerpt.slice(0, 80) : s.category}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SmartSearch;
