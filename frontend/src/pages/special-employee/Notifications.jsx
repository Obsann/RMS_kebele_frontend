import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Bell, Briefcase, CheckCircle, AlertTriangle, Info, MessageSquare,
  Clock, X, Check, IdCard, Users,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const TYPES = {
  task_assigned: { icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Task Assigned' },
  task_completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Task Completed' },
  urgent: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Urgent' },
  message: { icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', label: 'From Admin' },
  id_request: { icon: IdCard, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', label: 'ID Request' },
  info: { icon: Info, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Info' },
};

const initialNotifications = [
  { id: 1, type: 'message', source: 'admin', title: 'New issue assigned: Sewage overflow – Block A', body: 'Obsan Habtamu has assigned you a new community issue. Residents near Block A entrance reported a sewage overflow. Please coordinate with your team and assign to the appropriate employee.', time: '20 min ago', read: false, date: '2026-02-27' },
  { id: 2, type: 'id_request', source: 'admin', title: 'Digital ID request approved — Samson Tadesse', body: 'Admin has approved the Digital ID request for Samson Tadesse (Unit A-101). Please assign an employee to issue the ID and set a due date.', time: '1 hour ago', read: false, date: '2026-02-27' },
  { id: 3, type: 'urgent', source: 'admin', title: 'Urgent: 5 issues pending over 48 hours', body: 'There are 5 community issue reports that have been in "pending" status for over 48 hours. Please review and take action immediately.', time: '3 hours ago', read: false, date: '2026-02-27' },
  { id: 4, type: 'task_completed', source: 'employee', title: 'Samuel Fayisa completed: Fix drainage – Block C', body: 'Employee Samuel Fayisa has marked the task "Fix drainage issue – Block C entrance" as completed. Please verify and update the status.', time: 'Yesterday, 5:00 PM', read: true, date: '2026-02-26' },
  { id: 5, type: 'task_assigned', source: 'admin', title: 'Clear sewage blockage – Block A assigned to you', body: 'Obsan Habtamu assigned this community issue to you. Please assign to an available maintenance staff member.', time: 'Yesterday, 2:00 PM', read: true, date: '2026-02-26' },
  { id: 6, type: 'task_completed', source: 'employee', title: 'Biruk Woldemariam completed: Pothole repair – Block C', body: 'Employee Biruk Woldemariam completed "Fill pothole – Access road near Block C". Verified by resident.', time: '2 days ago', read: true, date: '2026-02-25' },
  { id: 7, type: 'message', source: 'admin', title: 'Monthly performance review reminder', body: 'Admin: Monthly performance reviews are due this Friday. Please ensure all task statuses are updated and submit your team report by EOD Thursday.', time: '2 days ago', read: true, date: '2026-02-25' },
  { id: 8, type: 'id_request', source: 'admin', title: 'Digital ID request — Mulugeta Haile (C-312)', body: 'A new approved Digital ID request from Admin: Mulugeta Haile (Unit C-312) needs a replacement ID. Please assign employee and set due date.', time: '3 days ago', read: true, date: '2026-02-24' },
  { id: 9, type: 'info', source: 'admin', title: 'Team briefing – Monday 9:00 AM', body: 'There will be a mandatory team briefing on Monday, 2026-03-02 at 9:00 AM in the management office. Your attendance is required.', time: '3 days ago', read: true, date: '2026-02-24' },
];

export default function SpecialEmployeeNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllAsRead = () => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); toast.success('All marked as read'); };
  const dismiss = (id) => { setNotifications(prev => prev.filter(n => n.id !== id)); toast.success('Notification dismissed'); };
  const toggle = (id) => { setExpandedId(prev => prev === id ? null : id); markAsRead(id); };

  const filtered = notifications.filter(n => {
    const matchFilter = activeFilter === 'all' ? true : activeFilter === 'unread' ? !n.read : n.type === activeFilter;
    const matchSource = sourceFilter === 'all' ? true : n.source === sourceFilter;
    return matchFilter && matchSource;
  });

  const dateGroups = filtered.reduce((acc, n) => {
    const key = n.date === '2026-02-27' ? 'Today' : n.date === '2026-02-26' ? 'Yesterday' : n.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(n);
    return acc;
  }, {});

  const typeFilters = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'message', label: 'From Admin' },
    { key: 'id_request', label: 'ID Requests' },
    { key: 'task_assigned', label: 'Tasks' },
    { key: 'task_completed', label: 'Completed' },
    { key: 'urgent', label: 'Urgent' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3">
              <Bell className="w-7 h-7 text-blue-600" />
              Notifications
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full text-sm">{unreadCount}</span>
              )}
            </h1>
            <p className="text-gray-600 mt-1">{unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Check className="w-4 h-4" /> Mark all as read
            </button>
          )}
        </div>

        {/* Source Filter */}
        <div className="flex gap-3">
          {[
            { key: 'all', label: 'All Sources', icon: <Bell className="w-4 h-4" /> },
            { key: 'admin', label: 'From Admin', icon: <Users className="w-4 h-4" /> },
            { key: 'employee', label: 'From Employees', icon: <Briefcase className="w-4 h-4" /> },
          ].map(s => (
            <button key={s.key} onClick={() => setSourceFilter(s.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${sourceFilter === s.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {/* Type Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex gap-2 flex-wrap">
          {typeFilters.map(f => {
            const count = f.key === 'all' ? notifications.length : f.key === 'unread' ? notifications.filter(n => !n.read).length : notifications.filter(n => n.type === f.key).length;
            return (
              <button key={f.key} onClick={() => setActiveFilter(f.key)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeFilter === f.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                {f.label}
                {count > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeFilter === f.key ? 'bg-white text-blue-600' : 'bg-gray-100'}`}>{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Notifications */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications in this category.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(dateGroups).map(([dateLabel, items]) => (
              <div key={dateLabel}>
                <p className="text-gray-500 mb-3 px-1">{dateLabel}</p>
                <div className="space-y-3">
                  {items.map(notif => {
                    const cfg = TYPES[notif.type];
                    const Icon = cfg.icon;
                    const isExpanded = expandedId === notif.id;
                    return (
                      <div key={notif.id}
                        className={`bg-white rounded-xl border transition-all overflow-hidden ${!notif.read ? 'border-blue-300 shadow-md' : 'border-gray-200 shadow-sm'}`}>
                        <div className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => toggle(notif.id)}>
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-lg flex-shrink-0 ${cfg.bg} ${cfg.border} border`}>
                              <Icon className={`w-5 h-5 ${cfg.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  {!notif.read && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                                  <p className={notif.read ? 'text-gray-700' : 'text-gray-900'}>{notif.title}</p>
                                </div>
                                <button onClick={e => { e.stopPropagation(); dismiss(notif.id); }}
                                  className="p-1 hover:bg-gray-200 rounded-lg text-gray-400 flex-shrink-0">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                                {notif.source === 'admin' && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Admin</span>}
                                {notif.source === 'employee' && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Employee</span>}
                                <span className="flex items-center gap-1 text-gray-500"><Clock className="w-3.5 h-3.5" />{notif.time}</span>
                              </div>
                              {!isExpanded ? (
                                <p className="text-gray-500 mt-2 line-clamp-1">{notif.body}</p>
                              ) : (
                                <p className="text-gray-700 mt-2 leading-relaxed">{notif.body}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="px-4 pb-4 flex gap-3 border-t border-gray-100 pt-3">
                            {notif.type === 'task_assigned' && (
                              <button onClick={() => toast.success('Navigating to tasks...')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">View task</button>
                            )}
                            {notif.type === 'id_request' && (
                              <button onClick={() => toast.success('Navigating to Digital ID...')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Manage ID Request</button>
                            )}
                            {notif.type === 'urgent' && (
                              <button onClick={() => toast.success('Reviewing urgent items...')} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Take Action</button>
                            )}
                            {notif.type === 'task_completed' && (
                              <button onClick={() => toast.success('task verified!')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Verify & Close</button>
                            )}
                            <button onClick={() => dismiss(notif.id)} className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">Dismiss</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
