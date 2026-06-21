import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useToast } from '../context/ToastContext';
import DashboardLayout from './layout/DashboardLayout';
import { Users, Shield, CheckCircle2, Clock3, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/users');
      setUsers(res.data);
      setPendingUsers(res.data.filter(user => !user.isApproved && !user.isRejected));
    } catch (error) {
      console.error('Failed to load users', error);
      showToast(error.response?.data?.message || 'Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await axiosInstance.put(`/admin/users/${userId}/approve`);
      showToast('User approved successfully', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Approve failed', error);
      showToast(error.response?.data?.message || 'Approval failed', 'error');
    }
  };

  const handleReject = async (userId) => {
    try {
      await axiosInstance.put(`/admin/users/${userId}/reject`);
      showToast('User rejected successfully', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Reject failed', error);
      showToast(error.response?.data?.message || 'Rejection failed', 'error');
    }
  };

  const handleBlock = async (userId) => {
    try {
      await axiosInstance.put(`/admin/users/${userId}/block`);
      showToast('User blocked successfully', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Block failed', error);
      showToast(error.response?.data?.message || 'Block failed', 'error');
    }
  };

  const handleUnblock = async (userId) => {
    try {
      await axiosInstance.put(`/admin/users/${userId}/unblock`);
      showToast('User unblocked successfully', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Unblock failed', error);
      showToast(error.response?.data?.message || 'Unblock failed', 'error');
    }
  };

  const sidebarItems = [
    { id: 'pending', label: 'Pending Approval', icon: Shield },
    { id: 'all-users', label: 'All Users', icon: Users },
    { id: 'dashboard', label: 'Overview', icon: Clock3 },
    { id: 'profile', label: 'Profile Settings', icon: Shield },
  ];

  const totalApproved = users.filter(user => user.isApproved).length;
  const totalPending = users.filter(user => !user.isApproved).length;

  return (
    <DashboardLayout sidebarItems={sidebarItems} activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="space-y-8">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-sm uppercase tracking-widest text-slate-500">Approved Users</h2>
                  <p className="text-4xl font-extrabold text-slate-100">{totalApproved}</p>
                </div>
                <CheckCircle2 size={28} className="text-emerald-400" />
              </div>
              <p className="text-sm text-slate-400">Approved users can sign in and access dashboards.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-sm uppercase tracking-widest text-slate-500">Pending Approval</h2>
                  <p className="text-4xl font-extrabold text-slate-100">{totalPending}</p>
                </div>
                <Clock3 size={28} className="text-amber-400" />
              </div>
              <p className="text-sm text-slate-400">New registrations waiting for admin approval.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-sm uppercase tracking-widest text-slate-500">Total Users</h2>
                  <p className="text-4xl font-extrabold text-slate-100">{users.length}</p>
                </div>
                <Users size={28} className="text-blue-400" />
              </div>
              <p className="text-sm text-slate-400">All employees and managers registered in the system.</p>
            </div>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-slate-100 mb-4">Pending User Approvals</h2>
            {loading ? (
              <div className="text-slate-500">Loading pending users...</div>
            ) : pendingUsers.length === 0 ? (
              <div className="text-slate-500">No users are currently pending approval.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Designation</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-slate-300 text-sm">
                    {pendingUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-200">{user.name}</td>
                        <td className="py-4 px-4 font-mono text-xs">{user.email}</td>
                        <td className="py-4 px-4">{user.role}</td>
                        <td className="py-4 px-4">{user.department || 'General'}</td>
                        <td className="py-4 px-4">{user.designation || 'Staff'}</td>
                                <td className="py-4 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleApprove(user._id)}
                            className="bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/35 hover:border-emerald-500/70 text-emerald-300 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(user._id)}
                            className="bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/35 hover:border-rose-500/70 text-rose-300 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'all-users' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-slate-100 mb-4">All Registered Users</h2>
            {loading ? (
              <div className="text-slate-500">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="text-slate-500">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Designation</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-slate-300 text-sm">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-200">{user.name}</td>
                        <td className="py-4 px-4 font-mono text-xs">{user.email}</td>
                        <td className="py-4 px-4">{user.role}</td>
                        <td className="py-4 px-4">{user.department || 'General'}</td>
                        <td className="py-4 px-4">{user.designation || 'Staff'}</td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {user.isBlocked && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-red-950/45 text-red-400 border border-red-800/50 animate-pulse">
                                Blocked
                              </span>
                            )}
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${user.isApproved ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/50' : user.isRejected ? 'bg-rose-950/40 text-rose-400 border border-rose-800/50' : 'bg-amber-950/40 text-amber-400 border border-amber-800/50'}`}>
                              {user.isApproved ? 'Approved' : user.isRejected ? 'Rejected' : 'Pending'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {user.role !== 'Admin' && (
                            user.isBlocked ? (
                              <button
                                onClick={() => handleUnblock(user._id)}
                                className="bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/35 hover:border-emerald-500/70 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                              >
                                Unblock
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBlock(user._id)}
                                className="bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/35 hover:border-rose-500/70 text-rose-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                              >
                                Block
                              </button>
                            )
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
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
