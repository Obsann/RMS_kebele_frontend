import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { Eye, Wrench, MessageSquare, Search, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const employees = [
  { id: 1, name: 'Samuel Fayisa', category: 'Plumbing' },
  { id: 2, name: 'Tesfaye Alemu', category: 'Electrical' },
  { id: 3, name: 'Biruk Woldemariam', category: 'HVAC' },
  { id: 4, name: 'Mekonnen Desta', category: 'General Maintenance' },
  { id: 5, name: 'Hana Worku', category: 'Landscaping' },
];

const initialRequests = [
  { id: 1, type: 'maintenance', resident: 'Samson Tadesse', unit: 'A-101', category: 'Plumbing', subject: 'Leaking pipe in kitchen', description: 'Pipe under sink is leaking constantly.', status: 'pending', date: '2026-02-24', priority: 'high', assignedTo: '' },
  { id: 2, type: 'maintenance', resident: 'Olyad Amanuel', unit: 'B-205', category: 'Electrical', subject: 'Light fixture not working', description: 'Bedroom ceiling light stopped working suddenly.', status: 'in-progress', date: '2026-02-23', priority: 'medium', assignedTo: 'Tesfaye Alemu' },
  { id: 3, type: 'complaint', resident: 'Mulugeta Haile', unit: 'C-312', category: 'Noise', subject: 'Loud music from neighbor', description: 'Loud music after midnight from unit above.', status: 'pending', date: '2026-02-23', priority: 'medium', assignedTo: '' },
  { id: 4, type: 'maintenance', resident: 'Semira Ambisa', unit: 'A-204', category: 'HVAC', subject: 'AC not cooling properly', description: 'Air conditioner running but not cooling.', status: 'completed', date: '2026-02-22', priority: 'high', assignedTo: 'Biruk Woldemariam' },
  { id: 5, type: 'complaint', resident: 'Ramadan Oumer', unit: 'B-108', category: 'Cleanliness', subject: 'Hallway not cleaned', description: 'Common hallway has not been cleaned for 3 days.', status: 'pending', date: '2026-02-22', priority: 'low', assignedTo: '' },
  { id: 6, type: 'maintenance', resident: 'Hana Bekele', unit: 'D-201', category: 'Plumbing', subject: 'Water pressure issue', description: 'Water pressure in bathroom is very low.', status: 'pending', date: '2026-02-21', priority: 'medium', assignedTo: '' },
];

export default function SpecialEmployeeRequests() {
  const [requests, setRequests] = useState(initialRequests);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedReq, setSelectedReq] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const filtered = requests.filter(r => {
    const matchTab = activeTab === 'all' || (activeTab === 'pending' ? r.status === 'pending' : r.type === activeTab);
    const matchSearch = r.resident.toLowerCase().includes(search.toLowerCase()) ||
      r.unit.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleUpdateStatus = (req, status) => {
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status } : r));
    toast.success(`Request status updated to ${status}!`);
    setShowDetailModal(false);
  };

  const handleAssignEmployee = () => {
    if (!selectedEmployee) { toast.error('Please select an employee'); return; }
    setRequests(prev => prev.map(r => r.id === selectedReq.id ? { ...r, assignedTo: selectedEmployee, status: 'in-progress' } : r));
    toast.success(`Request assigned to ${selectedEmployee}!`);
    setShowAssignModal(false);
  };

  const tabs = [
    { key: 'all', label: 'All', count: requests.length },
    { key: 'pending', label: 'Pending', count: requests.filter(r => r.status === 'pending').length },
    { key: 'maintenance', label: 'Maintenance', count: requests.filter(r => r.type === 'maintenance').length },
    { key: 'complaint', label: 'Complaints', count: requests.filter(r => r.type === 'complaint').length },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1>Requests & Complaints</h1>
          <p className="text-gray-600 mt-1">Review and manage resident requests and complaints</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"><p className="text-gray-600 mb-1">Total</p><p className="text-gray-900">{requests.length}</p></div>
          <div className="bg-yellow-50 rounded-xl p-5 shadow-sm border border-yellow-200"><p className="text-yellow-700 mb-1">Pending</p><p className="text-gray-900">{requests.filter(r => r.status === 'pending').length}</p></div>
          <div className="bg-blue-50 rounded-xl p-5 shadow-sm border border-blue-200"><p className="text-blue-700 mb-1">In Progress</p><p className="text-gray-900">{requests.filter(r => r.status === 'in-progress').length}</p></div>
          <div className="bg-green-50 rounded-xl p-5 shadow-sm border border-green-200"><p className="text-green-700 mb-1">Completed</p><p className="text-gray-900">{requests.filter(r => r.status === 'completed').length}</p></div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200 px-6 flex gap-6 flex-wrap">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`py-4 border-b-2 transition-colors ${activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                {tab.label}
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by resident, unit, or subject..."
                className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                  <th className="px-6 py-3 text-left text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-gray-600">Assigned To</th>
                  <th className="px-6 py-3 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${req.type === 'maintenance' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                        {req.type === 'maintenance' ? <Wrench className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                        {req.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{req.resident}</td>
                    <td className="px-6 py-4 text-gray-600">{req.unit}</td>
                    <td className="px-6 py-4 text-gray-700 max-w-xs truncate">{req.subject}</td>
                    <td className="px-6 py-4"><StatusBadge status={req.status} size="sm" /></td>
                    <td className="px-6 py-4 text-gray-600">{req.assignedTo || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setSelectedReq(req); setShowDetailModal(true); }}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-600" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        {req.status === 'pending' && req.type === 'maintenance' && (
                          <button
                            onClick={() => { setSelectedReq(req); setSelectedEmployee(''); setShowAssignModal(true); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                          >
                            <ArrowRight className="w-3.5 h-3.5" /> Assign
                          </button>
                        )}
                        {req.status === 'pending' && (
                          <button onClick={() => handleUpdateStatus(req, 'in-progress')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                            In Progress
                          </button>
                        )}
                        {req.status === 'in-progress' && (
                          <button onClick={() => handleUpdateStatus(req, 'completed')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
                            <CheckCircle className="w-3.5 h-3.5" /> Done
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
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Request Details" size="lg">
        {selectedReq && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-gray-600 mb-1">Type</label>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${selectedReq.type === 'maintenance' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>{selectedReq.type}</span>
              </div>
              <div><label className="block text-gray-600 mb-1">Status</label><StatusBadge status={selectedReq.status} /></div>
              <div><label className="block text-gray-600 mb-1">Resident</label><p className="text-gray-900">{selectedReq.resident}</p></div>
              <div><label className="block text-gray-600 mb-1">Unit</label><p className="text-gray-900">{selectedReq.unit}</p></div>
              <div><label className="block text-gray-600 mb-1">Category</label><p className="text-gray-900">{selectedReq.category}</p></div>
              <div><label className="block text-gray-600 mb-1">Date</label><p className="text-gray-900">{selectedReq.date}</p></div>
              {selectedReq.assignedTo && <div className="col-span-2"><label className="block text-gray-600 mb-1">Assigned To</label><p className="text-gray-900">{selectedReq.assignedTo}</p></div>}
            </div>
            <div><label className="block text-gray-600 mb-1">Subject</label><p className="text-gray-900">{selectedReq.subject}</p></div>
            <div><label className="block text-gray-600 mb-1">Description</label><p className="text-gray-900">{selectedReq.description}</p></div>
            <div className="flex gap-3">
              {selectedReq.status === 'pending' && (
                <>
                  <button onClick={() => { setShowDetailModal(false); setShowAssignModal(true); }} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Assign to Employee</button>
                  <button onClick={() => handleUpdateStatus(selectedReq, 'in-progress')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Mark In Progress</button>
                </>
              )}
              {selectedReq.status === 'in-progress' && (
                <button onClick={() => handleUpdateStatus(selectedReq, 'completed')} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Mark Completed</button>
              )}
              <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign Employee Modal */}
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Assign to Employee" size="md">
        {selectedReq && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-gray-900">{selectedReq.subject}</p>
              <p className="text-gray-600">{selectedReq.resident} — Unit {selectedReq.unit}</p>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Select Employee</label>
              <div className="space-y-2">
                {employees.map(emp => (
                  <label key={emp.id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${selectedEmployee === emp.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="emp" checked={selectedEmployee === emp.name} onChange={() => setSelectedEmployee(emp.name)} />
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><span className="text-green-600">{emp.name.charAt(0)}</span></div>
                    <div>
                      <p className="text-gray-900">{emp.name}</p>
                      <p className="text-gray-600 text-sm">{emp.category}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAssignEmployee} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Assign</button>
              <button onClick={() => setShowAssignModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
