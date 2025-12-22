import React from 'react';
import { PieChart, CreditCard } from 'lucide-react';
import { useTripContext } from '../../context/TripContext';
import { getCategoryBreakdown, getMethodBreakdown } from '../../utils/mathUtils';
import { categoryColors, methodColors } from '../../utils/appUtils';

export const StatsPanel = ({ isDarkMode, themeClasses }) => {
  const { expenses, activeTrip } = useTripContext();
  const catBreakdown = getCategoryBreakdown(expenses);
  const methodBreakdown = getMethodBreakdown(expenses);

  return (
    <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
       
       {/* Category Breakdown */}
       <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
          <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${themeClasses.text}`}>
            <PieChart className="text-purple-500" size={20} /> Spending by Category
          </h3>
          <div className="space-y-4">
              {catBreakdown.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={`font-medium ${categoryColors[cat.name].split(' ')[1]}`}>{cat.name}</span>
                    <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{activeTrip.currency}{cat.total.toLocaleString()}</span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                    <div className={`h-2 rounded-full opacity-90 ${categoryColors[cat.name].split(' ')[0]}`} style={{ width: `${cat.percentage}%` }}></div>
                  </div>
                </div>
              ))}
              {catBreakdown.length === 0 && <p className="text-slate-400 italic">No data yet.</p>}
          </div>
       </div>

       {/* Payment Method Breakdown */}
       <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
          <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${themeClasses.text}`}>
            <CreditCard className="text-emerald-500" size={20} /> Payment Methods
          </h3>
          <div className="space-y-4">
              {methodBreakdown.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-500">{item.name}</span>
                    <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{activeTrip.currency}{item.total.toLocaleString()}</span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                    <div className={`h-2 rounded-full opacity-90 ${methodColors[item.name] || 'bg-slate-400'}`} style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
              {methodBreakdown.length === 0 && <p className="text-slate-400 italic">No data yet.</p>}
          </div>
       </div>
    </div>
  );
};