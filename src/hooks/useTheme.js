import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('trip_tracker_theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('trip_tracker_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // Common theme classes accessible anywhere
  const themeClasses = {
    bg: isDarkMode ? 'bg-slate-950' : 'bg-slate-100',
    text: isDarkMode ? 'text-slate-100' : 'text-slate-800',
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200',
    subText: isDarkMode ? 'text-slate-500' : 'text-slate-500',
    input: isDarkMode ? 'bg-slate-950 border-slate-700 text-white focus:ring-blue-500/50' : 'bg-white border-slate-200 text-slate-800 focus:ring-blue-100',
    drawer: isDarkMode ? 'bg-slate-900 border-l border-slate-800' : 'bg-white',
    tableHeader: isDarkMode ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-500',
    tableRowHover: isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-blue-50/50',
    tableInput: isDarkMode ? 'text-slate-200 focus:bg-slate-900 focus:ring-2 focus:ring-yellow-400' : 'text-slate-700 focus:bg-white focus:ring-2 focus:ring-yellow-400',
    progressBarBg: isDarkMode ? 'bg-slate-800' : 'bg-slate-100',
    modalOverlay: 'bg-black/60 backdrop-blur-sm',
    border: isDarkMode ? 'border-slate-800' : 'border-slate-200', // Generic border
  };

  return { isDarkMode, toggleTheme, themeClasses };
};