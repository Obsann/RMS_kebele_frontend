import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Bell,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  Info,
  MessageSquare,
  Clock,
  X,
  Check,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const NOTIFICATION_TYPES = {
  task_assigned: {
    icon: Briefcase, 
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    label: 'Task Assigned',
  },
  task_completed: {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    label: 'Task Completed',
  },
  urgent: {
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    label: 'Urgent',
  },
  message: {
    icon: MessageSquare,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    label: 'Message',
  },
  info: {
    icon: Info,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    label: 'Info',
  },
};

const initialNotifications = [
  {
    id: 1,
    type: 'urgent',
    title: 'Urgent: Sewage overflow near Block A gate',
    body: 'A sewage overflow has been reported near the Block A entrance. This requires immediate attention. Please report to the location as soon as possible.',
    time: '10 minutes ago',
    read: false,
    date: '2026-02-26',
  },
  {
    id: 2,
    type: 'task_assigned',
    title: 'New task assigned: Repair streetlights – Block B',
    body: 'You have been assigned a new community maintenance task – repair the broken streetlights on Block B road. Due date: 2026-02-28.',
    time: '1 hour ago',
    read: false,
    date: '2026-02-26',
  },
  {
    id: 3,
    type: 'message',
    title: 'Message from Supervisor Temesgen Alemu',
    body: 'Please make sure to update task statuses by end of shift today. The monthly report will be generated tomorrow morning.',
    time: '3 hours ago',
    read: false,
    date: '2026-02-26',
  },
  {
    id: 4,
    type: 'task_assigned',
    title: 'New task assigned: Fix water main valve – Block A',
    body: 'Task has been assigned to you. Location: Block A water main. Category: Water Supply. Priority: High. Due: 2026-02-27.',
    time: 'Yesterday, 4:30 PM',
    read: true,
    date: '2026-02-25',
  },
  {
    id: 5,
    type: 'task_completed',
    title: 'Task verified: Drainage repair – Block C',
    body: 'Your completed task "Fix drainage issue – Block C entrance" has been reviewed and verified by admin. Great work!',
    time: 'Yesterday, 11:00 AM',
    read: true,
    date: '2026-02-25',
  },
  {
    id: 6,
    type: 'info',
    title: 'Schedule reminder: Road inspection round',
    body: 'Your monthly road and infrastructure inspection round is scheduled for this Friday, 2026-02-28. Blocks B and C are on the list.',
    time: '2 days ago',
    read: true,
    date: '2026-02-24',
  },
  {
    id: 7,
    type: 'message',
    title: 'Resident feedback received',
    body: 'Resident Mulugeta Haile (Block C) has left positive feedback for your work on the sanitation cleanup. "Very professional and prompt service."',
    time: '2 days ago',
    read: true,
    date: '2026-02-24',
  },
  {
    id: 8,
    type: 'info',
    title: 'Team meeting — Monday 9:00 AM',
    body: 'There will be a mandatory team briefing on Monday, 2026-03-02 at 9:00 AM in the maintenance office. Please attend on time.',
    time: '3 days ago',
    read: true,
    date: '2026-02-23',
  },
  {
    id: 9,
    type: 'task_completed',
    title: 'Task verified: Community notice board – Block B',
    body: 'Task "Replace community notice board – Block B" has been marked as verified by Samuel Tolasa. Thank you for completing it on time.',
    time: '4 days ago',
    read: true,
    date: '2026-02-22',
  },
];

export default function EmployeeNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success('Notification dismissed');
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
    markAsRead(id);
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'task_assigned', label: 'Tasks' },
    { key: 'urgent', label: 'Urgent' },
    { key: 'message', label: 'Messages' },
    { key: 'info', label: 'Info' },
  ];

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !n.read;
    return n.type === activeFilter;
  });

  // Group by date label
  const groupedByDate = filtered.reduce((acc, n) => {
    const key = n.date === '2026-02-26' ? 'Today' : n.date === '2026-02-25' ? 'Yesterday' : n.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(n);
    return acc;
  }, {});

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
                <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full text-sm">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All caught up! No unread notifications.'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex gap-2 flex-wrap">
          {filters.map((f) => {
            const count =
              f.key === 'all'
                ? notifications.length
                : f.key === 'unread'
                  ? notifications.filter((n) => !n.read).length
                  : notifications.filter((n) => n.type === f.key).length;

            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeFilter === f.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {f.label}
                {count > 0 && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${activeFilter === f.key ? 'bg-white text-blue-600' : 'bg-gray-100'
                      }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications in this category.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByDate).map(([dateLabel, items]) => (
              <div key={dateLabel}>
                <p className="text-gray-500 mb-3 px-1">{dateLabel}</p>
                <div className="space-y-3">
                  {items.map((notif) => {
                    const config = NOTIFICATION_TYPES[notif.type];
                    const Icon = config.icon;
                    const isExpanded = expandedId === notif.id;

                    return (
                      <div
                        key={notif.id}
                        className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${!notif.read
                            ? 'border-blue-300 shadow-md'
                            : 'border-gray-200 shadow-sm'
                          }`}
                      >
                        <div
                          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => toggleExpand(notif.id)}
                        >
                          <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className={`p-2 rounded-lg flex-shrink-0 ${config.bg} ${config.border} border`}>
                              <Icon className={`w-5 h-5 ${config.color}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {!notif.read && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                                  )}
                                  <p className={`${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {notif.title}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dismissNotification(notif.id);
                                  }}
                                  className="p-1 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-gray-600 flex-shrink-0"
                                  title="Dismiss"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                                  {config.label}
                                </span>
                                <span className="flex items-center gap-1 text-gray-500">
                                  <Clock className="w-3.5 h-3.5" />
                                  {notif.time}
                                </span>
                              </div>

                              {/* Preview / Expanded Body */}
                              {!isExpanded ? (
                                <p className="text-gray-500 mt-2 line-clamp-1">{notif.body}</p>
                              ) : (
                                <p className="text-gray-700 mt-2 leading-relaxed">{notif.body}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expanded actions */}
                        {isExpanded && (
                          <div className="px-4 pb-4 flex gap-3 border-t border-gray-100 pt-3 mt-0">
                            {notif.type === 'task_assigned' && (
                              <button
                                onClick={() => toast.success('Navigating to task details...')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                View task
                              </button>
                            )}
                            {notif.type === 'urgent' && (
                              <button
                                onClick={() => toast.success('Acknowledged! Heading to the unit.')}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                              >
                                Acknowledge &amp; Go
                              </button>
                            )}
                            {notif.type === 'message' && (
                              <button
                                onClick={() => toast.success('Reply sent!')}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                              >
                                Reply
                              </button>
                            )}
                            <button
                              onClick={() => dismissNotification(notif.id)}
                              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                            >
                              Dismiss
                            </button>
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
