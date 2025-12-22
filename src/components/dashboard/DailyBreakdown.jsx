import React, { useState } from 'react';
import { BarChart3, ChevronRight, ArrowLeft, CreditCard } from 'lucide-react';
import { useTripContext } from '../../context/TripContext';
import { getDailyBreakdown } from '../../utils/mathUtils';
import { categoryColors, categories, methodColors } from '../../utils/appUtils';

export const DailyBreakdown = ({ isDarkMode, themeClasses }) => {
  const { expenses, activeTrip } = useTripContext();
  const [selectedDay, setSelectedDay] = useState(null);

  const days = Array.from({ length: Math.max(1, activeTrip.duration || 1) }, (_, i) => `Day ${i + 1}`);
  const allDayOptions = ['Pre-Trip', ...days];
  
  const dailyBreakdown = getDailyBreakdown(expenses, allDayOptions);

  // Helper to get method stats for a specific day
  const getDayMethodStats = (dayExpenses) => {
    const total = dayExpenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const methods = {};
    dayExpenses.forEach(e => {
       methods[e.method] = (methods[e.method] || 0) + (parseFloat(e.amount) || 0);
    });
    return Object.entries(methods)
      .map(([name, amount]) => ({ name, amount, percent: total > 0 ? (amount / total) * 100 : 0 }))
      .sort((a, b) => b.amount - a.amount);
  };

  return (
    <div className="p-4 md:p-8 h-full">
      {/* ANIMATION: We use a simple fade transition using a key property. 
          When !selectedDay, we show the list.
      */}
      {!selectedDay ? (
        <div className="flex flex-col items-center animate-[fadeIn_0.3s_ease-out]">
          <div className="flex justify-between items-center w-full max-w-2xl mb-6">
             <h2 className={`text-xl font-bold flex items-center gap-2 ${themeClasses.text}`}>
               <BarChart3 className="text-blue-500" /> Daily Spending
             </h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map(cat => (
              <div key={cat} className="flex items-center gap-1.5 transition-transform hover:scale-105">
                <div className={`w-3 h-3 rounded-full ${categoryColors[cat].split(' ')[0]}`}></div>
                <span className="text-xs text-slate-500 font-medium">{cat}</span>
              </div>
            ))}
          </div>

          <div className="w-full max-w-2xl space-y-4">
            {dailyBreakdown.some(d => d.total > 0) ? (
              dailyBreakdown.map((dayItem, index) => (
                <div 
                    key={index} 
                    className="group cursor-pointer transform transition-all duration-200 hover:-translate-y-1" 
                    onClick={() => setSelectedDay(dayItem)}
                    style={{ animationDelay: `${index * 50}ms` }} // Staggered entrance
                >
                  <div className="flex justify-between text-sm mb-1 px-1">
                    <span className="font-bold text-slate-500 group-hover:text-blue-500 transition-colors flex items-center gap-1">{dayItem.day} <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></span>
                    <span className={`font-bold ${themeClasses.text}`}>{activeTrip.currency}{dayItem.total}</span>
                  </div>
                  <div className={`flex-grow h-8 rounded-full overflow-hidden relative flex hover:shadow-lg transition-shadow ${themeClasses.progressBarBg}`}>
                    {dayItem.stacks.length > 0 ? (
                      dayItem.stacks.map((stack, i) => (
                        <div key={i} className={`h-full ${categoryColors[stack.category].split(' ')[0]} border-r border-white/20 last:border-0`} style={{ width: `${stack.percent}%` }} title={`${stack.category}: ${activeTrip.currency}${stack.amount}`}></div>
                      ))
                    ) : (
                      <div className={`w-full h-full ${themeClasses.progressBarBg}`}></div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 italic py-12">No data yet.</div>
            )}
          </div>
        </div>
      ) : (
        // Detailed Day View
        <div className="animate-[slideInRight_0.3s_ease-out]">
          <button 
            onClick={() => setSelectedDay(null)} 
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Overview
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl border ${themeClasses.card} shadow-sm space-y-6`}>
               <div>
                   <h3 className={`text-xl font-bold mb-1 ${themeClasses.text}`}>{selectedDay.day} Summary</h3>
                   <p className="text-3xl font-bold text-emerald-600">{activeTrip.currency}{selectedDay.total.toLocaleString()}</p>
               </div>
               
               {/* Categories Breakdown */}
               <div>
                   <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">By Category</h4>
                   <div className="space-y-3">
                      {selectedDay.stacks.map((stack, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1"><span className="text-slate-500">{stack.category}</span><span className="font-bold">{activeTrip.currency}{stack.amount}</span></div>
                          <div className={`w-full rounded-full h-1.5 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}><div className={`h-1.5 rounded-full ${categoryColors[stack.category].split(' ')[0]}`} style={{ width: `${stack.percent}%` }}></div></div>
                        </div>
                      ))}
                   </div>
               </div>

               {/* New Feature: Payment Method Breakdown */}
               <div className="pt-4 border-t border-dashed border-slate-300 dark:border-slate-700">
                   <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><CreditCard size={12}/> By Payment Method</h4>
                   <div className="space-y-3">
                      {getDayMethodStats(selectedDay.expenses).map((method, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1"><span className="text-slate-500">{method.name}</span><span className="font-bold">{activeTrip.currency}{method.amount}</span></div>
                          <div className={`w-full rounded-full h-1.5 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                              <div className={`h-1.5 rounded-full ${methodColors[method.name] || 'bg-slate-400'}`} style={{ width: `${method.percent}%` }}></div>
                          </div>
                        </div>
                      ))}
                   </div>
               </div>
            </div>

            <div className="md:col-span-2">
               <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Transactions</h3>
               {selectedDay.expenses.length > 0 ? (
                 <div className={`border rounded-lg overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                   <table className="w-full text-left">
                     <thead className={`text-xs uppercase text-slate-500 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}><tr><th className="p-3">Category</th><th className="p-3">Description</th><th className="p-3 text-right">Amount</th></tr></thead>
                     <tbody className={`divide-y text-sm ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                       {selectedDay.expenses.map(exp => (
                         <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                           <td className="p-3 flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${categoryColors[exp.category].split(' ')[0]}`}></div>{exp.category}</td>
                           <td className="p-3 text-slate-500">{exp.description || '-'}</td>
                           <td className="p-3 text-right font-medium">{activeTrip.currency}{exp.amount}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               ) : (
                 <p className="text-slate-400 italic">No transactions recorded for this day.</p>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};