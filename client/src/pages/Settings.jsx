// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext.jsx'; // Corrected import path
// import { motion } from 'framer-motion';

// const SettingsPage = () => {
//     const { user } = useAuth();
//     // This state would be initialized with user data from an API
//     const [profile, setProfile] = useState({
//         username: user?.username || '',
//         email: user?.email || '',
//         bio: 'Passionate writer, tech enthusiast, and lifelong learner.',
//     });
//     const [password, setPassword] = useState({ current: '', new: '', confirm: '' });

//     const handleProfileChange = (e) => {
//         setProfile({ ...profile, [e.target.name]: e.target.value });
//     };
    
//      const handlePasswordChange = (e) => {
//         setPassword({ ...password, [e.target.name]: e.target.value });
//     };

//     const handleProfileSave = (e) => {
//         e.preventDefault();
//         alert('Profile saved! (API call would be made here)');
//     };
    
//     const handlePasswordSave = (e) => {
//         e.preventDefault();
//         alert('Password changed! (API call would be made here)');
//     };

//     if (!user) return <p>Loading settings...</p>;

//     return (
//         <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="max-w-4xl mx-auto"
//         >
//             <h1 className="text-4xl font-bold mb-10">Account Settings</h1>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 {/* --- Left Navigation --- */}
//                 <div className="md:col-span-1">
//                     <nav className="space-y-2 sticky top-24">
//                         <a href="#profile" className="block p-3 rounded-lg font-semibold bg-gray-100 dark:bg-slate-800">Profile</a>
//                         <a href="#password" className="block p-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-slate-800">Password</a>
//                         <a href="#notifications" className="block p-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-slate-800">Notifications</a>
//                     </nav>
//                 </div>
                
//                 {/* --- Right Content --- */}
//                 <div className="md:col-span-2 space-y-12">
//                     {/* Profile Section */}
//                     <form id="profile" onSubmit={handleProfileSave} className="glass-card p-8 rounded-2xl scroll-mt-24">
//                         <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Username</label>
//                                 <input type="text" name="username" value={profile.username} onChange={handleProfileChange} className="input-field" />
//                             </div>
//                              <div>
//                                 <label className="block text-sm font-medium mb-1">Email</label>
//                                 <input type="email" name="email" value={profile.email} onChange={handleProfileChange} className="input-field" disabled/>
//                             </div>
//                              <div>
//                                 <label className="block text-sm font-medium mb-1">Bio</label>
//                                 <textarea name="bio" value={profile.bio} onChange={handleProfileChange} className="input-field h-24"></textarea>
//                             </div>
//                         </div>
//                         <div className="text-right mt-6">
//                             <button type="submit" className="btn-primary">Save Profile</button>
//                         </div>
//                     </form>

//                     {/* Password Section */}
//                     <form id="password" onSubmit={handlePasswordSave} className="glass-card p-8 rounded-2xl scroll-mt-24">
//                          <h2 className="text-2xl font-bold mb-6">Change Password</h2>
//                          <div className="space-y-4">
//                             <input type="password" name="current" placeholder="Current Password" onChange={handlePasswordChange} className="input-field" />
//                             <input type="password" name="new" placeholder="New Password" onChange={handlePasswordChange} className="input-field" />
//                             <input type="password" name="confirm" placeholder="Confirm New Password" onChange={handlePasswordChange} className="input-field" />
//                          </div>
//                          <div className="text-right mt-6">
//                             <button type="submit" className="btn-primary">Update Password</button>
//                         </div>
//                     </form>

