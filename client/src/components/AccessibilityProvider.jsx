// client/src/components/AccessibilityProvider.jsx - Accessibility Context
import React, { createContext,useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReaderOptimized: false,
    keyboardNavigation: true,
    fontSize: 100, // percentage
    lineHeight: 1.5,
    letterSpacing: 0,
    wordSpacing: 0,
    colorBlindMode: 'none', // none, protanopia, deuteranopia, tritanopia
    announcements: true
  });

  const [focusVisible, setFocusVisible] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Load saved accessibility settings
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
      }
    }

    // Detect user preferences
    detectUserPreferences();

    // Setup keyboard navigation
    setupKeyboardNavigation();

    // Setup focus management
    setupFocusManagement();

  }, []);

  useEffect(() => {
    // Save settings when they change
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    // Apply settings to DOM
    applySettings();
  }, [settings]);

  const detectUserPreferences = () => {
    // Detect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }

    // Detect high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      setSettings(prev => ({ ...prev, highContrast: true }));
    }

    // Detect large text preference
    if (window.matchMedia('(prefers-reduced-data: reduce)').matches) {
      setSettings(prev => ({ ...prev, largeText: true }));
    }
  };

  const applySettings = () => {
    const root = document.documentElement;

    // Apply font size
    root.style.setProperty('--font-size-scale', `${settings.fontSize}%`);
    
    // Apply line height
    root.style.setProperty('--line-height', settings.lineHeight);
    
    // Apply letter spacing
    root.style.setProperty('--letter-spacing', `${settings.letterSpacing}px`);
    
    // Apply word spacing
    root.style.setProperty('--word-spacing', `${settings.wordSpacing}px`);

    // Apply classes for major settings
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('large-text', settings.largeText);
    root.classList.toggle('reduced-motion', settings.reducedMotion);
    root.classList.toggle('screen-reader-optimized', settings.screenReaderOptimized);
    root.classList.toggle(`colorblind-${settings.colorBlindMode}`, settings.colorBlindMode !== 'none');
  };

  const setupKeyboardNavigation = () => {
    // Skip links for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Escape key handling
      if (e.key === 'Escape') {
        closeModalsAndMenus();
      }

      // Arrow key navigation for custom components
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        handleArrowNavigation(e);
      }

      // Tab trapping in modals
      if (e.key === 'Tab') {
        handleTabTrapping(e);
      }
    });
  };

  const setupFocusManagement = () => {
    // Focus visibility detection
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        setFocusVisible(true);
      }
    });

    document.addEventListener('mousedown', () => {
      setFocusVisible(false);
    });

    // Focus management for dynamic content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.hasAttribute('data-auto-focus')) {
              node.focus();
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  const announce = (message, priority = 'polite') => {
    if (!settings.announcements) return;

    const announcement = {
      id: Date.now(),
      message,
      priority,
      timestamp: new Date()
    };

    setAnnouncements(prev => [...prev, announcement]);

    // Remove announcement after it's been read
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== announcement.id));
    }, 5000);
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    const defaultSettings = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReaderOptimized: false,
      keyboardNavigation: true,
      fontSize: 100,
      lineHeight: 1.5,
      letterSpacing: 0,
      wordSpacing: 0,
      colorBlindMode: 'none',
      announcements: true
    };
    setSettings(defaultSettings);
  };

  // Helper functions
  const closeModalsAndMenus = () => {
    // Close all open modals and dropdowns
    document.querySelectorAll('[data-modal]').forEach(modal => {
      if (modal.style.display !== 'none') {
        modal.style.display = 'none';
        // Restore focus to trigger element
        const trigger = document.querySelector(`[data-modal-trigger="${modal.id}"]`);
        if (trigger) trigger.focus();
      }
    });
  };

  const handleArrowNavigation = (e) => {
    const currentFocus = document.activeElement;
    const navGroup = currentFocus.closest('[data-nav-group]');
    
    if (navGroup) {
      const items = navGroup.querySelectorAll('[data-nav-item]');
      const currentIndex = Array.from(items).indexOf(currentFocus);
      
      let nextIndex;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          break;
      }
      
      if (nextIndex !== undefined) {
        e.preventDefault();
        items[nextIndex].focus();
      }
    }
  };

  const handleTabTrapping = (e) => {
    const modal = document.querySelector('[data-modal][aria-hidden="false"]');
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  const value = {
    settings,
    updateSetting,
    resetSettings,
    announce,
    focusVisible,
    announcements
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      
      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcements
          .filter(a => a.priority === 'polite')
          .map(a => (
            <div key={a.id}>{a.message}</div>
          ))
        }
      </div>
      
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {announcements
          .filter(a => a.priority === 'assertive')
          .map(a => (
            <div key={a.id}>{a.message}</div>
          ))
        }
      </div>
    </AccessibilityContext.Provider>
  );
};
