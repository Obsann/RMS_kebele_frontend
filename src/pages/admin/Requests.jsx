import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { Eye, AlertTriangle, MessageSquare, Filter, Search, UserCheck, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function AdminRequests() {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const [requests, setRequests] = useState([
    {
      id: 1, type: 'request', resident: 'Samson Tadesse', unit: 'A-101',
      category: 'Water Supply', subject: 'No water supply since morning',
      description: 'Water has been cut off in Block A since 6 AM. Multiple residents affected.',
      status: 'pending', date: '2026-02-28', priority: 'high',
    },
    {
      id: 2, type: 'complaint', resident: 'Olyad Amanuel', unit: 'B-205',
      category: 'Electricity', subject: 'Streetlight outage on Block B road',
      description: 'Three streetlights on the main road near Block B have been out for two nights. Safety concern for residents walking at night.',
      status: 'in-progress', date: '2026-02-27', priority: 'high', assignedTo: 'Samuel Tolasa',
    },
    {
      id: 3, type: 'complaint', resident: 'Mulugeta Haile', unit: 'C-312',
      category: 'Noise Disturbance', subject: 'Loud construction noise during rest hours',
      description: 'Construction work continues past 10 PM in the adjacent lot, disturbing residents in Block C.',
      status: 'pending', date: '2026-02-27', priority: 'medium',
    },
    {
      id: 4, type: 'request', resident: 'Semira Ambisa', unit: 'A-204',
      category: 'Sewage/Sanitation', subject: 'Sewage overflow near Block A entrance',
      description: 'Sewage from the main drain is overflowing near the Block A entrance. Strong odor and health hazard.',
      status: 'resolved', date: '2026-02-26', priority: 'high', assignedTo: 'Samuel Fayisa',
    },
    {
      id: 5, type: 'complaint', resident: 'Ramadan Oumer', unit: 'B-108',
      category: 'Waste Collection', subject: 'Garbage not collected for 4 days',
      description: 'The waste collection truck has not visited Block B for four consecutive days. Trash bins are overflowing.',
      status: 'pending', date: '2026-02-26', priority: 'medium',
    },
    {
      id: 6, type: 'request', resident: 'Samson Tadesse', unit: 'A-101',
      category: 'Security', subject: 'Suspicious activity near parking area',
      description: 'Unknown individuals seen loitering near the Block A parking lot late at night. Requesting increased security patrol.',
      status: 'in-progress', date: '2026-02-25', priority: 'high', assignedTo: 'Samuel Tolasa',
    },
    {
      id: 7, type: 'request', resident: 'Olyad Amanuel', unit: 'B-205',
      category: 'Road/Access', subject: 'Pothole on main access road',
      description: 'Large pothole on the main road near Block B gate causing vehicle damage.',
      status: 'pending', date: '2026-02-25', priority: 'medium',
    },
    {
      id: 8, type: 'complaint', resident: 'Semira Ambisa', unit: 'A-204',
      category: 'Public Infrastructure', subject: 'Broken bench in community park',
      description: 'The wooden bench near the children\'s play area is broken and poses a safety risk.',
      status: 'resolved', date: '2026-02-24', priority: 'low', assignedTo: 'Samuel Fayisa',
    },
  ]);

  const handleViewDetails = (request) => { setSelectedRequest(request); setShowDetailsModal(true); };
  const handleAssign = (request) => { setSelectedRequest(request); setShowAssignModal(true); };
  const confirmAssign = () => {
    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'in-progress', assignedTo: 'Assigned Staff' } : r));
    toast.success('Request assigned to staff successfully!');
    setShowAssignModal(false);
  };
  const handleResolve = (request) => {
    setRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: 'resolved' } : r));
    toast.success('Request marked as resolved!');
  };

  const filteredRequests = activeTab === 'all' ? requests : requests.filter((r) => r.type === activeTab);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1>Requests & Complaints</h1>
          <p className="text-gray-600 mt-1">Manage community-level issues reported by residents</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Total Issues</p>
            <p className="text-gray-900">{requests.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Pending</p>
            <p className="text-yellow-600">{requests.filter(r => r.status === 'pending').length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">In Progress</p>
            <p className="text-blue-600">{requests.filter(r => r.status === 'in-progress').length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Resolved</p>
            <p className="text-green-600">{requests.filter(r => r.status === 'resolved').length}</p>
          </div>
        </div>

        {/* Tabs + Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              {[
                { key: 'all', label: `All (${requests.length})` },
                { key: 'request', label: `Requests (${requests.filter(r => r.type === 'request').length})` },
                { key: 'complaint', label: `Complaints (${requests.filter(r => r.type === 'complaint').length})` },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`py-4 border-b-2 transition-colors ${activeTab === key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

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
                  <th className="px-6 py-3 text-left text-gray-600">Category</th>
                  <th className="px-6 py-3 text-left text-gray-600">Subject</th>
                  <th className="px-6 py-3 text-left text-gray-600">Priority</th>
                  <th className="px-6 py-3 text-left text-gray-600">Date</th>
                  <th className="px-6 py-3 text-left text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${request.type === 'request' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                        {request.type === 'request' ? <AlertTriangle className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                        {request.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{request.resident}<br /><span className="text-gray-500 text-sm">{request.unit}</span></td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-sm">{request.category}</span></td>
                    <td className="px-6 py-4 max-w-xs truncate">{request.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm ${request.priority === 'high' ? 'bg-red-100 text-red-700' : request.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                        }`}>{request.priority}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{request.date}</td>
                    <td className="px-6 py-4"><StatusBadge status={request.status} size="sm" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleViewDetails(request)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600" title="View Details"><Eye className="w-4 h-4" /></button>
                        {request.status === 'pending' && (
                          <button onClick={() => handleAssign(request)} className="p-2 hover:bg-green-50 rounded-lg text-green-600" title="Assign to Staff"><UserCheck className="w-4 h-4" /></button>
                        )}
                        {request.status === 'in-progress' && (
                          <button onClick={() => handleResolve(request)} className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600" title="Mark Resolved"><CheckCircle className="w-4 h-4" /></button>
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
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Issue Details" size="lg">
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Type</label>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${selectedRequest.type === 'request' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>{selectedRequest.type}</span>
              </div>
              <div><label className="block text-gray-600 mb-1">Status</label><StatusBadge status={selectedRequest.status} /></div>
              <div><label className="block text-gray-600 mb-1">Resident</label><p className="text-gray-900">{selectedRequest.resident}</p></div>
              <div><label className="block text-gray-600 mb-1">Unit</label><p className="text-gray-900">{selectedRequest.unit}</p></div>
              <div><label className="block text-gray-600 mb-1">Category</label><p className="text-gray-900">{selectedRequest.category}</p></div>
              <div><label className="block text-gray-600 mb-1">Priority</label><p className="text-gray-900 capitalize">{selectedRequest.priority}</p></div>
              <div><label className="block text-gray-600 mb-1">Date Submitted</label><p className="text-gray-900">{selectedRequest.date}</p></div>
              {selectedRequest.assignedTo && <div><label className="block text-gray-600 mb-1">Assigned To</label><p className="text-gray-900">{selectedRequest.assignedTo}</p></div>}
            </div>
            <div><label className="block text-gray-600 mb-1">Subject</label><p className="text-gray-900">{selectedRequest.subject}</p></div>
            <div><label className="block text-gray-600 mb-1">Description</label><p className="text-gray-900">{selectedRequest.description}</p></div>
            <div className="flex gap-3 pt-4">
              {selectedRequest.status === 'pending' && (
                <button onClick={() => { setShowDetailsModal(false); handleAssign(selectedRequest); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Assign to Staff</button>
              )}
              {selectedRequest.status === 'in-progress' && (
                <button onClick={() => { handleResolve(selectedRequest); setShowDetailsModal(false); }} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Mark Resolved</button>
              )}
              <button onClick={() => setShowDetailsModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign to Staff Modal */}
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Assign to Staff" size="md">
        {selectedRequest && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-gray-900">{selectedRequest.subject}</p>
              <p className="text-gray-600 mt-1">Category: {selectedRequest.category} | Priority: {selectedRequest.priority}</p>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Assign to</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Staff Member</option>
                <option>Samuel Tolasa — Special Employee</option>
                <option>Samuel Fayisa — Maintenance</option>
                <option>Tesfaye Alemu — Electricity</option>
                <option>Biruk Woldemariam — Sanitation</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Notes (Optional)</label>
              <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Any special instructions..." />
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={confirmAssign} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Assign</button>
              <button onClick={() => setShowAssignModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
