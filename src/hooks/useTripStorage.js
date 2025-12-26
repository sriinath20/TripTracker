import { useState, useEffect } from 'react';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

const DEFAULT_DATA = {
  trips: [{
    id: 'default_trip',
    name: 'My Trip',
    startDate: new Date().toISOString().split('T')[0],
    duration: 4,
    budget: 5000,
    currency: '$'
  }],
  expensesMap: {
    'default_trip': []
  },
  itineraryMap: {
    'default_trip': []
  },
  activeId: 'default_trip'
};

export const useTripStorage = () => {
  // --- Load Data ---
  const loadInitialData = () => {
    try {
      const v3Data = localStorage.getItem('trip_tracker_v3');
      if (v3Data) {
        const parsed = JSON.parse(v3Data);
        // Migration: Ensure itineraryMap exists for older versions
        if (!parsed.itineraryMap) parsed.itineraryMap = {};
        
        // Ensure every trip has an entry in itineraryMap
        if (Array.isArray(parsed.trips)) {
             parsed.trips.forEach(t => {
                 if (!parsed.itineraryMap[t.id]) parsed.itineraryMap[t.id] = [];
             });
             return parsed;
        }
      }
    } catch (e) {
      console.error("Data corruption detected, resetting to default.", e);
    }
    return DEFAULT_DATA;
  };

  const [data, setData] = useState(loadInitialData);
  const [lastSaved, setLastSaved] = useState(null);

  // --- Auto-Save Effect ---
  useEffect(() => {
    try {
      localStorage.setItem('trip_tracker_v3', JSON.stringify(data));
      setLastSaved(new Date());
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, [data]);

  // --- Android Native Export ---
  const exportData = async () => {
    const dataStr = JSON.stringify(data, null, 2);
    const fileName = `triptracker_backup_${new Date().toISOString().split('T')[0]}.json`;

    try {
      await Filesystem.writeFile({
        path: fileName,
        data: dataStr,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });

      const fileResult = await Filesystem.getUri({
        directory: Directory.Cache,
        path: fileName,
      });

      await Share.share({
        title: 'TripTracker Backup',
        url: fileResult.uri,
        dialogTitle: 'Save Backup File',
      });
      
      return { success: true };
    } catch (e) {
      console.error("Native share failed", e);
      return { success: false, error: e };
    }
  };

  const resetAllData = () => {
      localStorage.removeItem('trip_tracker_v3');
      localStorage.removeItem('trip_tracker_visited');
      setData(DEFAULT_DATA);
  };

  return {
    data,
    setData,
    lastSaved,
    exportData,
    resetAllData
  };
};