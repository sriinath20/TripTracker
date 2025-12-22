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

// CHECK THIS BLOCK
export const methodColors = {
  Cash: 'bg-emerald-500',
  Card: 'bg-purple-600',
  UPI: 'bg-blue-500',
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

// --- Math & Stats Helpers ---

export const calculateCategoryBreakdown = (expenses, totalSpent) => {
  return categories.map(cat => {
    const catTotal = expenses
      .filter(e => e.category === cat)
      .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    return { 
        name: cat, 
        total: catTotal, 
        percentage: totalSpent > 0 ? (catTotal / totalSpent) * 100 : 0 
    };
  }).filter(item => item.total > 0).sort((a, b) => b.total - a.total);
};

export const calculateMethodBreakdown = (expenses, totalSpent) => {
  return methods.map(method => {
    const total = expenses
      .filter(e => e.method === method)
      .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    return { 
        name: method, 
        total, 
        percentage: totalSpent > 0 ? (total / totalSpent) * 100 : 0 
    };
  }).filter(item => item.total > 0).sort((a, b) => b.total - a.total);
};

export const calculateDailyBreakdown = (expenses, allDayOptions) => {
  return allDayOptions.map(day => {
    const dayExpenses = expenses.filter(e => e.day === day);
    const total = dayExpenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const stacks = categories.map(cat => {
      const catTotal = dayExpenses
          .filter(e => e.category === cat)
          .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      return { 
          category: cat, 
          amount: catTotal, 
          percent: total > 0 ? (catTotal / total) * 100 : 0 
      };
    }).filter(s => s.amount > 0);
    
    return { day, total, stacks, expenses: dayExpenses };
  });
};