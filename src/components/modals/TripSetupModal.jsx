import React, { useState, useEffect } from 'react';
import { Globe, X, Check } from 'lucide-react';
import { useTripContext } from '../../context/TripContext';
import { ModalOverlay } from '../ui/ModalOverlay';

export const TripSetupModal = ({ isOpen, onClose, isNew, initialData, isDarkMode, themeClasses }) => {
  const { actions } = useTripContext();
  const [formData, setFormData] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    duration: 3,
    budget: '',
    currency: '$'
  });

  const currencies = ['$', '€', '£', '¥', '₹'];

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (isNew) {
      actions.addTrip(formData);
    } else {
      actions.updateTripSettings(formData);
    }
    onClose();
  };

  return (
    <ModalOverlay onClose={onClose} isDarkMode={isDarkMode}>
      <div className={`rounded-xl shadow-2xl p-6 w-full ${themeClasses.card} border-2 ${isDarkMode ? 'border-emerald-900' : 'border-emerald-100'}`}>
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 border-b pb-4 border-dashed border-slate-300 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-lg text-white">
                <Globe size={24} />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${themeClasses.text}`}>
                  {isNew ? 'Plan New Trip' : 'Welcome to TripTracker'}
                </h3>
                <p className="text-xs text-slate-500">Let's set up your budget details.</p>
              </div>
            </div>
            <button onClick={onClose} className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500`}>
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className={`text-xs font-bold uppercase mb-1 block ${themeClasses.subText}`}>Trip Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full p-3 rounded-lg border font-medium outline-none focus:ring-2 focus:ring-emerald-500 ${themeClasses.input}`}
                placeholder="e.g. Summer in Italy"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className={`text-xs font-bold uppercase mb-1 block ${themeClasses.subText}`}>Start Date</label>
                  <input 
                    type="date" 
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className={`w-full p-3 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${themeClasses.input}`}
                  />
               </div>
               <div>
                  <label className={`text-xs font-bold uppercase mb-1 block ${themeClasses.subText}`}>Duration (Days)</label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className={`w-full p-3 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${themeClasses.input}`}
                  />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-xs font-bold uppercase mb-1 block ${themeClasses.subText}`}>Budget</label>
                <input 
                  type="number" 
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  className={`w-full p-3 rounded-lg border font-mono font-medium outline-none focus:ring-2 focus:ring-emerald-500 ${themeClasses.input}`}
                  placeholder="5000"
                />
              </div>
               <div>
                  <label className={`text-xs font-bold uppercase mb-1 block ${themeClasses.subText}`}>Currency</label>
                  <select 
                    value={formData.currency}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    className={`w-full p-3 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-emerald-500 appearance-none ${themeClasses.input}`}
                  >
                     {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
               </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8">
             <button 
              onClick={handleSubmit}
              disabled={!formData.name || !formData.budget}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
               <Check size={20} /> {isNew ? 'Create Trip' : 'Start Tracking'}
             </button>
             {!isNew && (
                <p className="text-center text-xs text-slate-400 mt-3">You can change these later in settings.</p>
             )}
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
};