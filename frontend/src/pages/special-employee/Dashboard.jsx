import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Users, AlertTriangle, MessageSquare, IdCard, TrendingUp, Lock, Eye } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';

export default function SpecialEmployeeDashboard() {
  const stats = [
    { label: 'Total Residents', value: '487', icon: <Users className="w-7 h-7" />, color: 'bg-blue-500' },
    { label: 'Open Issues', value: '14', icon: <AlertTriangle className="w-7 h-7" />, color: 'bg-red-500' },
    { label: 'Pending Requests', value: '12', icon: <MessageSquare className="w-7 h-7" />, color: 'bg-yellow-500' },
    { label: 'ID Requests', value: '4', icon: <IdCard className="w-7 h-7" />, color: 'bg-green-500' },
  ];

  const recentIssues = [
    { id: 1, title: 'Water supply interruption – Block A', assignedTo: 'Samuel Fayisa', status: 'in-progress', priority: 'high' },
    { id: 2, title: 'Streetlight outage – Block B road', assignedTo: 'Tesfaye Alemu', status: 'pending', priority: 'high' },
    { id: 3, title: 'Sewage overflow – Block A entrance', assignedTo: 'Biruk Woldemariam', status: 'in-progress', priority: 'high' },
    { id: 4, title: 'Garbage collection delay – Block B', assignedTo: '', status: 'pending', priority: 'medium' },
  ];

  const recentRequests = [
    { id: 1, resident: 'Samson Tadesse', unit: 'A-101', type: 'Water Supply', status: 'pending' },
    { id: 2, resident: 'Olyad Amanuel', unit: 'B-205', type: 'Electricity', status: 'in-progress' },
    { id: 3, resident: 'Mulugeta Haile', unit: 'C-312', type: 'Noise Disturbance', status: 'pending' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Read-Only notice */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1>Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Welcome! Here's today's property overview.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
            <Lock className="w-4 h-4" />
            <span>Read-Only View</span>
          </div>
        </div>

        {/* Read-Only Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Eye className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-gray-900">Dashboard & Employees are read-only</p>
            <p className="text-gray-600">You can view the overview here, but actions are available in Residents, Requests, Digital ID, Notifications, and Reports sections.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className={`${stat.color} text-white p-2.5 rounded-lg`}>{stat.icon}</div>
              </div>
              <p className="text-gray-600 mb-1">{stat.label}</p>
              <p className="text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Community Issues */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2>Recent Community Issues</h2>
              <Lock className="w-4 h-4 text-gray-400" />
            </div>
            <div className="divide-y divide-gray-200">
              {recentIssues.map(issue => (
                <div key={issue.id} className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-gray-900 flex-1 pr-3">{issue.title}</p>
                    <span className={`px-2 py-0.5 rounded text-xs text-white ${issue.priority === 'high' ? 'bg-red-500' : issue.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                      {issue.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{issue.assignedTo ? `Assigned to: ${issue.assignedTo}` : 'Unassigned'}</p>
                  <StatusBadge status={issue.status} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2>Recent Resident Requests</h2>
              <Lock className="w-4 h-4 text-gray-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-gray-600">Resident</th>
                    <th className="px-5 py-3 text-left text-gray-600">Unit</th>
                    <th className="px-5 py-3 text-left text-gray-600">Category</th>
                    <th className="px-5 py-3 text-left text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentRequests.map(req => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 text-gray-900">{req.resident}</td>
                      <td className="px-5 py-4 text-gray-600">{req.unit}</td>
                      <td className="px-5 py-4 text-gray-600">{req.type}</td>
                      <td className="px-5 py-4"><StatusBadge status={req.status} size="sm" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2>This Month's Performance</h2>
            <div className="flex items-center gap-2 text-gray-500"><Lock className="w-4 h-4" /> Read-Only</div>
          </div>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { label: 'Issues Resolved', value: '42', pct: 78, color: 'bg-blue-500' },
              { label: 'Requests Handled', value: '31', pct: 85, color: 'bg-green-500' },
              { label: 'IDs Issued', value: '12', pct: 60, color: 'bg-purple-500' },
              { label: 'Avg Response Time', value: '2.4h', pct: 90, color: 'bg-yellow-500' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600">{item.label}</p>
                  <p className="text-gray-900">{item.value}</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
