// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Sun,
//   Moon,
//   Search,
//   Menu,
//   X,
//   Bell,
//   BookOpen,
//   BarChart3,
//   Cpu,
//   Edit3,
//   User,
//   Settings,
//   PlusCircle, // 🆕 Added for Create Post icon
// } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import SmartSearch from './SmartSearch';
// import { useTheme } from '../context/ThemeContext';
// import ProfileDropdown from './ProfileDropdown';
// import LanguageSwitcher from './LanguageSwitcher.jsx';
// import { useTranslation } from 'react-i18next'; // 🆕 i18n

// const Navbar = () => {
//   const { darkMode, setDarkMode } = useTheme();
//   const { user, logout, isAuthenticated } = useAuth();
//   const { t } = useTranslation(); // 🆕 for multilingual label
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [notifications] = useState(3);

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const navItems = [
//     { path: '/', label: t('nav.home', 'Home'), icon: BookOpen },
//     { path: '/dashboard', label: t('nav.dashboard', 'Dashboard'), icon: BarChart3, protected: true },
//     { path: '/dashboard/analytics', label: t('nav.analytics', 'Analytics'), icon: BarChart3, protected: true },
//     { path: '/editor', label: t('nav.editor', 'Editor'), icon: Edit3, protected: true },
//     { path: '/ai-studio', label: t('nav.aiStudio', 'AI Studio'), icon: Cpu, protected: true },
//     { path: '/profile', label: t('nav.profile', 'Profile'), icon: User, protected: true },
//     { path: '/settings', label: t('nav.settings', 'Settings'), icon: Settings, protected: true },
//   ];

//   return (
//     <motion.header
//       className={`fixed top-0 w-full z-50 transition-all duration-300 ${
//         isScrolled
//           ? 'glass-navbar backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 shadow-2xl border-b border-white/20'
//           : 'bg-transparent'
//       }`}
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* 🧠 Logo */}
//           <Link to="/" className="flex items-center space-x-3 group">
//             <motion.div
//               className="relative w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
//               whileHover={{ scale: 1.05, rotate: 5 }}
//               transition={{ type: 'spring', stiffness: 400 }}
//             >
//               <span className="text-white font-bold text-lg">B</span>
//               <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
//             </motion.div>
//             <div className="hidden md:block">
//               <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 BlogPro
//               </div>
//               <div className="text-xs text-gray-500 dark:text-gray-400">AI-Powered</div>
//             </div>
//           </Link>

//           {/* 🧭 Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-8">
//             {navItems.map(({ path, label, icon: Icon, protected: isProtected }) => {
//               if (isProtected && !isAuthenticated) return null;

//               return (
//                 <Link
//                   key={path}
//                   to={path}
//                   className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
//                     location.pathname === path
//                       ? 'glass-card bg-white/20 text-blue-600 dark:text-blue-400'
//                       : 'hover:glass-card hover:bg-white/10 text-gray-700 dark:text-gray-300'
//                   }`}
//                 >
//                   <Icon className="w-4 h-4" />
//                   <span className="font-medium">{label}</span>
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* 🧩 Right Section */}
//           <div className="flex items-center space-x-4">
//             {/* Search */}
//             <div className="hidden lg:block relative w-80">
//               <SmartSearch />
//             </div>

//             <button
//               onClick={() => setIsSearchOpen(true)}
//               className="lg:hidden glass-button p-2 rounded-xl hover:bg-white/20 transition-all duration-300"
//             >
//               <Search className="w-5 h-5" />
//             </button>

//             {/* Notifications */}
//             {isAuthenticated && (
//               <motion.button
//                 className="glass-button relative p-2 rounded-xl hover:bg-white/20 transition-all duration-300"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => navigate('/notifications')}
//               >
//                 <Bell className="w-5 h-5" />
//                 {notifications > 0 && (
//                   <motion.span
//                     className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ type: 'spring', stiffness: 500 }}
//                   >
//                     {notifications}
//                   </motion.span>
//                 )}
//               </motion.button>
//             )}

//             {/* 🟢 Create Post Button (only when logged in) */}
//             {isAuthenticated && (
//               <motion.button
//                 onClick={() => navigate('/create-post')}
//                 className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <PlusCircle className="w-4 h-4" />
//                 <span>{t('nav.createPost', 'Create Post')}</span>
//               </motion.button>
//             )}

//             {/* Language Switcher */}
//             <div className="hidden sm:block">
//               <LanguageSwitcher />
//             </div>

//             {/* Theme Toggle */}
//             <motion.button
//               onClick={() => setDarkMode(!darkMode)}
//               className="glass-button p-2 rounded-xl hover:bg-white/20 transition-all duration-300"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <AnimatePresence mode="wait">
//                 {darkMode ? (
//                   <motion.div
//                     key="sun"
//                     initial={{ opacity: 0, rotate: -90 }}
//                     animate={{ opacity: 1, rotate: 0 }}
//                     exit={{ opacity: 0, rotate: 90 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <Sun className="w-5 h-5 text-yellow-500" />
//                   </motion.div>
//                 ) : (
//                   <motion.div
//                     key="moon"
//                     initial={{ opacity: 0, rotate: 90 }}
//                     animate={{ opacity: 1, rotate: 0 }}
//                     exit={{ opacity: 0, rotate: -90 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <Moon className="w-5 h-5 text-blue-600" />
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.button>

