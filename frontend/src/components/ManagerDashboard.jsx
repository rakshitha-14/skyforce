import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import ManagerAnalytics from './ManagerAnalytics';
import DashboardLayout from './layout/DashboardLayout';
import TaskBoard from './TaskBoard';
import TeamCalendar from './TeamCalendar';
import FileUploadZone from './FileUploadZone';
import UserProfile from './UserProfile';
import SkeletonLoader from './SkeletonLoader';
import { useToast } from '../context/ToastContext';
import { Briefcase, ClipboardList, Users, CalendarDays, BarChart3, Calendar, LayoutGrid, List, File, Shield, User } from 'lucide-react';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState('projects');
  const [tasksViewMode, setTasksViewMode] = useState('kanban'); // 'list' or 'kanban'

  // Form states - Project
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projStart, setProjStart] = useState('');
  const [projEnd, setProjEnd] = useState('');
  const [projMsg, setProjMsg] = useState('');
  const [projAttachments, setProjAttachments] = useState([]);

  // Form states - Task
  const [taskProj, setTaskProj] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskDue, setTaskDue] = useState('');
  const [taskMsg, setTaskMsg] = useState('');
  const [taskAttachments, setTaskAttachments] = useState([]);

  // Audit log states
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotalPages, setAuditTotalPages] = useState(1);
  const [auditTotalDocs, setAuditTotalDocs] = useState(0);
  const [auditLoading, setAuditLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const projRes = await axiosInstance.get('/projects');
      setProjects(projRes.data);

      const tasksRes = await axiosInstance.get('/tasks');
      setTasks(tasksRes.data);

      const usersRes = await axiosInstance.get('/users');
      setEmployees(usersRes.data);

      const attRes = await axiosInstance.get('/attendance/all');
      setAttendance(attRes.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching manager dashboard data', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'audit-logs' && user?.role === 'Admin') {
      const fetchAuditLogs = async () => {
        setAuditLoading(true);
        try {
          const res = await axiosInstance.get(`/admin/audit-logs?page=${auditPage}&limit=10`);
          setAuditLogs(res.data.docs);
          setAuditTotalPages(res.data.totalPages);
          setAuditTotalDocs(res.data.totalDocs);
        } catch (error) {
          console.error('Failed to fetch audit logs', error);
        } finally {
          setAuditLoading(false);
        }
      };
      fetchAuditLogs();
    }
  }, [activeTab, auditPage, user]);

  // Form submissions
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setProjMsg('');
    if (!projName || !projDesc || !projStart || !projEnd) {
      setProjMsg('Please fill in all fields');
      return;
    }
    try {
      const res = await axiosInstance.post('/projects', {
        name: projName,
        description: projDesc,
        startDate: projStart,
        endDate: projEnd,
        attachments: projAttachments,
      });
      // Append project and reflect instantly
      setProjects(prev => [...prev, res.data]);
      setProjName('');
      setProjDesc('');
      setProjStart('');
      setProjEnd('');
      setProjAttachments([]);
      setProjMsg('Project created successfully!');
    } catch (error) {
      setProjMsg(error.response?.data?.message || 'Failed to create project');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskMsg('');
    if (!taskProj || !taskTitle || !taskDesc || !taskAssignee || !taskDue) {
      setTaskMsg('Please fill in all fields');
      return;
    }
    try {
      const res = await axiosInstance.post('/tasks', {
        project: taskProj,
        title: taskTitle,
        description: taskDesc,
        assignedTo: taskAssignee,
        priority: taskPriority,
        dueDate: taskDue,
        attachments: taskAttachments,
      });
      // Fetch fresh tasks list to ensure populated references are fetched correctly
      const tasksRes = await axiosInstance.get('/tasks');
      setTasks(tasksRes.data);

      setTaskTitle('');
      setTaskDesc('');
      setTaskAssignee('');
      setTaskPriority('Medium');
      setTaskDue('');
      setTaskAttachments([]);
      setTaskMsg('Task assigned successfully!');
    } catch (error) {
      setTaskMsg(error.response?.data?.message || 'Failed to assign task');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? This will delete all associated tasks.')) return;
    try {
      await axiosInstance.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
      // Refresh tasks
      const tasksRes = await axiosInstance.get('/tasks');
      setTasks(tasksRes.data);
    } catch (error) {
      alert('Delete project failed');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      alert('Delete task failed');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    const previousTasks = tasks;
    // Optimistically update
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    showToast(`Updating task stage to "${newStatus}"...`, 'info');

    try {
      const res = await axiosInstance.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: res.data.status } : t));
      showToast('Task stage updated!', 'success');
    } catch (error) {
      setTasks(previousTasks);
      const errMsg = error.response?.data?.message || 'Failed to update task status';
      showToast(errMsg, 'error');
    }
  };

  const handleAddTaskAttachment = async (taskId, fileObj) => {
    const previousTasks = tasks;
    const taskToUpdate = tasks.find(t => t._id === taskId);
    if (!taskToUpdate) return;
    const updatedAttachments = [...(taskToUpdate.attachments || []), fileObj];

    // Optimistically update
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, attachments: updatedAttachments } : t));
    showToast(`Attaching file "${fileObj.fileName}" to task...`, 'info');

    try {
      const res = await axiosInstance.put(`/tasks/${taskId}`, { attachments: updatedAttachments });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, attachments: res.data.attachments } : t));
      showToast('File attached successfully!', 'success');
    } catch (error) {
      setTasks(previousTasks);
      const errMsg = error.response?.data?.message || 'Failed to add task attachment';
      showToast(errMsg, 'error');
    }
  };

  const handleDownloadReport = async (id, name) => {
    try {
      const res = await axiosInstance.get(`/reports/employee/${id}`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Performance_Report_${name.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Report download failed', error);
      alert('Failed to download employee monthly performance report');
    }
  };

  const sidebarItems = [
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'tasks', label: 'Tasks', icon: ClipboardList },
    { id: 'workforce', label: 'Workforce', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: CalendarDays },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ...(user?.role === 'Admin' ? [{ id: 'audit-logs', label: 'Audit Logs', icon: Shield }] : []),
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  if (loading) {
    return (
      <DashboardLayout
        sidebarItems={sidebarItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        <div className="space-y-8">
          <SkeletonLoader variant="kpi" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <SkeletonLoader variant="list" count={1} />
            </div>
            <div className="lg:col-span-2">
              <SkeletonLoader variant="table" count={3} />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate stats
  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const pendingTasks = tasks.filter(t => t.status !== 'Completed').length;
  const totalWorkforce = employees.length;
  const presentToday = attendance.filter(a => a.date === new Date().toISOString().split('T')[0]).length;

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Projects</span>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-2">{projects.length}</h3>
            <p className="text-xs text-blue-400 mt-1">{activeProjects} Active</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pending Tickets</span>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-2">{pendingTasks}</h3>
            <p className="text-xs text-purple-400 mt-1">{tasks.length - pendingTasks} Completed</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Employees</span>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-2">{totalWorkforce}</h3>
            <p className="text-xs text-indigo-400 mt-1">Workforce Directory</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Present Today</span>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-2">{presentToday}</h3>
            <p className="text-xs text-emerald-400 mt-1">Attendance Checked</p>
          </div>
        </div>

      {/* Tab Contents */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Project Form */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl h-fit space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-200">Add New Project</h2>
              <p className="text-slate-400 text-sm">Create and assign timeline targets.</p>
            </div>
            {projMsg && (
              <div className={`p-3 text-xs text-center rounded-lg ${
                projMsg.includes('successfully') ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-800/50' : 'bg-red-950/30 text-red-400 border border-red-800/50'
              }`}>
                {projMsg}
              </div>
            )}
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1">Project Name</label>
                <input
                  type="text"
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  placeholder="App Design Redesign"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1">Description</label>
                <textarea
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="Detailed scopes..."
                  rows="3"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={projStart}
                    onChange={(e) => setProjStart(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    value={projEnd}
                    onChange={(e) => setProjEnd(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-slate-400 text-xs font-semibold mb-1">Project Spec Brief</label>
                <FileUploadZone onUploadSuccess={(file) => setProjAttachments(prev => [...prev, file])} />
                {projAttachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {projAttachments.map((att, i) => (
                      <div key={i} className="text-xs text-slate-400 flex items-center gap-1.5">
                        <File size={12} className="text-slate-500" />
                        <span className="truncate">{att.fileName}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl shadow-md transition-all text-sm mt-2"
              >
                Create Project
              </button>
            </form>
          </div>

          {/* Projects Data Table */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-slate-200">Active Project Mappings</h2>
            {projects.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-950 border border-slate-800/50 rounded-xl">
                No projects mapped yet. Create one!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4">Project</th>
                      <th className="py-3 px-4">Timeline</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-slate-300 text-sm">
                    {projects.map(p => (
                      <tr key={p._id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-200">{p.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{p.description}</div>
                          {p.attachments && p.attachments.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {p.attachments.map((att, i) => (
                                <a 
                                  key={i}
                                  href={`http://localhost:5000${att.fileUrl}`} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-[10px] bg-slate-950 border border-slate-850 text-blue-400 hover:underline px-2 py-1 rounded flex items-center gap-1.5 cursor-pointer"
                                >
                                  <File size={10} className="text-slate-500" />
                                  <span>{att.fileName}</span>
                                </a>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 font-mono text-xs">
                          {new Date(p.startDate).toLocaleDateString()} - {new Date(p.endDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            p.status === 'Completed'
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/50'
                              : 'bg-blue-950/40 text-blue-400 border border-blue-800/50'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleDeleteProject(p._id)}
                            className="text-rose-500 hover:text-rose-400 text-xs font-semibold focus:outline-none"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md">
            <div>
              <h2 className="text-lg font-bold text-slate-200">Corporate Tasks Ledger</h2>
              <p className="text-slate-400 text-sm">Monitor and assign workplace tickets.</p>
            </div>
            <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs font-bold">
              <button
                onClick={() => setTasksViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  tasksViewMode === 'kanban' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid size={14} />
                Kanban Board
              </button>
              <button
                onClick={() => setTasksViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  tasksViewMode === 'list' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
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
              onUpdateStatus={handleUpdateTaskStatus} 
              onAddAttachment={handleAddTaskAttachment} 
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Create Task Form */}
              <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl h-fit space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-200">Assign New Task</h2>
                  <p className="text-slate-400 text-sm">Configure tickets for employee assignees.</p>
                </div>
                {taskMsg && (
                  <div className={`p-3 text-xs text-center rounded-lg ${
                    taskMsg.includes('successfully') ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-800/50' : 'bg-red-950/30 text-red-400 border border-red-800/50'
                  }`}>
                    {taskMsg}
                  </div>
                )}
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1">Select Project</label>
                    <select
                      value={taskProj}
                      onChange={(e) => setTaskProj(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none"
                    >
                      <option value="">-- Choose Project --</option>
                      {projects.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1">Task Title</label>
                    <input
                      type="text"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="Draft project blueprints"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1">Description</label>
                    <textarea
                      value={taskDesc}
                      onChange={(e) => setTaskDesc(e.target.value)}
                      placeholder="Task scope details..."
                      rows="2"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1">Assignee</label>
                    <select
                      value={taskAssignee}
                      onChange={(e) => setTaskAssignee(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none"
                    >
                      <option value="">-- Choose Employee --</option>
                      {employees.filter(e => e.role === 'Employee').map(emp => (
                        <option key={emp._id} value={emp._id}>{emp.name} ({emp.designation})</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1">Priority</label>
                      <select
                        value={taskPriority}
                        onChange={(e) => setTaskPriority(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1">Due Date</label>
                      <input
                        type="date"
                        value={taskDue}
                        onChange={(e) => setTaskDue(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-400 text-xs font-semibold mb-1">Task Attachment</label>
                    <FileUploadZone onUploadSuccess={(file) => setTaskAttachments(prev => [...prev, file])} />
                    {taskAttachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {taskAttachments.map((att, i) => (
                          <div key={i} className="text-xs text-slate-400 flex items-center gap-1.5">
                            <File size={12} className="text-slate-500" />
                            <span className="truncate">{att.fileName}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl shadow-md transition-all text-sm mt-2"
                  >
                    Assign Task
                  </button>
                </form>
              </div>

              {/* Tasks Listing */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                <h2 className="text-lg font-bold text-slate-200">Corporate Tasks Ledger</h2>
                {tasks.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 bg-slate-950 border border-slate-800/50 rounded-xl">
                    No tasks assigned yet. Add one!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                          <th className="py-3 px-4">Task Details</th>
                          <th className="py-3 px-4">Assignee</th>
                          <th className="py-3 px-4">Priority</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 text-slate-300 text-sm">
                        {tasks.map(t => (
                          <tr key={t._id} className="hover:bg-slate-800/20 transition-colors">
                            <td className="py-4 px-4">
                              <div className="font-bold text-slate-200">{t.title}</div>
                              <div className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">
                                Project: {t.project?.name || 'Unassigned'}
                              </div>
                              {t.attachments && t.attachments.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {t.attachments.map((att, i) => (
                                    <a 
                                      key={i}
                                      href={`http://localhost:5000${att.fileUrl}`} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="text-[10px] bg-slate-950 border border-slate-850 text-blue-400 hover:underline px-2 py-1 rounded flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <File size={10} className="text-slate-500" />
                                      <span>{att.fileName}</span>
                                    </a>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-slate-200 text-xs">{t.assignedTo?.name || 'Unassigned'}</div>
                              <div className="text-[10px] text-slate-500">{t.assignedTo?.email}</div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                t.priority === 'High'
                                  ? 'bg-rose-950/40 text-rose-400 border border-rose-800/50'
                                  : t.priority === 'Medium'
                                  ? 'bg-amber-950/40 text-amber-400 border border-amber-800/50'
                                  : 'bg-slate-950 text-slate-400 border border-slate-800'
                              }`}>
                                {t.priority}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                t.status === 'Completed'
                                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/50'
                                  : t.status === 'In Review'
                                  ? 'bg-purple-950/40 text-purple-400 border border-purple-800/50'
                                  : t.status === 'In Progress'
                                  ? 'bg-blue-950/40 text-blue-400 border border-blue-800/50'
                                  : 'bg-slate-950 text-slate-400 border border-slate-800'
                              }`}>
                                {t.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => handleDeleteTask(t._id)}
                                className="text-rose-500 hover:text-rose-400 text-xs font-semibold focus:outline-none"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'workforce' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Workforce Registry Directory</h2>
          {employees.length === 0 ? (
            <div className="text-center py-6 text-slate-500">No staff members found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Designation</th>
                    <th className="py-3.5 px-4 text-right">System Role</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-300 text-sm">
                  {employees.map(emp => (
                    <tr key={emp._id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-200">{emp.name}</td>
                      <td className="py-3.5 px-4 font-mono text-xs">{emp.email}</td>
                      <td className="py-3.5 px-4">{emp.department || 'General'}</td>
                      <td className="py-3.5 px-4 text-slate-400">{emp.designation || 'Staff'}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          emp.role === 'Admin'
                            ? 'bg-purple-950/40 text-purple-400 border border-purple-800/50'
                            : emp.role === 'Manager'
                            ? 'bg-blue-950/40 text-blue-400 border border-blue-800/50'
                            : 'bg-slate-950 text-slate-400 border border-slate-800'
                        }`}>
                          {emp.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {emp.role === 'Employee' && (
                          <button
                            onClick={() => handleDownloadReport(emp._id, emp.name)}
                            className="bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/35 hover:border-blue-500/70 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all focus:outline-none cursor-pointer"
                          >
                            Download Report
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Workforce Attendance Audit Summary</h2>
          {attendance.length === 0 ? (
            <div className="text-center py-6 text-slate-500">No attendance records logs cataloged.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="py-3.5 px-4">Employee</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Check In</th>
                    <th className="py-3.5 px-4">Check Out</th>
                    <th className="py-3.5 px-4 text-right">Hours Worked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-300 text-sm">
                  {attendance.map(log => (
                    <tr key={log._id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-200">
                        <div>{log.user?.name || 'Deleted User'}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{log.user?.department} • {log.user?.designation}</div>
                      </td>
                      <td className="py-4 px-4 font-mono text-xs">{log.date}</td>
                      <td className="py-4 px-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          log.status === 'Late'
                            ? 'bg-amber-950/40 text-amber-400 border border-amber-800/50'
                            : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/50'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-xs">{new Date(log.checkIn).toLocaleTimeString()}</td>
                      <td className="py-4 px-4 font-mono text-xs">
                        {log.checkOut ? new Date(log.checkOut).toLocaleTimeString() : 'Active Session'}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-slate-200">
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
        <TeamCalendar projects={projects} tasks={tasks} employees={employees} />
      )}

      {activeTab === 'analytics' && <ManagerAnalytics />}

      {activeTab === 'audit-logs' && user?.role === 'Admin' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-200">System Security Audit Ledger</h2>
              <p className="text-slate-400 text-sm">Monitors structural actions, updates, and entity deletions.</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 text-[10px] uppercase font-bold text-slate-400 px-3 py-1 rounded-xl">
              Total Log Entries: {auditTotalDocs}
            </div>
          </div>

          {auditLoading ? (
            <div className="text-center py-12 text-slate-500 font-medium">Loading audit records...</div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-slate-950/20 border border-slate-850 rounded-xl">
              No security audit logs captured yet.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4">Operator</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Module</th>
                      <th className="py-3 px-4">IP Address</th>
                      <th className="py-3 px-4 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-slate-300 text-xs font-medium">
                    {auditLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-850/10 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-200">
                          <div>{log.userId?.name || 'Unknown Operator'}</div>
                          <div className="text-[10px] text-slate-500 font-mono font-normal">{log.userId?.email || '--'}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-mono">{log.action}</td>
                        <td className="py-3 px-4">
                          <span className="bg-slate-950 border border-slate-850 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            {log.module}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono">{log.ipAddress}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-500">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {auditTotalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-850 text-xs">
                  <button
                    onClick={() => setAuditPage(p => Math.max(p - 1, 1))}
                    disabled={auditPage === 1}
                    className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="text-slate-450 font-medium">
                    Page <span className="font-bold text-slate-200">{auditPage}</span> of {auditTotalPages}
                  </span>
                  <button
                    onClick={() => setAuditPage(p => Math.min(p + 1, auditTotalPages))}
                    disabled={auditPage === auditTotalPages}
                    className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && <UserProfile />}
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
