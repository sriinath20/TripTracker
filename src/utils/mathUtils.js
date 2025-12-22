import { categories, methods } from './appUtils';

export const calculateTotalSpent = (expenses) => {
  return expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
};

export const getCategoryBreakdown = (expenses) => {
  const totalSpent = calculateTotalSpent(expenses);
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

export const getMethodBreakdown = (expenses) => {
  const totalSpent = calculateTotalSpent(expenses);
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

export const getDailyBreakdown = (expenses, allDayOptions) => {
  return allDayOptions.map(day => {
    const dayExpenses = expenses.filter(e => e.day === day);
    const total = dayExpenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const stacks = categories.map(cat => {
      const catTotal = dayExpenses.filter(e => e.category === cat).reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      return { category: cat, amount: catTotal, percent: total > 0 ? (catTotal / total) * 100 : 0 };
    }).filter(s => s.amount > 0);
    return { day, total, stacks, expenses: dayExpenses };
  });
};