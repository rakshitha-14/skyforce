import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Briefcase, TrendingUp, Percent, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const COLORS = {
  critical: '#f43f5e', // rose-500
  high: '#f59e0b',     // amber-500
  medium: '#3b82f6',   // blue-500
  low: '#64748b'       // slate-500
};

const ManagerAnalytics = () => {
  const { isDark } = useTheme();
  const [timeframe, setTimeframe] = useState('30days');

  // Dynamic datasets depending on chosen timeframe
  const getKPIMetrics = () => {
    switch (timeframe) {
      case '7days':
        return { projects: 6, velocity: '14.2', productivity: '86%', attendance: '95.4%' };
      case 'quarter':
        return { projects: 18, velocity: '9.8', productivity: '89%', attendance: '92.1%' };
      case '30days':
      default:
        return { projects: 12, velocity: '12.5', productivity: '88%', attendance: '94.2%' };
    }
  };

  const getVelocityData = () => {
    switch (timeframe) {
      case '7days':
        return [
          { name: 'Mon', Planned: 2, Actual: 1 },
          { name: 'Tue', Planned: 4, Actual: 3 },
          { name: 'Wed', Planned: 5, Actual: 4 },
          { name: 'Thu', Planned: 7, Actual: 6 },
          { name: 'Fri', Planned: 9, Actual: 8 },
          { name: 'Sat', Planned: 10, Actual: 9 },
          { name: 'Sun', Planned: 10, Actual: 10 }
        ];
      case 'quarter':
        return [
          { name: 'Month 1', Planned: 10, Actual: 8 },
          { name: 'Month 2', Planned: 25, Actual: 21 },
          { name: 'Month 3', Planned: 40, Actual: 38 }
        ];
      case '30days':
      default:
        return [
          { name: 'Week 1', Planned: 5, Actual: 4 },
          { name: 'Week 2', Planned: 12, Actual: 10 },
          { name: 'Week 3', Planned: 20, Actual: 18 },
          { name: 'Week 4', Planned: 30, Actual: 27 }
        ];
    }
  };

  const getWorkloadData = () => {
    // Resource Workload is structured by Employee name, showing stacked states
    switch (timeframe) {
      case '7days':
        return [
          { name: 'Alice', 'To Do': 1, 'In Progress': 2, Completed: 4 },
          { name: 'Bob', 'To Do': 2, 'In Progress': 1, Completed: 3 },
          { name: 'Charlie', 'To Do': 1, 'In Progress': 3, Completed: 2 },
          { name: 'Diana', 'To Do': 0, 'In Progress': 2, Completed: 5 },
          { name: 'Ethan', 'To Do': 3, 'In Progress': 1, Completed: 1 }
        ];
      case 'quarter':
        return [
          { name: 'Alice', 'To Do': 5, 'In Progress': 8, Completed: 25 },
          { name: 'Bob', 'To Do': 8, 'In Progress': 6, Completed: 20 },
          { name: 'Charlie', 'To Do': 6, 'In Progress': 10, Completed: 18 },
          { name: 'Diana', 'To Do': 3, 'In Progress': 7, Completed: 30 },
          { name: 'Ethan', 'To Do': 10, 'In Progress': 5, Completed: 12 }
        ];
      case '30days':
      default:
        return [
          { name: 'Alice', 'To Do': 2, 'In Progress': 4, Completed: 10 },
          { name: 'Bob', 'To Do': 3, 'In Progress': 2, Completed: 8 },
          { name: 'Charlie', 'To Do': 2, 'In Progress': 5, Completed: 6 },
          { name: 'Diana', 'To Do': 1, 'In Progress': 3, Completed: 12 },
          { name: 'Ethan', 'To Do': 4, 'In Progress': 2, Completed: 4 }
        ];
    }
  };

  const getAttendanceData = () => {
    // Attendance data tracks daily checkin count averages and peak arrival hours
    switch (timeframe) {
      case '7days':
        return [
          { name: 'Mon', 'Check-In Rate': 94, 'Peak Hour': 9.0 },
          { name: 'Tue', 'Check-In Rate': 96, 'Peak Hour': 8.8 },
          { name: 'Wed', 'Check-In Rate': 95, 'Peak Hour': 9.1 },
          { name: 'Thu', 'Check-In Rate': 97, 'Peak Hour': 8.9 },
          { name: 'Fri', 'Check-In Rate': 93, 'Peak Hour': 9.2 },
          { name: 'Sat', 'Check-In Rate': 40, 'Peak Hour': 10.0 },
          { name: 'Sun', 'Check-In Rate': 25, 'Peak Hour': 10.5 }
        ];
      case 'quarter':
        return [
          { name: 'Month 1', 'Check-In Rate': 92, 'Peak Hour': 9.1 },
          { name: 'Month 2', 'Check-In Rate': 93, 'Peak Hour': 9.0 },
          { name: 'Month 3', 'Check-In Rate': 91, 'Peak Hour': 9.2 }
        ];
      case '30days':
      default:
        return [
          { name: 'Week 1', 'Check-In Rate': 93, 'Peak Hour': 9.0 },
          { name: 'Week 2', 'Check-In Rate': 95, 'Peak Hour': 8.9 },
          { name: 'Week 3', 'Check-In Rate': 94, 'Peak Hour': 9.1 },
          { name: 'Week 4', 'Check-In Rate': 95, 'Peak Hour': 9.0 }
        ];
    }
  };

  const getPriorityData = () => {
    // Circular breakdown
    switch (timeframe) {
      case '7days':
        return [
          { name: 'Critical', value: 2, color: COLORS.critical },
          { name: 'High', value: 5, color: COLORS.high },
          { name: 'Medium', value: 8, color: COLORS.medium },
          { name: 'Low', value: 12, color: COLORS.low }
        ];
      case 'quarter':
        return [
          { name: 'Critical', value: 12, color: COLORS.critical },
          { name: 'High', value: 35, color: COLORS.high },
          { name: 'Medium', value: 50, color: COLORS.medium },
          { name: 'Low', value: 75, color: COLORS.low }
        ];
      case '30days':
      default:
        return [
          { name: 'Critical', value: 5, color: COLORS.critical },
          { name: 'High', value: 15, color: COLORS.high },
          { name: 'Medium', value: 25, color: COLORS.medium },
          { name: 'Low', value: 35, color: COLORS.low }
        ];
    }
  };

  const metrics = getKPIMetrics();
  const velocityData = getVelocityData();
  const workloadData = getWorkloadData();
  const attendanceData = getAttendanceData();
  const priorityData = getPriorityData();

  return (
    <div className="space-y-8">
      {/* Top Filter and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-5 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-slate-100 light:text-slate-900">Enterprise Productivity Intelligence</h2>
          <p className="text-slate-400 light:text-slate-500 text-xs mt-1">Real-time analytical graphs mapping team velocity and workload allocations.</p>
        </div>
        <div>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-slate-950 light:bg-white border border-slate-800 light:border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-300 light:text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="7days">Past 7 Days</option>
            <option value="30days">Past 30 Days</option>
            <option value="quarter">Current Quarter</option>
          </select>
        </div>
      </div>

      {/* High-level KPI Summary Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3.5 bg-blue-950/50 light:bg-blue-50 border border-blue-950 light:border-blue-100 text-blue-400 light:text-blue-600 rounded-xl">
            <Briefcase size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 light:text-slate-400 font-bold uppercase tracking-wider block">Active Projects</span>
            <span className="text-2xl font-extrabold text-slate-100 light:text-slate-900 block mt-0.5">{metrics.projects}</span>
          </div>
        </div>

        <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3.5 bg-violet-950/50 light:bg-violet-50 border border-violet-950 light:border-violet-100 text-violet-400 light:text-violet-600 rounded-xl">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 light:text-slate-400 font-bold uppercase tracking-wider block">Velocity (Tasks/Wk)</span>
            <span className="text-2xl font-extrabold text-slate-100 light:text-slate-900 block mt-0.5">{metrics.velocity}</span>
          </div>
        </div>

        <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3.5 bg-indigo-950/50 light:bg-indigo-50 border border-indigo-950 light:border-indigo-100 text-indigo-400 light:text-indigo-600 rounded-xl">
            <Percent size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 light:text-slate-400 font-bold uppercase tracking-wider block">Team Productivity</span>
            <span className="text-2xl font-extrabold text-slate-100 light:text-slate-900 block mt-0.5">{metrics.productivity}</span>
          </div>
        </div>

        <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3.5 bg-emerald-950/50 light:bg-emerald-50 border border-emerald-950 light:border-emerald-100 text-emerald-400 light:text-emerald-600 rounded-xl">
            <CheckCircle size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 light:text-slate-400 font-bold uppercase tracking-wider block">Attendance Rate</span>
            <span className="text-2xl font-extrabold text-slate-100 light:text-slate-900 block mt-0.5">{metrics.attendance}</span>
          </div>
        </div>
      </div>

      {/* 2x2 Data Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Project Completion Velocity (Line Chart) */}
        <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 light:text-slate-900 uppercase tracking-wide">1. Project Completion Velocity</h3>
            <p className="text-slate-500 light:text-slate-400 text-xs mt-0.5">Planned vs. Actual cumulative tickets closed.</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} />
                <XAxis dataKey="name" stroke={isDark ? "#64748b" : "#475569"} fontSize={11} />
                <YAxis stroke={isDark ? "#64748b" : "#475569"} fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '10px', color: isDark ? '#f8fafc' : '#0f172a' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="Planned" stroke="#3b82f6" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Actual" stroke="#10b981" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource & Workload Allocation (Stacked Bar Chart) */}
        <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 light:text-slate-900 uppercase tracking-wide">2. Resource & Workload Allocation</h3>
            <p className="text-slate-500 light:text-slate-400 text-xs mt-0.5">Open vs finished tickets grouped per employee.</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} />
                <XAxis dataKey="name" stroke={isDark ? "#64748b" : "#475569"} fontSize={11} />
                <YAxis stroke={isDark ? "#64748b" : "#475569"} fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '10px', color: isDark ? '#f8fafc' : '#0f172a' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="To Do" stackId="a" fill={isDark ? "#334155" : "#cbd5e1"} />
                <Bar dataKey="In Progress" stackId="a" fill="#3b82f6" />
                <Bar dataKey="Completed" stackId="a" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Company Attendance Patterns (Area Chart) */}
        <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 light:text-slate-900 uppercase tracking-wide">3. Company-wide Attendance & Peak Hour Patterns</h3>
            <p className="text-slate-500 light:text-slate-400 text-xs mt-0.5">Weekly check-in percentages alongside average punch hour (AM).</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} />
                <XAxis dataKey="name" stroke={isDark ? "#64748b" : "#475569"} fontSize={11} />
                <YAxis stroke={isDark ? "#64748b" : "#475569"} fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '10px', color: isDark ? '#f8fafc' : '#0f172a' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="Check-In Rate" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRate)" strokeWidth={2} />
                <Line type="monotone" dataKey="Peak Hour" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Priority Distribution (Pie Chart) */}
        <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 light:text-slate-900 uppercase tracking-wide">4. Task Priority Distribution</h3>
            <p className="text-slate-500 light:text-slate-400 text-xs mt-0.5">Proportional breakdown of active workload urgency levels.</p>
          </div>
          <div className="h-64 w-full flex flex-col sm:flex-row items-center justify-around gap-4">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '10px', color: isDark ? '#f8fafc' : '#0f172a' }} />
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="flex flex-col gap-2.5">
              {priorityData.map(item => (
                <div key={item.name} className="flex items-center gap-3 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-400 light:text-slate-600 font-medium">{item.name}:</span>
                  <span className="text-slate-200 light:text-slate-800 font-bold font-mono">{item.value} issues</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManagerAnalytics;
