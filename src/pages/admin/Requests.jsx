import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { Eye, Wrench, MessageSquare, Filter, Search } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function AdminRequests() {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const requests = [
    {
      id: 1, type: 'maintenance', resident: 'Samson Tadesse', unit: 'A-101',
      category: 'Plumbing', subject: 'Leaking pipe in kitchen',
      description: 'There is a leaking pipe under the kitchen sink. Water is dripping constantly.',
      status: 'pending', date: '2026-02-24', priority: 'high',
    },
    {
      id: 2, type: 'maintenance', resident: 'Olyad Amanuel', unit: 'B-205',
      category: 'Electrical', subject: 'Light fixture not working',
      description: 'The ceiling light in the bedroom stopped working suddenly.',
      status: 'in-progress', date: '2026-02-23', priority: 'medium',
    },
    {
      id: 3, type: 'complaint', resident: 'Mulugeta Haile', unit: 'C-312',
      category: 'Noise', subject: 'Loud music from neighbor',
      description: 'Loud music playing late at night from the unit above.',
      status: 'pending', date: '2026-02-23', priority: 'medium',
    },
    {
      id: 4, type: 'maintenance', resident: 'Semira Ambisa', unit: 'A-204',
      category: 'HVAC', subject: 'AC not cooling properly',
      description: 'The air conditioning is running but not cooling effectively.',
      status: 'completed', date: '2026-02-22', priority: 'high',
    },
    {
      id: 5, type: 'complaint', resident: 'Ramadan Oumer', unit: 'B-108',
      category: 'Cleanliness', subject: 'Common area not clean',
      description: 'The hallway has not been cleaned for several days.',
      status: 'pending', date: '2026-02-22', priority: 'low',
    },
  ];

  const handleViewDetails = (request) => { setSelectedRequest(request); setShowDetailsModal(true); };
  const handleConvertToJob = (request) => { setSelectedRequest(request); setShowConvertModal(true); };
  const confirmConvertToJob = () => { toast.success('Request converted to job successfully!'); setShowConvertModal(false); };

  const filteredRequests = activeTab === 'all' ? requests : requests.filter((r) => r.type === activeTab);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1>Requests & Complaints</h1>
          <p className="text-gray-600 mt-1">Manage resident maintenance requests and complaints</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Total Requests</p>
            <p className="text-gray-900">{requests.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Pending</p>
            <p className="text-gray-900">{requests.filter((r) => r.status === 'pending').length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">In Progress</p>
            <p className="text-gray-900">{requests.filter((r) => r.status === 'in-progress').length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Completed</p>
            <p className="text-gray-900">{requests.filter((r) => r.status === 'completed').length}</p>
          </div>
        </div>

        {/* Tabs + Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              {[
                { key: 'all', label: `All (${requests.length})` },
                { key: 'maintenance', label: `Maintenance (${requests.filter((r) => r.type === 'maintenance').length})` },
                { key: 'complaint', label: `Complaints (${requests.filter((r) => r.type === 'complaint').length})` },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`py-4 border-b-2 transition-colors ${
                    activeTab === key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter row */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search by resident, unit, or subject..." className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-5 h-5" /> Filters
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-600">Type</th>
                  <th className="px-6 py-3 text-left text-gray-600">Resident</th>
                  <th className="px-6 py-3 text-left text-gray-600">Unit</th>
                  <th className="px-6 py-3 text-left text-gray-600">Subject</th>
                  <th className="px-6 py-3 text-left text-gray-600">Category</th>
                  <th className="px-6 py-3 text-left text-gray-600">Date</th>
                  <th className="px-6 py-3 text-left text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                        request.type === 'maintenance' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {request.type === 'maintenance' ? <Wrench className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                        {request.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{request.resident}</td>
                    <td className="px-6 py-4">{request.unit}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{request.subject}</td>
                    <td className="px-6 py-4">{request.category}</td>
                    <td className="px-6 py-4 text-gray-600">{request.date}</td>
                    <td className="px-6 py-4"><StatusBadge status={request.status} size="sm" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleViewDetails(request)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600" title="View Details"><Eye className="w-4 h-4" /></button>
                        {request.type === 'maintenance' && request.status === 'pending' && (
                          <button onClick={() => handleConvertToJob(request)} className="p-2 hover:bg-green-50 rounded-lg text-green-600" title="Convert to Job"><Wrench className="w-4 h-4" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Request Details Modal */}
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Request Details" size="lg">
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Type</label>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${selectedRequest.type === 'maintenance' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>{selectedRequest.type}</span>
              </div>
              <div><label className="block text-gray-600 mb-1">Status</label><StatusBadge status={selectedRequest.status} /></div>
              <div><label className="block text-gray-600 mb-1">Resident</label><p className="text-gray-900">{selectedRequest.resident}</p></div>
              <div><label className="block text-gray-600 mb-1">Unit</label><p className="text-gray-900">{selectedRequest.unit}</p></div>
              <div><label className="block text-gray-600 mb-1">Category</label><p className="text-gray-900">{selectedRequest.category}</p></div>
              <div><label className="block text-gray-600 mb-1">Date Submitted</label><p className="text-gray-900">{selectedRequest.date}</p></div>
            </div>
            <div><label className="block text-gray-600 mb-1">Subject</label><p className="text-gray-900">{selectedRequest.subject}</p></div>
            <div><label className="block text-gray-600 mb-1">Description</label><p className="text-gray-900">{selectedRequest.description}</p></div>
            <div className="flex gap-3 pt-4">
              {selectedRequest.type === 'maintenance' && selectedRequest.status === 'pending' && (
                <button onClick={() => { setShowDetailsModal(false); handleConvertToJob(selectedRequest); }} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Convert to Job</button>
              )}
              <button onClick={() => setShowDetailsModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Convert to Job Modal */}
      <Modal isOpen={showConvertModal} onClose={() => setShowConvertModal(false)} title="Convert Request to Job" size="md">
        {selectedRequest && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-gray-900">Convert this maintenance request into a job?</p>
              <p className="text-gray-600 mt-1">{selectedRequest.subject}</p>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Assign to Employee</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Employee</option>
                <option>Samuel Fayisa — Plumbing</option>
                <option>Tesfaye Alemu — Electrical</option>
                <option>Biruk Woldemariam — HVAC</option>
                <option>Mekonnen Desta — General</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Priority</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={confirmConvertToJob} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Convert to Job</button>
              <button onClick={() => setShowConvertModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
