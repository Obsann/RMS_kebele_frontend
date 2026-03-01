import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { IdCard, CheckCircle, XCircle, Eye, UserCheck, Clock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const specialEmployees = [
  { id: 1, name: 'Samuel Tolasa', role: 'Senior Manager' },
  { id: 2, name: 'Temesgen Alemu', role: 'Supervisor' },
  { id: 3, name: 'Mekdes Haile', role: 'Coordinator' },
];

const initialRequests = [
  { id: 1, resident: 'Samson Tadesse', unit: 'A-101', email: 'samson.tadesse@email.com', requestDate: '2026-02-26', status: 'pending', note: 'First-time ID request', assignedTo: '' },
  { id: 2, resident: 'Olyad Amanuel', unit: 'B-205', email: 'olyad.amanuel@email.com', requestDate: '2026-02-25', status: 'approved', note: 'Renewal request', assignedTo: 'Samuel Tolasa' },
  { id: 3, resident: 'Mulugeta Haile', unit: 'C-312', email: 'mulugeta.haile@email.com', requestDate: '2026-02-24', status: 'pending', note: 'Lost ID replacement', assignedTo: '' },
  { id: 4, resident: 'Semira Ambisa', unit: 'A-204', email: 'semira.a@email.com', requestDate: '2026-02-23', status: 'approved', note: 'New resident onboarding', assignedTo: 'Temesgen Alemu' },
  { id: 5, resident: 'Ramadan Oumer', unit: 'B-108', email: 'ramadan.oumer@email.com', requestDate: '2026-02-22', status: 'completed', note: 'ID issued successfully', assignedTo: 'Mekdes Haile' },
  { id: 6, resident: 'Hana Bekele', unit: 'D-201', email: 'hana.bekele@email.com', requestDate: '2026-02-21', status: 'rejected', note: 'Missing documents', assignedTo: '' },
];

export default function AdminDigitalID() {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all' ? requests : requests.filter(r => r.status === activeTab);

  const handleApprove = (req) => {
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'approved' } : r));
    toast.success(`ID request for ${req.resident} approved!`);
    setShowDetailModal(false);
    setSelectedRequest({ ...req, status: 'approved' });
    setShowAssignModal(true);
  };

  const handleReject = (req) => {
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'rejected' } : r));
    toast.error(`ID request for ${req.resident} rejected.`);
    setShowDetailModal(false);
  };

  const handleAssignToSpecialEmployee = (se) => {
    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, assignedTo: se.name, status: 'approved' } : r));
    toast.success(`Job to issue ID for ${selectedRequest.resident} assigned to ${se.name}!`);
    setShowAssignModal(false);
  };

  const statusColors = {
    pending: 'bg-yellow-50 border-yellow-200',
    approved: 'bg-blue-50 border-blue-200',
    completed: 'bg-green-50 border-green-200',
    rejected: 'bg-red-50 border-red-200',
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'completed', label: 'Completed' },
    { key: 'rejected', label: 'Rejected' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1>Digital ID System</h1>
          <p className="text-gray-600 mt-1">Review and approve resident Digital ID requests</p>
        </div>

        {/* Workflow Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <p className="text-gray-900 mb-3">Digital ID Workflow</p>
          <div className="flex flex-wrap items-center gap-3">
            {[
              { icon: <IdCard className="w-4 h-4" />, label: 'Resident Requests ID', color: 'bg-gray-100 text-gray-700' },
              { icon: <ArrowRight className="w-4 h-4 text-blue-400" />, label: '', color: '' },
              { icon: <CheckCircle className="w-4 h-4" />, label: 'Admin Approves', color: 'bg-blue-100 text-blue-700' },
              { icon: <ArrowRight className="w-4 h-4 text-blue-400" />, label: '', color: '' },
              { icon: <UserCheck className="w-4 h-4" />, label: 'Special Employee Assigned', color: 'bg-purple-100 text-purple-700' },
              { icon: <ArrowRight className="w-4 h-4 text-blue-400" />, label: '', color: '' },
              { icon: <Clock className="w-4 h-4" />, label: 'Employee Sets Due Date', color: 'bg-yellow-100 text-yellow-700' },
              { icon: <ArrowRight className="w-4 h-4 text-blue-400" />, label: '', color: '' },
              { icon: <IdCard className="w-4 h-4" />, label: 'ID Delivered to Resident', color: 'bg-green-100 text-green-700' },
            ].map((step, idx) =>
              step.label ? (
                <span key={idx} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${step.color}`}>
                  {step.icon}{step.label}
                </span>
              ) : (
                <span key={idx}>{step.icon}</span>
              )
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Total Requests</p>
            <p className="text-gray-900">{requests.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-yellow-200 bg-yellow-50">
            <p className="text-yellow-700 mb-1">Pending</p>
            <p className="text-gray-900">{requests.filter(r => r.status === 'pending').length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-200 bg-blue-50">
            <p className="text-blue-700 mb-1">Approved</p>
            <p className="text-gray-900">{requests.filter(r => r.status === 'approved').length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-green-200 bg-green-50">
            <p className="text-green-700 mb-1">Completed</p>
            <p className="text-gray-900">{requests.filter(r => r.status === 'completed').length}</p>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200 px-6 flex gap-6 flex-wrap">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 border-b-2 transition-colors capitalize ${
                  activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {tab.key === 'all' ? requests.length : requests.filter(r => r.status === tab.key).length}
                </span>
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-600">Resident</th>
                  <th className="px-6 py-3 text-left text-gray-600">Unit</th>
                  <th className="px-6 py-3 text-left text-gray-600">Request Date</th>
                  <th className="px-6 py-3 text-left text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-gray-600">Assigned To</th>
                  <th className="px-6 py-3 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600">{req.resident.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-gray-900">{req.resident}</p>
                          <p className="text-gray-500">{req.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{req.unit}</td>
                    <td className="px-6 py-4 text-gray-600">{req.requestDate}</td>
                    <td className="px-6 py-4"><StatusBadge status={req.status} size="sm" /></td>
                    <td className="px-6 py-4 text-gray-600">{req.assignedTo || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setSelectedRequest(req); setShowDetailModal(true); }}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-600" title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(req)}
                              className="p-2 hover:bg-green-50 rounded-lg text-green-600" title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(req)}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-600" title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {req.status === 'approved' && !req.assignedTo && (
                          <button
                            onClick={() => { setSelectedRequest(req); setShowAssignModal(true); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            Assign
                          </button>
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

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="ID Request Details" size="md">
        {selectedRequest && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-2xl">{selectedRequest.resident.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-gray-900">{selectedRequest.resident}</h3>
                <p className="text-gray-600">{selectedRequest.email}</p>
                <p className="text-gray-600">Unit {selectedRequest.unit}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div><label className="block text-gray-600 mb-1">Request Date</label><p className="text-gray-900">{selectedRequest.requestDate}</p></div>
              <div><label className="block text-gray-600 mb-1">Status</label><StatusBadge status={selectedRequest.status} /></div>
              <div className="col-span-2"><label className="block text-gray-600 mb-1">Note</label><p className="text-gray-900">{selectedRequest.note}</p></div>
              {selectedRequest.assignedTo && (
                <div className="col-span-2"><label className="block text-gray-600 mb-1">Assigned To</label><p className="text-gray-900">{selectedRequest.assignedTo}</p></div>
              )}
            </div>
            <div className="flex gap-3">
              {selectedRequest.status === 'pending' && (
                <>
                  <button onClick={() => handleApprove(selectedRequest)} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Approve & Assign</button>
                  <button onClick={() => handleReject(selectedRequest)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Reject</button>
                </>
              )}
              <button onClick={() => setShowDetailModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign to Special Employee Modal */}
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Assign ID Job to Special Employee" size="md">
        {selectedRequest && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-gray-900">Creating ID issuance job for: <strong>{selectedRequest.resident}</strong></p>
            </div>
            <p className="text-gray-600">Select a Special Employee to handle this ID issuance:</p>
            <div className="space-y-3">
              {specialEmployees.map(se => (
                <button
                  key={se.id}
                  onClick={() => handleAssignToSpecialEmployee(se)}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
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
            <button onClick={() => setShowAssignModal(false)} className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
