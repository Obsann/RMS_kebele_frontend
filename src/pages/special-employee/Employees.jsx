import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import { Search, Lock, Eye, Info } from 'lucide-react';

const employees = [
  { id: 1, name: 'Samuel Fayisa', email: 'samuel.f@pms.com', phone: '+251 911 111 001', category: 'Plumbing', assignedJobs: 5, status: 'active' },
  { id: 2, name: 'Tesfaye Alemu', email: 'tesfaye.a@pms.com', phone: '+251 911 111 002', category: 'Electrical', assignedJobs: 3, status: 'active' },
  { id: 3, name: 'Biruk Woldemariam', email: 'biruk.w@pms.com', phone: '+251 911 111 003', category: 'HVAC', assignedJobs: 7, status: 'active' },
  { id: 4, name: 'Mekonnen Desta', email: 'mekonnen.d@pms.com', phone: '+251 911 111 004', category: 'General Maintenance', assignedJobs: 4, status: 'active' },
  { id: 5, name: 'Hana Worku', email: 'hana.w@pms.com', phone: '+251 911 111 005', category: 'Landscaping', assignedJobs: 2, status: 'inactive' },
  { id: 6, name: 'Meron Bekele', email: 'meron.b@pms.com', phone: '+251 911 111 006', category: 'Cleaning', assignedJobs: 6, status: 'active' },
  { id: 7, name: 'Robel Haile', email: 'robel.h@pms.com', phone: '+251 911 111 007', category: 'Security', assignedJobs: 1, status: 'active' },
  { id: 8, name: 'Nardos Bekele', email: 'nardos.b@pms.com', phone: '+251 911 111 008', category: 'Carpentry', assignedJobs: 3, status: 'active' },
];

export default function SpecialEmployeeEmployees() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1>Employees</h1>
            <p className="text-gray-600 mt-1">View maintenance staff — read-only access</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-700">
            <Lock className="w-4 h-4" />
            <span>Read-Only View</span>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-gray-700">
            You can view employees here and assign them jobs through the <strong>Job Management</strong> section.
            Only Admin can add, edit, or remove employees.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Total</p><p className="text-gray-900">{employees.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Active</p><p className="text-gray-900">{employees.filter(e => e.status === 'active').length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Total Active Jobs</p><p className="text-gray-900">{employees.reduce((s, e) => s + e.assignedJobs, 0)}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Categories</p><p className="text-gray-900">{new Set(employees.map(e => e.category)).size}</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by name, category, or email..."
              className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-600">Name</th>
                  <th className="px-6 py-3 text-left text-gray-600">Email</th>
                  <th className="px-6 py-3 text-left text-gray-600">Phone</th>
                  <th className="px-6 py-3 text-left text-gray-600">Category</th>
                  <th className="px-6 py-3 text-left text-gray-600">Jobs</th>
                  <th className="px-6 py-3 text-left text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600">{emp.name.charAt(0)}</span>
                        </div>
                        <span className="text-gray-900">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{emp.email}</td>
                    <td className="px-6 py-4 text-gray-600">{emp.phone}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{emp.category}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{emp.assignedJobs}</td>
                    <td className="px-6 py-4"><StatusBadge status={emp.status} size="sm" /></td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600" title="View (Read-only)">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
