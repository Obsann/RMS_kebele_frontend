import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Users, Briefcase, MessageSquare, IdCard, TrendingUp, Lock, Eye } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';

export default function SpecialEmployeeDashboard() {
  const stats = [
    { label: 'Total Residents', value: '487', icon: <Users className="w-7 h-7" />, color: 'bg-blue-500' },
    { label: 'Active Jobs', value: '21', icon: <Briefcase className="w-7 h-7" />, color: 'bg-purple-500' },
    { label: 'Pending Requests', value: '12', icon: <MessageSquare className="w-7 h-7" />, color: 'bg-yellow-500' },
    { label: 'ID Requests', value: '4', icon: <IdCard className="w-7 h-7" />, color: 'bg-green-500' },
  ];

  const recentJobs = [
    { id: 1, title: 'Fix leaking pipe – Unit A-101', assignedTo: 'Samuel Fayisa', status: 'in-progress', priority: 'high' },
    { id: 2, title: 'Replace ceiling fan – Unit B-305', assignedTo: 'Tesfaye Alemu', status: 'pending', priority: 'medium' },
    { id: 3, title: 'Install new outlet – Unit A-204', assignedTo: 'Biruk Woldemariam', status: 'in-progress', priority: 'medium' },
    { id: 4, title: 'AC maintenance – Unit C-110', assignedTo: 'Mekonnen Desta', status: 'pending', priority: 'low' },
  ];

  const recentRequests = [
    { id: 1, resident: 'Samson Tadesse', unit: 'A-101', type: 'Plumbing', status: 'pending' },
    { id: 2, resident: 'Olyad Amanuel', unit: 'B-205', type: 'Electrical', status: 'in-progress' },
    { id: 3, resident: 'Mulugeta Haile', unit: 'C-312', type: 'HVAC', status: 'pending' },
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
            <p className="text-gray-600">You can view the overview here, but actions are available in Residents, Jobs, Requests, Digital ID, Notifications, and Reports sections.</p>
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
          {/* Recent Jobs Assigned to Employees */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2>Jobs Assigned to Employees</h2>
              <Lock className="w-4 h-4 text-gray-400" />
            </div>
            <div className="divide-y divide-gray-200">
              {recentJobs.map(job => (
                <div key={job.id} className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-gray-900 flex-1 pr-3">{job.title}</p>
                    <span className={`px-2 py-0.5 rounded text-xs text-white ${job.priority === 'high' ? 'bg-red-500' : job.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                      {job.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">Assigned to: {job.assignedTo}</p>
                  <StatusBadge status={job.status} size="sm" />
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
                    <th className="px-5 py-3 text-left text-gray-600">Type</th>
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
              { label: 'Jobs Completed', value: '42', pct: 78, color: 'bg-blue-500' },
              { label: 'Requests Resolved', value: '31', pct: 85, color: 'bg-green-500' },
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
