import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Bell, CheckCircle, AlertTriangle, Info, MessageSquare, Clock, X, Check, Send, Users } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const TYPES = {
  system: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'System' },
  alert: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Alert' },
  approval: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Approval' },
  message: { icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', label: 'Message' },
};

const initialNotifications = [
  { id: 1, type: 'alert', title: 'Urgent maintenance needed – Unit A-101', body: 'Samson Tadesse reported a burst pipe. Immediate action required.', time: '15 min ago', read: false },
  { id: 2, type: 'approval', title: 'Digital ID request approved', body: 'ID request for Olyad Amanuel (Unit B-205) was approved and assigned to Samuel Tolasa.', time: '1 hour ago', read: false },
  { id: 3, type: 'message', title: 'Special Employee report submitted', body: 'Temesgen Alemu submitted the monthly maintenance report for February 2026.', time: '3 hours ago', read: false },
  { id: 4, type: 'system', title: 'New resident registered', body: 'Ramadan Oumer has registered as a new resident in Unit B-108. Account pending verification.', time: 'Yesterday', read: true },
  { id: 5, type: 'approval', title: 'Job #J-2041 completed', body: 'Samuel Fayisa completed "Install new electrical outlet – Unit A-204". Ready for verification.', time: 'Yesterday', read: true },
  { id: 6, type: 'alert', title: '5 requests pending action', body: 'There are 5 maintenance requests that have been pending for more than 48 hours.', time: '2 days ago', read: true },
  { id: 7, type: 'system', title: 'Monthly report ready', body: 'The February 2026 property management report is ready for review.', time: '3 days ago', read: true },
];

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState({ target: 'all', subject: '', body: '' });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllAsRead = () => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); toast.success('All marked as read'); };
  const dismiss = (id) => { setNotifications(prev => prev.filter(n => n.id !== id)); toast.success('Notification dismissed'); };
  const toggle = (id) => { setExpandedId(prev => prev === id ? null : id); markAsRead(id); };

  const filtered = activeFilter === 'all' ? notifications : activeFilter === 'unread' ? notifications.filter(n => !n.read) : notifications.filter(n => n.type === activeFilter);

  const sendBroadcast = () => {
    if (!broadcastMsg.subject || !broadcastMsg.body) { toast.error('Please fill in all fields'); return; }
    toast.success(`Broadcast sent to ${broadcastMsg.target === 'all' ? 'everyone' : broadcastMsg.target}!`);
    setShowBroadcast(false);
    setBroadcastMsg({ target: 'all', subject: '', body: '' });
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'alert', label: 'Alerts' },
    { key: 'approval', label: 'Approvals' },
    { key: 'message', label: 'Messages' },
    { key: 'system', label: 'System' },
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
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <Check className="w-4 h-4" /> Mark all read
              </button>
            )}
            <button onClick={() => setShowBroadcast(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Send className="w-4 h-4" /> Broadcast
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex gap-2 flex-wrap">
          {filters.map(f => {
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

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications in this category.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(notif => {
              const cfg = TYPES[notif.type];
              const Icon = cfg.icon;
              const isExpanded = expandedId === notif.id;
              return (
                <div key={notif.id} className={`bg-white rounded-xl border transition-all overflow-hidden ${!notif.read ? 'border-blue-300 shadow-md' : 'border-gray-200 shadow-sm'}`}>
                  <div className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => toggle(notif.id)}>
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${cfg.bg} ${cfg.border} border`}>
                        <Icon className={`w-5 h-5 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {!notif.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>}
                            <p className={notif.read ? 'text-gray-700' : 'text-gray-900'}>{notif.title}</p>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                            className="p-1 hover:bg-gray-200 rounded-lg text-gray-400 flex-shrink-0">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
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
                      {notif.type === 'alert' && (
                        <button onClick={() => toast.success('Action taken!')} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Take Action</button>
                      )}
                      <button onClick={() => dismiss(notif.id)} className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">Dismiss</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      {showBroadcast && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2"><Send className="w-5 h-5 text-blue-600" /> Broadcast Notification</h2>
              <button onClick={() => setShowBroadcast(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Send To</label>
              <select value={broadcastMsg.target} onChange={e => setBroadcastMsg({ ...broadcastMsg, target: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">All Users</option>
                <option value="residents">All Residents</option>
                <option value="employees">All Employees</option>
                <option value="special-employees">All Special Employees</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Subject</label>
              <input value={broadcastMsg.subject} onChange={e => setBroadcastMsg({ ...broadcastMsg, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notification subject..." />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Message</label>
              <textarea value={broadcastMsg.body} onChange={e => setBroadcastMsg({ ...broadcastMsg, body: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4} placeholder="Write your message..." />
            </div>
            <div className="flex gap-3">
              <button onClick={sendBroadcast} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Send Broadcast</button>
              <button onClick={() => setShowBroadcast(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
