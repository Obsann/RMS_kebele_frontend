import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FileText, Download, Briefcase, MessageSquare, IdCard, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const myStats = [
  { label: 'Jobs Managed', value: '28', icon: <Briefcase className="w-6 h-6" />, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Requests Handled', value: '19', icon: <MessageSquare className="w-6 h-6" />, color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'IDs Processed', value: '7', icon: <IdCard className="w-6 h-6" />, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Completion Rate', value: '92%', icon: <CheckCircle className="w-6 h-6" />, color: 'text-green-600', bg: 'bg-green-50' },
];

const employeePerformance = [
  { name: 'Samuel Fayisa', category: 'Plumbing', assigned: 8, completed: 7, pending: 1, rate: 88 },
  { name: 'Tesfaye Alemu', category: 'Electrical', assigned: 6, completed: 6, pending: 0, rate: 100 },
  { name: 'Biruk Woldemariam', category: 'HVAC', assigned: 7, completed: 5, pending: 2, rate: 71 },
  { name: 'Mekonnen Desta', category: 'General', assigned: 5, completed: 5, pending: 0, rate: 100 },
  { name: 'Meron Bekele', category: 'Cleaning', assigned: 4, completed: 4, pending: 0, rate: 100 },
];

const jobCats = [
  { category: 'Plumbing', total: 8, completed: 7, color: 'bg-blue-500' },
  { category: 'Electrical', total: 6, completed: 6, color: 'bg-yellow-500' },
  { category: 'HVAC', total: 7, completed: 5, color: 'bg-cyan-500' },
  { category: 'General', total: 5, completed: 5, color: 'bg-green-500' },
  { category: 'Cleaning', total: 4, completed: 4, color: 'bg-purple-500' },
];

const weeklyActivity = [
  { day: 'Mon', jobs: 4, requests: 3 },
  { day: 'Tue', jobs: 6, requests: 5 },
  { day: 'Wed', jobs: 3, requests: 2 },
  { day: 'Thu', jobs: 7, requests: 4 },
  { day: 'Fri', jobs: 5, requests: 6 },
  { day: 'Sat', jobs: 2, requests: 1 },
  { day: 'Sun', jobs: 1, requests: 0 },
];

export default function SpecialEmployeeReports() {
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const maxActivity = Math.max(...weeklyActivity.map(d => d.jobs + d.requests));

  const handleGenerate = () => toast.success(`${reportPeriod} report generated successfully!`);
  const handleExport = (type) => toast.success(`Report exported as ${type}!`);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1>Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Your performance and team activity reports</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleExport('PDF')} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" /> PDF
            </button>
            <button onClick={() => handleExport('Excel')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4" /> Excel
            </button>
          </div>
        </div>

        {/* Report Type */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-gray-700 mb-2">Report Period</label>
              <select value={reportPeriod} onChange={e => setReportPeriod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="weekly">This Week</option>
                <option value="monthly">This Month (February 2026)</option>
                <option value="quarterly">This Quarter</option>
              </select>
            </div>
            <button onClick={handleGenerate} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap">
              Generate Report
            </button>
          </div>
        </div>

        {/* My Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {myStats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className={`inline-flex p-3 rounded-lg ${stat.bg} mb-3`}>
                <span className={stat.color}>{stat.icon}</span>
              </div>
              <p className="text-gray-600 mb-1">{stat.label}</p>
              <p className="text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2>Weekly Activity</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-full"></span><span className="text-gray-600">Jobs</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-orange-400 rounded-full"></span><span className="text-gray-600">Requests</span></div>
            </div>
          </div>
          <div className="flex items-end gap-4 h-40">
            {weeklyActivity.map((d, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end gap-0.5 h-28">
                  <div className="flex-1 bg-blue-500 rounded-t opacity-80" style={{ height: `${(d.jobs / maxActivity) * 100}%` }}></div>
                  <div className="flex-1 bg-orange-400 rounded-t opacity-80" style={{ height: `${(d.requests / maxActivity) * 100}%` }}></div>
                </div>
                <span className="text-gray-500" style={{ fontSize: '11px' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Two columns */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Employee Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="mb-5">My Team's Performance</h2>
            <div className="space-y-4">
              {employeePerformance.map((emp, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">{emp.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-gray-900">{emp.name}</p>
                        <p className="text-gray-500" style={{ fontSize: '11px' }}>{emp.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900">{emp.completed}/{emp.assigned}</p>
                      <p className="text-gray-500" style={{ fontSize: '11px' }}>{emp.rate}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${emp.rate >= 90 ? 'bg-green-500' : emp.rate >= 75 ? 'bg-yellow-500' : 'bg-red-400'}`}
                      style={{ width: `${emp.rate}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="mb-5">Jobs by Category</h2>
            <div className="space-y-4">
              {jobCats.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-700">{cat.category}</span>
                    <span className="text-gray-600">{cat.completed}/{cat.total} completed</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${cat.color} h-2 rounded-full`} style={{ width: `${(cat.completed / cat.total) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Report Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { title: 'Job Summary Report', desc: 'All jobs managed this month with employee assignments', icon: <Briefcase className="w-8 h-8 text-blue-600" /> },
            { title: 'Requests Report', desc: 'Maintenance requests and complaints handled by your team', icon: <MessageSquare className="w-8 h-8 text-orange-600" /> },
            { title: 'Digital ID Report', desc: 'ID requests processed and issuance timeline', icon: <IdCard className="w-8 h-8 text-purple-600" /> },
          ].map((card, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="mb-4">{card.icon}</div>
              <h3 className="mb-2">{card.title}</h3>
              <p className="text-gray-600 mb-4">{card.desc}</p>
              <button onClick={() => handleExport(card.title)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
