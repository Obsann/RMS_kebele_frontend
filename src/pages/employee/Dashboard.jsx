import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function EmployeeDashboard() {
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const myJobs = [
    { id: 1, title: 'Fix leaking pipe', unit: 'A-101', priority: 'high', status: 'in-progress', assignedDate: '2026-02-24', dueDate: '2026-02-26', resident: 'Samson Tadesse' },
    { id: 2, title: 'Replace ceiling fan', unit: 'B-305', priority: 'medium', status: 'pending', assignedDate: '2026-02-25', dueDate: '2026-02-28', resident: 'Olyad Amanuel' },
    { id: 3, title: 'Install new outlet', unit: 'A-204', priority: 'medium', status: 'in-progress', assignedDate: '2026-02-24', dueDate: '2026-02-27', resident: 'Semira Ambisa' },
    { id: 4, title: 'AC maintenance checkup', unit: 'C-110', priority: 'low', status: 'pending', assignedDate: '2026-02-25', dueDate: '2026-03-01', resident: 'Ramadan Oumer' },
  ];

  const completedJobs = [
    { id: 5, title: 'Fix door lock', unit: 'C-201', completedDate: '2026-02-23', resident: 'Mekonnen Desta' },
    { id: 6, title: 'Replace light bulbs', unit: 'B-108', completedDate: '2026-02-22', resident: 'Mulugeta Haile' },
    { id: 7, title: 'Repair window screen', unit: 'A-305', completedDate: '2026-02-21', resident: 'Samuel Tolasa' },
  ];

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  const handleUpdateStatus = (status) => {
    toast.success(`Job status updated to ${status}!`);
    setShowJobModal(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1>My Jobs</h1>
          <p className="text-gray-600 mt-1">View and manage your assigned tasks</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-gray-600">Active Jobs</p>
                <p className="text-gray-900">{myJobs.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-gray-600">Completed This Week</p>
                <p className="text-gray-900">{completedJobs.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-gray-600">High Priority</p>
                <p className="text-gray-900">{myJobs.filter((j) => j.priority === 'high').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Jobs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2>Active Jobs</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {myJobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-gray-50 cursor-pointer" onClick={() => handleViewJob(job)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-gray-600">Unit {job.unit} — {job.resident}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full ${getPriorityColor(job.priority)} capitalize`}>
                    {job.priority}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <StatusBadge status={job.status} size="sm" />
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {job.dueDate}</span>
                  </div>
                  <span>Assigned: {job.assignedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Completed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2>Recently Completed</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {completedJobs.map((job) => (
              <div key={job.id} className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-900 mb-1">{job.title}</p>
                  <p className="text-gray-600">Unit {job.unit} — {job.resident}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status="completed" size="sm" />
                  <p className="text-gray-600 mt-1">{job.completedDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      <Modal
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        title="Job Details"
        size="lg"
      >
        {selectedJob && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-gray-900 mb-2">{selectedJob.title}</h3>
              <p className="text-gray-600">Unit {selectedJob.unit}</p>
              <p className="text-gray-600">Resident: {selectedJob.resident}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Priority</label>
                <span className={`inline-block px-3 py-1 rounded-full ${getPriorityColor(selectedJob.priority)} capitalize`}>
                  {selectedJob.priority}
                </span>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Current Status</label>
                <StatusBadge status={selectedJob.status} />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Assigned Date</label>
                <p className="text-gray-900">{selectedJob.assignedDate}</p>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Due Date</label>
                <p className="text-gray-900">{selectedJob.dueDate}</p>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Update Status</label>
              <div className="flex gap-3">
                {selectedJob.status === 'pending' && (
                  <button
                    onClick={() => handleUpdateStatus('in-progress')}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Start Job
                  </button>
                )}
                {selectedJob.status === 'in-progress' && (
                  <button
                    onClick={() => handleUpdateStatus('completed')}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Add Notes</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Add any notes or comments about this job..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => toast.success('Notes saved!')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Notes
              </button>
              <button
                onClick={() => setShowJobModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
