import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Clock, ShieldAlert, LogOut, RefreshCw, User, Briefcase, Mail } from 'lucide-react';

const PendingApproval = () => {
  const { user, logout, refreshUserStatus } = useAuth();
  const { showToast } = useToast();
  const [checking, setChecking] = useState(false);

  const handleRefresh = async () => {
    setChecking(true);
    showToast('Checking account status with administrator...', 'info');
    
    // Simulate minor delay for a nice interactive feel
    setTimeout(async () => {
      const res = await refreshUserStatus();
      setChecking(false);
      
      if (res.success) {
        if (res.user.isApproved) {
          showToast('Account approved! Accessing dashboard...', 'success');
        } else {
          showToast('Account is still pending approval.', 'warning');
        }
      } else {
        showToast(res.message || 'Failed to check status. You might have been logged out.', 'error');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative gradient glowing spheres */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-lg bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 text-center space-y-8 animate-fade-in">
        {/* Animated Icon Header */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-1.5 bg-amber-500/20 rounded-full blur animate-pulse"></div>
            <div className="bg-slate-950 border border-amber-500/40 p-5 rounded-full text-amber-400 relative">
              <Clock size={40} className="animate-spin-slow" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mt-6">
            Approval Pending
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-sm">
            Your account request has been received. Our administrators are currently reviewing your workspace profile.
          </p>
        </div>

        {/* User Workspace Info Card */}
        <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-5 text-left space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/80 pb-2">
            Profile Registration Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-2.5">
              <User size={16} className="text-slate-500" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Full Name</span>
                <span className="font-semibold text-slate-200">{user?.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={16} className="text-slate-500" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Email Address</span>
                <span className="font-mono text-xs text-slate-200">{user?.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Briefcase size={16} className="text-slate-500" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Department</span>
                <span className="text-slate-200">{user?.department || 'General'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldAlert size={16} className="text-slate-500" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Requested Role</span>
                <span className="text-blue-400 font-bold">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Informative notice callout */}
        <div className="p-4 bg-slate-950 border border-slate-800/60 rounded-2xl text-left flex items-start gap-3">
          <ShieldAlert className="text-amber-500/80 shrink-0 mt-0.5" size={18} />
          <div className="text-xs text-slate-400 leading-relaxed">
            <span className="font-bold text-slate-300 block mb-0.5">Secure Workspace Notice</span>
            Once approved, you will immediately be granted access to the dashboards, project ledgers, and team calendars. If you require urgent access, please contact your department manager.
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            onClick={handleRefresh}
            disabled={checking}
            className="flex-1 bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <RefreshCw size={16} className={checking ? 'animate-spin' : ''} />
            {checking ? 'Checking status...' : 'Refresh Status'}
          </button>
          
          <button
            onClick={logout}
            className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 font-bold py-3.5 px-6 rounded-2xl transition-all focus:outline-none flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
