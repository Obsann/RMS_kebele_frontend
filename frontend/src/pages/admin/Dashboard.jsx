import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Users, UserCog, MessageSquare, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Residents', value: '487', icon: <Users className="w-8 h-8" />, color: 'bg-blue-500', change: '+12%' },
    { label: 'Employees', value: '52', icon: <UserCog className="w-8 h-8" />, color: 'bg-green-500', change: '+3%' },
    { label: 'Open Issues', value: '34', icon: <MessageSquare className="w-8 h-8" />, color: 'bg-yellow-500', change: '-5%' },
    { label: 'Urgent Reports', value: '7', icon: <AlertTriangle className="w-8 h-8" />, color: 'bg-red-500', change: '+2' },
  ];

  const recentRequests = [
    { id: 1, resident: 'Samson Tadesse', unit: 'A-101', type: 'Water Supply', status: 'pending', date: '2026-02-28' },
    { id: 2, resident: 'Olyad Amanuel', unit: 'B-205', type: 'Electricity', status: 'in-progress', date: '2026-02-27' },
    { id: 3, resident: 'Mulugeta Haile', unit: 'C-312', type: 'Noise Disturbance', status: 'resolved', date: '2026-02-27' },
    { id: 4, resident: 'Semira Ambisa', unit: 'A-204', type: 'Sewage/Sanitation', status: 'pending', date: '2026-02-26' },
  ];

  const urgentIssues = [
    { id: 1, issue: 'Sewage overflow — Block A entrance', assignedTo: 'Samuel Fayisa', priority: 'High', reported: 'Today' },
    { id: 2, issue: 'Streetlight outage — Block B road', assignedTo: 'Tesfaye Alemu', priority: 'High', reported: 'Yesterday' },
    { id: 3, issue: 'Pothole on main access road', assignedTo: 'Biruk Woldemariam', priority: 'Medium', reported: 'Feb 25' },
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
                    <th className="px-6 py-3 text-left text-gray-600">Category</th>
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

          {/* Urgent Issues */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2>Urgent Issues</h2>
            </div>
            <div className="p-6 space-y-4">
              {urgentIssues.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <p className="text-gray-900 mb-1">{item.issue}</p>
                    <p className="text-gray-600">Assigned to: {item.assignedTo}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded text-white ${item.priority === 'High' ? 'bg-red-500' :
                        item.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}>
                      {item.priority}
                    </span>
                    <p className="text-gray-600 mt-1">{item.reported}</p>
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