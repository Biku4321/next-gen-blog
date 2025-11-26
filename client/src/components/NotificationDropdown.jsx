import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import API from "../services/api"; // ✅ make sure this path matches your project

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // ✅ Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications");
        if (res.data.success) setNotifications(res.data.notifications);
      } catch (err) {
        console.error("Fetch notifications failed", err);
      }
    };
    fetchNotifications();
  }, []);

  // ✅ Mark all notifications as read
  const markAllRead = async (e) => {
    e.stopPropagation();
    try {
      const res = await API.put("/notifications/mark-all");
      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, read: true }))
        );
      }
    } catch (err) {
      console.error("Mark all read error", err);
    }
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-5 h-5" />
        {notifications.filter((n) => !n.read).length > 0 && (
          <motion.span
            className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-gray-50 dark:border-slate-900"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            {notifications.filter((n) => !n.read).length}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 glass-card rounded-xl shadow-lg z-50"
            onClick={() => setIsOpen(false)}
          >
            <div className="p-2">
              <div className="px-3 py-2 flex justify-between items-center">
                <h4 className="font-bold">Notifications</h4>
                <button
                  onClick={markAllRead}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Mark all as read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center p-3">
                    No notifications yet
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-lg cursor-pointer ${
                        n.read
                          ? "opacity-70"
                          : "hover:bg-gray-100 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <p className="text-sm">{n.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {n.time || ""}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="text-center p-2 border-t border-gray-200 dark:border-slate-700 mt-1">
                <a
                  href="/notifications"
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  View all notifications
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
