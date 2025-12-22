import React, { useRef, useState } from 'react';
import { Trash2, Plus, Filter } from 'lucide-react';
import { useTripContext } from '../../context/TripContext';
import { categories, methods, getCalculatedDate, getDayFromDate } from '../../utils/appUtils';
import { playCrunchSound } from '../../utils/feedbackUtils';

export const ExpenseTable = ({ isDarkMode, themeClasses }) => {
  const { expenses, activeTrip, actions, setData } = useTripContext();
  const [filterCategory, setFilterCategory] = useState('All');
  const rowRefs = useRef({});

  const updateExpense = (id, field, value) => {
    setData(prev => {
      const currentExps = prev.expensesMap[prev.activeId] || [];
      const updatedExps = currentExps.map(exp => {
        if (exp.id === id) {
          const updates = { [field]: value };
          if (field === 'day') {
            updates.date = getCalculatedDate(activeTrip.startDate, value);
          } else if (field === 'date') {
            updates.day = getDayFromDate(activeTrip.startDate, value);
          }
          return { ...exp, ...updates };
        }
        return exp;
      });
      return { ...prev, expensesMap: { ...prev.expensesMap, [prev.activeId]: updatedExps } };
    });
  };

  const addRow = () => {
    setData(prev => {
      const currentExps = prev.expensesMap[prev.activeId] || [];
      const newId = currentExps.length > 0 ? Math.max(...currentExps.map(e => e.id)) + 1 : 1;
      
      let defaultDate = activeTrip.startDate;
      let defaultDay = 'Day 1';

      if (currentExps.length > 0) {
        const lastExpense = currentExps[currentExps.length - 1];
        defaultDate = lastExpense.date;
        defaultDay = lastExpense.day;
      }

      const newExpense = { 
        id: newId, 
        date: defaultDate, 
        day: defaultDay, 
        category: 'Food', 
        description: '', 
        amount: '', 
        method: 'Cash' 
      };

      return {
        ...prev,
        expensesMap: {
          ...prev.expensesMap,
          [prev.activeId]: [...currentExps, newExpense]
        }
      };
    });
  };

  const initiateDeleteRow = (id) => {
    if (confirm("Delete this transaction?")) {
        playCrunchSound();
        setData(prev => ({
            ...prev,
            expensesMap: {
              ...prev.expensesMap,
              [prev.activeId]: (prev.expensesMap[prev.activeId] || []).filter(e => e.id !== id)
            }
        }));
    }
  };

  const setRef = (id, field, el) => {
    if (!rowRefs.current[id]) rowRefs.current[id] = {};
    rowRefs.current[id][field] = el;
  };

  const handleKeyDown = (e, id, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (field === 'description') {
         setTimeout(() => rowRefs.current[id]?.method?.focus(), 300);
      } else if (field === 'amount') {
         e.target.blur();
         setTimeout(addRow, 150);
      }
    }
  };

  const filteredExpenses = filterCategory === 'All' ? expenses : expenses.filter(e => e.category === filterCategory);
  const days = Array.from({ length: Math.max(1, activeTrip.duration || 1) }, (_, i) => `Day ${i + 1}`);
  const allDayOptions = ['Pre-Trip', ...days];

  return (
    <>
      <div className={`p-4 md:p-5 border-b flex justify-between items-center gap-4 ${themeClasses.border}`}>
        <div className="relative group w-full md:w-48">
          <select 
             value={filterCategory} 
             onChange={(e) => setFilterCategory(e.target.value)} 
             className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm font-medium outline-none appearance-none cursor-pointer ${themeClasses.input}`}
          >
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <Filter size={14} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="overflow-x-auto flex-grow p-1 pb-20">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className={`sticky top-0 z-10 shadow-sm ${themeClasses.tableHeader}`}>
            <tr className="text-xs uppercase tracking-wider">
              <th className={`p-4 font-semibold w-36 border-b ${themeClasses.border}`}>Date</th>
              <th className={`p-4 font-semibold w-28 border-b ${themeClasses.border}`}>Day</th>
              <th className={`p-4 font-semibold w-40 border-b ${themeClasses.border}`}>Category</th>
              <th className={`p-4 font-semibold border-b ${themeClasses.border}`}>Description</th>
              <th className={`p-4 font-semibold w-32 border-b ${themeClasses.border}`}>Method</th>
              <th className={`p-4 font-semibold w-32 text-right border-b ${themeClasses.border}`}>Amount</th>
              <th className={`p-4 font-semibold w-16 border-b ${themeClasses.border}`}></th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-50'}`}>
            {filteredExpenses.map((expense) => (
              <tr key={expense.id} className={`group transition-colors ${themeClasses.tableRowHover}`}>
                <td className="p-2 pl-4">
                  <input 
                    type="date" 
                    value={expense.date} 
                    onChange={(e) => {
                      updateExpense(expense.id, 'date', e.target.value);
                      // REMOVED blur() here to prevent keyboard dismissal fighting
                      setTimeout(() => {
                          if (rowRefs.current[expense.id]?.category) {
                              rowRefs.current[expense.id].category.focus();
                          }
                      }, 500); // Increased timeout slightly for better Android compatibility
                    }} 
                    className={`w-full p-1.5 rounded text-sm border border-transparent focus:ring-2 focus:ring-blue-100 outline-none bg-transparent ${themeClasses.tableInput}`} 
                  />
                </td>
                <td className="p-2">
                  <select 
                    value={expense.day} 
                    onChange={(e) => updateExpense(expense.id, 'day', e.target.value)} 
                    className={`w-full p-2 rounded text-sm border border-transparent focus:ring-2 focus:ring-blue-100 outline-none bg-transparent cursor-pointer ${themeClasses.tableInput}`}
                  >
                    {allDayOptions.map(d => <option key={d} value={d}>{d}</option>)}
                    {!allDayOptions.includes(expense.day) && <option value={expense.day}>{expense.day}</option>}
                  </select>
                </td>
                <td className="p-2">
                  <select 
                    ref={(el) => setRef(expense.id, 'category', el)}
                    value={expense.category} 
                    onChange={(e) => {
                      updateExpense(expense.id, 'category', e.target.value);
                      setTimeout(() => rowRefs.current[expense.id]?.description?.focus(), 200);
                    }} 
                    className={`w-full p-2 rounded text-sm border border-transparent focus:ring-2 focus:ring-blue-100 outline-none bg-transparent cursor-pointer ${themeClasses.tableInput}`}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </td>
                <td className="p-2">
                  <input 
                    ref={(el) => setRef(expense.id, 'description', el)}
                    type="text" 
                    placeholder="Description..." 
                    value={expense.description} 
                    onChange={(e) => updateExpense(expense.id, 'description', e.target.value)} 
                    onKeyDown={(e) => handleKeyDown(e, expense.id, 'description')}
                    className={`w-full p-2 rounded text-sm border border-transparent focus:ring-2 focus:ring-blue-100 outline-none bg-transparent ${themeClasses.tableInput}`} 
                  />
                </td>
                <td className="p-2">
                  <select 
                    ref={(el) => setRef(expense.id, 'method', el)}
                    value={expense.method} 
                    onChange={(e) => {
                      updateExpense(expense.id, 'method', e.target.value);
                      setTimeout(() => rowRefs.current[expense.id]?.amount?.focus(), 200);
                    }} 
                    className={`w-full p-2 rounded text-sm border border-transparent focus:ring-2 focus:ring-blue-100 outline-none bg-transparent cursor-pointer ${themeClasses.tableInput}`}
                  >
                    {methods.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </td>
                <td className="p-2">
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-slate-400 text-sm">{activeTrip.currency}</span>
                    <input 
                      ref={(el) => setRef(expense.id, 'amount', el)}
                      type="number" 
                      value={expense.amount} 
                      onChange={(e) => updateExpense(expense.id, 'amount', e.target.value)} 
                      onKeyDown={(e) => handleKeyDown(e, expense.id, 'amount')}
                      className={`w-full p-2 pl-6 font-mono font-medium text-right text-sm rounded border border-transparent focus:ring-2 focus:ring-blue-100 outline-none bg-transparent ${themeClasses.tableInput}`} 
                      placeholder="0.00" 
                    />
                  </div>
                </td>
                <td className="p-2 text-center">
                  <button onClick={() => initiateDeleteRow(expense.id)} className="text-slate-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all opacity-100 md:opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {filteredExpenses.length === 0 && (
              <tr><td colSpan="7" className="p-12 text-center text-slate-400 italic">No transactions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={`p-4 border-t rounded-b-xl flex justify-center sticky bottom-0 z-10 w-full backdrop-blur-sm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] ${isDarkMode ? 'border-slate-800 bg-slate-900/95' : 'border-slate-100 bg-white/95'}`}>
        <button onClick={addRow} className="flex items-center gap-2 text-white bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-full transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-lg"><Plus size={24} /> Add Item</button>
      </div>
    </>
  );
};