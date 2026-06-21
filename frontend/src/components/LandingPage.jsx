import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Briefcase, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  UserCheck, 
  Zap, 
  Layers, 
  LineChart, 
  Cpu, 
  ArrowRight, 
  Mail, 
  Phone, 
  Globe, 
  Sun, 
  Moon, 
  Play 
} from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900 transition-colors duration-300 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-900/10 via-violet-900/5 to-transparent pointer-events-none blur-[120px]" />

      {/* Header bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/75 dark:bg-slate-950/75 light:bg-white/80 border-b border-slate-900 dark:border-slate-900 light:border-slate-200 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-md">
              E
            </div>
            <span className="text-sm font-extrabold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500">
              EPWMS Portal
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wide uppercase text-slate-400 dark:text-slate-400 light:text-slate-650">
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-blue-500 transition-colors cursor-pointer">How It Works</button>
            <button onClick={() => scrollToSection('dashboards')} className="hover:text-blue-500 transition-colors cursor-pointer">Dashboards</button>
            <button onClick={() => scrollToSection('roles')} className="hover:text-blue-500 transition-colors cursor-pointer">Roles & Access</button>
            <button onClick={() => scrollToSection('benefits')} className="hover:text-blue-500 transition-colors cursor-pointer">Benefits</button>
          </nav>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-900 dark:hover:bg-slate-900 light:hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-650" />}
            </button>

            {/* Auth CTA */}
            <button
              onClick={onGetStarted}
              className="bg-blue-650 hover:bg-blue-600 border border-blue-500/25 text-white font-bold px-4 py-2 rounded-xl text-xs tracking-wider uppercase shadow-lg shadow-blue-900/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center space-y-8">
        <div className="space-y-4 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-950/40 text-blue-400 border border-blue-800/40 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/40 light:bg-blue-100 light:text-blue-700 light:border-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            Next-Gen Enterprise Platform
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100 dark:text-slate-100 light:text-slate-900 leading-none">
            Centralize Your Projects, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-500">
              Empower Your Workforce
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-450 dark:text-slate-400 light:text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            The All-in-One Platform for Modern Organizations. Sync team attendance log patterns, manage agile Kanban tasks, and stream aggregate performance analytics.
          </p>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 bg-blue-650 hover:bg-blue-600 text-white font-bold px-6 py-3.5 rounded-2xl text-xs tracking-wider uppercase shadow-xl shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Get Started
            <ArrowRight size={14} />
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-850 dark:bg-slate-900 dark:hover:bg-slate-850 light:bg-white light:hover:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-750 font-bold px-6 py-3.5 rounded-2xl text-xs tracking-wider uppercase transition-all cursor-pointer"
          >
            Explore Platform
          </button>
        </div>

        {/* Visual Mock Showcase (Hero Graphic) */}
        <div className="pt-12 max-w-5xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-violet-600/10 rounded-3xl blur-2xl group-hover:scale-105 transition-transform pointer-events-none duration-500" />
          <div className="relative bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 p-4 rounded-3xl shadow-2xl space-y-4">
            {/* Window control mock */}
            <div className="flex gap-2 pb-2 border-b border-slate-850 dark:border-slate-850 light:border-slate-100">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
            {/* Visual content mockup layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
              {/* Sidebar mockup */}
              <div className="space-y-2 border-r border-slate-850 dark:border-slate-850 light:border-slate-100 pr-4">
                <div className="h-6 w-full bg-blue-600/20 rounded-lg animate-pulse" />
                <div className="h-6 w-5/6 bg-slate-850 dark:bg-slate-850 light:bg-slate-100 rounded-lg" />
                <div className="h-6 w-4/5 bg-slate-850 dark:bg-slate-850 light:bg-slate-100 rounded-lg" />
                <div className="h-6 w-5/6 bg-slate-850 dark:bg-slate-850 light:bg-slate-100 rounded-lg" />
              </div>
              {/* Content mockup */}
              <div className="md:col-span-3 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-950 dark:bg-slate-950 light:bg-slate-50 border border-slate-850 dark:border-slate-850 light:border-slate-150 p-3 rounded-xl space-y-2">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase">Active Projects</span>
                    <span className="text-xl font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">12 Mapped</span>
                  </div>
                  <div className="bg-slate-950 dark:bg-slate-950 light:bg-slate-50 border border-slate-850 dark:border-slate-850 light:border-slate-150 p-3 rounded-xl space-y-2">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase">Velocity Rate</span>
                    <span className="text-xl font-bold text-emerald-450">94.2%</span>
                  </div>
                  <div className="bg-slate-950 dark:bg-slate-950 light:bg-slate-50 border border-slate-850 dark:border-slate-850 light:border-slate-150 p-3 rounded-xl space-y-2">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase">Today Attendance</span>
                    <span className="text-xl font-bold text-blue-400">24 Present</span>
                  </div>
                </div>
                {/* Large graph mock block */}
                <div className="bg-slate-950 dark:bg-slate-950 light:bg-slate-50 border border-slate-850 dark:border-slate-850 light:border-slate-150 p-4 rounded-xl h-36 flex items-end gap-3 justify-around pt-8">
                  <div className="w-10 bg-blue-600/35 h-1/3 rounded-t-lg" />
                  <div className="w-10 bg-violet-600/40 h-2/3 rounded-t-lg" />
                  <div className="w-10 bg-blue-650 h-1/2 rounded-t-lg" />
                  <div className="w-10 bg-violet-650 h-5/6 rounded-t-lg" />
                  <div className="w-10 bg-indigo-500 h-3/4 rounded-t-lg animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 'How It Works' Section */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-900/20 dark:bg-slate-900/20 light:bg-slate-100/50 transition-colors">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900">How It Works</h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              Our automated structural execution flow streamlines organization operations in 3 simple phases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {/* Step 1 */}
            <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 rounded-2xl space-y-4 hover:border-blue-500/30 transition-all hover:-translate-y-1">
              <div className="h-10 w-10 bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center rounded-xl font-bold">
                <Briefcase size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">1. Plan & Assign</h3>
              <p className="text-xs text-slate-450 dark:text-slate-400 light:text-slate-650 leading-relaxed font-medium">
                Managers map projects, configure budgets, define scopes, and attach briefs. Tasks are assigned directly to employees with due dates and priority tiers.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 rounded-2xl space-y-4 hover:border-indigo-500/30 transition-all hover:-translate-y-1">
              <div className="h-10 w-10 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center rounded-xl font-bold">
                <Activity size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">2. Track & Monitor</h3>
              <p className="text-xs text-slate-450 dark:text-slate-400 light:text-slate-650 leading-relaxed font-medium">
                Employees manage workloads using interactive Kanban boards. Digital clock-in logs attendance histories and calculates daily working times instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 rounded-2xl space-y-4 hover:border-violet-500/30 transition-all hover:-translate-y-1">
              <div className="h-10 w-10 bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center rounded-xl font-bold">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">3. Analyze & Improve</h3>
              <p className="text-xs text-slate-450 dark:text-slate-400 light:text-slate-650 leading-relaxed font-medium">
                Aggregated database analytics chart productivity velocity and workloads. Managers generate professional PDF performance reports in one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 'Dashboards' Section */}
      <section id="dashboards" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900">Showcase Dashboards</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Tailored workspaces focused on structural management execution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Manager Dashboard Mockup */}
          <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 rounded-2xl space-y-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-1 bg-blue-600/80" />
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold text-slate-200 dark:text-slate-200 light:text-slate-800">Manager Control Console</h3>
                <p className="text-[11px] text-slate-500">Timeline tracking, metrics reporting, and team allocation.</p>
              </div>
              <span className="text-[9px] bg-blue-950 text-blue-400 px-2 py-0.5 rounded font-extrabold uppercase border border-blue-900">Manager View</span>
            </div>

            {/* Visual elements */}
            <div className="bg-slate-950 dark:bg-slate-950 light:bg-slate-50 border border-slate-850 dark:border-slate-850 light:border-slate-150 p-4 rounded-xl space-y-4">
              {/* KPI blocks */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="border border-slate-900 p-2.5 rounded-lg bg-slate-900/50">
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Active Projects</span>
                  <div className="font-bold text-slate-200 dark:text-slate-200 light:text-slate-850 mt-0.5">8 Running</div>
                </div>
                <div className="border border-slate-900 p-2.5 rounded-lg bg-slate-900/50">
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Total Workforce</span>
                  <div className="font-bold text-slate-200 dark:text-slate-200 light:text-slate-850 mt-0.5">14 Employees</div>
                </div>
              </div>
              {/* List item row */}
              <div className="border-t border-slate-900 pt-2 space-y-2">
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Active timelines</span>
                <div className="flex justify-between items-center text-[11px] border border-slate-900 p-2 rounded-lg bg-slate-900/30">
                  <span className="font-semibold text-slate-350">App Design Redesign</span>
                  <span className="text-blue-450 font-bold uppercase text-[9px] bg-blue-950 px-2 py-0.5 rounded">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Workspace Mockup */}
          <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 rounded-2xl space-y-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-1 bg-violet-600/80" />
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold text-slate-200 dark:text-slate-200 light:text-slate-800">Employee Workspace</h3>
                <p className="text-[11px] text-slate-500">Agile task checklists, check-ins, and notification streams.</p>
              </div>
              <span className="text-[9px] bg-violet-950 text-violet-400 px-2 py-0.5 rounded font-extrabold uppercase border border-violet-900">Employee View</span>
            </div>

            {/* Visual elements */}
            <div className="bg-slate-950 dark:bg-slate-950 light:bg-slate-50 border border-slate-850 dark:border-slate-850 light:border-slate-150 p-4 rounded-xl space-y-4">
              {/* Clock widget simulator */}
              <div className="flex items-center justify-between border border-slate-900 p-2.5 rounded-lg bg-slate-900/40">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-slate-200 dark:text-slate-200 light:text-slate-850">Clocked In</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 font-bold">Shift: 04:32:15</span>
              </div>
              {/* Task item */}
              <div className="border-t border-slate-900 pt-2 space-y-2">
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Your checklist</span>
                <div className="flex justify-between items-center text-[11px] border border-slate-900 p-2 rounded-lg bg-slate-900/30">
                  <span className="font-semibold text-slate-350">Develop API endpoints</span>
                  <span className="text-amber-500 font-bold uppercase text-[9px] bg-amber-950 px-2 py-0.5 rounded border border-amber-900/50">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 'Roles & Access' Section */}
      <section id="roles" className="py-20 px-6 bg-slate-900/20 dark:bg-slate-900/20 light:bg-slate-100/50 transition-colors">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900">Roles & Access Control</h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              Secure role-based permissions matrix ensuring strict governance boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {/* Admin Card */}
            <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 rounded-2xl space-y-4 shadow relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-purple-600" />
              <div className="flex items-center justify-between">
                <span className="text-xs bg-purple-950 text-purple-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-purple-900/50">
                  System Admin
                </span>
                <ShieldCheck className="text-purple-400" size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-200 dark:text-slate-200 light:text-slate-850">System Configuration</h3>
              <p className="text-xs text-slate-450 dark:text-slate-400 light:text-slate-650 leading-relaxed font-medium">
                Full authority over system architecture parameters, managing workforce accounts, audit log inspection, and global KPI monitoring.
              </p>
            </div>

            {/* Manager Card */}
            <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 rounded-2xl space-y-4 shadow relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-blue-600" />
              <div className="flex items-center justify-between">
                <span className="text-xs bg-blue-950 text-blue-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-blue-900/50">
                  Team Manager
                </span>
                <Users className="text-blue-400" size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-200 dark:text-slate-200 light:text-slate-850">Operations & Allocation</h3>
              <p className="text-xs text-slate-450 dark:text-slate-400 light:text-slate-650 leading-relaxed font-medium">
                Timeline targets planning, ticket assignment delegation, reviewing team checklists, running workforce summaries, and downloading PDF performance reviews.
              </p>
            </div>

            {/* Employee Card */}
            <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 rounded-2xl space-y-4 shadow relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-emerald-600" />
              <div className="flex items-center justify-between">
                <span className="text-xs bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-emerald-900/50">
                  Employee Staff
                </span>
                <UserCheck className="text-emerald-400" size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-200 dark:text-slate-200 light:text-slate-850">Execution & Checking</h3>
              <p className="text-xs text-slate-450 dark:text-slate-400 light:text-slate-650 leading-relaxed font-medium">
                Punches attendance clock-in logs, moves Kanban cards, downloads files attachments, modifies personal profiles, and receives notifications in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 'Key Benefits' Section */}
      <section id="benefits" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900">Key Benefits</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Why leading modern organizations adopt our management platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex gap-4 items-start bg-slate-900/30 border border-slate-900 p-5 rounded-2xl">
            <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex-shrink-0">
              <Zap size={18} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">Enhanced Productivity</h3>
              <p className="text-xs text-slate-450 dark:text-slate-400 light:text-slate-600 leading-relaxed font-medium">
                Sleek responsive dashboards keep employees focused on critical checkmarks, minimizing time overhead.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-slate-900/30 border border-slate-900 p-5 rounded-2xl">
            <div className="p-2.5 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex-shrink-0">
              <Layers size={18} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">Improved Collaboration</h3>
              <p className="text-xs text-slate-450 dark:text-slate-400 light:text-slate-600 leading-relaxed font-medium">
                Live document cloud attachments and notification streams align employees on task timeline deliverables.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-slate-900/30 border border-slate-900 p-5 rounded-2xl">
            <div className="p-2.5 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex-shrink-0">
              <LineChart size={18} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">Real-time Insights</h3>
              <p className="text-xs text-slate-450 dark:text-slate-400 light:text-slate-6xl leading-relaxed font-medium">
                Aggregation analytics compute velocity metrics, workload rates, and attendance percentages dynamically.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-slate-900/30 border border-slate-900 p-5 rounded-2xl">
            <div className="p-2.5 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex-shrink-0">
              <Cpu size={18} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">Efficient Resources</h3>
              <p className="text-xs text-slate-450 dark:text-slate-400 light:text-slate-600 leading-relaxed font-medium">
                Quick resource distribution and workload charts allow managers to balance task queues easily.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-slate-900/30 border border-slate-900 p-5 rounded-2xl md:col-span-2 lg:col-span-1">
            <div className="p-2.5 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex-shrink-0">
              <Globe size={18} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">Simplified Overhead</h3>
              <p className="text-xs text-slate-450 dark:text-slate-400 light:text-slate-600 leading-relaxed font-medium">
                All logs, security records, briefs, files, and checklists are centralized in one secure cloud workspace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-slate-950 dark:bg-slate-950 light:bg-white border-t border-slate-900 dark:border-slate-900 light:border-slate-200 py-12 px-6 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-900 dark:border-slate-900 light:border-slate-200 text-xs">
          
          {/* Logo and Contact */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">E</div>
              <span className="font-extrabold uppercase text-slate-200 dark:text-slate-200 light:text-slate-900">EPWMS</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Enterprise Project & Workforce Management System. Empowering global organizations with visual agility.
            </p>
            <div className="space-y-2 text-slate-400 dark:text-slate-400 light:text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-slate-500" />
                <span>support@epwms.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-slate-500" />
                <span>+1 (800) 555-0199</span>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider block">Company</span>
            <ul className="space-y-2 font-medium text-slate-400 dark:text-slate-400 light:text-slate-600">
              <li><a href="#/" className="hover:text-blue-500 transition-colors">About Us</a></li>
              <li><a href="#/" className="hover:text-blue-500 transition-colors">Careers</a></li>
              <li><a href="#/" className="hover:text-blue-500 transition-colors">Security Audit</a></li>
              <li><a href="#/" className="hover:text-blue-500 transition-colors">Media Kit</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider block">Legal</span>
            <ul className="space-y-2 font-medium text-slate-400 dark:text-slate-400 light:text-slate-600">
              <li><a href="#/" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#/" className="hover:text-blue-500 transition-colors">Terms of Service</a></li>
              <li><a href="#/" className="hover:text-blue-500 transition-colors">GDPR Compliance</a></li>
              <li><a href="#/" className="hover:text-blue-500 transition-colors">Disclaimer</a></li>
            </ul>
          </div>

          {/* Social connections */}
          <div className="space-y-3">
            <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider block">Follow Us</span>
            <div className="flex gap-2">
              <a href="#/" className="h-8 w-8 rounded-xl bg-slate-900 hover:bg-blue-600 border border-slate-850 dark:border-slate-850 light:border-slate-200 text-slate-400 hover:text-white flex items-center justify-center transition-colors">𝕏</a>
              <a href="#/" className="h-8 w-8 rounded-xl bg-slate-900 hover:bg-blue-600 border border-slate-850 dark:border-slate-850 light:border-slate-200 text-slate-400 hover:text-white flex items-center justify-center transition-colors">in</a>
              <a href="#/" className="h-8 w-8 rounded-xl bg-slate-900 hover:bg-blue-600 border border-slate-850 dark:border-slate-850 light:border-slate-200 text-slate-400 hover:text-white flex items-center justify-center transition-colors">git</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-bold">
          <span>&copy; {new Date().getFullYear()} Enterprise Project & Workforce Management System. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#/" className="hover:text-slate-400 transition-colors">Status</a>
            <span>&bull;</span>
            <a href="#/" className="hover:text-slate-400 transition-colors">Sitemap</a>
            <span>&bull;</span>
            <a href="#/" className="hover:text-slate-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
