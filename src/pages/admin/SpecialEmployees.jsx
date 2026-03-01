import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import { Plus, Shield, Edit } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function AdminSpecialEmployees() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const specialEmployees = [
    {
      id: 1,
      name: 'Samuel Tolasa',
      email: 'hiwot.m@pms.com',
      role: 'Senior Manager',
      permissions: ['manage-tasks', 'view-reports', 'manage-employees', 'approve-requests'],
    },
    {
      id: 2,
      name: 'Temesgen Alemu',
      email: 'temesgen.a@pms.com',
      role: 'Supervisor',
      permissions: ['manage-tasks', 'view-reports', 'approve-requests'],
    },
    {
      id: 3,
      name: 'Mekdes Haile',
      email: 'mekdes.h@pms.com',
      role: 'Coordinator',
      permissions: ['manage-tasks', 'view-reports'],
    },
  ];

  const allPermissions = [
    { id: 'manage-tasks', label: 'Manage tasks & Tasks', description: 'Create, assign, and track tasks' },
    { id: 'manage-employees', label: 'Manage Employees', description: 'Add, edit, and remove employees' },
    { id: 'approve-requests', label: 'Approve Requests', description: 'Review and approve resident requests' },
    { id: 'view-reports', label: 'View Reports', description: 'Access system reports and analytics' },
    { id: 'manage-residents', label: 'Manage Residents', description: 'Add, edit, and view resident information' },
    { id: 'digital-id-approval', label: 'Digital ID Approval', description: 'Approve digital ID certificates' },
  ];

  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const handleManagePermissions = (employee) => {
    setSelectedEmployee(employee);
    setSelectedPermissions(employee.permissions);
    setShowPermissionsModal(true);
  };

  const handleSavePermissions = () => {
    toast.success('Permissions updated successfully!');
    setShowPermissionsModal(false);
  };

  const togglePermission = (permId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1>Special Employees</h1>
            <p className="text-gray-600 mt-1">Manage special employees and their permissions</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Special Employee
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-gray-900 mb-1">About Special Employees</p>
            <p className="text-gray-600">
              Special employees have elevated permissions to manage tasks, approve requests, and oversee operations.
              Configure their access level based on their responsibilities.
            </p>
          </div>
        </div>

        {/* Special Employees List */}
        <div className="grid gap-6">
          {specialEmployees.map((employee) => (
            <div key={employee.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-xl">{employee.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="mb-1">{employee.name}</h3>
                    <p className="text-gray-600">{employee.email}</p>
                    <p className="text-gray-500 mt-1">{employee.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleManagePermissions(employee)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4" />
                  Manage Permissions
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-600 mb-2">Current Permissions:</p>
                <div className="flex flex-wrap gap-2">
                  {employee.permissions.map((perm, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {allPermissions.find((p) => p.id === perm)?.label || perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Special Employee Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Special Employee" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="ለምሳሌ፡ Samuel Tolasa" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="hiwot@pms.com" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Role/Title</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Manager, Supervisor, etc." />
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => { toast.success('Special employee added!'); setShowAddModal(false); }} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Employee</button>
            <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Manage Permissions Modal */}
      <Modal isOpen={showPermissionsModal} onClose={() => setShowPermissionsModal(false)} title={`Manage Permissions — ${selectedEmployee?.name}`} size="lg">
        <div className="space-y-4">
          <p className="text-gray-600">Select the permissions you want to grant to this employee:</p>
          <div className="space-y-3">
            {allPermissions.map((permission) => (
              <div key={permission.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  id={permission.id}
                  checked={selectedPermissions.includes(permission.id)}
                  onChange={() => togglePermission(permission.id)}
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor={permission.id} className="flex-1 cursor-pointer">
                  <p className="text-gray-900">{permission.label}</p>
                  <p className="text-gray-600">{permission.description}</p>
                </label>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={handleSavePermissions} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Permissions</button>
            <button onClick={() => setShowPermissionsModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
