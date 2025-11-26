// // hooks/useTableOfContents.js
// import { useState, useEffect } from 'react';

// export const useTableOfContents = () => {
//   const [headings, setHeadings] = useState([]);
//   const [activeId, setActiveId] = useState('');

//   useEffect(() => {
//     const headingElements = Array.from(
//       document.querySelectorAll('h1, h2, h3, h4, h5, h6')
//     );

//     const headingsData = headingElements.map((heading, index) => ({
//       id: heading.id || `heading-${index}`,
//       text: heading.textContent,
//       level: parseInt(heading.tagName.charAt(1))
//     }));

//     setHeadings(headingsData);

//     // Add IDs to headings if they don't have them
//     headingElements.forEach((heading, index) => {
//       if (!heading.id) {
//         heading.id = `heading-${index}`;
//       }
//     });

//     // Intersection Observer for active heading
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             setActiveId(entry.target.id);
//           }
//         });
//       },
//       { rootMargin: '-20% 0% -80% 0%' }
//     );

//     headingElements.forEach((element) => observer.observe(element));

//     return () => observer.disconnect();
//   }, []);

//   return { headings, activeId };
// };

// components/TableOfContents.jsx
import React from 'react';
import { useTableOfContents } from '../hooks/useTableOfContents';

const TableOfContents = () => {
  const { headings, activeId } = useTableOfContents();

  const scrollToHeading = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="glass-card p-6 rounded-2xl sticky top-24">
      <h3 className="text-h4 mb-4">Table of Contents</h3>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id}>
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={`text-left w-full p-2 rounded-lg transition-colors text-sm ${
                  activeId === heading.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                style={{ paddingLeft: `${(heading.level - 1) * 16 + 8}px` }}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
