import { BedDouble, Coffee, Utensils, Map as MapIcon } from 'lucide-react';

// --- Constants ---
export const categories = ['Transport', 'Food', 'Accommodation', 'Activity', 'Shopping', 'Misc'];
export const methods = ['Cash', 'Card', 'UPI'];

export const categoryColors = {
  Transport: 'bg-blue-500 text-blue-500',
  Food: 'bg-orange-500 text-orange-500',
  Accommodation: 'bg-indigo-500 text-indigo-500',
  Activity: 'bg-pink-500 text-pink-500',
  Shopping: 'bg-yellow-500 text-yellow-500',
  Misc: 'bg-slate-400 text-slate-400'
};

export const methodColors = {
  Cash: 'bg-emerald-500',
  Card: 'bg-purple-600',
  UPI: 'bg-blue-500',
};

// --- Itinerary Constants ---
export const ITINERARY_TYPES = {
  checkin: { 
    label: 'Check-in', 
    icon: BedDouble, 
    color: 'text-indigo-500', 
    bg: 'bg-indigo-500',
    timeLabel1: 'Check-in Time',
    showTime2: false
  },
  checkout: { 
    label: 'Check-out', 
    icon: BedDouble, 
    color: 'text-slate-500', 
    bg: 'bg-slate-500',
    timeLabel1: 'Check-out Time',
    showTime2: false
  },
  breakfast: { 
    label: 'Breakfast', 
    icon: Coffee, 
    color: 'text-orange-500', 
    bg: 'bg-orange-500',
    timeLabel1: 'Start Time',
    timeLabel2: 'End Time'
  },
  lunch: { 
    label: 'Lunch', 
    icon: Utensils, 
    color: 'text-orange-600', 
    bg: 'bg-orange-600',
    timeLabel1: 'Start Time',
    timeLabel2: 'End Time'
  },
  dinner: { 
    label: 'Dinner', 
    icon: Utensils, 
    color: 'text-red-500', 
    bg: 'bg-red-500',
    timeLabel1: 'Start Time',
    timeLabel2: 'End Time'
  },
  place: { 
    label: 'Visit', 
    icon: MapIcon, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-500',
    timeLabel1: 'Reach Time',
    timeLabel2: 'Leave Time'
  },
};

// ... keep the rest of the file (getCalculatedDate, etc.)
export const getCalculatedDate = (startDateStr, dayStr) => {
  if (!startDateStr || !dayStr) return startDateStr || new Date().toISOString().split('T')[0];
  try {
    const [y, m, d] = startDateStr.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    
    let offset = 0;
    if (dayStr === 'Pre-Trip') {
      offset = -1;
    } else if (dayStr.startsWith('Day ')) {
      const dayNum = parseInt(dayStr.split(' ')[1]);
      offset = dayNum - 1;
    }
    date.setUTCDate(date.getUTCDate() + offset);
    return date.toISOString().split('T')[0];
  } catch (e) {
    return startDateStr;
  }
};

export const getDayFromDate = (startDateStr, targetDateStr) => {
  if (!startDateStr || !targetDateStr) return 'Day 1';
  try {
    const start = new Date(startDateStr);
    const target = new Date(targetDateStr);
    start.setHours(0,0,0,0);
    target.setHours(0,0,0,0);
    
    const diffTime = target - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Pre-Trip';
    return `Day ${diffDays + 1}`;
  } catch (e) {
    return 'Day 1';
  }
};