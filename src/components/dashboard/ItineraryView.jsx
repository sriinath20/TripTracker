import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapPin, GripVertical, Clock, Pencil, Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { useTripContext } from '../../context/TripContext';
import { ITINERARY_TYPES } from '../../utils/appUtils';
import { ItineraryFormModal } from '../modals/ItineraryFormModal';

export const ItineraryView = ({ isDarkMode, themeClasses }) => {
  const { activeTrip, itinerary, actions } = useTripContext();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- Local State for Drag & Drop ---
  const [localItems, setLocalItems] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragItemIndex = useRef(null);
  const dragOverItemIndex = useRef(null);
  
  const scrollContainerRef = useRef(null);
  const scrollInterval = useRef(null);

  // Helper: Format Time
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  // 1. Calculate Days
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

  // 2. Sync Local State with Context (when not dragging)
  useEffect(() => {
    if (!isDragging) {
      setLocalItems(currentDay.items);
    }
  }, [currentDay.items, isDragging]);

  // --- CRUD Handlers ---
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

  // --- Drag & Drop Handlers (Sortable List Style) ---

  const stopAutoScroll = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  const handleDragStart = (e, index) => {
    setIsDragging(true);
    dragItemIndex.current = index;
    dragOverItemIndex.current = index;
    // e.dataTransfer.effectAllowed = "move"; 
    // Hack to remove ghost image if desired, otherwise standard ghost is fine
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    
    const container = scrollContainerRef.current;
    if (container) {
      const { top, bottom, height } = container.getBoundingClientRect();
      const mouseY = e.clientY;
      
      // Auto Scroll Zones (Top 15% and Bottom 15%)
      const zoneSize = 100; // px
      
      stopAutoScroll();

      if (mouseY < top + zoneSize) {
        // Scroll Up
        scrollInterval.current = setInterval(() => {
          container.scrollTop -= 10;
        }, 16);
      } else if (mouseY > bottom - zoneSize) {
        // Scroll Down
        scrollInterval.current = setInterval(() => {
          container.scrollTop += 10;
        }, 16);
      }
    }
  };

  const handleDragEnter = (e, index) => {
    // This function handles the reordering (swapping) logic visual
    dragOverItemIndex.current = index;
    
    const draggedIdx = dragItemIndex.current;
    if (draggedIdx === null || draggedIdx === index) return;

    // Create a copy and swap items locally for visual feedback
    const newList = [...localItems];
    const item = newList[draggedIdx];
    
    // Remove from old index
    newList.splice(draggedIdx, 1);
    // Insert at new index
    newList.splice(index, 0, item);
    
    setLocalItems(newList);
    dragItemIndex.current = index; // Update reference to track new position
  };

  const handleDrop = (e) => {
    e.preventDefault();
    stopAutoScroll();
    
    // Commit changes to Context
    if (dragItemIndex.current !== null) {
      actions.updateItineraryDay(currentDay.id, localItems);
    }
    
    setIsDragging(false);
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
  };

  const handleDragEnd = () => {
    stopAutoScroll();
    setIsDragging(false);
    // If dropped, handleDrop handles save. If cancelled, this resets local state via useEffect dependency
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
  };

  // Manual Move for Mobile
  const handleManualMove = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= localItems.length) return;
    const newItems = [...localItems];
    const temp = newItems[index];
    newItems[index] = newItems[newIndex];
    newItems[newIndex] = temp;
    actions.updateItineraryDay(currentDay.id, newItems);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 relative">
      
      {/* Day Selector */}
      <div className="flex overflow-x-auto p-4 gap-3 no-scrollbar mb-2 flex-shrink-0">
        {days.map((day, idx) => {
            const dateObj = new Date(day.date);
            const dateDisplay = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDayIndex(idx)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-center transition-all border ${
                  selectedDayIndex === idx
                  ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105'
                  : `${themeClasses.card} text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800`
                }`}
              >
                <div className={`text-sm font-bold ${selectedDayIndex === idx ? 'text-white' : themeClasses.text}`}>
                    {dateDisplay}
                </div>
                <div className={`text-xs uppercase tracking-wide mt-0.5 ${selectedDayIndex === idx ? 'text-slate-400' : 'text-slate-400'}`}>
                    {day.dayLabel}
                </div>
              </button>
            );
        })}
      </div>

      {/* Timeline Container */}
      <div 
        ref={scrollContainerRef}
        onDragOver={handleDragOver} // Handle scroll on container
        className={`flex-1 rounded-2xl border p-4 sm:p-6 overflow-y-auto relative min-h-[400px] pb-24 ${themeClasses.card}`}
      >
        <div className="absolute left-6 sm:left-8 top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
        
        <div className="space-y-4 relative">
          {localItems.length === 0 ? (
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
            localItems.map((item, idx) => {
              const typeConfig = ITINERARY_TYPES[item.type] || ITINERARY_TYPES.place;
              // Check if this item is currently being dragged (ghost)
              const isBeingDragged = isDragging && dragItemIndex.current === idx;
              
              return (
                <div 
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragEnter={(e) => handleDragEnter(e, idx)} // Swap trigger
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop} // Commit trigger
                  onDragOver={(e) => e.preventDefault()} // Allow drop
                  className={`relative pl-8 sm:pl-10 group transition-transform duration-200 ${isBeingDragged ? 'opacity-50 scale-95' : 'opacity-100'}`}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 top-3 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 shadow-sm z-10 ${typeConfig.bg}`}></div>
                  
                  {/* Card */}
                  <div className={`p-4 rounded-xl border transition-all ${
                      isBeingDragged 
                        ? 'border-dashed border-slate-400 bg-slate-50 dark:bg-slate-800/30' 
                        : isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100 shadow-sm'
                    } ${!isBeingDragged && 'group-hover:border-slate-300 dark:group-hover:border-slate-600'}`}>
                     
                     <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                           {/* Drag Handle */}
                           <div className="cursor-grab text-slate-300 hover:text-slate-500 hidden sm:flex items-center pt-1 active:cursor-grabbing">
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
                        <div className="flex items-center gap-3 mr-4">
                            <div className="flex flex-col sm:hidden mr-2">
                                <button onClick={() => handleManualMove(idx, -1)} className="p-1 text-slate-300 hover:text-blue-500 disabled:opacity-30" disabled={idx===0}><ArrowUp size={14}/></button>
                                <button onClick={() => handleManualMove(idx, 1)} className="p-1 text-slate-300 hover:text-blue-500 disabled:opacity-30" disabled={idx===localItems.length-1}><ArrowDown size={14}/></button>
                            </div>

                            <button 
                              onClick={() => { setEditingItem({ item }); setIsModalOpen(true); }}
                              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}
                            >
                              <Pencil size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(item.id)}
                              className={`p-2 rounded-full transition-colors hover:bg-red-50 hover:text-red-500 text-slate-300`}
                            >
                              <Trash2 size={18} />
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