//                     {/* Notifications Section */}
//                      <div id="notifications" className="glass-card p-8 rounded-2xl scroll-mt-24">
//                          <h2 className="text-2xl font-bold mb-6">Notifications</h2>
//                          <div className="space-y-4">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="font-medium">Comments</p>
//                                     <p className="text-sm text-gray-500">Notify me when someone comments on my posts.</p>
//                                 </div>
//                                 <input type="checkbox" className="toggle-switch" defaultChecked/>
//                             </div>
//                              <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="font-medium">Likes</p>
//                                     <p className="text-sm text-gray-500">Notify me when someone likes my posts.</p>
//                                 </div>
//                                 <input type="checkbox" className="toggle-switch" defaultChecked/>
//                             </div>
//                              <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="font-medium">Newsletter</p>
//                                     <p className="text-sm text-gray-500">Receive our weekly newsletter with top posts.</p>
//                                 </div>
//                                 <input type="checkbox" className="toggle-switch" />
//                             </div>
//                          </div>
//                     </div>
//                 </div>
//             </div>
//         </motion.div>
//     );
// };

// // Simple toggle switch style for the example
// const styles = `
// .toggle-switch {
//   -webkit-appearance: none;
//   appearance: none;
//   width: 40px;
//   height: 24px;
//   border-radius: 9999px;
//   background-color: #d1d5db; /* gray-300 */
//   position: relative;
//   cursor: pointer;
//   transition: background-color 0.2s;
// }
// .dark .toggle-switch {
//     background-color: #4b5563; /* gray-600 */
// }
// .toggle-switch:checked {
//   background-color: #3b82f6; /* blue-500 */
// }
// .toggle-switch::before {
//   content: "";
//   position: absolute;
//   top: 2px;
//   left: 2px;
//   width: 20px;
//   height: 20px;
//   border-radius: 9999px;
//   background-color: white;
//   transition: transform 0.2s;
// }
// .toggle-switch:checked::before {
//   transform: translateX(16px);
// }
// `;
// const styleSheet = document.createElement("style");
// styleSheet.innerText = styles;
// document.head.appendChild(styleSheet);


// export default SettingsPage;

// src/pages/SettingsPage.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";
import API from "../services/api";

const SettingsPage = () => {
  const { user, refreshUser } = useAuth();

  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
    avatarUrl: user?.avatarUrl || "",
  });

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  /** --- Save Profile --- */
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put("/users/me", profile);
      await refreshUser();
      alert("✅ Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile.");
      console.error("Profile update error:", err);
    } finally {
      setLoading(false);
    }
  };

  /** --- Change Password --- */
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      return alert("New passwords do not match!");
    }

    setLoading(true);
    try {
      await API.put("/users/change-password", {
        oldPassword: password.oldPassword,
        newPassword: password.newPassword,
      });
      alert("✅ Password changed successfully!");
      setPassword({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change password.");
      console.error("Password change error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Loading settings...</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-4xl font-bold mb-10">Account Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <nav className="space-y-2 sticky top-24">
            <a
              href="#profile"
              className="block p-3 rounded-lg font-semibold bg-gray-100 dark:bg-slate-800"
            >
              Profile
            </a>
            <a
              href="#password"
              className="block p-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              Password
            </a>
            <a
              href="#notifications"
              className="block p-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              Notifications
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-12">
          {/* --- Profile Form --- */}
          <form
            id="profile"
            onSubmit={handleProfileSave}
            className="glass-card p-8 rounded-2xl scroll-mt-24"
          >
            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleProfileChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Avatar URL</label>
                <input
                  type="url"
                  name="avatarUrl"
                  value={profile.avatarUrl}
                  onChange={handleProfileChange}
                  className="input-field"
                />
              </div>
            </div>
            <div className="text-right mt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>

          {/* --- Password Form --- */}
          <form
            id="password"
            onSubmit={handlePasswordSave}
            className="glass-card p-8 rounded-2xl scroll-mt-24"
          >
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
            <div className="space-y-4">
              <input
                type="password"
                name="oldPassword"
                placeholder="Current Password"
                value={password.oldPassword}
                onChange={handlePasswordChange}
                className="input-field"
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={password.newPassword}
                onChange={handlePasswordChange}
                className="input-field"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={password.confirmPassword}
                onChange={handlePasswordChange}
                className="input-field"
              />
            </div>
            <div className="text-right mt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>

          {/* --- Notifications --- */}
          <div id="notifications" className="glass-card p-8 rounded-2xl scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">Notifications</h2>
            <p className="text-gray-500">
              Notification preferences will be added soon.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
