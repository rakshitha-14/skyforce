import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Bell } from 'lucide-react';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error('Error fetching notifications', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
      // Update state instantly
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-slate-200 focus:outline-none transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
            <span className="text-xs font-bold text-slate-200">Alerts Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-rose-950/40 text-rose-400 border border-rose-800/50 px-2 py-0.5 rounded-full font-bold">
                {unreadCount} unread
              </span>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 bg-slate-950">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                You have no notifications yet
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                  className={`p-4 text-xs transition-colors cursor-pointer text-left ${
                    notif.isRead
                      ? 'bg-slate-950/50 hover:bg-slate-900/30 text-slate-500'
                      : 'bg-slate-900/40 hover:bg-slate-900/70 text-slate-200 font-semibold'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      notif.type === 'Task_Assigned'
                        ? 'bg-blue-950/40 text-blue-400 border border-blue-900/35'
                        : notif.type === 'Project_Update'
                        ? 'bg-purple-950/40 text-purple-400 border border-purple-900/35'
                        : 'bg-amber-950/40 text-amber-400 border border-amber-900/35'
                    }`}>
                      {notif.type.replace('_', ' ')}
                    </span>
                    <span className="text-[9px] text-slate-600 font-mono">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="line-clamp-2 leading-relaxed">{notif.message}</p>
                  {!notif.isRead && (
                    <span className="text-[9px] text-blue-400 hover:text-blue-300 block mt-1.5">
                      Mark as read
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
