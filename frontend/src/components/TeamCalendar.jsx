import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, Clock, X, Info } from 'lucide-react';

const TeamCalendar = ({ projects = [], tasks = [], employees = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'agenda'
  const [filterProject, setFilterProject] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // { type: 'project' | 'task', data: obj }

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Format date helper
  const formatDateString = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Navigations
  const handlePrev = () => {
    setCurrentDate(prev => {
      const next = new Date(prev);
      if (viewMode === 'month') {
        next.setMonth(next.getMonth() - 1);
      } else if (viewMode === 'week') {
        next.setDate(next.getDate() - 7);
      } else {
        next.setMonth(next.getMonth() - 1);
      }
      return next;
    });
  };

  const handleNext = () => {
    setCurrentDate(prev => {
      const next = new Date(prev);
      if (viewMode === 'month') {
        next.setMonth(next.getMonth() + 1);
      } else if (viewMode === 'week') {
        next.setDate(next.getDate() + 7);
      } else {
        next.setMonth(next.getMonth() + 1);
      }
      return next;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Filter logic
  const filteredProjects = projects.filter(p => {
    if (filterProject && p._id !== filterProject) return false;
    return true;
  });

  const filteredTasks = tasks.filter(t => {
    if (filterProject && t.project?._id !== filterProject) return false;
    if (filterEmployee && t.assignedTo?._id !== filterEmployee) return false;
    return true;
  });

  // Calculate current Month Grid
  const getMonthGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    // Adjust so Mon is 0, Sun is 6
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek < 0) startDayOfWeek = 6;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];

    // Prev month padding
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, daysInPrevMonth - i);
      cells.push({ date: d, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      cells.push({ date: d, isCurrentMonth: true });
    }

    // Next month padding to fill 42 cells
    const totalCells = 42;
    const paddingNeeded = totalCells - cells.length;
    for (let i = 1; i <= paddingNeeded; i++) {
      const d = new Date(year, month + 1, i);
      cells.push({ date: d, isCurrentMonth: false });
    }

    return cells;
  };

  // Get current Week Days (starting Monday)
  const getWeekDays = () => {
    const day = currentDate.getDay();
    // Monday offset
    const offset = day === 0 ? -6 : 1 - day;
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() + offset);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  };

  // Check if dates fall on cell
  const getEventsForDate = (date) => {
    const dateStr = formatDateString(date);
    const dayEvents = [];

    // Projects starting or ending on this day, or active
    filteredProjects.forEach(p => {
      const startStr = formatDateString(p.startDate);
      const endStr = formatDateString(p.endDate);
      if (dateStr === startStr) {
        dayEvents.push({ type: 'project', label: `Start: ${p.name}`, color: 'bg-indigo-600/30 border-indigo-500/50 text-indigo-400', raw: p });
      } else if (dateStr === endStr) {
        dayEvents.push({ type: 'project', label: `End: ${p.name}`, color: 'bg-rose-600/30 border-rose-500/50 text-rose-400', raw: p });
      } else if (dateStr > startStr && dateStr < endStr) {
        dayEvents.push({ type: 'project', label: `Active: ${p.name}`, color: 'bg-blue-900/20 border-blue-800/40 text-blue-400', raw: p });
      }
    });

    // Tasks due
    filteredTasks.forEach(t => {
      const dueStr = formatDateString(t.dueDate);
      if (dateStr === dueStr) {
        const priorityColor = t.priority === 'High' ? 'bg-rose-950/40 border-rose-800/50 text-rose-400' : t.priority === 'Medium' ? 'bg-amber-950/40 border-amber-800/50 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-400';
        dayEvents.push({ type: 'task', label: `Task: ${t.title}`, color: priorityColor, raw: t });
      }
    });

    return dayEvents;
  };

  const getAgendaItems = () => {
    const items = [];
    
    filteredProjects.forEach(p => {
      items.push({
        date: new Date(p.endDate),
        title: `Project Target: ${p.name}`,
        desc: p.description,
        type: 'project',
        raw: p
      });
    });

    filteredTasks.forEach(t => {
      items.push({
        date: new Date(t.dueDate),
        title: `Task Due: ${t.title}`,
        desc: t.description,
        type: 'task',
        raw: t
      });
    });

    return items.sort((a, b) => a.date - b.date);
  };

  const gridCells = getMonthGrid();
  const weekDays = getWeekDays();
  const agendaItems = getAgendaItems();

  return (
    <div className="space-y-6">
      {/* Calendar Header / Toolbar */}
      <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-4 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigations & Range */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-955 light:bg-slate-50 border border-slate-800 light:border-slate-200 rounded-xl p-0.5">
            <button onClick={handlePrev} className="p-2 text-slate-400 light:text-slate-500 hover:text-slate-200 light:hover:text-slate-900 rounded-lg hover:bg-slate-900 light:hover:bg-slate-100 transition-colors cursor-pointer">
              <ChevronLeft size={16} />
            </button>
            <button onClick={handleToday} className="px-3 text-xs font-bold text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-950 rounded-lg hover:bg-slate-900 light:hover:bg-slate-100 transition-colors cursor-pointer">
              Today
            </button>
            <button onClick={handleNext} className="p-2 text-slate-400 light:text-slate-500 hover:text-slate-200 light:hover:text-slate-900 rounded-lg hover:bg-slate-900 light:hover:bg-slate-100 transition-colors cursor-pointer">
              <ChevronRight size={16} />
            </button>
          </div>

          <h3 className="font-extrabold text-slate-200 light:text-slate-900 tracking-wide text-sm sm:text-base">
            {viewMode === 'month' && currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            {viewMode === 'week' && `Week of ${weekDays[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
            {viewMode === 'agenda' && 'Schedule Agenda Ledger'}
          </h3>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Project filter */}
          <div className="flex items-center gap-1.5 bg-slate-955 light:bg-slate-50 border border-slate-800 light:border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <Filter size={12} className="text-slate-500" />
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="bg-transparent text-slate-300 light:text-slate-700 focus:outline-none focus:ring-0 cursor-pointer"
            >
              <option value="" className="bg-slate-905 light:bg-white text-slate-300 light:text-slate-750">All Projects</option>
              {projects.map(p => (
                <option key={p._id} value={p._id} className="bg-slate-905 light:bg-white text-slate-300 light:text-slate-750">{p.name}</option>
              ))}
            </select>
          </div>

          {/* View Selection Toggle */}
          <div className="flex bg-slate-955 light:bg-slate-50 border border-slate-800 light:border-slate-200 rounded-xl p-0.5 text-xs">
            {['month', 'week', 'agenda'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  viewMode === mode 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-400 light:text-slate-550 hover:text-slate-200 light:hover:text-slate-900'
                }`}
              >
                {mode === 'agenda' ? 'Agenda' : `${mode} view`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Render View Mode content */}

      {/* Month View Grid */}
      {viewMode === 'month' && (
        <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl p-4 shadow-lg">
          {/* Days header row */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
            {daysOfWeek.map(d => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>

          {/* Monthly grid cells */}
          <div className="grid grid-cols-7 gap-2">
            {gridCells.map((cell, idx) => {
              const dayEvents = getEventsForDate(cell.date);
              const isToday = formatDateString(cell.date) === formatDateString(new Date());
              
              return (
                <div
                  key={idx}
                  className={`min-h-[100px] border border-slate-800 light:border-slate-200 p-2 rounded-xl flex flex-col justify-between transition-all duration-200 ${
                    cell.isCurrentMonth 
                      ? 'bg-slate-955/40 light:bg-white text-slate-200 light:text-slate-800' 
                      : 'bg-slate-955/10 light:bg-slate-50/50 text-slate-600 light:text-slate-400 border-slate-850 light:border-slate-150'
                  } ${isToday ? 'ring-1 ring-blue-500/80 bg-blue-950/10 light:bg-blue-50/80 border-blue-800/40' : ''}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                      isToday ? 'bg-blue-600 text-white shadow' : 'text-slate-400 light:text-slate-500'
                    }`}>
                      {cell.date.getDate()}
                    </span>
                  </div>

                  <div className="flex-grow space-y-1 overflow-y-auto max-h-[80px] pr-0.5 scrollbar-thin">
                    {dayEvents.map((ev, evIdx) => (
                      <button
                        key={evIdx}
                        onClick={() => setSelectedItem({ type: ev.type, data: ev.raw })}
                        className={`w-full text-left text-[9px] font-bold px-1.5 py-1 rounded border truncate block cursor-pointer transition-colors hover:filter hover:brightness-110 ${ev.color}`}
                      >
                        {ev.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View Columns */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-4 rounded-2xl shadow-lg">
          {weekDays.map((day, idx) => {
            const dayEvents = getEventsForDate(day);
            const isToday = formatDateString(day) === formatDateString(new Date());

            return (
              <div 
                key={idx} 
                className={`flex flex-col min-h-[300px] bg-slate-955/40 light:bg-slate-50/30 border border-slate-800/80 light:border-slate-200 rounded-xl p-3 space-y-3 ${
                  isToday ? 'ring-1 ring-blue-500/80 bg-blue-950/10 light:bg-blue-50/80 border-blue-800/40' : ''
                }`}
              >
                {/* Column header */}
                <div className="text-center pb-2 border-b border-slate-900 light:border-slate-200">
                  <div className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                    {daysOfWeek[idx]}
                  </div>
                  <div className={`text-base font-extrabold font-mono mt-0.5 px-2 py-0.5 rounded-full inline-block ${
                    isToday ? 'bg-blue-600 text-white' : 'text-slate-300 light:text-slate-850'
                  }`}>
                    {day.getDate()}
                  </div>
                </div>

                {/* Day events */}
                <div className="flex-grow space-y-2 overflow-y-auto max-h-[400px]">
                  {dayEvents.length === 0 ? (
                    <div className="text-center py-6 text-[10px] text-slate-650 italic">No events</div>
                  ) : (
                    dayEvents.map((ev, evIdx) => (
                      <button
                        key={evIdx}
                        onClick={() => setSelectedItem({ type: ev.type, data: ev.raw })}
                        className={`w-full text-left text-[10px] font-bold p-2 rounded-xl border block cursor-pointer transition-all hover:translate-x-0.5 hover:shadow-md ${ev.color}`}
                      >
                        <div className="line-clamp-2">{ev.label.split(': ').slice(1).join(': ')}</div>
                        <div className="text-[8px] mt-1 text-slate-500 uppercase">{ev.type}</div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Agenda Timeline View */}
      {viewMode === 'agenda' && (
        <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl p-6 shadow-lg space-y-4 max-w-3xl mx-auto">
          <h4 className="text-sm font-bold text-slate-400 light:text-slate-500 border-b border-slate-800 light:border-slate-200 pb-3">Deadlines Ledger</h4>
          
          {agendaItems.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">No scheduled targets mapped.</div>
          ) : (
            <div className="space-y-4">
              {agendaItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedItem({ type: item.type, data: item.raw })}
                  className="flex items-start gap-4 p-3.5 bg-slate-955 light:bg-white border border-slate-800 light:border-slate-200 hover:border-slate-700 light:hover:border-slate-300 rounded-xl cursor-pointer hover:shadow-lg transition-all group"
                >
                  <div className="text-center min-w-[64px] bg-slate-900 light:bg-slate-50 border border-slate-850 light:border-slate-200 p-2 rounded-xl">
                    <div className="text-[10px] uppercase font-bold text-slate-500">
                      {item.date.toLocaleDateString(undefined, { month: 'short' })}
                    </div>
                    <div className="text-lg font-extrabold text-slate-200 light:text-slate-800 font-mono">
                      {item.date.getDate()}
                    </div>
                  </div>

                  <div className="flex-grow space-y-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h5 className="text-sm font-bold text-slate-200 light:text-slate-850 group-hover:text-blue-400 transition-colors truncate">
                        {item.title}
                      </h5>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        item.type === 'project' 
                          ? 'bg-blue-955/40 text-blue-400 border border-blue-800/50' 
                          : 'bg-amber-955/40 text-amber-400 border border-amber-800/50'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 light:text-slate-500 line-clamp-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Details Info Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
          
          <div className="relative bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-6 z-10 text-slate-100 light:text-slate-900">
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-800 light:border-slate-200">
              <div className="space-y-1">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase border ${
                  selectedItem.type === 'project'
                    ? 'bg-blue-955/40 text-blue-400 border-blue-800/50'
                    : 'bg-amber-955/40 text-amber-400 border-amber-800/50'
                }`}>
                  {selectedItem.type} Information
                </span>
                <h4 className="text-lg font-bold mt-1 text-slate-100 light:text-slate-900">
                  {selectedItem.type === 'project' ? selectedItem.data.name : selectedItem.data.title}
                </h4>
              </div>
              
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-250 p-1 rounded-lg hover:bg-slate-800 light:hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Description</span>
                <p className="bg-slate-955 light:bg-slate-50 border border-slate-800 light:border-slate-200 p-3 rounded-xl text-slate-300 light:text-slate-700 leading-relaxed max-h-[100px] overflow-y-auto">
                  {selectedItem.data.description}
                </p>
              </div>

              {selectedItem.type === 'project' ? (
                <div className="bg-slate-955 light:bg-slate-50 p-3 rounded-xl border border-slate-800 light:border-slate-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold uppercase">Timeline:</span>
                    <span className="font-mono font-bold text-slate-300 light:text-slate-700">
                      {new Date(selectedItem.data.startDate).toLocaleDateString()} - {new Date(selectedItem.data.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold uppercase">Status:</span>
                    <span className="bg-blue-955/40 text-blue-400 border border-blue-800/50 px-2 py-0.5 rounded font-extrabold uppercase text-[10px]">
                      {selectedItem.data.status}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-955 light:bg-slate-50 p-3 rounded-xl border border-slate-800 light:border-slate-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold uppercase">Associated Project:</span>
                    <span className="font-bold text-slate-300 light:text-slate-700">{selectedItem.data.project?.name || 'Unassigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold uppercase">Priority:</span>
                    <span className="font-bold text-slate-300 light:text-slate-700">{selectedItem.data.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold uppercase">Assignee:</span>
                    <span className="font-bold text-slate-300 light:text-slate-700">{selectedItem.data.assignedTo?.name || 'Unassigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold uppercase">Due Date:</span>
                    <span className="font-mono font-bold text-slate-300 light:text-slate-700">{new Date(selectedItem.data.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold uppercase">Status:</span>
                    <span className="bg-purple-955/40 text-purple-400 border border-purple-800/50 px-2 py-0.5 rounded font-extrabold uppercase text-[10px]">
                      {selectedItem.data.status}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-4 border-t border-slate-800 light:border-slate-200">
              <button
                onClick={() => setSelectedItem(null)}
                className="bg-slate-805 hover:bg-slate-700 light:bg-slate-100 light:hover:bg-slate-200 text-slate-200 light:text-slate-800 font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCalendar;
