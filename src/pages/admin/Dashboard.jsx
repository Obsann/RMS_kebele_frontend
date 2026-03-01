import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Users, UserCog, MessageSquare, Briefcase, TrendingUp, Calendar } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Residents', value: '487', icon: <Users className="w-8 h-8" />, color: 'bg-blue-500', change: '+12%' },
    { label: 'Employees', value: '52', icon: <UserCog className="w-8 h-8" />, color: 'bg-green-500', change: '+3%' },
    { label: 'Active Requests', value: '34', icon: <MessageSquare className="w-8 h-8" />, color: 'bg-yellow-500', change: '-5%' },
    { label: 'Tasks in Progress', value: '18', icon: <Briefcase className="w-8 h-8" />, color: 'bg-purple-500', change: '+8%' },
  ];

  const recentRequests = [
    { id: 1, resident: 'Samson Tadesse', unit: 'A-101', type: 'Plumbing', status: 'pending', date: '2026-02-26' },
    { id: 2, resident: 'Olyad Amanuel', unit: 'B-205', type: 'Electrical', status: 'in-progress', date: '2026-02-26' },
    { id: 3, resident: 'Mulugeta Haile', unit: 'C-312', type: 'HVAC', status: 'completed', date: '2026-02-25' },
    { id: 4, resident: 'Semira Ambisa', unit: 'A-204', type: 'Maintenance', status: 'pending', date: '2026-02-25' },
  ];

  const upcomingTasks = [
    { id: 1, task: 'Fix broken pipe - Unit A-101', employee: 'Samuel Fayisa', priority: 'High', dueDate: 'Today' },
    { id: 2, task: 'Install new light fixtures - Unit B-205', employee: 'Tesfaye Alemu', priority: 'Medium', dueDate: 'Tomorrow' },
    { id: 3, task: 'AC maintenance - Unit C-312', employee: 'Biruk Woldemariam', priority: 'Low', dueDate: 'Mar 1' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1>Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>February 26, 2026</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  {stat.icon}
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-1">{stat.label}</p>
              <p className="text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2>Recent Requests</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-600">Resident</th>
                    <th className="px-6 py-3 text-left text-gray-600">Unit</th>
                    <th className="px-6 py-3 text-left text-gray-600">Type</th>
                    <th className="px-6 py-3 text-left text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{request.resident}</td>
                      <td className="px-6 py-4">{request.unit}</td>
                      <td className="px-6 py-4">{request.type}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={request.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2>Upcoming Tasks</h2>
            </div>
            <div className="p-6 space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <p className="text-gray-900 mb-1">{task.task}</p>
                    <p className="text-gray-600">Assigned to: {task.employee}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded text-white ${
                      task.priority === 'High' ? 'bg-red-500' :
                      task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      {task.priority}
                    </span>
                    <p className="text-gray-600 mt-1">{task.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="mb-4">Activity Overview</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Activity chart visualization would go here</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}