import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { IdCard, CheckCircle, Clock, Eye, ArrowRight, User, Calendar, QrCode } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const employees = [
  { id: 1, name: 'Samuel Fayisa', category: 'General' },
  { id: 2, name: 'Tesfaye Alemu', category: 'Administrative' },
  { id: 3, name: 'Mekonnen Desta', category: 'General Maintenance' },
  { id: 4, name: 'Meron Bekele', category: 'Administrative' },
  { id: 5, name: 'Nardos Bekele', category: 'Administrative' },
];

const initialRequests = [
  { id: 1, resident: 'Samson Tadesse', unit: 'A-101', email: 'samson.tadesse@email.com', requestDate: '2026-02-26', status: 'pending', note: 'First-time ID request', assignedTo: '', dueDate: '' },
  { id: 2, resident: 'Olyad Amanuel', unit: 'B-205', email: 'olyad.amanuel@email.com', requestDate: '2026-02-25', status: 'approved', note: 'Renewal', assignedTo: 'Tesfaye Alemu', dueDate: '2026-03-05' },
  { id: 3, resident: 'Mulugeta Haile', unit: 'C-312', email: 'mulugeta.haile@email.com', requestDate: '2026-02-24', status: 'pending', note: 'Lost ID replacement', assignedTo: '', dueDate: '' },
  { id: 4, resident: 'Fasil Girma', unit: 'C-105', email: 'fasil.g@email.com', requestDate: '2026-02-23', status: 'approved', note: 'New resident', assignedTo: 'Meron Bekele', dueDate: '2026-03-03' },
  { id: 5, resident: 'Ramadan Oumer', unit: 'B-108', email: 'ramadan.oumer@email.com', requestDate: '2026-02-22', status: 'completed', note: 'ID issued', assignedTo: 'Nardos Bekele', dueDate: '2026-02-27', idNumber: 'RES-2026-0108' },
];

