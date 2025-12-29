// client/src/utils/performance.js - Frontend Performance Utils
import React, { lazy, useState,useEffect,Suspense,useRef } from 'react';
import { motion } from 'framer-motion';

// Code splitting with React.lazy
export const LazyHome = lazy(() => import('../pages/Home'));
export const LazyDashboard = lazy(() => import('../pages/Dashboard'));
export const LazyEditor = lazy(() => import('../pages/Editor'));
export const LazyAnalytics = lazy(() => import('../pages/Analytics'));
export const LazyPostDetail = lazy(() => import('../pages/PostDetail'));

// Lazy loading wrapper component
export const LazyComponent = ({ children, fallback = <LoadingSpinner /> }) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

// Image lazy loading hook
export const useImageLazyLoading = () => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const imageRefs = useRef(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            
            if (src && !loadedImages.has(src)) {
              img.src = src;
              img.onload = () => {
                setLoadedImages(prev => new Set([...prev, src]));
                img.classList.add('loaded');
              };
              observer.unobserve(img);
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    imageRefs.current.forEach((img) => {
      if (img) observer.observe(img);
    });

    return () => observer.disconnect();
  }, [loadedImages]);

  const registerImage = (src, ref) => {
    if (ref) {
      imageRefs.current.set(src, ref);
    }
  };

  return { registerImage, loadedImages };
};

// WebP support detection
export const supportsWebP = (() => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
})();

// Performance monitoring
export const performanceMonitor = {
  measurePageLoad: () => {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      
      console.log(`Page load time: ${loadTime}ms`);
      
      // Send to analytics
      if (window.gtag) {
        window.gtag('event', 'timing_complete', {
          name: 'load',
          value: Math.round(loadTime)
        });
      }
    });
  },

  measureComponentRender: (componentName) => {
    return {
      start: () => performance.mark(`${componentName}-start`),
      end: () => {
        performance.mark(`${componentName}-end`);
        performance.measure(
          `${componentName}-render`,
          `${componentName}-start`,
          `${componentName}-end`
        );
        
        const measure = performance.getEntriesByName(`${componentName}-render`)[0];
        if (measure) {
          console.log(`${componentName} render time: ${measure.duration}ms`);
        }
      }
    };
  }
};
