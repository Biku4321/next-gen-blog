// import React, { useEffect, useState } from "react";
// import API from "../services/api";

// const CommentList = ({ postId, initialComments = [] }) => {
//   const [comments, setComments] = useState(
//     Array.isArray(initialComments) ? initialComments : []
//   );
//   const [text, setText] = useState("");
//   const user = JSON.parse(localStorage.getItem("user")); // store user on login

//   // Fetch comments
//   useEffect(() => {
//     let mounted = true;

//     const fetchComments = async () => {
//       try {
//         const { data } = await API.get(`/comments/${postId}`);

//         const arr =
//           Array.isArray(data?.comments) ? data.comments :
//           Array.isArray(data) ? data :
//           [];

//         if (mounted) setComments(arr);
//       } catch (err) {
//         console.error("❌ Failed to load comments:", err);
//       }
//     };

//     if (postId) fetchComments();
//     return () => (mounted = false);
//   }, [postId]);

//   // Submit comment
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!text.trim()) return;

//     try {
//       const { data } = await API.post("/comments", { postId, content: text });
//       const newComment = data?.comment || data;

//       setComments((prev) => [...prev, newComment]);
//       setText("");
//     } catch (err) {
//       console.error("❌ Failed to post comment:", err);
//     }
//   };

//   // Delete comment
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this comment?")) return;

//     try {
//       await API.delete(`/comments/${id}`);
//       // Remove from UI
//       setComments((prev) => prev.filter((c) => c._id !== id));
//     } catch (err) {
//       console.error("❌ Failed to delete comment:", err);
//     }
//   };

//   return (
//     <div className="mt-4">
//       <h2 className="font-bold mb-3">Comments</h2>

//       {Array.isArray(comments) && comments.length > 0 ? (
//         comments.map((c) => (
//           <div
//             key={c._id}
//             className="border-b py-2 text-sm flex items-start justify-between"
//           >
//             <div>
//               <p className="font-medium">{c.user?.username || "User"}</p>
//               <p>{c.content}</p>
//             </div>

//             {/* Allow delete only if logged-in user wrote comment */}
//             {user && user._id === c.user?._id && (
//               <button
//                 className="text-red-500 text-xs hover:underline"
//                 onClick={() => handleDelete(c._id)}
//               >
//                 Delete
//               </button>
//             )}
//           </div>
//         ))
//       ) : (
//         <p className="text-sm text-gray-500 italic">No comments yet.</p>
//       )}

//       <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
//         <input
//           className="border p-2 w-full rounded-md"
//           placeholder="Add a comment..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700 transition"
//         >
//           Post
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CommentList;
// import React, { useEffect, useState } from "react";
// import API from "../services/api";

// const CommentList = ({ postId, initialComments = [] }) => {
//   const [comments, setComments] = useState(
//     Array.isArray(initialComments) ? initialComments : []
//   );
//   const [text, setText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [deleting, setDeleting] = useState(null);
//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   // 🔹 Fetch all comments
//   useEffect(() => {
//     let active = true;
//     const fetchComments = async () => {
//       try {
//         const { data } = await API.get(`/comments/${postId}`);
//         const arr = Array.isArray(data?.comments)
//           ? data.comments
//           : Array.isArray(data)
//           ? data
//           : [];
//         if (active) setComments(arr);
//       } catch (err) {
//         console.error("❌ Failed to load comments:", err);
//       }
//     };
//     if (postId) fetchComments();
//     return () => {
//       active = false;
//     };
//   }, [postId]);

//   // 🔹 Add new comment
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!text.trim()) return;
//     setLoading(true);
//     try {
//       const { data } = await API.post("/comments", { postId, content: text });
//       const newComment = data?.comment || data;
//       setComments((prev) => [...prev, newComment]);
//       setText("");
//     } catch (err) {
//       console.error("❌ Failed to post comment:", err);
//       alert("Failed to post comment. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Delete comment (only author)
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this comment?")) return;
//     setDeleting(id);
//     try {
//       await API.delete(`/comments/${id}`);
//       setComments((prev) => prev.filter((c) => c._id !== id));
//     } catch (err) {
//       console.error("❌ Failed to delete comment:", err);
//       alert("Failed to delete comment. Please try again.");
//     } finally {
//       setDeleting(null);
//     }
//   };

//   return (
//     <div className="mt-8">
//       <h2 className="text-lg font-bold mb-4">Comments ({comments.length})</h2>

//       {/* Comments list */}
//       <div className="space-y-4">
//         {comments.length > 0 ? (
//           comments.map((c) => (
//             <div
//               key={c._id}
//               className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-between items-start border border-gray-200 dark:border-gray-700"
//             >
//               <div className="flex-1">
//                 <p className="font-semibold text-gray-800 dark:text-gray-100">
//                   {c.user?.username || "Anonymous"}
//                 </p>
//                 <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
//                   {c.content}
//                 </p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   {new Date(c.createdAt).toLocaleString()}
//                 </p>
//               </div>

//               {user && user._id === c.user?._id && (
//                 <button
//                   onClick={() => handleDelete(c._id)}
//                   disabled={deleting === c._id}
//                   className="text-red-500 text-xs hover:underline ml-4"
//                 >
//                   {deleting === c._id ? "Deleting..." : "Delete"}
//                 </button>
//               )}
//             </div>
//           ))
//         ) : (
//           <p className="text-sm text-gray-500 italic">No comments yet.</p>
//         )}
//       </div>

//       {/* Add new comment */}
//       <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
//         <input
//           className="flex-1 border border-gray-300 dark:border-gray-700 bg-transparent p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//           placeholder="Write a comment..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />
//         <button
//           type="submit"
//           disabled={loading || !text.trim()}
//           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
//         >
//           {loading ? "Posting..." : "Post"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CommentList;
import React, { useEffect, useState } from "react";
import API from "../services/api";

const CommentList = ({ postId, initialComments = [] }) => {
  const [comments, setComments] = useState(
    Array.isArray(initialComments) ? initialComments : []
  );
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await API.get(`/comments/${postId}`);
        const arr = Array.isArray(data?.comments)
          ? data.comments
          : Array.isArray(data)
          ? data
          : [];
        setComments(arr);
      } catch (err) {
        console.error("❌ Failed to load comments:", err);
      }
    };
    if (postId) fetchComments();
  }, [postId]);

  // Submit new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { data } = await API.post("/comments", { postId, content: text });
      const newComment = data?.comment || data;
      setComments((prev) => [...prev, newComment]);
      setText("");
    } catch (err) {
      console.error("❌ Failed to post comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete comment
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    setDeleting(id);
    try {
      await API.delete(`/comments/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete comment:", err);
    } finally {
      setDeleting(null);
    }
  };

  const canDelete = (c) => {
    // Defensive check for both MongoDB _id and string IDs
    const uid = user?._id?.toString();
    const cid = c?.user?._id?.toString() || c?.user?.id?.toString();
    return uid && cid && uid === cid;
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4">Comments ({comments.length})</h2>

      {/* Comment List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c._id}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-between items-start border border-gray-200 dark:border-gray-700"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  {c.user?.username || c.user?.name || "Unknown User"}
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                  {c.content}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>

              {canDelete(c) && (
                <button
                  onClick={() => handleDelete(c._id)}
                  disabled={deleting === c._id}
                  className="text-red-500 text-xs hover:underline ml-4"
                >
                  {deleting === c._id ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No comments yet.</p>
        )}
      </div>

      {/* Add Comment */}
      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <input
          className="flex-1 border border-gray-300 dark:border-gray-700 bg-transparent p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CommentList;
