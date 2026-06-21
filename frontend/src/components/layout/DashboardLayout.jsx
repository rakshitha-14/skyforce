import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationBell from '../NotificationBell';
import { Menu, X, Sun, Moon, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

const DashboardLayout = ({ children, sidebarItems = [], activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900 transition-colors duration-200">
      
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex flex-col bg-slate-900 dark:bg-slate-900 light:bg-white border-r border-slate-800 dark:border-slate-800 light:border-slate-200 transition-all duration-300 relative ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 min-w-[36px] rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-md">
              E
            </div>
            {!isCollapsed && (
              <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500 tracking-wider uppercase whitespace-nowrap">
                EPWMS PORTAL
              </span>
            )}
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-grow py-6 px-3 space-y-1.5 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-all group focus:outline-none cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:bg-slate-850 dark:hover:bg-slate-800 light:hover:bg-slate-100 hover:text-slate-200 dark:hover:text-slate-200 light:hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 light:text-slate-600 group-hover:text-blue-500'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User profile card absolute-positioned at the bottom */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="p-4 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-50/50 cursor-pointer hover:bg-slate-800/40 transition-colors"
          title="View Profile Settings"
        >
          <div className="flex items-center justify-between gap-3 overflow-hidden">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                {user?.name?.charAt(0)}
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate text-slate-200 dark:text-slate-200 light:text-slate-900">{user?.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{user?.role}</div>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={logout}
                className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Collapse Toggle trigger */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-slate-800 dark:bg-slate-800 light:bg-slate-200 border border-slate-700 dark:border-slate-700 light:border-slate-300 rounded-full p-1 text-slate-400 hover:text-slate-200 transition-colors z-20 cursor-pointer"
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Sidebar - Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          
          <aside className="relative flex flex-col w-64 bg-slate-900 dark:bg-slate-900 light:bg-white border-r border-slate-800 dark:border-slate-800 light:border-slate-200 p-4 shadow-2xl h-full">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">E</div>
                <span className="text-sm font-extrabold text-slate-200 dark:text-slate-200 light:text-slate-900">EPWMS MOBILE</span>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-grow py-6 space-y-1.5 overflow-y-auto">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100 hover:text-slate-200 dark:hover:text-slate-200 light:hover:text-slate-900'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div 
              onClick={() => {
                setActiveTab('profile');
                setIsMobileOpen(false);
              }}
              className="pt-4 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 cursor-pointer hover:bg-slate-805 p-2 rounded-xl transition-colors"
              title="View Profile Settings"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {user?.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 dark:text-slate-200 light:text-slate-900">{user?.name}</div>
                    <div className="text-[10px] text-slate-500">{user?.role}</div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-slate-500 hover:text-rose-400 p-2 rounded-lg cursor-pointer"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Header Bar */}
        <header className="h-16 bg-slate-900 dark:bg-slate-900 light:bg-white border-b border-slate-800 dark:border-slate-800 light:border-slate-200 sticky top-0 z-30 flex items-center justify-between px-6 shadow-md transition-colors">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden text-slate-400 hover:text-slate-200 p-2 rounded-lg focus:outline-none"
          >
            <Menu size={20} />
          </button>

          {/* Page Title placeholder or branding on mobile */}
          <div className="hidden lg:block">
            <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Workspace Management Dashboard</span>
          </div>
          <div className="lg:hidden text-sm font-bold text-slate-200 dark:text-slate-200 light:text-slate-900">
            EPWMS Portal
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle Moon/Sun */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-850 dark:hover:bg-slate-800 light:hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-600" />}
            </button>

            {/* Notification Bell */}
            <NotificationBell />
            
          </div>
        </header>

        {/* Main Canvas Scrollable Panel */}
        <main className="flex-grow p-6 overflow-y-auto bg-slate-950 dark:bg-slate-950 light:bg-slate-50 transition-colors duration-200">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
