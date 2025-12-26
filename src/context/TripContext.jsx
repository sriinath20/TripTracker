import React, { createContext, useContext, useMemo } from 'react';
import { useTripStorage } from '../hooks/useTripStorage';
// NOTE: If you need imports from appUtils here, use '../utils/appUtils' (only one ../)

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const { data, setData, lastSaved, exportData, resetAllData } = useTripStorage();

  const activeTrip = useMemo(() => 
    data.trips.find(t => t.id === data.activeId) || data.trips[0] || {}, 
  [data.trips, data.activeId]);

  const expenses = useMemo(() => 
    (data.expensesMap && data.expensesMap[activeTrip.id]) ? data.expensesMap[activeTrip.id] : [],
  [data.expensesMap, activeTrip.id]);

  // Derived Itinerary Data
  const itinerary = useMemo(() => 
    (data.itineraryMap && data.itineraryMap[activeTrip.id]) ? data.itineraryMap[activeTrip.id] : [],
  [data.itineraryMap, activeTrip.id]);

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
        itineraryMap: { ...prev.itineraryMap, [newId]: [] }, // Initialize itinerary
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
        
        const newItineraryMap = { ...prev.itineraryMap }; // Clean up itinerary
        delete newItineraryMap[idToDelete];

        return { trips: newTrips, activeId: newActiveId, expensesMap: newExpensesMap, itineraryMap: newItineraryMap };
    });
  };

  const importData = (importedData, strategy) => {
    if (strategy === 'replace') {
      setData(importedData);
    } else if (strategy === 'merge') {
      const newTrips = [];
      const newExpensesMap = { ...data.expensesMap };
      const newItineraryMap = { ...data.itineraryMap };

      importedData.trips.forEach(trip => {
        const newId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
        newTrips.push({ 
          ...trip, 
          id: newId, 
          name: `${trip.name} (Imported)` 
        });
        newExpensesMap[newId] = importedData.expensesMap[trip.id] || [];
        newItineraryMap[newId] = importedData.itineraryMap ? (importedData.itineraryMap[trip.id] || []) : [];
      });

      setData(prev => ({
        ...prev,
        trips: [...prev.trips, ...newTrips],
        expensesMap: newExpensesMap,
        itineraryMap: newItineraryMap,
        activeId: newTrips[0]?.id || prev.activeId 
      }));
    }
  };

  // --- Itinerary Actions ---
  const updateItineraryDay = (dayId, newItems) => {
    setData(prev => {
      const currentItinerary = prev.itineraryMap[prev.activeId] || [];
      const dayIndex = currentItinerary.findIndex(d => d.id === dayId);
      let updatedItinerary = [...currentItinerary];
      
      if (dayIndex >= 0) {
        updatedItinerary[dayIndex] = { ...updatedItinerary[dayIndex], items: newItems };
      } else {
        updatedItinerary.push({ id: dayId, items: newItems });
      }

      return {
        ...prev,
        itineraryMap: { ...prev.itineraryMap, [prev.activeId]: updatedItinerary }
      };
    });
  };

  return (
    <TripContext.Provider value={{
      data,
      setData,
      activeTrip,
      expenses,
      itinerary,
      lastSaved,
      actions: {
        switchTrip,
        updateTripSettings,
        addTrip,
        deleteTrip,
        exportData,
        resetAllData,
        importData,
        updateItineraryDay
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