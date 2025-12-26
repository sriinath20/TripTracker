import React, { useState, useMemo } from 'react';
import { MapPin, GripVertical, Clock, Pencil, Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { useTripContext } from '../../context/TripContext';
import { ITINERARY_TYPES } from '../../utils/appUtils';
import { ItineraryFormModal } from '../modals/ItineraryFormModal';

export const ItineraryView = ({ isDarkMode, themeClasses }) => {
  const { activeTrip, itinerary, actions } = useTripContext();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [editingItem, setEditingItem] = useState(null); // { dayId, item }
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper: Format Time to AM/PM
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  // Initialize/Sync Itinerary Data structure with current trip duration
  const days = useMemo(() => {
    const arr = [];
    const duration = Math.max(1, activeTrip.duration || 1);
    const startDate = new Date(activeTrip.startDate);
    
    for (let i = 0; i < duration; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      const label = `Day ${i + 1}`;
      
      const existing = itinerary.find(d => d.id === `day-${i}`) || { items: [] };
      arr.push({
        id: `day-${i}`,
        dayLabel: label,
        date: dateStr,
        items: existing.items || []
      });
    }
    return arr;
  }, [activeTrip.duration, activeTrip.startDate, itinerary]);

  const currentDay = days[selectedDayIndex] || days[0];

  // --- Handlers ---
  const handleSaveItem = (formData) => {
    const newItems = [...currentDay.items];
    if (editingItem && editingItem.item) {
      const idx = newItems.findIndex(i => i.id === editingItem.item.id);
      if(idx !== -1) newItems[idx] = { ...editingItem.item, ...formData };
    } else {
      newItems.push({ id: crypto.randomUUID(), ...formData });
    }
    actions.updateItineraryDay(currentDay.id, newItems);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId) => {
    if(confirm("Remove this item?")) {
      const newItems = currentDay.items.filter(i => i.id !== itemId);
      actions.updateItineraryDay(currentDay.id, newItems);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    const newItems = [...currentDay.items];
    const [movedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(targetIndex, 0, movedItem);
    
    actions.updateItineraryDay(currentDay.id, newItems);
  };

  const handleMove = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= currentDay.items.length) return;
    
    const newItems = [...currentDay.items];
    const temp = newItems[index];
    newItems[index] = newItems[newIndex];
    newItems[newIndex] = temp;
    actions.updateItineraryDay(currentDay.id, newItems);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 relative">
      
      {/* Day Selector */}
      <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar mb-2 flex-shrink-0">
        {days.map((day, idx) => (
          <button
            key={day.id}
            onClick={() => setSelectedDayIndex(idx)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              selectedDayIndex === idx
              ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105'
              : `${themeClasses.card} ${themeClasses.subText} hover:bg-slate-100 dark:hover:bg-slate-800`
            }`}
          >
            <div className="text-xs opacity-70">{new Date(day.date).toLocaleDateString(undefined, {weekday:'short'})}</div>
            <div>{day.dayLabel}</div>
          </button>
        ))}
      </div>

      {/* Timeline Container */}
      <div className={`flex-1 rounded-2xl border p-4 sm:p-6 overflow-y-auto relative min-h-[400px] pb-24 ${themeClasses.card}`}>
        <div className="absolute left-6 sm:left-8 top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
        
        <div className="space-y-6 relative">
          {currentDay.items.length === 0 ? (
             <div className="text-center py-20 pl-8">
                <MapPin className="mx-auto text-slate-300 mb-2" size={32}/>
                <p className="text-slate-400 italic">No plans yet for {currentDay.dayLabel}.</p>
                <button 
                  onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                  className="mt-4 text-emerald-500 font-bold text-sm hover:underline"
                >
                  Start Planning
                </button>
             </div>
          ) : (
            currentDay.items.map((item, idx) => {
              const typeConfig = ITINERARY_TYPES[item.type] || ITINERARY_TYPES.place;
              
              return (
                <div 
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, idx)}
                  className="relative pl-8 sm:pl-10 group"
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 top-3 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 shadow-sm z-10 ${typeConfig.bg}`}></div>
                  
                  {/* Card */}
                  <div className={`p-4 rounded-xl border transition-all hover:shadow-md ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100 shadow-sm'} group-hover:border-slate-300 dark:group-hover:border-slate-600`}>
                     <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                           {/* Drag Handle (Desktop) */}
                           <div className="cursor-grab text-slate-300 hover:text-slate-500 hidden sm:flex items-center pt-1">
                              <GripVertical size={16} />
                           </div>

                           <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'} ${typeConfig.color}`}>
                                  {typeConfig.label}
                                </span>
                                {(item.startTime || item.endTime) && (
                                  <span className={`text-xs font-mono font-medium flex items-center gap-1 ${themeClasses.subText}`}>
                                    <Clock size={10} />
                                    {formatTime(item.startTime)} {item.endTime ? `- ${formatTime(item.endTime)}` : ''}
                                  </span>
                                )}
                              </div>
                              <h4 className={`font-bold ${themeClasses.text} text-base sm:text-lg`}>{item.title}</h4>
                              {item.notes && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.notes}</p>}
                           </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {/* Mobile Reorder Buttons */}
                            <div className="flex flex-col sm:hidden mr-2">
                                <button onClick={() => handleMove(idx, -1)} className="p-1 text-slate-300 hover:text-blue-500 disabled:opacity-30" disabled={idx===0}><ArrowUp size={14}/></button>
                                <button onClick={() => handleMove(idx, 1)} className="p-1 text-slate-300 hover:text-blue-500 disabled:opacity-30" disabled={idx===currentDay.items.length-1}><ArrowDown size={14}/></button>
                            </div>

                            <button 
                              onClick={() => { setEditingItem({ item }); setIsModalOpen(true); }}
                              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(item.id)}
                              className={`p-2 rounded-full transition-colors hover:bg-red-50 hover:text-red-500 text-slate-300`}
                            >
                              <Trash2 size={16} />
                            </button>
                        </div>
                     </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10 pointer-events-none">
         <button 
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-emerald-900/20 active:scale-95 transition-all pointer-events-auto transform hover:-translate-y-1"
         >
           <Plus size={20} /> Add to Timeline
         </button>
      </div>

      <ItineraryFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingItem?.item}
        onSave={handleSaveItem}
        isDarkMode={isDarkMode}
        themeClasses={themeClasses}
      />
    </div>
  );
};