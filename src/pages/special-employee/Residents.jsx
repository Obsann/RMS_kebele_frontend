import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { Search, Eye, Edit, IdCard, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const initialResidents = [
  { id: 1, name: 'Samson Tadesse', email: 'samson.tadesse@email.com', unit: 'A-101', phone: '+251 911 234 567', status: 'active', dependents: 2, idStatus: 'verified' },
  { id: 2, name: 'Olyad Amanuel', email: 'olyad.amanuel@email.com', unit: 'B-205', phone: '+251 922 345 678', status: 'active', dependents: 1, idStatus: 'pending' },
  { id: 3, name: 'Mulugeta Haile', email: 'mulugeta.haile@email.com', unit: 'C-312', phone: '+251 933 456 789', status: 'active', dependents: 3, idStatus: 'verified' },
  { id: 4, name: 'Semira Ambisa', email: 'semira.a@email.com', unit: 'A-204', phone: '+251 944 567 890', status: 'inactive', dependents: 0, idStatus: 'none' },
  { id: 5, name: 'Ramadan Oumer', email: 'ramadan.oumer@email.com', unit: 'B-108', phone: '+251 955 678 901', status: 'active', dependents: 2, idStatus: 'in-progress' },
  { id: 6, name: 'Hana Bekele', email: 'hana.bekele@email.com', unit: 'D-201', phone: '+251 966 789 012', status: 'active', dependents: 1, idStatus: 'verified' },
  { id: 7, name: 'Fasil Girma', email: 'fasil.g@email.com', unit: 'C-105', phone: '+251 977 890 123', status: 'active', dependents: 4, idStatus: 'pending' },
];

export default function SpecialEmployeeResidents() {
  const [residents, setResidents] = useState(initialResidents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedResident, setSelectedResident] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});

  const filtered = residents.filter(r => {
    const matchSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.unit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSaveEdit = () => {
    setResidents(prev => prev.map(r => r.id === editData.id ? { ...r, ...editData } : r));
    toast.success('Resident information updated!');
    setShowEditModal(false);
  };

  const idStatusColors = {
    verified: 'text-green-600 bg-green-50 border-green-200',
    pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'in-progress': 'text-blue-600 bg-blue-50 border-blue-200',
    none: 'text-gray-500 bg-gray-50 border-gray-200',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1>Residents Management</h1>
            <p className="text-gray-600 mt-1">View and manage resident information</p>
          </div>
          <button
            onClick={() => toast.info('Contact Admin to add new residents')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" /> Add Resident
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"><p className="text-gray-600 mb-1">Total</p><p className="text-gray-900">{residents.length}</p></div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-green-200 bg-green-50"><p className="text-green-700 mb-1">Active</p><p className="text-gray-900">{residents.filter(r => r.status === 'active').length}</p></div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-200 bg-blue-50"><p className="text-blue-700 mb-1">IDs Verified</p><p className="text-gray-900">{residents.filter(r => r.idStatus === 'verified').length}</p></div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-yellow-200 bg-yellow-50"><p className="text-yellow-700 mb-1">ID Pending</p><p className="text-gray-900">{residents.filter(r => r.idStatus === 'pending').length}</p></div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name or unit..."
                className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-600">Name</th>
                  <th className="px-6 py-3 text-left text-gray-600">Unit</th>
                  <th className="px-6 py-3 text-left text-gray-600">Phone</th>
                  <th className="px-6 py-3 text-left text-gray-600">Dependents</th>
                  <th className="px-6 py-3 text-left text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-gray-600">Digital ID</th>
                  <th className="px-6 py-3 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600">{r.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-gray-900">{r.name}</p>
                          <p className="text-gray-500">{r.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{r.unit}</td>
                    <td className="px-6 py-4 text-gray-600">{r.phone}</td>
                    <td className="px-6 py-4 text-gray-700">{r.dependents}</td>
                    <td className="px-6 py-4"><StatusBadge status={r.status} size="sm" /></td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-sm ${idStatusColors[r.idStatus] || idStatusColors.none}`}>
                        <IdCard className="w-3.5 h-3.5" />
                        {r.idStatus === 'verified' ? 'Verified' : r.idStatus === 'pending' ? 'Pending' : r.idStatus === 'in-progress' ? 'Processing' : 'None'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setSelectedResident(r); setShowViewModal(true); }}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-600" title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setEditData({ ...r }); setShowEditModal(true); }}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Resident Details" size="md">
        {selectedResident && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-2xl">{selectedResident.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-gray-900">{selectedResident.name}</h3>
                <p className="text-gray-600">{selectedResident.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div><label className="block text-gray-600 mb-1">Unit</label><p className="text-gray-900">{selectedResident.unit}</p></div>
              <div><label className="block text-gray-600 mb-1">Phone</label><p className="text-gray-900">{selectedResident.phone}</p></div>
              <div><label className="block text-gray-600 mb-1">Dependents</label><p className="text-gray-900">{selectedResident.dependents}</p></div>
              <div><label className="block text-gray-600 mb-1">Status</label><StatusBadge status={selectedResident.status} size="sm" /></div>
              <div className="col-span-2"><label className="block text-gray-600 mb-1">Digital ID Status</label>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-sm ${idStatusColors[selectedResident.idStatus] || idStatusColors.none}`}>
                  <IdCard className="w-3.5 h-3.5" />
                  {selectedResident.idStatus === 'verified' ? 'Verified' : selectedResident.idStatus === 'pending' ? 'Pending' : selectedResident.idStatus === 'in-progress' ? 'Processing' : 'No ID'}
                </span>
              </div>
            </div>
            <button onClick={() => setShowViewModal(false)} className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Resident Information" size="md">
        <div className="space-y-4">
          <div><label className="block text-gray-700 mb-2">Phone Number</label>
            <input type="tel" value={editData.phone || ''} onChange={e => setEditData({ ...editData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div><label className="block text-gray-700 mb-2">Status</label>
            <select value={editData.status || 'active'} onChange={e => setEditData({ ...editData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select></div>
          <div className="flex gap-3">
            <button onClick={handleSaveEdit} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
            <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
