import React from "react";
import { Link, useInRouterContext } from "react-router-dom";

const Footer = () => {
  const inRouter = useInRouterContext();
  if (!inRouter) {
    console.warn("⚠️ Footer rendered outside of BrowserRouter");
    return null;
  }
  const linkSections = {
    Help: [
      { name: "Help Center", path: "/help" },
      { name: "Help Forum", path: "/help/forum" },
      { name: "Video Tutorials", path: "/help/videos" },
    ],
    Community: [
      { name: "Community", path: "/community" },
      { name: "Blogger Buzz", path: "/blogger-buzz" }, // optional if exists
    ],
    Developers: [
      { name: "Developer API", path: "/developers" },
      { name: "Developer Forum", path: "/developers/forum" }, // optional
    ],
  };

  return (
    <footer className="bg-gray-100 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(linkSections).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} BlogPro. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/terms" className="hover:text-blue-600">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-blue-600">
              Privacy
            </Link>
            <Link to="/content-policy" className="hover:text-blue-600">
              Content Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
