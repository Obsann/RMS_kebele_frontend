import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner@2.0.3';

export default function AdminResidents() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const residents = [
    { id: 1, name: 'Samson Tadesse', email: 'samson.tadesse@email.com', unit: 'A-101', phone: '+251 911 234 567', status: 'active', dependents: 2 },
    { id: 2, name: 'Olyad Amanuel', email: 'olyad.amanuel@email.com', unit: 'B-205', phone: '+251 922 345 678', status: 'active', dependents: 1 },
    { id: 3, name: 'Mulugeta Haile', email: 'mulugeta.haile@email.com', unit: 'C-312', phone: '+251 933 456 789', status: 'active', dependents: 3 },
    { id: 4, name: 'Semira Ambisa', email: 'semira.a@email.com', unit: 'A-204', phone: '+251 944 567 890', status: 'inactive', dependents: 0 },
    { id: 5, name: 'Ramadan Oumer', email: 'ramadan.oumer@email.com', unit: 'B-108', phone: '+251 955 678 901', status: 'active', dependents: 2 },
  ];

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', unit: '' });

  const handleAddResident = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.unit) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Resident added successfully!');
    setShowAddModal(false);
    setFormData({ name: '', email: '', phone: '', unit: '' });
  };

  const filtered = residents.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1>Residents Management</h1>
            <p className="text-gray-600 mt-1">Manage all residents in the property</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Resident
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, unit, or email..."
                className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5" />
              More Filters
            </button>
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
                  <th className="px-6 py-3 text-left text-gray-600">Email</th>
                  <th className="px-6 py-3 text-left text-gray-600">Phone</th>
                  <th className="px-6 py-3 text-left text-gray-600">Dependents</th>
                  <th className="px-6 py-3 text-left text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((resident) => (
                  <tr key={resident.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600">{resident.name.charAt(0)}</span>
                        </div>
                        <span className="text-gray-900">{resident.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{resident.unit}</td>
                    <td className="px-6 py-4 text-gray-600">{resident.email}</td>
                    <td className="px-6 py-4 text-gray-600">{resident.phone}</td>
                    <td className="px-6 py-4">{resident.dependents}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={resident.status} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/residents/${resident.id}`)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg text-red-600" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-gray-600">Showing {filtered.length} of 487 residents</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Previous</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Resident Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Resident" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ለምሳሌ፡ Samson Tadesse"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="samson@example.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+251 9XX XXX XXX"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Unit Number</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="A-101"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleAddResident}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Resident
            </button>
            <button
              onClick={() => setShowAddModal(false)}
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
