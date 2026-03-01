import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import { Calendar, User, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const employees = [
  { id: 1, name: 'Samuel Fayisa', category: 'Plumbing', assignedJobs: 5 },
  { id: 2, name: 'Tesfaye Alemu', category: 'Electrical', assignedJobs: 3 },
  { id: 3, name: 'Biruk Woldemariam', category: 'HVAC', assignedJobs: 7 },
  { id: 4, name: 'Mekonnen Desta', category: 'General Maintenance', assignedJobs: 4 },
  { id: 5, name: 'Hana Worku', category: 'Landscaping', assignedJobs: 2 },
  { id: 6, name: 'Meron Bekele', category: 'Cleaning', assignedJobs: 6 },
];

const initialJobs = [
  // Jobs assigned TO this special employee FROM admin
  { id: 1, title: 'Fix leaking pipe – Unit A-101', unit: 'A-101', priority: 'high', category: 'Plumbing', status: 'received', createdDate: '2026-02-25', assignedByAdmin: true, assignedTo: '', dueDate: '' },
  { id: 2, title: 'Install new outlets – Unit A-204', unit: 'A-204', priority: 'medium', category: 'Electrical', status: 'received', createdDate: '2026-02-24', assignedByAdmin: true, assignedTo: '', dueDate: '' },
  { id: 3, title: 'AC not cooling – Unit C-312', unit: 'C-312', priority: 'high', category: 'HVAC', status: 'assigned', createdDate: '2026-02-23', assignedByAdmin: true, assignedTo: 'Biruk Woldemariam', dueDate: '2026-03-01' },
  { id: 4, title: 'Clean common area – Building B', unit: 'Common B', priority: 'low', category: 'Cleaning', status: 'assigned', createdDate: '2026-02-22', assignedByAdmin: true, assignedTo: 'Meron Bekele', dueDate: '2026-02-28' },
  { id: 5, title: 'Paint apartment walls – Unit B-108', unit: 'B-108', priority: 'low', category: 'General', status: 'in-progress', createdDate: '2026-02-21', assignedByAdmin: true, assignedTo: 'Mekonnen Desta', dueDate: '2026-02-29' },
  { id: 6, title: 'Fix door lock – Unit C-201', unit: 'C-201', priority: 'medium', category: 'Maintenance', status: 'completed', createdDate: '2026-02-20', assignedByAdmin: true, assignedTo: 'Samuel Fayisa', dueDate: '2026-02-22' },
  // Digital ID job
  { id: 7, title: 'Issue Digital ID – Samson Tadesse (A-101)', unit: 'A-101', priority: 'medium', category: 'Digital ID', status: 'received', createdDate: '2026-02-26', assignedByAdmin: true, assignedTo: '', dueDate: '', isIdJob: true, residentName: 'Samson Tadesse' },
];

export default function SpecialEmployeeJobs() {
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignData, setAssignData] = useState({ employeeId: '', dueDate: '' });

  const handleAssign = () => {
    if (!assignData.employeeId || !assignData.dueDate) {
      toast.error('Please select an employee and set a due date');
      return;
    }
    const emp = employees.find(e => e.id === parseInt(assignData.employeeId));
    setJobs(prev => prev.map(j => j.id === selectedJob.id ? {
      ...j, assignedTo: emp.name, dueDate: assignData.dueDate, status: 'assigned',
    } : j));
    toast.success(`Job assigned to ${emp.name} with due date ${assignData.dueDate}!`);
    setShowAssignModal(false);
    setAssignData({ employeeId: '', dueDate: '' });
  };

  const getPriorityColor = (p) => p === 'high' ? 'bg-red-500' : p === 'medium' ? 'bg-yellow-500' : 'bg-green-500';

  const cols = [
    { key: 'received', label: 'Received from Admin', bg: 'bg-blue-50', badge: 'bg-blue-200 text-blue-800' },
    { key: 'assigned', label: 'Assigned to Employee', bg: 'bg-yellow-50', badge: 'bg-yellow-200 text-yellow-800' },
    { key: 'in-progress', label: 'In Progress', bg: 'bg-purple-50', badge: 'bg-purple-200 text-purple-800' },
    { key: 'completed', label: 'Completed', bg: 'bg-green-50', badge: 'bg-green-200 text-green-800' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1>Job Management</h1>
          <p className="text-gray-600 mt-1">Jobs assigned to you by Admin — reassign them to Employees</p>
        </div>

        {/* Workflow info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-gray-900">Your Role in Job Management</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">Admin assigns job to you</span>
              <ArrowRight className="w-4 h-4 text-blue-400" />
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm">You assign to Employee</span>
              <ArrowRight className="w-4 h-4 text-blue-400" />
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">Employee completes job</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {cols.map(col => (
            <div key={col.key} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <p className="text-gray-600 mb-1">{col.label}</p>
              <p className="text-gray-900">{jobs.filter(j => j.status === col.key).length}</p>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="grid lg:grid-cols-4 gap-4">
          {cols.map(col => (
            <div key={col.key} className={`${col.bg} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 text-sm">{col.label}</h3>
                <span className={`px-2 py-0.5 rounded-full text-sm ${col.badge}`}>
                  {jobs.filter(j => j.status === col.key).length}
                </span>
              </div>
              <div className="space-y-3">
                {jobs.filter(j => j.status === col.key).map(job => (
                  <div key={job.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-1.5">
                      <p className="text-gray-900 flex-1 pr-2">{job.title}</p>
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${getPriorityColor(job.priority)}`}></span>
                    </div>
                    <p className="text-gray-600 mb-2">{job.unit}</p>
                    {job.assignedTo && (
                      <div className="flex items-center gap-1.5 text-gray-600 mb-2">
                        <User className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-xs">{job.assignedTo}</span>
                      </div>
                    )}
                    {job.dueDate && (
                      <div className="flex items-center gap-1.5 text-gray-600 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-xs">Due: {job.dueDate}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">{job.category}</span>
                    </div>
                    {job.status === 'received' && (
                      <button
                        onClick={() => { setSelectedJob(job); setShowAssignModal(true); }}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 mt-1"
                      >
                        <ArrowRight className="w-3.5 h-3.5" /> Assign to Employee
                      </button>
                    )}
                    {job.status === 'completed' && (
                      <div className="flex items-center gap-1.5 text-green-600 mt-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span className="text-xs">Completed</span>
                      </div>
                    )}
                  </div>
                ))}
                {jobs.filter(j => j.status === col.key).length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-4">No jobs here</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assign to Employee Modal */}
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Assign Job to Employee" size="lg">
        {selectedJob && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-gray-900">{selectedJob.title}</p>
              <p className="text-gray-600">Unit: {selectedJob.unit} | Category: {selectedJob.category}</p>
              {selectedJob.isIdJob && (
                <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded text-purple-700 text-sm">
                  This is a <strong>Digital ID issuance</strong> job for resident: {selectedJob.residentName}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Select Employee *</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {employees.filter(e => !selectedJob.category || selectedJob.category === 'Digital ID' || e.category.toLowerCase().includes(selectedJob.category?.toLowerCase()) || true).map(emp => (
                  <label
                    key={emp.id}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${parseInt(assignData.employeeId) === emp.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="employee"
                        value={emp.id}
                        checked={parseInt(assignData.employeeId) === emp.id}
                        onChange={() => setAssignData({ ...assignData, employeeId: String(emp.id) })}
                        className="text-blue-600"
                      />
                      <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600">{emp.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-gray-900">{emp.name}</p>
                        <p className="text-gray-600 text-sm">{emp.category}</p>
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">{emp.assignedJobs} active jobs</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Due Date *</label>
              <input type="date" value={assignData.dueDate} onChange={e => setAssignData({ ...assignData, dueDate: e.target.value })}
                min="2026-02-27"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Additional Notes (Optional)</label>
              <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2} placeholder="Any special instructions for the employee..." />
            </div>

            <div className="flex gap-3">
              <button onClick={handleAssign} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Assign Job</button>
              <button onClick={() => setShowAssignModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