export default function SpecialEmployeeDigitalID() {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedReq, setSelectedReq] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [assignData, setAssignData] = useState({ employeeId: '', dueDate: '' });
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all' ? requests : requests.filter(r => r.status === activeTab);

  const handleAssign = () => {
    if (!assignData.employeeId || !assignData.dueDate) {
      toast.error('Please select an employee and set a due date');
      return;
    }
    const emp = employees.find(e => e.id === parseInt(assignData.employeeId));
    setRequests(prev => prev.map(r => r.id === selectedReq.id ? {
      ...r, assignedTo: emp.name, dueDate: assignData.dueDate, status: 'approved',
    } : r));
    toast.success(`ID job assigned to ${emp.name}! Due date: ${assignData.dueDate}`);
    setShowAssignModal(false);
    setAssignData({ employeeId: '', dueDate: '' });
  };

  const handleMarkIssued = (req) => {
    const idNumber = `RES-2026-0${req.unit.replace(/\D/g, '')}`;
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'completed', idNumber } : r));
    toast.success(`Digital ID issued for ${req.resident}!`);
    setShowDetailModal(false);
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending Approval' },
    { key: 'approved', label: 'In Progress' },
    { key: 'completed', label: 'Issued' },
  ];

  const statusColors = {
    pending: 'border-yellow-200',
    approved: 'border-blue-200',
    completed: 'border-green-200',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1>Digital ID System</h1>
          <p className="text-gray-600 mt-1">Manage Digital ID requests — assign to employees and track issuance</p>
        </div>

        {/* Workflow */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <p className="text-gray-900 mb-3">Your Role in Digital ID Workflow</p>
          <div className="flex flex-wrap items-center gap-3">
            {[
              { label: 'Admin approves request', color: 'bg-blue-100 text-blue-700' },
              null,
              { label: 'You receive approved requests', color: 'bg-purple-100 text-purple-700' },
              null,
              { label: 'You assign to Employee + set due date', color: 'bg-yellow-100 text-yellow-700' },
              null,
              { label: 'Employee issues the ID', color: 'bg-green-100 text-green-700' },
            ].map((item, idx) =>
              item ? (
                <span key={idx} className={`px-3 py-1.5 rounded-lg text-sm ${item.color}`}>{item.label}</span>
              ) : (
                <ArrowRight key={idx} className="w-4 h-4 text-blue-400" />
              )
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"><p className="text-gray-600 mb-1">Total</p><p className="text-gray-900">{requests.length}</p></div>
          <div className="bg-yellow-50 rounded-xl p-5 shadow-sm border border-yellow-200"><p className="text-yellow-700 mb-1">Pending</p><p className="text-gray-900">{requests.filter(r => r.status === 'pending').length}</p></div>
          <div className="bg-blue-50 rounded-xl p-5 shadow-sm border border-blue-200"><p className="text-blue-700 mb-1">In Progress</p><p className="text-gray-900">{requests.filter(r => r.status === 'approved').length}</p></div>
          <div className="bg-green-50 rounded-xl p-5 shadow-sm border border-green-200"><p className="text-green-700 mb-1">Issued</p><p className="text-gray-900">{requests.filter(r => r.status === 'completed').length}</p></div>
        </div>

        {/* Tabs + List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 flex gap-6 flex-wrap">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`py-4 border-b-2 transition-colors ${activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                {tab.label}
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {tab.key === 'all' ? requests.length : requests.filter(r => r.status === tab.key).length}
                </span>
              </button>
            ))}
          </div>

          <div className="divide-y divide-gray-200">
            {filtered.map(req => (
              <div key={req.id} className={`p-5 hover:bg-gray-50 border-l-4 ${statusColors[req.status] || 'border-gray-200'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600">{req.resident.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-gray-900">{req.resident}</p>
                      <p className="text-gray-600">Unit {req.unit} • {req.email}</p>
                      <p className="text-gray-500">Requested: {req.requestDate}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={req.status === 'approved' ? 'in-progress' : req.status} size="sm" />
                    {req.assignedTo && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <User className="w-3.5 h-3.5" />
                        <span className="text-sm">{req.assignedTo}</span>
                      </div>
                    )}
                    {req.dueDate && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-sm">Due: {req.dueDate}</span>
                      </div>
                    )}
                    {req.status === 'completed' && req.idNumber && (
                      <div className="flex items-center gap-1.5 text-green-600">
                        <QrCode className="w-3.5 h-3.5" />
                        <span className="text-sm">{req.idNumber}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelectedReq(req); setShowDetailModal(true); }}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600" title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {req.status === 'pending' && (
                        <button
                          onClick={() => { setSelectedReq(req); setAssignData({ employeeId: '', dueDate: '' }); setShowAssignModal(true); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          <ArrowRight className="w-3.5 h-3.5" /> Assign Employee
                        </button>
                      )}
                      {req.status === 'approved' && req.assignedTo && (
                        <button
                          onClick={() => handleMarkIssued(req)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Mark Issued
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="ID Request Details" size="md">
        {selectedReq && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-2xl">{selectedReq.resident.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-gray-900">{selectedReq.resident}</h3>
                <p className="text-gray-600">{selectedReq.email}</p>
                <p className="text-gray-600">Unit {selectedReq.unit}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg text-sm">
              <div><label className="block text-gray-600 mb-0.5">Request Date</label><p className="text-gray-900">{selectedReq.requestDate}</p></div>
              <div><label className="block text-gray-600 mb-0.5">Status</label><StatusBadge status={selectedReq.status === 'approved' ? 'in-progress' : selectedReq.status} size="sm" /></div>
              <div><label className="block text-gray-600 mb-0.5">Note</label><p className="text-gray-900">{selectedReq.note}</p></div>
              {selectedReq.assignedTo && <div><label className="block text-gray-600 mb-0.5">Assigned To</label><p className="text-gray-900">{selectedReq.assignedTo}</p></div>}
              {selectedReq.dueDate && <div><label className="block text-gray-600 mb-0.5">Due Date</label><p className="text-gray-900">{selectedReq.dueDate}</p></div>}
              {selectedReq.idNumber && <div className="col-span-2"><label className="block text-gray-600 mb-0.5">ID Number</label><p className="text-green-700">{selectedReq.idNumber}</p></div>}
            </div>
            <div className="flex gap-3">
              {selectedReq.status === 'pending' && (
                <button onClick={() => { setShowDetailModal(false); setShowAssignModal(true); }} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Assign Employee</button>
              )}
              {selectedReq.status === 'approved' && selectedReq.assignedTo && (
                <button onClick={() => handleMarkIssued(selectedReq)} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Mark ID Issued</button>
              )}
              <button onClick={() => setShowDetailModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign Employee Modal */}
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Assign Employee & Set Due Date" size="md">
        {selectedReq && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-gray-900">ID request for: <strong>{selectedReq.resident}</strong></p>
              <p className="text-gray-600">Unit {selectedReq.unit}</p>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Assign Employee *</label>
              <div className="space-y-2">
                {employees.map(emp => (
                  <label key={emp.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${parseInt(assignData.employeeId) === emp.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="empId" checked={parseInt(assignData.employeeId) === emp.id}
                      onChange={() => setAssignData({ ...assignData, employeeId: String(emp.id) })} />
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600">{emp.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-gray-900">{emp.name}</p>
                      <p className="text-gray-600 text-sm">{emp.category}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">ID Ready Date (Due Date) *</label>
              <input type="date" value={assignData.dueDate} onChange={e => setAssignData({ ...assignData, dueDate: e.target.value })}
                min="2026-02-27"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p className="text-gray-500 mt-1">The resident will be notified of this due date.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAssign} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Assign & Notify</button>
              <button onClick={() => setShowAssignModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
