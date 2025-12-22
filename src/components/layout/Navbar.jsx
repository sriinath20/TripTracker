import React, { useState } from 'react';
import { Wallet, Save, Sun, Moon, Menu } from 'lucide-react';
import { useTripContext } from '../../context/TripContext';

export const Navbar = ({ isDarkMode, toggleTheme, onMenuClick }) => {
  const { activeTrip, lastSaved } = useTripContext();
  const [logoError, setLogoError] = useState(false);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 shadow-lg pt-[calc(env(safe-area-inset-top)+1rem)] px-6 pb-4 transition-colors duration-300 bg-slate-900 text-white border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-900'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* --- LOGO SECTION --- */}
        <div className="flex items-center gap-3">
          
          {/* Logic: Try to show 'logo.png'. If missing, show Wallet icon. */}
          {!logoError ? (
            <img 
              src="/logo.png" 
              alt="App Logo" 
              className="w-10 h-10 rounded-xl object-contain bg-white/10 p-1"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="bg-emerald-500 p-2 rounded-xl">
              <Wallet size={22} className="text-white" />
            </div>
          )}

          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight leading-none text-white">TripTracker</h1>
            <div className="text-xs text-slate-400 font-medium mt-1 truncate max-w-[150px]">
              {activeTrip?.name || 'My Trip'}
            </div>
          </div>
        </div>

        {/* --- RIGHT ACTIONS --- */}
        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="hidden md:flex items-center gap-1 text-xs text-slate-400">
              <Save size={12} /> Saved
            </span>
          )}
          
          <button
            onClick={toggleTheme}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors flex items-center gap-2 border border-slate-700 touch-manipulation active:scale-95"
          >
            {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-200" />}
          </button>
          
          <button 
            onClick={onMenuClick}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors flex items-center gap-2 border border-slate-700 touch-manipulation active:scale-95"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};