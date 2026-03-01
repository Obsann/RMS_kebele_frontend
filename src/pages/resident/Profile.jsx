import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import { User, Mail, Phone, Home, Plus, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import StatusBadge from '../../components/ui/StatusBadge';

export default function ResidentProfile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [showAddDependentModal, setShowAddDependentModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const profile = {
    name: 'Samson Tadesse',
    email: 'samson.tadesse@email.com',
    phone: '+251 911 234 567',
    unit: 'A-101',
    moveInDate: '2024-01-15',
    emergencyContact: 'Habtamu Tadesse — +251 911 234 999',
  };

  const dependents = [
    { id: 1, name: 'Liya Tadesse', relationship: 'Daughter', age: 8 },
    { id: 2, name: 'Nahom Tadesse', relationship: 'Son', age: 5 },
  ];

  const certificates = [
    { id: 1, type: 'Kebele ID Card', status: 'approved', uploadDate: '2024-01-15' },
    { id: 2, type: 'Proof of Address', status: 'approved', uploadDate: '2024-01-15' },
    { id: 3, type: 'Employment Letter', status: 'pending', uploadDate: '2026-02-20' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1>My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and family members</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-3xl">{profile.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <h2 className="mb-2">{profile.name}</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>Unit {profile.unit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{dependents.length} Dependents</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              {[
                { key: 'personal', label: 'Personal Information' },
                { key: 'dependents', label: 'Dependents' },
                { key: 'certificates', label: 'Certificates' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`py-4 border-b-2 transition-colors ${
                    activeTab === key
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={profile.name}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      defaultValue={profile.email}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue={profile.phone}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Unit Number</label>
                    <input
                      type="text"
                      defaultValue={profile.unit}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Move-in Date</label>
                    <input
                      type="text"
                      defaultValue={profile.moveInDate}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Emergency Contact</label>
                    <input
                      type="text"
                      defaultValue={profile.emergencyContact}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => toast.success('Profile updated successfully!')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            )}

            {/* Dependents Tab */}
            {activeTab === 'dependents' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3>Family Members</h3>
                  <button
                    onClick={() => setShowAddDependentModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Dependent
                  </button>
                </div>
                <div className="space-y-3">
                  {dependents.map((dependent) => (
                    <div key={dependent.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600">{dependent.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-gray-900">{dependent.name}</p>
                          <p className="text-gray-600">{dependent.relationship} • {dependent.age} years old</p>
                        </div>
                      </div>
                      <button className="text-red-600 hover:bg-red-50 px-3 py-1 rounded">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3>My Certificates</h3>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Certificate
                  </button>
                </div>
                <div className="space-y-3">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <FileText className="w-10 h-10 text-blue-600" />
                        <div>
                          <p className="text-gray-900">{cert.type}</p>
                          <p className="text-gray-600">Uploaded: {cert.uploadDate}</p>
                        </div>
                      </div>
                      <StatusBadge status={cert.status} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Dependent Modal */}
      <Modal
        isOpen={showAddDependentModal}
        onClose={() => setShowAddDependentModal(false)}
        title="Add Family Member"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ለምሳሌ፡ Liya Tadesse"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Relationship</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Son</option>
              <option>Daughter</option>
              <option>Spouse</option>
              <option>Parent</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Age</label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter age"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                toast.success('Family member added successfully!');
                setShowAddDependentModal(false);
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Member
            </button>
            <button
              onClick={() => setShowAddDependentModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Upload Certificate Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Certificate"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Certificate Type</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Kebele ID Card</option>
              <option>Proof of Address</option>
              <option>Employment Letter</option>
              <option>Bank Statement</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Upload File</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
              <p className="text-gray-500">PDF, JPG, PNG (max. 5MB)</p>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                toast.success('Certificate uploaded successfully!');
                setShowUploadModal(false);
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upload
            </button>
            <button
              onClick={() => setShowUploadModal(false)}
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
