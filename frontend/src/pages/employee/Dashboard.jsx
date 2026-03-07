import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertTriangle, Calendar, Loader2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import { toast } from 'sonner';
import { getJobs, updateJobStatus } from '../../utils/api';

export default function EmployeeDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskNotes, setTaskNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs();
      setJobs(data.jobs || []);
    } catch (error) {
      toast.error('Failed to load tasks');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedTask) return;
    setSubmitting(true);
    try {
      await updateJobStatus(selectedTask._id, status, taskNotes);
      toast.success(`Task marked as ${status}`);
      setShowTaskModal(false);
      setTaskNotes('');
      fetchJobs();
    } catch (error) {
      toast.error(error.message || 'Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  const priorityColors = {
    critical: 'text-red-700 bg-red-50 border-red-200',
    high: 'text-orange-700 bg-orange-50 border-orange-200',
    medium: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    low: 'text-green-700 bg-green-50 border-green-200'
  };

  const statusColors = {
    assigned: 'text-blue-700 bg-blue-50 border-blue-200',
    'in-progress': 'text-purple-700 bg-purple-50 border-purple-200',
    completed: 'text-green-700 bg-green-50 border-green-200'
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading your tasks...</span>
        </div>
      </DashboardLayout>
    );
  }

  const activedJobs = jobs.filter(j => j.status !== 'completed');
  const completedJobs = jobs.filter(j => j.status === 'completed');
  const todaysJobs = activedJobs.filter(j => {
    if (!j.dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return j.dueDate.startsWith(today);
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your assigned maintenance and service tasks</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-gray-600">Pending Tasks</p><p className="text-2xl font-semibold text-gray-900 mt-1">{activedJobs.length}</p></div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Clock className="w-6 h-6" /></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-gray-600">Due Today</p><p className="text-2xl font-semibold text-gray-900 mt-1">{todaysJobs.length}</p></div>
              <div className="p-3 bg-red-50 text-red-600 rounded-lg"><AlertTriangle className="w-6 h-6" /></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-gray-600">Completed (Total)</p><p className="text-2xl font-semibold text-gray-900 mt-1">{completedJobs.length}</p></div>
              <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle className="w-6 h-6" /></div>
            </div>
          </div>
        </div>

        {/* Active Tasks List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Your Active Tasks</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {activedJobs.length > 0 ? activedJobs.map(task => (
              <div key={task._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityColors[task.priority] || priorityColors.medium}`}>
                        {task.priority || 'medium'} priority
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[task.status] || statusColors.assigned}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm max-w-2xl">{task.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 pt-1">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Assigned: {new Date(task.assignedAt || task.createdAt).toLocaleDateString()}</span>
                      {task.dueDate && <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-red-500" /> Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">Unit: {task.unit || 'General'}</span>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedTask(task); setTaskNotes(task.notes || ''); setShowTaskModal(true); }} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                    Update Progress
                  </button>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>You have no active tasks aligned.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Update Modal */}
      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} title="Update Task Status" size="md">
        {selectedTask && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-1">{selectedTask.title}</h3>
              <p className="text-sm text-gray-600">{selectedTask.description}</p>
              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded">Unit: {selectedTask.unit || 'General'}</span>
                <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded">Priority: {selectedTask.priority}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Notes / Findings</label>
              <textarea
                value={taskNotes}
                onChange={(e) => setTaskNotes(e.target.value)}
                rows={3}
                placeholder="Briefly describe the work done or any issues found..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-3">
              {selectedTask.status === 'assigned' && (
                <button disabled={submitting} onClick={() => handleUpdateStatus('in-progress')} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Mark In-Progress</button>
              )}
              {(selectedTask.status === 'assigned' || selectedTask.status === 'in-progress') && (
                <button disabled={submitting} onClick={() => handleUpdateStatus('completed')} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">Mark Completed</button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
