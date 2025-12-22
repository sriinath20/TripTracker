import React, { useState, useEffect } from 'react';
import { X, FileText, CheckCircle, Loader2, Calendar, Receipt, DollarSign, ChevronRight } from 'lucide-react';
import { ModalOverlay } from '../ui/ModalOverlay';
import { useTripContext } from '../../context/TripContext';
import { generateTripReport } from '../../utils/pdfUtils';

export const TripReportModal = ({ isOpen, onClose, isDarkMode, themeClasses }) => {
  const { activeTrip, expenses } = useTripContext();
  const [status, setStatus] = useState('idle'); // idle, generating, success, error

  // Reset status when opening
  useEffect(() => {
    if (isOpen) setStatus('idle');
  }, [isOpen]);

  if (!isOpen || !activeTrip) return null;

  const totalSpent = expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const startDate = new Date(activeTrip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  const handleExport = () => {
    setStatus('generating');
    // Delay to allow UI animation to start
    setTimeout(async () => {
      try {
        const success = await generateTripReport(activeTrip, expenses);
        if (success) {
          setStatus('success');
          // Optional: Close automatically after success
          setTimeout(onClose, 2500);
        } else {
          setStatus('error');
        }
      } catch (e) {
        setStatus('error');
      }
    }, 800);
  };

  return (
    <ModalOverlay onClose={onClose} isDarkMode={isDarkMode}>
      <div className={`rounded-2xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden flex flex-col transform transition-all duration-300 ${themeClasses.card} animate-in fade-in zoom-in-95`}>
        
        {/* Header with Gradient */}
        <div className={`relative p-6 text-center overflow-hidden ${isDarkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'}`}>
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
           <button 
              onClick={onClose} 
              className={`absolute right-4 top-4 p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-indigo-800 text-indigo-300' : 'hover:bg-indigo-100 text-indigo-400'}`}
           >
             <X size={20} />
           </button>
           
           {/* Animated Icon Container */}
           <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-lg transition-all duration-500 ${
              status === 'success' ? 'bg-emerald-500 rotate-0 scale-110' : 
              status === 'error' ? 'bg-red-500 rotate-12' :
              'bg-white text-indigo-600 rotate-3'
           }`}>
              {status === 'generating' && <Loader2 size={32} className="animate-spin text-indigo-600" />}
              {status === 'success' && <CheckCircle size={32} className="text-white animate-[bounce_1s_infinite]" />}
              {status === 'error' && <X size={32} className="text-white" />}
              {status === 'idle' && <FileText size={32} className="text-indigo-600" />}
           </div>
           
           <h2 className={`text-xl font-bold ${themeClasses.text}`}>
             {status === 'success' ? 'Report Ready!' : 'Export Trip Report'}
           </h2>
           <p className={`text-xs mt-1 ${themeClasses.subText}`}>
             {status === 'success' ? 'Your PDF has been saved & shared.' : 'Generate a detailed PDF summary.'}
           </p>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
           
           {/* Preview Card */}
           <div className={`p-4 rounded-xl border flex flex-col gap-3 relative overflow-hidden ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="flex justify-between items-start">
                  <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Trip Name</div>
                      <div className={`font-bold text-lg ${themeClasses.text}`}>{activeTrip.name}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                      PDF
                  </div>
              </div>
              
              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent"></div>

              <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                      <Calendar size={14} className="mx-auto mb-1 text-slate-400" />
                      <div className={`text-xs font-medium ${themeClasses.text}`}>{activeTrip.duration} Days</div>
                  </div>
                  <div>
                      <Receipt size={14} className="mx-auto mb-1 text-slate-400" />
                      <div className={`text-xs font-medium ${themeClasses.text}`}>{expenses.length} Txns</div>
                  </div>
                  <div>
                      <DollarSign size={14} className="mx-auto mb-1 text-slate-400" />
                      <div className={`text-xs font-medium ${themeClasses.text}`}>{activeTrip.currency}{totalSpent}</div>
                  </div>
              </div>
           </div>

           {/* Action Button */}
           <button
              onClick={handleExport}
              disabled={status === 'generating' || status === 'success'}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98] ${
                  status === 'success' 
                  ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                  : status === 'error'
                    ? 'bg-red-500 text-white shadow-red-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30'
              }`}
           >
              {status === 'idle' && (
                  <>Generate Report <ChevronRight size={20} className="opacity-70 group-hover:translate-x-1 transition-transform" /></>
              )}
              {status === 'generating' && (
                  <>Generating...</>
              )}
              {status === 'success' && (
                  <>Opened successfully!</>
              )}
              {status === 'error' && (
                  <>Retry Export</>
              )}
           </button>
        </div>

      </div>
    </ModalOverlay>
  );
};