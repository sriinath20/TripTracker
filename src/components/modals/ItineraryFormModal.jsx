import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ITINERARY_TYPES } from '../../utils/appUtils';

export const ItineraryFormModal = ({ isOpen, onClose, initialData, onSave, isDarkMode, themeClasses }) => {
  const [formData, setFormData] = useState({
    type: 'place',
    title: '',
    startTime: '',
    endTime: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || { type: 'place', title: '', startTime: '', endTime: '', notes: '' });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const currentTypeConfig = ITINERARY_TYPES[formData.type] || ITINERARY_TYPES.place;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className={`relative w-full sm:max-w-md p-6 rounded-t-2xl sm:rounded-xl shadow-2xl animate-[slideInUp_0.2s_ease-out] sm:animate-in sm:zoom-in-95 ${themeClasses.card}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-bold ${themeClasses.text}`}>
            {initialData ? 'Edit Item' : 'Add to Itinerary'}
          </h3>
          <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
        </div>

        <div className="space-y-4">
          {/* Type Selection */}
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(ITINERARY_TYPES).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setFormData({ ...formData, type: key })}
                    className={`p-2 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-all border ${
                      formData.type === key 
                      ? `border-${config.color.split('-')[1]}-500 bg-${config.color.split('-')[1]}-50 dark:bg-slate-800 ${config.color}`
                      : `border-transparent ${themeClasses.subText} hover:bg-slate-100 dark:hover:bg-slate-800`
                    }`}
                  >
                    <Icon size={16} />
                    {config.label}
                  </button>
                );
            })}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Title / Place Name</label>
            <input 
              type="text"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Eiffel Tower or Hotel Grand"
              className={`w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-emerald-500 ${themeClasses.input}`}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="text-xs font-bold text-slate-400 uppercase block mb-1">
                 {currentTypeConfig.timeLabel1 || 'Start Time'}
               </label>
               <input 
                 type="time"
                 value={formData.startTime}
                 onChange={e => setFormData({...formData, startTime: e.target.value})}
                 className={`w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-emerald-500 ${themeClasses.input}`}
               />
             </div>
             {currentTypeConfig.showTime2 !== false && (
               <div>
                 <label className="text-xs font-bold text-slate-400 uppercase block mb-1">
                   {currentTypeConfig.timeLabel2 || 'End Time'} (Opt)
                 </label>
                 <input 
                   type="time"
                   value={formData.endTime}
                   onChange={e => setFormData({...formData, endTime: e.target.value})}
                   className={`w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-emerald-500 ${themeClasses.input}`}
                 />
               </div>
             )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Notes</label>
            <textarea 
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              placeholder="Tickets cost $20, bring ID..."
              className={`w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-emerald-500 min-h-[80px] ${themeClasses.input}`}
            />
          </div>
          
          <button 
            onClick={() => {
              if(!formData.title) return alert("Please enter a title");
              onSave(formData);
              onClose();
            }}
            className="w-full py-3 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-transform"
          >
            Save Item
          </button>
        </div>
      </div>
    </div>
  );
};