import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { Plus, Calendar, User, Eye, ArrowRight, UserCheck } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const specialEmployees = [
  { id: 1, name: 'Samuel Tolasa', role: 'Senior Manager' },
  { id: 2, name: 'Temesgen Alemu', role: 'Supervisor' },
  { id: 3, name: 'Mekdes Haile', role: 'Coordinator' },
];

export default function AdminJobs() {
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [showJobDetailModal, setShowJobDetailModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [jobs, setJobs] = useState([
    { id: 1, title: 'Fix leaking pipe', unit: 'A-101', priority: 'high', category: 'Plumbing', status: 'pending', createdDate: '2026-02-24', assignedTo: '', assignedToRole: '' },
    { id: 2, title: 'Replace light bulbs', unit: 'B-205', priority: 'low', category: 'Electrical', status: 'pending', createdDate: '2026-02-24', assignedTo: '', assignedToRole: '' },
    { id: 3, title: 'AC not cooling', unit: 'C-312', priority: 'high', category: 'HVAC', status: 'pending', createdDate: '2026-02-23', assignedTo: '', assignedToRole: '' },
    { id: 4, title: 'Install new outlets', unit: 'A-204', priority: 'medium', category: 'Electrical', status: 'assigned', createdDate: '2026-02-23', assignedTo: 'Temesgen Alemu', assignedToRole: 'Supervisor' },
    { id: 5, title: 'Paint apartment walls', unit: 'B-108', priority: 'low', category: 'General', status: 'in-progress', createdDate: '2026-02-22', assignedTo: 'Samuel Tolasa', assignedToRole: 'Senior Manager' },
    { id: 6, title: 'Fix door lock', unit: 'C-201', priority: 'medium', category: 'Maintenance', status: 'completed', createdDate: '2026-02-22', assignedTo: 'Mekdes Haile', assignedToRole: 'Coordinator' },
    { id: 7, title: 'Clean common area', unit: 'Common', priority: 'low', category: 'Cleaning', status: 'completed', createdDate: '2026-02-21', assignedTo: 'Temesgen Alemu', assignedToRole: 'Supervisor' },
  ]);

  const [formData, setFormData] = useState({
    title: '', description: '', category: '', priority: 'medium', unit: '', assignedTo: '',
  });

  const handleCreateJob = () => {
    if (!formData.title || !formData.category || !formData.unit) {
      toast.error('Please fill in required fields');
      return;
    }
    const newJob = {
      id: jobs.length + 1,
      title: formData.title,
      unit: formData.unit,
      priority: formData.priority,
      category: formData.category,
      status: formData.assignedTo ? 'assigned' : 'pending',
      createdDate: '2026-02-27',
      assignedTo: formData.assignedTo,
      assignedToRole: specialEmployees.find(e => e.name === formData.assignedTo)?.role || '',
    };
    setJobs(prev => [newJob, ...prev]);
    toast.success('Job created successfully!');
    setShowCreateJobModal(false);
    setFormData({ title: '', description: '', category: '', priority: 'medium', unit: '', assignedTo: '' });
  };

  const handleAssignJob = (job, specialEmployee) => {
    setJobs(prev => prev.map(j => j.id === job.id ? {
      ...j,
      assignedTo: specialEmployee.name,
      assignedToRole: specialEmployee.role,
      status: 'assigned',
    } : j));
    toast.success(`Job assigned to ${specialEmployee.name}!`);
    setShowJobDetailModal(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-700';
      case 'assigned': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const kanbanCols = [
    { key: 'pending', label: 'Pending', bg: 'bg-gray-50', badge: 'bg-gray-200 text-gray-700' },
    { key: 'assigned', label: 'Assigned', bg: 'bg-blue-50', badge: 'bg-blue-200 text-blue-700' },
    { key: 'in-progress', label: 'In Progress', bg: 'bg-yellow-50', badge: 'bg-yellow-200 text-yellow-700' },
    { key: 'completed', label: 'Completed', bg: 'bg-green-50', badge: 'bg-green-200 text-green-700' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1>Job & Task Management</h1>
            <p className="text-gray-600 mt-1">Create jobs and assign them to Special Employees</p>
          </div>
          <button
            onClick={() => setShowCreateJobModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Job
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <UserCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-gray-900">Job Assignment Workflow</p>
            <p className="text-gray-600 mt-0.5">
              As Admin, you create jobs and assign them to <strong>Special Employees</strong>.
              Special Employees then reassign the jobs to regular Employees who carry out the work.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {kanbanCols.map(col => (
            <div key={col.key} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <p className="text-gray-600 mb-1 capitalize">{col.label}</p>
              <p className="text-gray-900">{jobs.filter(j => j.status === col.key).length}</p>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="grid lg:grid-cols-4 gap-4">
          {kanbanCols.map(col => (
            <div key={col.key} className={`${col.bg} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">{col.label}</h3>
                <span className={`px-2.5 py-1 rounded-full text-sm ${col.badge}`}>
                  {jobs.filter(j => j.status === col.key).length}
                </span>
              </div>
              <div className="space-y-3">
                {jobs.filter(j => j.status === col.key).map(job => (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => { setSelectedJob(job); setShowJobDetailModal(true); }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-gray-900 flex-1 pr-2">{job.title}</h4>
                      <span className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${getPriorityColor(job.priority)}`} title={job.priority}></span>
                    </div>
                    <p className="text-gray-600 mb-2">{job.unit}</p>
                    {job.assignedTo && (
                      <div className="flex items-center gap-1.5 text-gray-600 mb-2">
                        <UserCheck className="w-3.5 h-3.5 text-purple-500" />
                        <span className="text-xs">{job.assignedTo}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">{job.category}</span>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs">{job.createdDate}</span>
                      </div>
                    </div>
                    {!job.assignedTo && job.status === 'pending' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedJob(job); setShowJobDetailModal(true); }}
                        className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        Assign to Special Employee
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Job Modal */}
      <Modal isOpen={showCreateJobModal} onClose={() => setShowCreateJobModal(false)} title="Create New Job" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Job Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Fix leaking pipe" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3} placeholder="Provide detailed description..." />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Category *</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Category</option>
                <option>Plumbing</option><option>Electrical</option><option>HVAC</option>
                <option>General Maintenance</option><option>Cleaning</option><option>Security</option>
                <option>Digital ID</option><option>Administrative</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Priority</label>
              <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Unit Number *</label>
              <input type="text" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="A-101" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Assign to Special Employee</label>
              <select value={formData.assignedTo} onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Assign Later</option>
                {specialEmployees.map(se => (
                  <option key={se.id} value={se.name}>{se.name} — {se.role}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={handleCreateJob} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Job</button>
            <button onClick={() => setShowCreateJobModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Job Detail / Assign Modal */}
      <Modal isOpen={showJobDetailModal} onClose={() => setShowJobDetailModal(false)} title="Job Details" size="lg">
        {selectedJob && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-gray-900 mb-1">{selectedJob.title}</h3>
                  <p className="text-gray-600">Unit: {selectedJob.unit}</p>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(selectedJob.status)} capitalize`}>
                  {selectedJob.status}
                </span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-gray-600 mb-1">Category</label><p className="text-gray-900">{selectedJob.category}</p></div>
              <div><label className="block text-gray-600 mb-1">Priority</label>
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getPriorityColor(selectedJob.priority)}`}></span>
                <span className="text-gray-900 capitalize">{selectedJob.priority}</span>
              </div>
              <div><label className="block text-gray-600 mb-1">Created</label><p className="text-gray-900">{selectedJob.createdDate}</p></div>
              <div><label className="block text-gray-600 mb-1">Assigned To</label>
                <p className="text-gray-900">{selectedJob.assignedTo ? `${selectedJob.assignedTo} (${selectedJob.assignedToRole})` : 'Not yet assigned'}</p>
              </div>
            </div>

            {selectedJob.status === 'pending' && (
              <div>
                <label className="block text-gray-700 mb-2">Assign to Special Employee</label>
                <div className="space-y-2">
                  {specialEmployees.map(se => (
                    <button
                      key={se.id}
                      onClick={() => handleAssignJob(selectedJob, se)}
                      className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600">{se.name.charAt(0)}</span>
                        </div>
                        <div className="text-left">
                          <p className="text-gray-900">{se.name}</p>
                          <p className="text-gray-600">{se.role}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-blue-600" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setShowJobDetailModal(false)} className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
