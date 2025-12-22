import React, { useState } from 'react';
import { Wallet, BarChart3, PieChart } from 'lucide-react';
import { BudgetOverview } from './BudgetOverview';
import { ExpenseTable } from './ExpenseTable';
import { DailyBreakdown } from './DailyBreakdown';
import { StatsPanel } from './StatsPanel';

export const Dashboard = ({ isDarkMode, themeClasses }) => {
  const [activeTab, setActiveTab] = useState('transactions');

  return (
    <div className="flex-1 p-3 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 pb-20">
        
        {/* Left Col: Overview */}
        <div className="lg:col-span-1 space-y-4 md:space-y-6">
          <BudgetOverview isDarkMode={isDarkMode} themeClasses={themeClasses} />
        </div>

        {/* Right Col: Tabs & Content */}
        <div className="lg:col-span-3 flex flex-col h-full">
          {/* Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'transactions', icon: Wallet, label: 'Transactions' },
              { id: 'daily', icon: BarChart3, label: 'Daily Analysis' },
              { id: 'stats', icon: PieChart, label: 'Stats & Insights' },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : isDarkMode 
                    ? 'bg-slate-900 text-slate-400 hover:bg-slate-800' 
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Main Card */}
          <div className={`rounded-xl shadow-sm border flex flex-col min-h-[600px] relative ${themeClasses.card}`}>
            {activeTab === 'transactions' && (
              <ExpenseTable isDarkMode={isDarkMode} themeClasses={themeClasses} />
            )}
            {activeTab === 'daily' && (
              <DailyBreakdown isDarkMode={isDarkMode} themeClasses={themeClasses} />
            )}
            {activeTab === 'stats' && (
              <StatsPanel isDarkMode={isDarkMode} themeClasses={themeClasses} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};