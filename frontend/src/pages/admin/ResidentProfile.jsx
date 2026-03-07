import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { ArrowLeft, Mail, Phone, Home, Users, FileText, CheckCircle, XCircle, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner@2.0.3';

export default function AdminResidentProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('personal');
  const [showAddDependentModal, setShowAddDependentModal] = useState(false);

  const resident = {
    id,
    name: 'Samson Tadesse',
    email: 'samson.tadesse@email.com',
    phone: '+251 911 234 567',
    unit: 'A-101',
    status: 'active',
    joinDate: '2024-01-15',
    emergencyContact: 'Habtamu Tadesse - +251 911 234 999',
  };

  const dependents = [
    { id: 1, name: 'Liya Tadesse', relationship: 'Daughter', age: 8 },
    { id: 2, name: 'Nahom Tadesse', relationship: 'Son', age: 5 },
  ];

  const certificates = [
    { id: 1, type: 'ID Card (Kebele)', status: 'approved', uploadDate: '2024-01-15', approvedBy: 'Admin' },
    { id: 2, type: 'Proof of Address', status: 'approved', uploadDate: '2024-01-15', approvedBy: 'Admin' },
    { id: 3, type: 'Employment Letter', status: 'pending', uploadDate: '2026-02-20', approvedBy: '-' },
  ];

  const handleApproveCertificate = () => toast.success('Certificate approved successfully!');
  const handleRejectCertificate = () => toast.error('Certificate rejected');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/residents')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1>Resident Profile</h1>
            <p className="text-gray-600 mt-1">View and manage resident information</p>
          </div>
          <StatusBadge status={resident.status} />
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-3xl">{resident.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <h2 className="mb-2">{resident.name}</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-gray-600">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4" /><span>{resident.email}</span></div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><span>{resident.phone}</span></div>
                <div className="flex items-center gap-2"><Home className="w-4 h-4" /><span>Unit {resident.unit}</span></div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4" /><span>{dependents.length} Dependents</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              {['personal', 'dependents', 'certificates'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 border-b-2 transition-colors capitalize ${activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {tab === 'personal' ? 'Personal Information' : tab === 'dependents' ? 'Dependents' : 'Certificates'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Personal Information */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-gray-600 mb-1">Full Name</label><p className="text-gray-900">{resident.name}</p></div>
                  <div><label className="block text-gray-600 mb-1">Email Address</label><p className="text-gray-900">{resident.email}</p></div>
                  <div><label className="block text-gray-600 mb-1">Phone Number</label><p className="text-gray-900">{resident.phone}</p></div>
                  <div><label className="block text-gray-600 mb-1">Unit Number</label><p className="text-gray-900">{resident.unit}</p></div>
                  <div><label className="block text-gray-600 mb-1">Join Date</label><p className="text-gray-900">{resident.joinDate}</p></div>
                  <div><label className="block text-gray-600 mb-1">Emergency Contact</label><p className="text-gray-900">{resident.emergencyContact}</p></div>
                </div>
              </div>
            )}

            {/* Dependents */}
            {activeTab === 'dependents' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3>Dependents List</h3>
                  <button
                    onClick={() => setShowAddDependentModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Dependent
                  </button>
                </div>
                <div className="space-y-3">
                  {dependents.map((dep) => (
                    <div key={dep.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-gray-900">{dep.name}</p>
                        <p className="text-gray-600">{dep.relationship} • {dep.age} years old</p>
                      </div>
                      <button className="text-red-600 hover:bg-red-50 px-3 py-1 rounded">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificates */}
            {activeTab === 'certificates' && (
              <div className="space-y-4">
                <h3 className="mb-4">Uploaded Certificates</h3>
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
                      <div className="flex items-center gap-3">
                        <StatusBadge status={cert.status} size="sm" />
                        {cert.status === 'pending' && (
                          <div className="flex gap-2">
                            <button onClick={handleApproveCertificate} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button onClick={handleRejectCertificate} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Reject">
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Dependent Modal */}
      <Modal isOpen={showAddDependentModal} onClose={() => setShowAddDependentModal(false)} title="Add Dependent" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter name" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Relationship</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Son</option><option>Daughter</option><option>Spouse</option><option>Parent</option><option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Age</label>
            <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter age" />
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => { toast.success('Dependent added!'); setShowAddDependentModal(false); }} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Dependent</button>
            <button onClick={() => setShowAddDependentModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
