import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { IdCard, CheckCircle, XCircle, Eye, UserCheck, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getDigitalIds, approveDigitalId, revokeDigitalId, getUsers } from '../../utils/api';

export default function AdminDigitalID() {
  const [requests, setRequests] = useState([]);
  const [specialEmployees, setSpecialEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [idData, seData] = await Promise.all([
        getDigitalIds(),
        getUsers('role=special-employee')
      ]);
      setRequests(idData.digitalIds || []);
      setSpecialEmployees(seData.users || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filtered = activeTab === 'all' ? requests : requests.filter(r => r.status === activeTab);

  const handleApprove = async (req) => {
    setSubmitting(true);
    try {
      await approveDigitalId(req._id);
      toast.success(`ID request approved!`);
      setShowDetailModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to approve ID');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (req) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason && reason !== '') return; // cancelled prompt

    setSubmitting(true);
    try {
      await revokeDigitalId(req._id, reason || 'Did not meet requirements');
      toast.success(`ID request rejected.`);
      setShowDetailModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to reject ID');
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'expired', label: 'Expired' },
    { key: 'revoked', label: 'Revoked' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital ID System</h1>
          <p className="text-gray-600 mt-1">Review and approve resident Digital ID requests</p>
        </div>

        {/* Workflow Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <p className="font-semibold text-gray-900 mb-3">Digital ID Workflow</p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {[
              { icon: <IdCard className="w-4 h-4" />, label: 'Resident Requests ID', color: 'bg-gray-100 text-gray-700 border-gray-200' },
              { icon: <ArrowRight className="w-4 h-4 text-blue-400" />, label: '', color: '' },
              { icon: <CheckCircle className="w-4 h-4" />, label: 'Admin Inspects & Approves', color: 'bg-blue-100 text-blue-800 border-blue-200' },
              { icon: <ArrowRight className="w-4 h-4 text-blue-400" />, label: '', color: '' },
              { icon: <IdCard className="w-4 h-4" />, label: 'ID Automatically Issued', color: 'bg-green-100 text-green-800 border-green-200' },
            ].map((step, idx) =>
              step.label ? (
                <span key={idx} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${step.color} font-medium`}>
                  {step.icon}{step.label}
                </span>
              ) : (
                <span key={idx}>{step.icon}</span>
              )
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1 text-sm font-medium">Total Requests</p>
            <p className="text-gray-900 text-3xl font-bold">{requests.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-yellow-200 bg-yellow-50">
            <p className="text-yellow-700 mb-1 text-sm font-medium">Pending Approvals</p>
            <p className="text-gray-900 text-3xl font-bold">{requests.filter(r => r.status === 'pending').length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-green-200 bg-green-50">
            <p className="text-green-700 mb-1 text-sm font-medium">Active (Approved)</p>
            <p className="text-gray-900 text-3xl font-bold">{requests.filter(r => r.status === 'approved').length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-red-200 bg-red-50">
            <p className="text-red-700 mb-1 text-sm font-medium">Revoked / Expired</p>
            <p className="text-gray-900 text-3xl font-bold">{requests.filter(r => r.status === 'revoked' || r.status === 'expired').length}</p>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 px-6 flex gap-6 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 border-b-2 font-medium transition-colors capitalize whitespace-nowrap ${activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs border ${activeTab === tab.key ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                  {tab.key === 'all' ? requests.length : requests.filter(r => r.status === tab.key).length}
                </span>
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center"><Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" /></div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-600 font-medium text-sm">Resident Info</th>
                    <th className="px-6 py-3 text-left text-gray-600 font-medium text-sm">ID Type & Number</th>
                    <th className="px-6 py-3 text-left text-gray-600 font-medium text-sm">Request Date</th>
                    <th className="px-6 py-3 text-left text-gray-600 font-medium text-sm">Status</th>
                    <th className="px-6 py-3 text-left text-gray-600 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map(req => (
                    <tr key={req._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-blue-600 font-medium">{(req.user?.username || 'U').charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium capitalize">{req.user?.username || 'Unknown'}</p>
                            <p className="text-gray-500 text-sm">Unit: {req.user?.unit || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-medium">Digital ID</p>
                        <p className="text-gray-500 font-mono text-xs max-w-xs truncate" title={req.qrCode}>{req.qrCode}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4"><StatusBadge status={req.status} size="sm" /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setSelectedRequest(req); setShowDetailModal(true); }} className="p-2 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          {req.status === 'pending' && (
                            <>
                              <button disabled={submitting} onClick={() => handleApprove(req)} className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors disabled:opacity-50 border border-transparent hover:border-green-200" title="Approve ID">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button disabled={submitting} onClick={() => handleReject(req)} className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors disabled:opacity-50 border border-transparent hover:border-red-200" title="Reject / Revoke">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {req.status === 'approved' && (
                            <button disabled={submitting} onClick={() => handleReject(req)} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm font-medium transition-colors" title="Revoke ID">
                              <XCircle className="w-3.5 h-3.5" /> Revoke
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No requests found</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Digital ID Application" size="md">
        {selectedRequest && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                <span className="text-blue-600 text-2xl font-medium">{(selectedRequest.user?.username || 'U').charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 text-lg font-bold capitalize">{selectedRequest.user?.username || 'Unknown'}</h3>
                <p className="text-gray-600">{selectedRequest.user?.email || 'No email'}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded">Unit {selectedRequest.user?.unit || '—'}</span>
                  {selectedRequest.user?.phone && <span className="text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded">{selectedRequest.user.phone}</span>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-xl space-y-3">
                <div><label className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Request Date</label><p className="text-gray-900 font-medium">{new Date(selectedRequest.createdAt).toLocaleString()}</p></div>
                <div><label className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Status</label><StatusBadge status={selectedRequest.status} /></div>
              </div>
              <div className="p-4 border border-gray-200 rounded-xl space-y-3">
                <div><label className="block text-gray-500 text-xs uppercase tracking-wider mb-1">ID Type</label><p className="text-gray-900 font-medium">Digital ID Mobile Pass</p></div>
                <div><label className="block text-gray-500 text-xs uppercase tracking-wider mb-1">QR Code Source string</label><p className="text-gray-900 font-mono tracking-wide break-all text-xs border border-gray-200 bg-gray-50 p-2 rounded mt-1">{selectedRequest.qrCode}</p></div>
                {selectedRequest.expiresAt && (
                  <div><label className="block text-gray-500 text-xs uppercase tracking-wider mb-1">ID Expiration</label><p className="text-gray-900">{new Date(selectedRequest.expiresAt).toLocaleDateString()}</p></div>
                )}
              </div>
            </div>

            {selectedRequest.revokeReason && selectedRequest.status === 'revoked' && (
              <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-100">
                <p className="font-semibold text-sm mb-1">Revocation Reason:</p>
                <p className="text-sm">{selectedRequest.revokeReason}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              {selectedRequest.status === 'pending' && (
                <>
                  <button disabled={submitting} onClick={() => handleApprove(selectedRequest)} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50">Approve ID</button>
                  <button disabled={submitting} onClick={() => handleReject(selectedRequest)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50">Reject</button>
                </>
              )}
              {selectedRequest.status === 'approved' && (
                <button disabled={submitting} onClick={() => handleReject(selectedRequest)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50">Revoke ID Access</button>
              )}
              <button disabled={submitting} onClick={() => setShowDetailModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
