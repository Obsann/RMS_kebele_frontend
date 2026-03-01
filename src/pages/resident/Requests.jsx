import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { Wrench, MessageSquare } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function ResidentRequests() {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [requestType, setRequestType] = useState('maintenance');

  const requests = [
    { id: 1, type: 'maintenance', subject: 'Leaking pipe in kitchen', category: 'Plumbing', description: 'Pipe under sink is leaking steadily.', status: 'in-progress', date: '2026-02-24', response: 'Technician assigned — Samuel Fayisa' },
    { id: 2, type: 'maintenance', subject: 'AC not cooling properly', category: 'HVAC', description: 'Air conditioner is running but not cooling the room.', status: 'pending', date: '2026-02-23', response: '-' },
    { id: 3, type: 'complaint', subject: 'Noise from upstairs', category: 'Noise', description: 'Loud music and noise late at night from the unit above.', status: 'pending', date: '2026-02-22', response: '-' },
    { id: 4, type: 'maintenance', subject: 'Door lock issue', category: 'Maintenance', description: 'Main door lock is stuck and difficult to open.', status: 'completed', date: '2026-02-18', response: 'Completed by Mekonnen Desta' },
  ];

  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'medium',
  });

  const maintenanceCategories = ['Plumbing', 'Electrical', 'HVAC', 'General Maintenance', 'Appliance', 'Other'];
  const complaintCategories = ['Noise', 'Cleanliness', 'Parking', 'Safety', 'Neighbor Issue', 'Other'];

  const handleSubmit = () => {
    if (!formData.category || !formData.subject || !formData.description) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success(`${requestType === 'maintenance' ? 'Maintenance request' : 'Complaint'} submitted successfully!`);
    setShowRequestModal(false);
    setShowComplaintModal(false);
    setFormData({ category: '', subject: '', description: '', priority: 'medium' });
  };

  const openModal = (type) => {
    setRequestType(type);
    if (type === 'maintenance') {
      setShowRequestModal(true);
    } else {
      setShowComplaintModal(true);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1>My Requests & Complaints</h1>
            <p className="text-gray-600 mt-1">Track your maintenance requests and complaints</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => openModal('maintenance')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Wrench className="w-5 h-5" />
              New Request
            </button>
            <button
              onClick={() => openModal('complaint')}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              New Complaint
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Total Requests</p>
            <p className="text-gray-900">{requests.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Pending / In Progress</p>
            <p className="text-gray-900">{requests.filter((r) => r.status !== 'completed').length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Completed</p>
            <p className="text-gray-900">{requests.filter((r) => r.status === 'completed').length}</p>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                      request.type === 'maintenance'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {request.type === 'maintenance' ? <Wrench className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                      {request.type}
                    </span>
                    <StatusBadge status={request.status} size="sm" />
                  </div>
                  <h3 className="text-gray-900 mb-1">{request.subject}</h3>
                  <p className="text-gray-600 mb-2">{request.description}</p>
                  <div className="flex flex-wrap gap-4 text-gray-500">
                    <span>Category: {request.category}</span>
                    <span>•</span>
                    <span>Submitted: {request.date}</span>
                  </div>
                </div>
              </div>

              {request.response !== '-' && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-gray-600 mb-1">Response:</p>
                  <p className="text-gray-900">{request.response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit Maintenance Request Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Submit Maintenance Request"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {maintenanceCategories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Subject *</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the issue"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Provide detailed information about the maintenance issue..."
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low — Can wait</option>
              <option value="medium">Medium — Normal</option>
              <option value="high">High — Urgent</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Request
            </button>
            <button
              onClick={() => setShowRequestModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Submit Complaint Modal */}
      <Modal
        isOpen={showComplaintModal}
        onClose={() => setShowComplaintModal(false)}
        title="Submit Complaint"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {complaintCategories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Subject *</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the complaint"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Provide detailed information about your complaint..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Submit Complaint
            </button>
            <button
              onClick={() => setShowComplaintModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
