import React, { useRef } from 'react';
import { Settings, X, Globe, Plus, Trash2, Calendar, Save, Download, Upload, RefreshCw, FileText } from 'lucide-react';
import { useTripContext } from '../../context/TripContext';

export const TripMenuDrawer = ({ isOpen, onClose, isDarkMode, themeClasses, onOpenNewTrip, onRestoreData, onOpenReport }) => {
  const { data, activeTrip, actions } = useTripContext();
  const fileInputRef = useRef(null);
  const currencies = ['$', '€', '£', '¥', '₹'];

  const handleDeleteTrip = (e, trip) => {
    e.stopPropagation();
    if (confirm(`Delete "${trip.name}"? This cannot be undone.`)) {
        actions.deleteTrip(trip.id);
    }
  };

  const handleReset = () => {
    if(confirm("This will delete all trips and data. Are you sure?")) {
        actions.resetAllData();
        window.location.reload();
    }
  };

  const onFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed && Array.isArray(parsed.trips)) {
             onRestoreData(parsed);
             onClose(); 
        } else {
             alert("Invalid backup file.");
        }
      } catch (err) { alert("Error reading file."); }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>
      
      <div className={`absolute right-0 top-0 h-full w-80 sm:w-96 shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'} pt-[calc(env(safe-area-inset-top)+1rem)] ${themeClasses.drawer}`}>
        
        <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
          <h2 className={`text-xl font-bold flex items-center gap-2 ${themeClasses.text}`}>
            <Settings size={20} className={themeClasses.subText} /> Settings
          </h2>
          <button onClick={onClose} className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-24">
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Globe size={14} /> My Trips
              </label>
              <button 
                onClick={() => { onOpenNewTrip(); onClose(); }}
                className={`text-xs font-bold flex items-center gap-1 px-2 py-1 rounded ${isDarkMode ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-600 hover:text-blue-800'}`}
              >
                <Plus size={12} /> New
              </button>
            </div>
            <div className="space-y-2">
              {data.trips.map(trip => (
                <div 
                  key={trip.id} 
                  onClick={() => { actions.switchTrip(trip.id); onClose(); }}
                  className={`p-3 rounded-lg cursor-pointer border transition-all flex justify-between items-center group ${
                    trip.id === activeTrip.id 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                    : `${isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{trip.name}</div>
                    <div className={`text-xs truncate ${trip.id === activeTrip.id ? 'text-slate-400' : 'text-slate-50'}`}>
                      {trip.startDate} • {trip.currency}{trip.budget}
                    </div>
                  </div>
                  {data.trips.length > 1 && (
                    <button 
                      onClick={(e) => handleDeleteTrip(e, trip)}
                      className={`p-1.5 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all ${
                         trip.id === activeTrip.id ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-red-100 text-red-500'
                      }`}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <hr className={themeClasses.border} />

          <div>
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block flex items-center gap-2">
               <Calendar size={14} /> Current Trip Details
             </label>
             
             <div className="space-y-4">
               <div>
                 <span className={`text-sm block mb-1 ${themeClasses.subText}`}>Trip Name</span>
                 <input 
                   type="text" 
                   value={activeTrip.name} 
                   onChange={(e) => actions.updateTripSettings({ name: e.target.value })} 
                   className={`w-full p-2 border rounded-lg text-sm focus:ring-2 outline-none font-medium ${themeClasses.input}`} 
                 />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className={`text-sm block mb-1 ${themeClasses.subText}`}>Start Date</span>
                    <input 
                      type="date" 
                      value={activeTrip.startDate} 
                      onChange={(e) => actions.updateTripSettings({ startDate: e.target.value })} 
                      className={`w-full p-2 border rounded-lg text-sm ${themeClasses.input}`} 
                    />
                  </div>
                  <div>
                    <span className={`text-sm block mb-1 ${themeClasses.subText}`}>Currency</span>
                    <select 
                        value={activeTrip.currency}
                        onChange={(e) => actions.updateTripSettings({ currency: e.target.value })}
                        className={`w-full p-2 border rounded-lg text-sm ${themeClasses.input}`}
                    >
                        {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
               </div>

               <div>
                 <span className={`text-sm block mb-1 ${themeClasses.subText}`}>Total Budget</span>
                 <div className="relative">
                   <span className="absolute left-3 top-2 text-slate-400 font-bold">{activeTrip.currency}</span>
                   <input 
                     type="number" 
                     value={activeTrip.budget} 
                     onChange={(e) => actions.updateTripSettings({ budget: parseFloat(e.target.value) || 0 })} 
                     className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono font-medium ${themeClasses.input}`} 
                   />
                 </div>
               </div>
             </div>
          </div>

          <hr className={themeClasses.border} />
          
          <div>
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block flex items-center gap-2">
               <Save size={14} /> Data Management
             </label>
             <div className="grid grid-cols-2 gap-3">
               <button 
                 onClick={actions.exportData}
                 className={`py-3 rounded-lg border font-medium flex flex-col items-center justify-center gap-1 transition-colors ${isDarkMode ? 'border-slate-700 text-emerald-400 hover:bg-slate-800' : 'border-slate-200 text-emerald-600 hover:bg-emerald-50'}`}
               >
                 <Download size={18} />
                 <span className="text-xs">Backup JSON</span>
               </button>
               <button 
                 onClick={() => fileInputRef.current.click()}
                 className={`py-3 rounded-lg border font-medium flex flex-col items-center justify-center gap-1 transition-colors ${isDarkMode ? 'border-slate-700 text-blue-400 hover:bg-slate-800' : 'border-slate-200 text-blue-600 hover:bg-blue-50'}`}
               >
                 <Upload size={18} />
                 <span className="text-xs">Restore JSON</span>
               </button>
               <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={onFileSelect} />
             </div>
             
             {/* New PDF Export Button */}
             <button 
                 onClick={() => { onOpenReport(); onClose(); }}
                 className={`w-full mt-3 py-3 rounded-lg border font-medium flex items-center justify-center gap-2 transition-colors ${isDarkMode ? 'border-slate-700 text-purple-400 hover:bg-slate-800' : 'border-slate-200 text-purple-600 hover:bg-purple-50'}`}
             >
                 <FileText size={18} />
                 <span className="text-sm">Export PDF Report</span>
             </button>
          </div>

          <hr className={themeClasses.border} />
          
          <button 
             onClick={handleReset} 
             className={`w-full py-3 rounded-lg border font-medium transition-colors flex items-center justify-center gap-2 ${isDarkMode ? 'border-red-900/50 text-red-400 hover:bg-red-900/20' : 'border-red-200 text-red-500 hover:bg-red-50'}`}
          >
            <RefreshCw size={16} /> Reset All Data
          </button>

        </div>
      </div>
    </div>
  );
};