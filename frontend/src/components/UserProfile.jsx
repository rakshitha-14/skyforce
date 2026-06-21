import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { User, Shield, KeyRound, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Tab state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [designation, setDesignation] = useState(user?.designation || '');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // Security Tab state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState({ type: '', text: '' });
  const [securityLoading, setSecurityLoading] = useState(false);

  // Regex complexity checks
  const checks = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    number: /\d/.test(newPassword),
    symbol: /[^A-Za-z0-9]/.test(newPassword),
  };

  const isPasswordValid = Object.values(checks).every(Boolean);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });

    if (!name || !email || !designation) {
      setProfileMsg({ type: 'error', text: 'All profile fields are required' });
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setProfileMsg({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setProfileLoading(true);
    try {
      const res = await axiosInstance.put('/auth/profile', {
        name,
        email,
        designation,
      });
      updateUser(res.data);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile settings',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSecurityMsg({ type: '', text: '' });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setSecurityMsg({ type: 'error', text: 'Please fill in all password fields' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (!isPasswordValid) {
      setSecurityMsg({ type: 'error', text: 'Password does not meet complexity requirements' });
      return;
    }

    setSecurityLoading(true);
    try {
      await axiosInstance.put('/auth/password', {
        currentPassword,
        newPassword,
      });
      setSecurityMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setSecurityMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password settings',
      });
    } finally {
      setSecurityLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-950 to-slate-900 light:from-slate-50 light:to-slate-100 border-b border-slate-800 light:border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 light:text-slate-900">Account Administration</h2>
          <p className="text-xs text-slate-500 light:text-slate-400 mt-1">Configure profile details and manage credentials.</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-slate-900 light:bg-white border border-slate-850 light:border-slate-200 flex items-center justify-center text-blue-400 light:text-blue-600">
          <User size={20} />
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-850 light:border-slate-200 bg-slate-900/60 light:bg-slate-50/50 p-1">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-all rounded-xl cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 light:text-slate-500 hover:text-slate-200 light:hover:text-slate-900'
          }`}
        >
          <User size={14} />
          Profile Information
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-all rounded-xl cursor-pointer ${
            activeTab === 'security'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 light:text-slate-500 hover:text-slate-200 light:hover:text-slate-900'
          }`}
        >
          <Shield size={14} />
          Security Settings
        </button>
      </div>

      {/* Content Canvas */}
      <div className="p-6 bg-slate-900/20 light:bg-slate-50/20">
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-2xl">
            {profileMsg.text && (
              <div className={`p-3 text-xs rounded-xl flex items-center gap-2 border ${
                profileMsg.type === 'success' 
                  ? 'bg-emerald-950/20 light:bg-emerald-50 text-emerald-450 light:text-emerald-700 border-emerald-900/50 light:border-emerald-200' 
                  : 'bg-rose-950/20 light:bg-rose-50 text-rose-450 light:text-rose-700 border-rose-900/50 light:border-rose-200'
              }`}>
                {profileMsg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-400 light:text-slate-500 text-xs font-bold mb-1.5 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 light:bg-white border border-slate-800 light:border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-200 light:text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-400 light:text-slate-500 text-xs font-bold mb-1.5 uppercase tracking-wide">Job Title / Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full bg-slate-950 light:bg-white border border-slate-800 light:border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-200 light:text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-400 light:text-slate-500 text-xs font-bold mb-1.5 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 light:bg-white border border-slate-800 light:border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-200 light:text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all text-xs cursor-pointer disabled:opacity-50"
            >
              {profileLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-2xl">
            {securityMsg.text && (
              <div className={`p-3 text-xs rounded-xl flex items-center gap-2 border ${
                securityMsg.type === 'success' 
                  ? 'bg-emerald-950/20 light:bg-emerald-50 text-emerald-450 light:text-emerald-700 border-emerald-900/50 light:border-emerald-200' 
                  : 'bg-rose-950/20 light:bg-rose-50 text-rose-450 light:text-rose-700 border-rose-900/50 light:border-rose-200'
              }`}>
                {securityMsg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                <span>{securityMsg.text}</span>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-slate-400 light:text-slate-500 text-xs font-bold mb-1.5 uppercase tracking-wide">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 light:bg-white border border-slate-800 light:border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-200 light:text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-slate-400 light:text-slate-500 text-xs font-bold mb-1.5 uppercase tracking-wide">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 light:bg-white border border-slate-800 light:border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-200 light:text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 light:text-slate-500 text-xs font-bold mb-1.5 uppercase tracking-wide">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 light:bg-white border border-slate-800 light:border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-200 light:text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password dynamic criteria list */}
              <div className="bg-slate-950 light:bg-slate-50 p-4 rounded-xl border border-slate-850 light:border-slate-200 space-y-2">
                <span className="text-slate-500 light:text-slate-405 text-[10px] uppercase font-bold tracking-wider">Complexity checklist</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    {checks.length ? (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    ) : (
                      <XCircle size={14} className="text-slate-400 light:text-slate-500" />
                    )}
                    <span className={checks.length ? 'text-emerald-400 light:text-emerald-600 font-medium' : 'text-slate-500 light:text-slate-400'}>
                      At least 8 characters
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {checks.uppercase ? (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    ) : (
                      <XCircle size={14} className="text-slate-400 light:text-slate-500" />
                    )}
                    <span className={checks.uppercase ? 'text-emerald-400 light:text-emerald-600 font-medium' : 'text-slate-500 light:text-slate-400'}>
                      Uppercase letter (A-Z)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {checks.number ? (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    ) : (
                      <XCircle size={14} className="text-slate-400 light:text-slate-500" />
                    )}
                    <span className={checks.number ? 'text-emerald-400 light:text-emerald-600 font-medium' : 'text-slate-500 light:text-slate-400'}>
                      Contains a number (0-9)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {checks.symbol ? (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    ) : (
                      <XCircle size={14} className="text-slate-400 light:text-slate-500" />
                    )}
                    <span className={checks.symbol ? 'text-emerald-400 light:text-emerald-600 font-medium' : 'text-slate-500 light:text-slate-400'}>
                      Special character (!@#$)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={securityLoading || !isPasswordValid}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all text-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {securityLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Updating Credentials...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
