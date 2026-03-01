import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function EmployeeDashboard() {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const myTasks = [
    { id: 1, title: 'Fix water main valve – Block A', unit: 'Block A', priority: 'high', status: 'in-progress', assignedDate: '2026-02-28', dueDate: '2026-03-01', reportedBy: 'Samson Tadesse' },
    { id: 2, title: 'Repair streetlights – Block B road', unit: 'Block B', priority: 'high', status: 'pending', assignedDate: '2026-02-27', dueDate: '2026-03-02', reportedBy: 'Olyad Amanuel' },
    { id: 3, title: 'Clear sewage blockage – Block A entrance', unit: 'Block A', priority: 'high', status: 'in-progress', assignedDate: '2026-02-27', dueDate: '2026-02-28', reportedBy: 'Semira Ambisa' },
    { id: 4, title: 'Fill pothole – Main access road', unit: 'Common', priority: 'medium', status: 'pending', assignedDate: '2026-02-26', dueDate: '2026-03-03', reportedBy: 'Ramadan Oumer' },
  ];

  const completedTasks = [
    { id: 5, title: 'Repaired broken park bench', unit: 'Common Park', completedDate: '2026-02-25', reportedBy: 'Semira Ambisa' },
    { id: 6, title: 'Replaced community notice board', unit: 'Block B', completedDate: '2026-02-24', reportedBy: 'Mulugeta Haile' },
    { id: 7, title: 'Fixed drainage issue near gate', unit: 'Main Gate', completedDate: '2026-02-23', reportedBy: 'Samson Tadesse' },
  ];

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleUpdateStatus = (status) => {
    toast.success(`Task status updated to ${status}!`);
    setShowTaskModal(false);
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
          <h1>My Tasks</h1>
          <p className="text-gray-600 mt-1">View and manage your assigned community tasks</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-gray-600">Active Tasks</p>
                <p className="text-gray-900">{myTasks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-gray-600">Completed This Week</p>
                <p className="text-gray-900">{completedTasks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-gray-600">High Priority</p>
                <p className="text-gray-900">{myTasks.filter((j) => j.priority === 'high').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2>Active Tasks</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {myTasks.map((task) => (
              <div key={task.id} className="p-6 hover:bg-gray-50 cursor-pointer" onClick={() => handleViewTask(task)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{task.title}</h3>
                    <p className="text-gray-600">{task.unit} — Reported by: {task.reportedBy}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full ${getPriorityColor(task.priority)} capitalize`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <StatusBadge status={task.status} size="sm" />
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {task.dueDate}</span>
                  </div>
                  <span>Assigned: {task.assignedDate}</span>
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
            {completedTasks.map((task) => (
              <div key={task.id} className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-900 mb-1">{task.title}</p>
                  <p className="text-gray-600">{task.unit} — Reported by: {task.reportedBy}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status="completed" size="sm" />
                  <p className="text-gray-600 mt-1">{task.completedDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* task Details Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Task Details"
        size="lg"
      >
        {selectedTask && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-gray-900 mb-2">{selectedTask.title}</h3>
              <p className="text-gray-600">{selectedTask.unit}</p>
              <p className="text-gray-600">Reported by: {selectedTask.reportedBy}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Priority</label>
                <span className={`inline-block px-3 py-1 rounded-full ${getPriorityColor(selectedTask.priority)} capitalize`}>
                  {selectedTask.priority}
                </span>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Current Status</label>
                <StatusBadge status={selectedTask.status} />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Assigned Date</label>
                <p className="text-gray-900">{selectedTask.assignedDate}</p>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Due Date</label>
                <p className="text-gray-900">{selectedTask.dueDate}</p>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Update Status</label>
              <div className="flex gap-3">
                {selectedTask.status === 'pending' && (
                  <button
                    onClick={() => handleUpdateStatus('in-progress')}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Start Task
                  </button>
                )}
                {selectedTask.status === 'in-progress' && (
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
                placeholder="Add any notes or comments about this task..."
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
                onClick={() => setShowTaskModal(false)}
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
