import React from 'react';
import { FileJson } from 'lucide-react';
import { ModalOverlay } from '../ui/ModalOverlay';
import { useTripContext } from '../../context/TripContext';

export const ImportModal = ({ isOpen, onClose, importedData, isDarkMode, themeClasses }) => {
  const { actions } = useTripContext();

  if (!isOpen || !importedData) return null;

  const handleAction = (strategy) => {
    actions.importData(importedData, strategy);
    alert(strategy === 'replace' ? "Data replaced successfully!" : "Trips imported successfully!");
    onClose();
  };

  return (
    <ModalOverlay onClose={onClose} isDarkMode={isDarkMode}>
      <div className={`rounded-xl shadow-2xl p-6 w-full ${themeClasses.card}`}>
        <div className="flex flex-col items-center text-center">
          <div className={`p-3 rounded-full mb-4 bg-blue-100 dark:bg-blue-900/30`}>
            <FileJson size={32} className="text-blue-500" />
          </div>
          <h3 className={`text-lg font-bold mb-2 ${themeClasses.text}`}>Import Strategy</h3>
          <p className={`text-sm mb-6 ${themeClasses.subText}`}>
            How would you like to import this data?
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={() => handleAction('replace')}
              className={`w-full py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 shadow-sm transition-colors`}
            >
              Replace All Data
            </button>
            <button 
              onClick={() => handleAction('merge')}
              className={`w-full py-3 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 shadow-sm transition-colors`}
            >
              Import as New Trip(s)
            </button>
            <button 
              onClick={onClose}
              className={`w-full py-3 rounded-lg border font-medium transition-colors ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
};