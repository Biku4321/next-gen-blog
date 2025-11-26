import React, { useRef, useState } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";

const ImageUploader = ({ image, setImage }) => {
  const [preview, setPreview] = useState(image || null);
  const fileInput = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreview(null);
    setImage(null);
    fileInput.current.value = "";
  };

  return (
    <div className="glass-card p-4 rounded-2xl text-center">
      <h3 className="text-lg font-semibold mb-3 flex items-center justify-center gap-2">
        <ImageIcon className="w-5 h-5 text-blue-500" />
        Upload Featured Image
      </h3>

      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="rounded-xl object-cover max-h-56 border"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            ref={fileInput}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInput.current?.click()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium flex items-center justify-center gap-2"
          >
            <Upload size={18} /> Select Image
          </button>
        </>
      )}
    </div>
  );
};

export default ImageUploader;
