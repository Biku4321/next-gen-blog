import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Settings, LogOut } from 'lucide-react';

const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    if (!user) return null;

    return (
        <div className="relative">
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.95 }}
            >
                <img
                    src={`https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff`}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full ring-2 ring-offset-2 ring-offset-gray-100 dark:ring-offset-slate-900 ring-blue-500"
                />
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-lg z-50"
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="p-2">
                             <div className="px-3 py-2 border-b border-gray-200 dark:border-slate-700">
                                <p className="font-semibold truncate">{user.username}</p>
                                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                            </div>
                            <Link to="/profile" className="flex items-center w-full text-left px-3 py-2 mt-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                                <User className="w-4 h-4 mr-2" /> My Profile
                            </Link>
                            <Link to="/settings" className="flex items-center w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                                <Settings className="w-4 h-4 mr-2" /> Settings
                            </Link>
                            <button onClick={handleLogout} className="flex items-center w-full text-left px-3 py-2 mt-1 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50">
                                <LogOut className="w-4 h-4 mr-2" /> Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileDropdown;
