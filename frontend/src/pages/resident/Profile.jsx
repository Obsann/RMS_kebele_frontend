import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import { Camera, Edit2, Mail, Phone, Home, Shield, Plus, Upload, FileText, Download, Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { getMeAPI, updateUser, api } from '../../utils/api';

export default function ResidentProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddDependentModal, setShowAddDependentModal] = useState(false);

  const [editFormData, setEditFormData] = useState({});
  const [dependentData, setDependentData] = useState({ name: '', relationship: '', age: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getMeAPI();
      setUser(data);
      setEditFormData({
        phone: data.phone || '',
        emergencyContact: data.emergencyContact || ''
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async () => {
    setSubmitting(true);
    try {
      await updateUser(user._id, {
        phone: editFormData.phone,
        emergencyContact: editFormData.emergencyContact
      });
      toast.success('Profile updated successfully!');
      setShowEditModal(false);
      fetchProfile();
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddDependent = async () => {
    if (!dependentData.name || !dependentData.relationship) {
      toast.error('Name and relationship are required');
      return;
    }
    setSubmitting(true);
    try {
      await api(`/users/${user._id}/dependents`, {
        method: 'POST',
        body: JSON.stringify(dependentData)
      });
      toast.success('Dependent added successfully!');
      setShowAddDependentModal(false);
      setDependentData({ name: '', relationship: '', age: '' });
      fetchProfile();
    } catch (error) {
      toast.error(error.message || 'Failed to add dependent');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveDependent = async (dependentId) => {
    if (!window.confirm('Remove this dependent?')) return;
    try {
      await api(`/users/${user._id}/dependents/${dependentId}`, {
        method: 'DELETE'
      });
      toast.success('Dependent removed');
      fetchProfile();
    } catch (error) {
      toast.error(error.message || 'Failed to remove dependent');
    }
  };

  if (loading || !user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading profile...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>

          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="relative group">
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
                  <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center border-4 border-white">
                    <span className="text-3xl font-medium text-blue-600">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowEditModal(true)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                <p className="text-gray-500 capitalize">{user.role}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Home className="w-5 h-5 text-blue-600" />
                  </div>
                  <div><p className="text-xs text-gray-500">Unit Number</p><p className="font-medium text-gray-900">{user.unit || '—'}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div><p className="text-xs text-gray-500">Account Status</p><p className={`font-medium capitalize ${user.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>{user.status}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden md:col-span-1">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
              <h2 className="font-semibold text-gray-900">Contact Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div><p className="text-sm font-medium text-gray-900">Email Address</p><p className="text-sm text-gray-600">{user.email}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div><p className="text-sm font-medium text-gray-900">Phone Number</p><p className="text-sm text-gray-600">{user.phone || 'Not provided'}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                <div><p className="text-sm font-medium text-gray-900">Emergency Contact</p><p className="text-sm text-gray-600">{user.emergencyContact || 'Not provided'}</p></div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            {/* Dependents */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                <h2 className="font-semibold text-gray-900">Family Members & Dependents</h2>
                <button onClick={() => setShowAddDependentModal(true)} className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add Member
                </button>
              </div>
              <div className="p-6">
                {user.dependents && user.dependents.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {user.dependents.map((dep) => (
                      <div key={dep._id} className="p-4 border border-gray-200 rounded-lg flex items-start gap-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <span className="text-gray-600 font-medium">{dep.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{dep.name}</p>
                          <p className="text-sm text-gray-500">{dep.relationship} {dep.age ? `• ${dep.age} yrs` : ''}</p>
                        </div>
                        <button onClick={() => handleRemoveDependent(dep._id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Home className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">No family members added yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Profile Details" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input type="tel" value={editFormData.phone} onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="+251 ..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact (Phone)</label>
            <input type="tel" value={editFormData.emergencyContact} onChange={e => setEditFormData({ ...editFormData, emergencyContact: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="+251 ..." />
          </div>
          <p className="text-xs text-gray-500 pt-2">Note: To update your Unit Number or Email, please contact the admin office.</p>

          <div className="pt-4 flex gap-3">
            <button disabled={submitting} onClick={handleEditProfile} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={() => setShowEditModal(false)} className="flex-1 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Add Dependent Modal */}
      <Modal isOpen={showAddDependentModal} onClose={() => setShowAddDependentModal(false)} title="Add Family Member" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input type="text" value={dependentData.name} onChange={e => setDependentData({ ...dependentData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="E.g., John Doe" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
              <select value={dependentData.relationship} onChange={e => setDependentData({ ...dependentData, relationship: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select...</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age (Optional)</label>
              <input type="number" value={dependentData.age} onChange={e => setDependentData({ ...dependentData, age: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Years" />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button disabled={submitting} onClick={handleAddDependent} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {submitting ? 'Adding...' : 'Add Member'}
            </button>
            <button onClick={() => setShowAddDependentModal(false)} className="flex-1 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
