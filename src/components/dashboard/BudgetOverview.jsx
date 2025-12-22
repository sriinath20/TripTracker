import React from 'react';
import { useTripContext } from '../../context/TripContext';

export const BudgetOverview = ({ isDarkMode, themeClasses }) => {
  const { activeTrip, expenses } = useTripContext();

  const totalSpent = expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const budget = Number(activeTrip.budget) || 0;
  const remaining = budget - totalSpent;
  const percentSpent = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;

  const getStatusColor = () => {
    if (percentSpent > 90) return 'bg-red-500';
    if (percentSpent > 75) return 'bg-orange-500';
    return 'bg-emerald-500';
  };

  return (
    <div className={`p-4 md:p-6 rounded-xl shadow-sm border ${themeClasses.card}`}>
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Budget Overview</h2>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-end mb-1">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Remaining</span>
            <span className={`text-2xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
              {remaining < 0 ? '-' : ''}{activeTrip.currency}{Math.abs(remaining).toLocaleString()}
            </span>
          </div>
          <div className={`w-full rounded-full h-3 overflow-hidden ${themeClasses.progressBarBg}`}>
            <div className={`h-full transition-all duration-500 ${getStatusColor()}`} style={{ width: `${percentSpent}%` }}></div>
          </div>
        </div>
        <div className={`grid grid-cols-2 gap-4 pt-4 border-t ${themeClasses.border}`}>
            <div>
              <div className="text-xs text-slate-400 mb-1">Total Budget</div>
              <div className={`font-bold ${themeClasses.text}`}>{activeTrip.currency}{budget.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 mb-1">Spent So Far</div>
              <div className={`font-bold ${themeClasses.text}`}>{activeTrip.currency}{totalSpent.toLocaleString()}</div>
            </div>
        </div>
      </div>
    </div>
  );
};