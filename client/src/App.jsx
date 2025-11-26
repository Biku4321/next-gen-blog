import React, { Suspense, lazy, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/footer.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import ErrorFallback from "./components/ErrorFallback.jsx";
import VoiceToText from "./components/VoiceToText.jsx";
import ReadingProgress from "./components/ReadingProgress.jsx";
import useUserDarkMode from "./hooks/useUserDarkMode.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import TestHooks from "./pages/TestHooks.jsx";
import BlogPost from "@components/BlogPost.jsx";
import Post from "@pages/Post.jsx";
import PostDetail from "@pages/PostDetail.jsx";
import CreatePost from "@pages/CreatePost.jsx";
import PostCard from "@components/PostCard.jsx";
import Author from "@pages/Author.jsx";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const SignUp = lazy(() => import("./pages/SignUp.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Editor = lazy(() => import("./components/Editor.jsx"));
const Analytics = lazy(() => import("./pages/Analytics.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const SettingsPage = lazy(() => import("./pages/Settings.jsx"));
const NotificationDropdown = lazy(() => import("./components/NotificationDropdown.jsx"));
const AiStudioPage = lazy(() => import("./components/AiStudioPage.jsx"));
const AiEditor = lazy(() => import("./components/AiEditor.jsx"));
const AIAssistant = lazy(() => import("./components/AIAssistant.jsx"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));
const Terms = lazy(() => import("./pages/Terms.jsx"));
const StaticPage = lazy(() => import("./pages/StaticPage.jsx"));
const HelpCenter = lazy(() => import("./pages/HelpCenter.jsx"));
const HelpForum = lazy(() => import("./pages/HelpForum.jsx"));
const VideoTutorials = lazy(() => import("./pages/VideoTutorials.jsx"));
const Community = lazy(() => import("./pages/Community.jsx"));
const ContentPolicy = lazy(() => import("./pages/ContentPolicy.jsx"));
const DeveloperForum = lazy(() => import("./pages/DeveloperForum.jsx"));
const BloggerBuzz = lazy(() => import("./pages/BloggerBuzz.jsx"));
const DeveloperAPI = lazy(() => import("./pages/DeveloperAPI.jsx"));
const EmailOtp = lazy(() => import("./pages/EmailOtp.jsx"));
const PhoneOtp = lazy(() => import("./pages/PhoneOtp.jsx"));
const GoogleLogin = lazy(() => import("./pages/GoogleLogin.jsx"));
const FacebookLogin = lazy(() => import("./pages/FacebookLogin.jsx"));
const PreLogin = lazy(() => import("./pages/PreLogin.jsx"));

// Route guards
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  const [darkMode] = useUserDarkMode();
  const contentRef = useRef(null); // ✅ now imported correctly

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(e) => console.error("App Error:", e)}
    >
      <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
        <Navbar />
        <ReadingProgress targetRef={contentRef} />
        <TestHooks />
        <main
          ref={contentRef}
          className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 w-full"
        >
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/posts/:slug" element={<PostDetail />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/page/:slug" element={<StaticPage />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/help/forum" element={<HelpForum />} />
              <Route path="/help/videos" element={<VideoTutorials />} />
              <Route path="/community" element={<Community />} />
              <Route path="/developers" element={<DeveloperAPI />} />
              <Route path="/content-policy" element={<ContentPolicy />} />
              <Route path="/Blogger-Buzz" element={<BloggerBuzz />} />
              <Route path="/developers/forum" element={<DeveloperForum />} />
              <Route path="/community/buzz" element={<BloggerBuzz />} />
              <Route path="/Blog-Post" element={<BlogPost />} />
              <Route path="/Post" element={<Post />} />
              {/* <Route path="/Create-Post" element={<CreatePost />} /> */}
              <Route path="/Post-Details" element={<PostCard />} />
              <Route path="/author/:id" element={<Author />} />

              {/* Auth */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <SignUp />
                  </PublicRoute>
                }
              />
              <Route
                path="/otp/email"
                element={
                  <PublicRoute>
                    <EmailOtp />
                  </PublicRoute>
                }
              />
              <Route
                path="/otp/phone"
                element={
                  <PublicRoute>
                    <PhoneOtp />
                  </PublicRoute>
                }
              />
              <Route
                path="/auth/google"
                element={
                  <PublicRoute>
                    <GoogleLogin />
                  </PublicRoute>
                }
              />
              <Route
                path="/auth/facebook"
                element={
                  <PublicRoute>
                    <FacebookLogin />
                  </PublicRoute>
                }
              />
              <Route
                path="/prelogin"
                element={
                  <PublicRoute>
                    <PreLogin />
                  </PublicRoute>
                }
              />

              {/* Protected */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/editor"
                element={
                  <ProtectedRoute>
                    <Editor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/editor/:id"
                element={
                  <ProtectedRoute>
                    <Editor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-post"
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationDropdown />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-studio"
                element={
                  <ProtectedRoute>
                    <AiStudioPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai/editor"
                element={
                  <ProtectedRoute>
                    <AiEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai/assistant"
                element={
                  <ProtectedRoute>
                    <AIAssistant />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <VoiceToText />
      </div>
    </ErrorBoundary>
  );
}

export default App;
