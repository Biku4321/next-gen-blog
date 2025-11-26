// client/src/components/AiStudioPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom"; // ✅ Added for navigation

const AiStudio = () => {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setError("Please login to access AI Studio.");
      setLoading(false);
      return;
    }

    let mounted = true;
    const init = async () => {
      setLoading(true);
      try {
        const res = await api.get("/ai/models");
        if (!mounted) return;
        setModels(res.data?.models || []);
      } catch (err) {
        console.error("AI Studio init error:", err?.response?.data || err.message);
        setError("Failed to load AI models.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();
    return () => { mounted = false; };
  }, [authLoading, isAuthenticated]);

  const handleModelSelect = (model) => {
    if (!model.available) return;
    // Pass the selected model ID to the editor via state or query param
    navigate("/editor", { state: { aiModel: model.id } });
  };

  if (authLoading || loading) return <div className="p-10 text-center text-gray-500">Loading AI Models...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Studio
        </h1>
        <p className="text-gray-600 mt-2">Select a model to power your creative writing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((m) => {
          const isAvailable = m.available !== false; // Default to true if undefined
          
          return (
            <div 
              key={m.id} 
              className={`relative p-6 border rounded-xl transition-all duration-300 ${
                isAvailable 
                  ? "hover:shadow-lg border-gray-200 bg-white" 
                  : "border-gray-100 bg-gray-50 opacity-80"
              }`}
            >
              {/* Badge for New or Pro models */}
              {m.id.includes('2.0') && isAvailable && (
                <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold text-white bg-purple-600 rounded-full">
                  NEW
                </span>
              )}
              
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                   isAvailable ? "bg-blue-600" : "bg-gray-400"
                }`}>
                  {m.name[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{m.name}</h3>
                  <p className="text-xs text-gray-500">{m.type}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-6 h-10 line-clamp-2">
                {isAvailable 
                  ? "Ready to generate high-quality content for your blog." 
                  : "This model is currently in beta testing and will be available soon."}
              </p>

              <button
                onClick={() => handleModelSelect(m)}
                disabled={!isAvailable}
                className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                  isAvailable
                    ? "bg-gray-900 text-white hover:bg-black"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isAvailable ? "Use Model" : "Available in Future"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AiStudio;