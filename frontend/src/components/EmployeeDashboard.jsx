import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import DashboardLayout from './layout/DashboardLayout';
import TaskBoard from './TaskBoard';
import TeamCalendar from './TeamCalendar';
import UserProfile from './UserProfile';
import SkeletonLoader from './SkeletonLoader';
import { Clock, ClipboardList, History, Calendar, LayoutGrid, List, File, User } from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [clockStatus, setClockStatus] = useState({ checkedIn: false, checkedOut: false, record: null });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasksViewMode, setTasksViewMode] = useState('kanban'); // 'list' or 'kanban'

  const sidebarItems = [
    { id: 'dashboard', label: 'Clock In/Out', icon: Clock },
    { id: 'tasks', label: 'My Tasks', icon: ClipboardList },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'logs', label: 'Attendance History', icon: History },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch user tasks
      const tasksRes = await axiosInstance.get('/tasks/my-tasks');
      setTasks(tasksRes.data);

      // Fetch today's clock status
      const statusRes = await axiosInstance.get('/attendance/status');
      setClockStatus(statusRes.data);

      // Fetch history logs
      const logsRes = await axiosInstance.get('/attendance/my-logs');
      setLogs(logsRes.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching employee dashboard data', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckIn = async () => {
    setMessage('');
    const previousStatus = clockStatus;
    // Optimistically update
    setClockStatus(prev => ({
      ...prev,
      checkedIn: true,
      checkedOut: false,
      record: { checkIn: new Date().toISOString() }
    }));
    showToast('Registering attendance check-in...', 'info');

    try {
      const res = await axiosInstance.post('/attendance/checkin');
      setClockStatus({ checkedIn: true, checkedOut: false, record: res.data });
      setMessage('Successfully checked in for today!');
      showToast('Checked in successfully!', 'success');
      // Refresh logs
      const logsRes = await axiosInstance.get('/attendance/my-logs');
      setLogs(logsRes.data);
    } catch (error) {
      setClockStatus(previousStatus);
      const errMsg = error.response?.data?.message || 'Check-in failed';
      setMessage(errMsg);
      showToast(errMsg, 'error');
    }
  };

  const handleCheckOut = async () => {
    setMessage('');
    const previousStatus = clockStatus;
    // Optimistically update
    setClockStatus(prev => ({
      ...prev,
      checkedIn: true,
      checkedOut: true,
      record: { ...prev.record, checkOut: new Date().toISOString() }
    }));
    showToast('Registering attendance check-out...', 'info');

    try {
      const res = await axiosInstance.post('/attendance/checkout');
      setClockStatus({ checkedIn: true, checkedOut: true, record: res.data });
      setMessage('Successfully checked out for today!');
      showToast('Checked out successfully!', 'success');
      // Refresh logs
      const logsRes = await axiosInstance.get('/attendance/my-logs');
      setLogs(logsRes.data);
    } catch (error) {
      setClockStatus(previousStatus);
      const errMsg = error.response?.data?.message || 'Check-out failed';
      setMessage(errMsg);
      showToast(errMsg, 'error');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const previousTasks = tasks;
    // Optimistically update
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    showToast(`Moving task to "${newStatus}"...`, 'info');

    try {
      const res = await axiosInstance.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: res.data.status } : t));
      showToast('Task status updated!', 'success');
    } catch (error) {
      setTasks(previousTasks);
      const errMsg = error.response?.data?.message || 'Failed to update task status';
      showToast(errMsg, 'error');
    }
  };

  const handleAddTaskAttachment = async (taskId, fileObj) => {
    try {
      const taskToUpdate = tasks.find(t => t._id === taskId);
      if (!taskToUpdate) return;
      const updatedAttachments = [...(taskToUpdate.attachments || []), fileObj];
      const res = await axiosInstance.put(`/tasks/${taskId}`, { attachments: updatedAttachments });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, attachments: res.data.attachments } : t));
    } catch (error) {
      console.error('Failed to add task attachment', error);
      alert('Failed to add task attachment');
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        sidebarItems={sidebarItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        <div className="space-y-8">
          <SkeletonLoader variant="list" count={1} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <SkeletonLoader variant="list" count={1} />
            </div>
            <div className="lg:col-span-2">
              <SkeletonLoader variant="kpi" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      <div className="space-y-8">
        {/* Welcome Bar */}
        <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 light:text-slate-900">Welcome back, {user?.name}!</h1>
            <p className="text-slate-400 light:text-slate-500 text-sm mt-1">{user?.designation} • {user?.department} Department</p>
          </div>
          {/* Quick status pill */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 light:text-slate-500 font-semibold uppercase tracking-wider">Clock Status:</span>
            {!clockStatus.checkedIn ? (
              <span className="bg-amber-950/40 border border-amber-800/80 text-amber-400 px-3 py-1 rounded-full text-xs font-bold">
                Not Clocked In
              </span>
            ) : !clockStatus.checkedOut ? (
              <span className="bg-emerald-950/40 border border-emerald-800/80 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                Clocked In
              </span>
            ) : (
              <span className="bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-200 text-slate-400 light:text-slate-500 px-3 py-1 rounded-full text-xs font-bold">
                Shift Completed
              </span>
            )}
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Clocking Actions Card */}
            <div className="lg:col-span-1 bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-6 rounded-2xl shadow-xl flex flex-col justify-between h-fit space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-200 light:text-slate-900 mb-2">Punch Attendance</h2>
                <p className="text-slate-400 light:text-slate-500 text-sm">Log your check-in and check-out times here daily.</p>
              </div>

              {message && (
                <div className="p-3 bg-blue-955/40 light:bg-blue-50/50 border border-blue-900/60 light:border-blue-200 text-blue-400 light:text-blue-700 text-xs text-center rounded-lg">
                  {message}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-950 light:bg-slate-50 p-4 rounded-xl border border-slate-800/50 light:border-slate-200/50">
                  <span className="text-xs text-slate-400 light:text-slate-500 font-semibold uppercase">Punch In</span>
                  <span className="text-sm font-mono text-slate-200 light:text-slate-800">
                    {clockStatus.record ? new Date(clockStatus.record.checkIn).toLocaleTimeString() : '--:--'}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-950 light:bg-slate-50 p-4 rounded-xl border border-slate-800/50 light:border-slate-200/50">
                  <span className="text-xs text-slate-400 light:text-slate-500 font-semibold uppercase">Punch Out</span>
                  <span className="text-sm font-mono text-slate-200 light:text-slate-800">
                    {clockStatus.record?.checkOut ? new Date(clockStatus.record.checkOut).toLocaleTimeString() : '--:--'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleCheckIn}
                  disabled={clockStatus.checkedIn}
                  className={`py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all ${
                    clockStatus.checkedIn
                      ? 'bg-slate-805 text-slate-600 border border-slate-700/30 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer animate-pulse-glow'
                  }`}
                >
                  Clock In
                </button>
                <button
                  onClick={handleCheckOut}
                  disabled={!clockStatus.checkedIn || clockStatus.checkedOut}
                  className={`py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all ${
                    !clockStatus.checkedIn || clockStatus.checkedOut
                      ? 'bg-slate-805 text-slate-600 border border-slate-700/30 cursor-not-allowed'
                      : 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer'
                  }`}
                >
                  Clock Out
                </button>
              </div>
            </div>

            {/* Quick stats and summary summary */}
            <div className="lg:col-span-2 bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-200 light:text-slate-900 mb-2">Shift & Tasks Summary</h2>
                <p className="text-slate-400 light:text-slate-500 text-sm">Key statistics for your current performance.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-955 light:bg-slate-50 p-5 rounded-xl border border-slate-800/50 light:border-slate-200/50">
                  <span className="text-xs text-slate-400 light:text-slate-500 uppercase font-semibold">Total Assigned Tasks</span>
                  <div className="text-3xl font-extrabold text-slate-200 light:text-slate-900 mt-2">{tasks.length}</div>
                </div>
                <div className="bg-slate-955 light:bg-slate-50 p-5 rounded-xl border border-slate-800/50 light:border-slate-200/50">
                  <span className="text-xs text-slate-400 light:text-slate-500 uppercase font-semibold">Pending Tasks</span>
                  <div className="text-3xl font-extrabold text-blue-400 mt-2">
                    {tasks.filter(t => t.status !== 'Completed').length}
                  </div>
                </div>
              </div>
              <div className="bg-slate-955 light:bg-slate-50 p-5 rounded-xl border border-slate-800/50 light:border-slate-200/50 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 light:text-slate-500 uppercase font-semibold">Today's Shift Hours</span>
                  <div className="text-lg font-bold text-slate-200 light:text-slate-800 mt-1">
                    {clockStatus.record?.workHours ? `${clockStatus.record.workHours} Hours Logged` : 'Active Shift / Not Checked Out'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-4 rounded-2xl shadow-md">
              <div>
                <h2 className="text-lg font-bold text-slate-200 light:text-slate-900">My Assigned Tasks</h2>
                <p className="text-slate-400 light:text-slate-500 text-sm">Update the workflow status of your tickets.</p>
              </div>
              <div className="flex bg-slate-955 light:bg-slate-50 border border-slate-800 light:border-slate-200 rounded-xl p-0.5 text-xs font-bold">
                <button
                  onClick={() => setTasksViewMode('kanban')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    tasksViewMode === 'kanban' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 light:text-slate-500 hover:text-slate-200 light:hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid size={14} />
                  Kanban Board
                </button>
                <button
                  onClick={() => setTasksViewMode('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    tasksViewMode === 'list' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 light:text-slate-500 hover:text-slate-200 light:hover:text-slate-900'
                  }`}
                >
                  <List size={14} />
                  List Table
                </button>
              </div>
            </div>

            {tasksViewMode === 'kanban' ? (
              <TaskBoard 
                tasks={tasks} 
                onUpdateStatus={handleStatusChange} 
                onAddAttachment={handleAddTaskAttachment} 
              />
            ) : (
              <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-200 light:text-slate-900 mb-2">My Assigned Tasks</h2>
                  <p className="text-slate-400 light:text-slate-500 text-sm">Update the workflow status of your tickets.</p>
                </div>

                {tasks.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 light:text-slate-400 bg-slate-955 light:bg-slate-55 rounded-xl border border-slate-800/50 light:border-slate-200/50">
                    No tasks assigned to you yet!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[400px] pr-2">
                    {tasks.map(task => (
                      <div
                        key={task._id}
                        className="bg-slate-955 light:bg-slate-50 border border-slate-800 light:border-slate-200 p-5 rounded-xl flex flex-col justify-between space-y-4 hover:border-slate-700 light:hover:border-slate-300 transition-colors"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 text-slate-400 light:text-slate-600 px-2 py-0.5 rounded-full font-bold">
                              {task.project?.name || 'No Project'}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              task.priority === 'High'
                                ? 'bg-rose-955/40 light:bg-rose-50/50 text-rose-450 border border-rose-800/50 light:border-rose-200'
                                : task.priority === 'Medium'
                                ? 'bg-amber-955/40 light:bg-amber-50/50 text-amber-450 border border-amber-800/50 light:border-amber-200'
                                : 'bg-slate-900 light:bg-white text-slate-400 light:text-slate-500 border border-slate-800 light:border-slate-200'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-200 light:text-slate-850">{task.title}</h3>
                          <p className="text-xs text-slate-400 light:text-slate-500 line-clamp-2">{task.description}</p>
                          {task.attachments && task.attachments.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {task.attachments.map((att, i) => (
                                <a 
                                  key={i}
                                  href={`http://localhost:5000${att.fileUrl}`} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-[10px] bg-slate-900 light:bg-white border border-slate-805 light:border-slate-200 text-blue-400 hover:underline px-2 py-1 rounded flex items-center gap-1.5 cursor-pointer animate-fade-in"
                                >
                                  <File size={10} className="text-slate-500" />
                                  <span>{att.fileName}</span>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-900 light:border-slate-200">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-550 uppercase font-semibold">Due Date</span>
                            <span className="text-xs text-slate-300 light:text-slate-600 font-mono">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            className={`text-xs bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer ${
                              task.status === 'Completed'
                                ? 'text-emerald-400 light:text-emerald-600'
                                : task.status === 'In Review'
                                ? 'text-purple-400 light:text-purple-650'
                                : task.status === 'In Progress'
                                ? 'text-blue-400 light:text-blue-600'
                                : 'text-slate-400 light:text-slate-500'
                            }`}
                          >
                            <option value="To Do" className="text-slate-400 light:text-slate-500">To Do</option>
                            <option value="In Progress" className="text-blue-400 light:text-blue-600">In Progress</option>
                            <option value="In Review" className="text-purple-400 light:text-purple-600">In Review</option>
                            <option value="Completed" className="text-emerald-400 light:text-emerald-600">Completed</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-6 rounded-2xl shadow-xl space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-200 light:text-slate-900">Attendance Log History</h2>
              <p className="text-slate-400 light:text-slate-500 text-sm">Review your historical shift logs and total hours.</p>
            </div>

            {logs.length === 0 ? (
              <div className="text-center py-6 text-slate-500 light:text-slate-400">No attendance entries recorded.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 light:border-slate-200 text-slate-400 light:text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Clock In</th>
                      <th className="py-3.5 px-4">Clock Out</th>
                      <th className="py-3.5 px-4 text-right">Work Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 light:divide-slate-200/50 text-sm text-slate-300 light:text-slate-700">
                    {logs.map(log => (
                      <tr key={log._id} className="hover:bg-slate-800/30 light:hover:bg-slate-100/50 transition-colors">
                        <td className="py-3 px-4 font-mono">{log.date}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                            log.status === 'Late'
                              ? 'bg-amber-955/40 light:bg-amber-50/50 text-amber-450 border border-amber-800/50 light:border-amber-200'
                              : 'bg-emerald-955/40 light:bg-emerald-50/50 text-emerald-450 border border-emerald-800/50 light:border-emerald-200'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono">{new Date(log.checkIn).toLocaleTimeString()}</td>
                        <td className="py-3 px-4 font-mono">
                          {log.checkOut ? new Date(log.checkOut).toLocaleTimeString() : 'Active Shift'}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-200 light:text-slate-900">
                          {log.workHours ? `${log.workHours} hrs` : '--'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <TeamCalendar 
            projects={Array.from(new Map(tasks.filter(t => t.project).map(t => [t.project._id, t.project])).values())} 
            tasks={tasks} 
          />
        )}

        {activeTab === 'profile' && <UserProfile />}
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
