import React, { createContext, useContext, useMemo } from 'react';
import { useTripStorage } from '../hooks/useTripStorage';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const { data, setData, lastSaved, exportData, resetAllData } = useTripStorage();

  const activeTrip = useMemo(() => 
    data.trips.find(t => t.id === data.activeId) || data.trips[0] || {}, 
  [data.trips, data.activeId]);

  const expenses = useMemo(() => 
    (data.expensesMap && data.expensesMap[activeTrip.id]) ? data.expensesMap[activeTrip.id] : [],
  [data.expensesMap, activeTrip.id]);

  // Actions
  const switchTrip = (id) => setData(prev => ({ ...prev, activeId: id }));

  const updateTripSettings = (updates) => {
    setData(prev => {
      const updatedTrips = prev.trips.map(t => 
        t.id === prev.activeId ? { ...t, ...updates } : t
      );
      return { ...prev, trips: updatedTrips };
    });
  };

  const addTrip = (newTripData) => {
    const newId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const initialRow = { 
        id: 1, 
        date: newTripData.startDate, 
        day: 'Day 1', 
        category: 'Food', 
        description: '', 
        amount: '', 
        method: 'Cash' 
    };
    const newTrip = {
        id: newId,
        ...newTripData,
        budget: Number(newTripData.budget) || 0,
        duration: Number(newTripData.duration) || 1
    };
    setData(prev => ({
        trips: [...prev.trips, newTrip],
        expensesMap: { ...prev.expensesMap, [newId]: [initialRow] },
        activeId: newId
    }));
  };

  const deleteTrip = (idToDelete) => {
    if (data.trips.length <= 1) return;
    setData(prev => {
        const newTrips = prev.trips.filter(t => t.id !== idToDelete);
        const newActiveId = prev.activeId === idToDelete ? newTrips[0].id : prev.activeId;
        const newExpensesMap = { ...prev.expensesMap };
        delete newExpensesMap[idToDelete];
        return { trips: newTrips, activeId: newActiveId, expensesMap: newExpensesMap };
    });
  };

  // --- NEW: Import Logic ---
  const importData = (importedData, strategy) => {
    if (strategy === 'replace') {
      setData(importedData);
    } else if (strategy === 'merge') {
      const newTrips = [];
      const newExpensesMap = { ...data.expensesMap };

      importedData.trips.forEach(trip => {
        const newId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
        newTrips.push({ 
          ...trip, 
          id: newId, 
          name: `${trip.name} (Imported)` 
        });
        newExpensesMap[newId] = importedData.expensesMap[trip.id] || [];
      });

      setData(prev => ({
        ...prev,
        trips: [...prev.trips, ...newTrips],
        expensesMap: newExpensesMap,
        activeId: newTrips[0]?.id || prev.activeId // Switch to first imported trip
      }));
    }
  };

  return (
    <TripContext.Provider value={{
      data,
      setData,
      activeTrip,
      expenses,
      lastSaved,
      actions: {
        switchTrip,
        updateTripSettings,
        addTrip,
        deleteTrip,
        exportData,
        resetAllData,
        importData // Exposed here
      }
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) throw new Error("useTripContext must be used within a TripProvider");
  return context;
};