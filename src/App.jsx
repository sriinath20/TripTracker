import React, { useState, useEffect } from 'react';
import { TripProvider } from './context/TripContext';
import { Navbar } from './components/layout/Navbar';
import { TripMenuDrawer } from './components/layout/TripMenuDrawer';
import { TripSetupModal } from './components/modals/TripSetupModal';
import { ImportModal } from './components/modals/ImportModal';
import { TripReportModal } from './components/modals/TripReportModal';
import { Dashboard } from './components/dashboard/Dashboard';
import { useTheme } from './hooks/useTheme';

const AppContent = () => {
  const { isDarkMode, toggleTheme, themeClasses } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [setupModal, setSetupModal] = useState({ isOpen: false, isNew: false, initialData: null });
  const [importModal, setImportModal] = useState({ isOpen: false, data: null });
  const [reportModalOpen, setReportModalOpen] = useState(false); // New State

  // Fix: First Time Load Logic
  useEffect(() => {
    const hasVisited = localStorage.getItem('trip_tracker_visited');
    if (!hasVisited) {
      setSetupModal({
        isOpen: true,
        isNew: false,
        initialData: {
          name: 'My Trip',
          startDate: new Date().toISOString().split('T')[0],
          duration: 4,
          budget: 2000,
          currency: '$'
        }
      });
      localStorage.setItem('trip_tracker_visited', 'true');
    }
  }, []);

  const openNewTrip = () => {
    setSetupModal({
      isOpen: true,
      isNew: true,
      initialData: { name: '', startDate: new Date().toISOString().split('T')[0], duration: 5, budget: '', currency: '$' }
    });
  };

  const handleRestoreRequest = (parsedData) => {
    setImportModal({ isOpen: true, data: parsedData });
  };

  return (
    <div className={`min-h-screen font-sans relative overflow-hidden flex flex-col transition-colors duration-300 ${themeClasses.bg} ${themeClasses.text}`}>
      
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        onMenuClick={() => setIsMenuOpen(true)} 
      />

      <div className="h-[calc(env(safe-area-inset-top)+5.5rem)] w-full flex-shrink-0"></div>

      <Dashboard isDarkMode={isDarkMode} themeClasses={themeClasses} />

      <TripMenuDrawer 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        isDarkMode={isDarkMode} 
        themeClasses={themeClasses}
        onOpenNewTrip={openNewTrip}
        onRestoreData={handleRestoreRequest}
        onOpenReport={() => setReportModalOpen(true)}
      />

      <TripSetupModal 
        isOpen={setupModal.isOpen}
        onClose={() => setSetupModal({ ...setupModal, isOpen: false })}
        isNew={setupModal.isNew}
        initialData={setupModal.initialData}
        isDarkMode={isDarkMode}
        themeClasses={themeClasses}
      />

      <ImportModal 
        isOpen={importModal.isOpen}
        importedData={importModal.data}
        onClose={() => setImportModal({ isOpen: false, data: null })}
        isDarkMode={isDarkMode}
        themeClasses={themeClasses}
      />

      {/* New Report Modal */}
      <TripReportModal 
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        isDarkMode={isDarkMode}
        themeClasses={themeClasses}
      />
    </div>
  );
};

const App = () => {
  return (
    <TripProvider>
      <AppContent />
    </TripProvider>
  );
};

export default App;