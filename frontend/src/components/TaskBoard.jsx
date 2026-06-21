import React, { useState } from 'react';
import FileUploadZone from './FileUploadZone';
import { Calendar, User, X, CheckCircle, Clock, AlertCircle, File } from 'lucide-react';

const TaskBoard = ({ tasks = [], onUpdateStatus, onAddAttachment }) => {
  const [selectedTask, setSelectedTask] = useState(null);

  // Status mapping
  const columns = [
    { id: 'todo', label: 'To Do', statuses: ['To Do'], color: 'border-t-slate-500' },
    { id: 'in_progress', label: 'In Progress', statuses: ['In Progress', 'In Review'], color: 'border-t-blue-500' },
    { id: 'done', label: 'Done', statuses: ['Completed'], color: 'border-t-emerald-500' }
  ];

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return {
          bg: 'bg-rose-950/40 border-rose-800/50 text-rose-400',
          dot: 'bg-rose-500'
        };
      case 'Medium':
        return {
          bg: 'bg-amber-950/40 border-amber-800/50 text-amber-400',
          dot: 'bg-amber-500'
        };
      default: // Low
        return {
          bg: 'bg-blue-950/40 border-blue-800/50 text-blue-400',
          dot: 'bg-blue-500'
        };
    }
  };

  const handleStatusSelect = async (taskId, newStatus) => {
    if (onUpdateStatus) {
      await onUpdateStatus(taskId, newStatus);
      // Update local modal state if open
      if (selectedTask && selectedTask._id === taskId) {
        setSelectedTask(prev => ({ ...prev, status: newStatus }));
      }
    }
  };

  const handleAttachmentSuccess = async (fileObj) => {
    if (onAddAttachment && selectedTask) {
      await onAddAttachment(selectedTask._id, fileObj);
      setSelectedTask(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), fileObj]
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map(col => {
          const colTasks = tasks.filter(t => col.statuses.includes(t.status));
          
          return (
            <div 
              key={col.id} 
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col min-h-[500px] shadow-lg"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    col.id === 'todo' ? 'bg-slate-400' : col.id === 'in_progress' ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'
                  }`} />
                  <h3 className="font-bold text-slate-200 text-sm tracking-wide uppercase">{col.label}</h3>
                </div>
                <span className="bg-slate-950 border border-slate-800 text-slate-400 px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards Stack */}
              <div className="flex-grow space-y-3 overflow-y-auto max-h-[600px] pr-1">
                {colTasks.length === 0 ? (
                  <div className="text-center py-10 text-slate-600 text-xs border border-dashed border-slate-800 rounded-xl bg-slate-950/30">
                    No tasks in this stage
                  </div>
                ) : (
                  colTasks.map(task => {
                    const priorityStyle = getPriorityStyle(task.priority);
                    return (
                      <div
                        key={task._id}
                        onClick={() => setSelectedTask(task)}
                        className={`bg-slate-950 border border-slate-800 hover:border-slate-700 p-4 rounded-xl space-y-3 cursor-pointer shadow hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[10px] bg-slate-900 border border-slate-850 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase truncate max-w-[120px]">
                            {task.project?.name || 'No Project'}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border flex items-center gap-1 ${priorityStyle.bg}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${priorityStyle.dot}`} />
                            {task.priority === 'High' ? 'Critical' : task.priority === 'Medium' ? 'High' : 'Medium'}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-200 line-clamp-1 group-hover:text-blue-400 transition-colors">
                          {task.title}
                        </h4>
                        
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {task.description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-900 text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                            <Calendar size={12} />
                            <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {task.status === 'In Review' && (
                              <span className="bg-purple-950/40 text-purple-400 border border-purple-800/50 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide">
                                In Review
                              </span>
                            )}
                            
                            {task.assignedTo ? (
                              <div 
                                className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white flex items-center justify-center font-extrabold text-[10px] shadow"
                                title={task.assignedTo.name}
                              >
                                {getInitials(task.assignedTo.name)}
                              </div>
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center" title="Unassigned">
                                <User size={10} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Details & Status Mutator Overlay Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedTask(null)} />
          
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-6 z-10 text-slate-100">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full font-bold uppercase">
                  Project: {selectedTask.project?.name || 'Unassigned'}
                </span>
                <h3 className="text-lg font-bold text-slate-100 mt-1">{selectedTask.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors focus:outline-none"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <span className="text-xs text-slate-400 font-semibold uppercase">Description</span>
                <p className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl text-xs text-slate-300 leading-relaxed max-h-[120px] overflow-y-auto">
                  {selectedTask.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase block">Assignee</span>
                  <div className="flex items-center gap-2.5 bg-slate-950 p-2.5 rounded-xl border border-slate-805">
                    <div className="h-7 w-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                      {selectedTask.assignedTo ? getInitials(selectedTask.assignedTo.name) : <User size={12} />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{selectedTask.assignedTo?.name || 'Unassigned'}</div>
                      <div className="text-[9px] text-slate-500 truncate">{selectedTask.assignedTo?.email || '--'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase block">Task Details</span>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Priority:</span>
                      <span className={`font-bold uppercase ${
                        selectedTask.priority === 'High' ? 'text-rose-400' : selectedTask.priority === 'Medium' ? 'text-amber-400' : 'text-blue-400'
                      }`}>
                        {selectedTask.priority === 'High' ? 'Critical' : selectedTask.priority === 'Medium' ? 'High' : 'Medium'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Due Date:</span>
                      <span className="font-mono font-semibold">{new Date(selectedTask.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attachments Section */}
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-semibold uppercase block">Attachments</span>
              {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTask.attachments.map((att, i) => (
                    <a
                      key={i}
                      href={`http://localhost:5000${att.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-slate-950 border border-slate-800 text-blue-400 hover:underline px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <File size={12} className="text-slate-500" />
                      <span>{att.fileName}</span>
                    </a>
                  ))}
                </div>
              )}
              <FileUploadZone onUploadSuccess={handleAttachmentSuccess} />
            </div>

            {/* Status Mutator Selector */}
              <div className="space-y-1.5">
                <span className="text-xs text-slate-400 font-semibold uppercase block">Modify Status</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['To Do', 'In Progress', 'In Review', 'Completed'].map(st => {
                    const isCurrent = selectedTask.status === st;
                    return (
                      <button
                        key={st}
                        onClick={() => handleStatusSelect(selectedTask._id, st)}
                        className={`px-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                          isCurrent 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800/80 hover:text-slate-200'
                        }`}
                      >
                        {st === 'Completed' ? 'Done' : st}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedTask(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
