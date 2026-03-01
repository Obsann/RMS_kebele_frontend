import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { Eye, AlertTriangle, MessageSquare, Filter, Search, UserCheck, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const staffMembers = [
  { id: 1, name: 'Samuel Fayisa', category: 'Maintenance' },
  { id: 2, name: 'Tesfaye Alemu', category: 'Electricity' },
  { id: 3, name: 'Biruk Woldemariam', category: 'Sanitation' },
  { id: 4, name: 'Mekonnen Desta', category: 'General' },
  { id: 5, name: 'Hana Worku', category: 'Road Maintenance' },
  { id: 6, name: 'Meron Bekele', category: 'Waste Management' },
];

export default function SpecialEmployeeRequests() {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const [requests, setRequests] = useState([
    {
      id: 1, type: 'request', resident: 'Samson Tadesse', unit: 'A-101',
      category: 'Water Supply', subject: 'No water supply since morning',
      description: 'Water has been cut off in Block A since 6 AM. Multiple residents affected.',
      status: 'pending', date: '2026-02-28', priority: 'high', assignedTo: '',
    },
    {
      id: 2, type: 'complaint', resident: 'Olyad Amanuel', unit: 'B-205',
      category: 'Electricity', subject: 'Streetlight outage on Block B road',
      description: 'Three streetlights near Block B have been out for two nights.',
      status: 'assigned', date: '2026-02-27', priority: 'high', assignedTo: 'Tesfaye Alemu',
    },
    {
      id: 3, type: 'complaint', resident: 'Mulugeta Haile', unit: 'C-312',
      category: 'Noise Disturbance', subject: 'Loud construction noise during rest hours',
      description: 'Construction work continues past 10 PM in the adjacent lot.',
      status: 'pending', date: '2026-02-27', priority: 'medium', assignedTo: '',
    },
    {
      id: 4, type: 'request', resident: 'Semira Ambisa', unit: 'A-204',
      category: 'Sewage/Sanitation', subject: 'Sewage overflow near Block A entrance',
      description: 'Sewage from the main drain is overflowing near the Block A entrance.',
      status: 'completed', date: '2026-02-26', priority: 'high', assignedTo: 'Biruk Woldemariam',
    },
    {
      id: 5, type: 'complaint', resident: 'Ramadan Oumer', unit: 'B-108',
      category: 'Waste Collection', subject: 'Garbage not collected for 4 days',
      description: 'The waste collection truck has not visited Block B for four days.',
      status: 'pending', date: '2026-02-26', priority: 'medium', assignedTo: '',
    },
  ]);

  const handleViewDetails = (request) => { setSelectedRequest(request); setShowDetailsModal(true); };
  const handleAssign = (request) => { setSelectedRequest(request); setShowAssignModal(true); };

  const confirmAssign = (employeeId) => {
    const emp = staffMembers.find(e => e.id === parseInt(employeeId));
    if (!emp) { toast.error('Please select a staff member'); return; }
    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'assigned', assignedTo: emp.name } : r));
    toast.success(`Assigned to ${emp.name}!`);
    setShowAssignModal(false);
  };

  const handleMarkCompleted = (request) => {
    setRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: 'completed' } : r));
    toast.success('Issue marked as completed!');
  };

  const filteredRequests = activeTab === 'all' ? requests : requests.filter(r => r.type === activeTab);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1>Requests & Complaints</h1>
          <p className="text-gray-600 mt-1">Manage and assign community issues to staff</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Total</p>
            <p className="text-gray-900">{requests.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Pending</p>
            <p className="text-yellow-600">{requests.filter(r => r.status === 'pending').length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Assigned</p>
            <p className="text-blue-600">{requests.filter(r => r.status === 'assigned').length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Completed</p>
            <p className="text-green-600">{requests.filter(r => r.status === 'completed').length}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              {[
                { key: 'all', label: `All (${requests.length})` },
                { key: 'request', label: `Requests (${requests.filter(r => r.type === 'request').length})` },
                { key: 'complaint', label: `Complaints (${requests.filter(r => r.type === 'complaint').length})` },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`py-4 border-b-2 transition-colors ${activeTab === key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search issues..." className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                  <th className="px-6 py-3 text-left text-gray-600">Assigned To</th>
                  <th className="px-6 py-3 text-left text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map(request => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${request.type === 'request' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                        {request.type === 'request' ? <AlertTriangle className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                        {request.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{request.resident}<br /><span className="text-gray-500 text-sm">{request.unit}</span></td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-sm">{request.category}</span></td>
                    <td className="px-6 py-4 max-w-xs truncate">{request.subject}</td>
                    <td className="px-6 py-4 text-gray-600">{request.assignedTo || '—'}</td>
                    <td className="px-6 py-4"><StatusBadge status={request.status} size="sm" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleViewDetails(request)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600" title="View"><Eye className="w-4 h-4" /></button>
                        {request.status === 'pending' && (
                          <button onClick={() => handleAssign(request)} className="p-2 hover:bg-green-50 rounded-lg text-green-600" title="Assign"><UserCheck className="w-4 h-4" /></button>
                        )}
                        {request.status === 'assigned' && (
                          <button onClick={() => handleMarkCompleted(request)} className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600" title="Complete"><CheckCircle className="w-4 h-4" /></button>
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

      {/* Details Modal */}
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Issue Details" size="lg">
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-gray-600 mb-1">Type</label><span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${selectedRequest.type === 'request' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>{selectedRequest.type}</span></div>
              <div><label className="block text-gray-600 mb-1">Status</label><StatusBadge status={selectedRequest.status} /></div>
              <div><label className="block text-gray-600 mb-1">Resident</label><p className="text-gray-900">{selectedRequest.resident}</p></div>
              <div><label className="block text-gray-600 mb-1">Unit</label><p className="text-gray-900">{selectedRequest.unit}</p></div>
              <div><label className="block text-gray-600 mb-1">Category</label><p className="text-gray-900">{selectedRequest.category}</p></div>
              <div><label className="block text-gray-600 mb-1">Priority</label><p className="text-gray-900 capitalize">{selectedRequest.priority}</p></div>
            </div>
            <div><label className="block text-gray-600 mb-1">Subject</label><p className="text-gray-900">{selectedRequest.subject}</p></div>
            <div><label className="block text-gray-600 mb-1">Description</label><p className="text-gray-900">{selectedRequest.description}</p></div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => setShowDetailsModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign Modal */}
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Assign to Staff" size="md">
        {selectedRequest && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-gray-900">{selectedRequest.subject}</p>
              <p className="text-gray-600 mt-1">{selectedRequest.category} | {selectedRequest.priority} priority</p>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Select Staff Member</label>
              <div className="space-y-2 max-h-48 overflow-y-auto" id="staff-list">
                {staffMembers.map(emp => (
                  <label key={emp.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-blue-300">
                    <input type="radio" name="staff" value={emp.id} className="text-blue-600" />
                    <div>
                      <p className="text-gray-900">{emp.name}</p>
                      <p className="text-gray-500 text-sm">{emp.category}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => {
                const checked = document.querySelector('#staff-list input[name="staff"]:checked');
                confirmAssign(checked?.value || '');
              }} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Assign</button>
              <button onClick={() => setShowAssignModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