//             {/* User */}
//             {isAuthenticated && user ? (
//               <ProfileDropdown user={user} onLogout={handleLogout} />
//             ) : (
//               <div className="flex items-center space-x-2">
//                 <Link
//                   to="/login"
//                   className="glass-button px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-300"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/signup"
//                   className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300"
//                 >
//                   Get Started
//                 </Link>
//               </div>
//             )}

//             {/* Mobile Toggle */}
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="md:hidden glass-button p-2 rounded-xl hover:bg-white/20 transition-all duration-300"
//             >
//               {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ✅ Mobile Menu (added Create Post + LanguageSwitcher) */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden glass-card border-t border-white/20 backdrop-blur-xl"
//           >
//             <div className="px-4 py-4 space-y-3">
//               <div className="pb-3 border-b border-white/20">
//                 <LanguageSwitcher />
//               </div>

//               {isAuthenticated && (
//                 <button
//                   onClick={() => {
//                     setIsMobileMenuOpen(false);
//                     navigate('/create-post');
//                   }}
//                   className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium"
//                 >
//                   <PlusCircle className="w-5 h-5" /> {t('nav.createPost', 'Create Post')}
//                 </button>
//               )}

//               {navItems.map(({ path, label, icon: Icon, protected: isProtected }) => {
//                 if (isProtected && !isAuthenticated) return null;
//                 return (
//                   <Link
//                     key={path}
//                     to={path}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
//                       location.pathname === path
//                         ? 'bg-white/20 text-blue-600 dark:text-blue-400'
//                         : 'hover:bg-white/10 text-gray-700 dark:text-gray-300'
//                     }`}
//                   >
//                     <Icon className="w-5 h-5" />
//                     <span className="font-medium">{label}</span>
//                   </Link>
//                 );
//               })}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.header>
//   );
// };

// export default Navbar;
// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Search,
  Menu,
  X,
  Bell,
  BookOpen,
  BarChart3,
  Cpu,
  Edit3,
  User,
  Settings,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SmartSearch from './SmartSearch';
import { useTheme } from '../context/ThemeContext';
import ProfileDropdown from './ProfileDropdown';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { darkMode, setDarkMode } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications] = useState(3); // Replace with live notification count later

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: t('nav.home', 'Home'), icon: BookOpen },
    { path: '/dashboard', label: t('nav.dashboard', 'Dashboard'), icon: BarChart3, protected: true },
    { path: '/editor', label: t('nav.editor', 'Editor'), icon: Edit3, protected: true },
    { path: '/ai-studio', label: t('nav.aiStudio', 'AI Studio'), icon: Cpu, protected: true },
    { path: '/profile', label: t('nav.profile', 'Profile'), icon: User, protected: true },
    { path: '/settings', label: t('nav.settings', 'Settings'), icon: Settings, protected: true },
  ];

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-navbar backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 shadow-2xl border-b border-white/20'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              className="relative w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <span className="text-white font-bold text-lg">B</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
            </motion.div>
            <div className="hidden md:block">
              <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BlogPro
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">AI-Powered</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label, icon: Icon, protected: isProtected }) => {
              if (isProtected && !isAuthenticated) return null;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    location.pathname === path
                      ? 'glass-card bg-white/20 text-blue-600 dark:text-blue-400'
                      : 'hover:glass-card hover:bg-white/10 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search (Desktop) */}
            <div className="hidden lg:block relative w-80">
              <SmartSearch />
            </div>

            {/* Search (Mobile trigger placeholder) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="lg:hidden glass-button p-2 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            {isAuthenticated && (
              <motion.button
                className="glass-button relative p-2 rounded-xl hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/notifications')}
              >
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    {notifications}
                  </motion.span>
                )}
              </motion.button>
            )}

            {/* Create Post Button */}
            {isAuthenticated && (
              <motion.button
                onClick={() => navigate('/editor')}
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('nav.createPost', 'Create Post')}</span>
              </motion.button>
            )}

            {/* Language Switcher */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Theme Toggle */}
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className="glass-button p-2 rounded-xl hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5 text-yellow-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5 text-blue-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* User Profile / Auth Buttons */}
            {isAuthenticated && user ? (
              <ProfileDropdown user={user} onLogout={handleLogout} />
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="glass-button px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden glass-button p-2 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-white/20 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              <div className="pb-3 border-b border-white/20">
                <LanguageSwitcher />
              </div>

              {isAuthenticated && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/editor');
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium"
                >
                  <PlusCircle className="w-5 h-5" /> {t('nav.createPost', 'Create Post')}
                </button>
              )}

              {navItems.map(({ path, label, icon: Icon, protected: isProtected }) => {
                if (isProtected && !isAuthenticated) return null;
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      location.pathname === path
                        ? 'bg-white/20 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-white/10 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
