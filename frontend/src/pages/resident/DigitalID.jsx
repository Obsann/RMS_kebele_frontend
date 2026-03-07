import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import { IdCard, Camera, Upload, AlertCircle, CheckCircle, Clock, Shield, Search, FileText, Download, Loader2, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { getMyDigitalId, requestDigitalId } from '../../utils/api';

export default function ResidentDigitalID() {
  const [digitalId, setDigitalId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const [formData, setFormData] = useState({
    idType: '',
    idNumber: '',
    expiryDate: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDigitalId();
  }, []);

  const fetchDigitalId = async () => {
    try {
      setLoading(true);
      const data = await getMyDigitalId();
      // the endpoint returns the user's digital ID record. If none exists, it might return 404 or null.
      setDigitalId(data);
    } catch (error) {
      if (error.status === 404) {
        setDigitalId(null);
      } else {
        toast.error('Failed to load Digital ID status');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!formData.idType || !formData.idNumber) {
      toast.error('Please fill in required fields');
      return;
    }
    setSubmitting(true);
    try {
      await requestDigitalId(formData);
      toast.success('Digital ID request submitted successfully');
      setShowRequestForm(false);
      fetchDigitalId();
    } catch (error) {
      toast.error(error.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadId = async () => {
    const cardElement = document.getElementById('digital-id-card');
    if (!cardElement) return;

    try {
      const canvas = await html2canvas(cardElement, {
        scale: 2, // High resolution
        backgroundColor: null, // Keep transparency if any
      });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `RMS_DigitalID_${digitalId?.resident?.username || 'Pass'}.png`;
      link.href = imgData;
      link.click();
      toast.success('Digital ID downloaded successfully!');
    } catch (error) {
      toast.error('Failed to export ID image');
    }
  };

  const idStatusColors = {
    verified: 'text-green-700 bg-green-50 border-green-200',
    pending: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    rejected: 'text-red-700 bg-red-50 border-red-200',
    none: 'text-gray-700 bg-gray-50 border-gray-200'
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading your Digital ID...</span>
        </div>
      </DashboardLayout>
    );
  }

  const currentStatus = digitalId ? digitalId.status : 'none';

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resident Digital ID</h1>
          <p className="text-gray-600 mt-1">Manage your secure community identification</p>
        </div>

        {currentStatus === 'verified' && digitalId ? (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div id="digital-id-card" className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl overflow-hidden relative text-white">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Shield className="w-48 h-48" />
              </div>
              <div className="relative p-8">
                <div className="flex justify-between items-start mb-8">
                  <div><p className="text-blue-200 font-medium">RMS Verified ID</p><p className="text-sm text-blue-300 mt-1">Kebele Resident Pass</p></div>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/30 text-white shadow-sm">
                    <CheckCircle className="w-4 h-4" /> <span className="text-sm font-medium tracking-wide">VERIFIED</span>
                  </div>
                </div>

                <div className="flex gap-6 items-center">
                  <div className="w-24 h-24 bg-white rounded-xl border-4 border-white flex flex-col items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    <QRCodeSVG
                      value={digitalId.qrCode || 'RMS-INVALID'}
                      size={88}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="Q"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="space-y-4">
                    <div><p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Resident Name</p><p className="text-xl font-semibold tracking-wide">{digitalId.resident?.username || 'Unknown'}</p></div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <div><p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Unit Number</p><p className="font-medium">{digitalId.resident?.unit || '—'}</p></div>
                      <div><p className="text-blue-200 text-xs uppercase tracking-wider mb-1">ID Number</p><p className="font-medium font-mono text-blue-50">{digitalId.idNumber || '—'}</p></div>
                      <div><p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Valid From</p><p className="font-medium">{new Date(digitalId.createdAt).toLocaleDateString()}</p></div>
                      <div><p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Role</p><p className="font-medium capitalize">{digitalId.resident?.role || 'Resident'}</p></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/20 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-blue-300">Property of Resident Management System</p>
                    <p className="text-[10px] text-blue-400 mt-0.5">If found, please return to management office</p>
                  </div>
                  <div className="h-10 w-32 bg-white/20 rounded flex justify-around flex-col p-1.5">
                    <div className="w-full h-1 bg-white/40"></div><div className="w-11/12 h-1 bg-white/50"></div><div className="w-full h-1 bg-white/30"></div><div className="w-10/12 h-1 bg-white/50"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={handleDownloadId}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-700 font-medium rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
              >
                <ImageIcon className="w-5 h-5" />
                Download as Image File
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-center p-12 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <IdCard className="w-10 h-10 text-blue-600" />
            </div>

            {currentStatus === 'pending' ? (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Processing</h2>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">Your Digital ID request is currently being reviewed by the administration. This usually takes 1-2 business days.</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full font-medium border border-yellow-200">
                  <Clock className="w-5 h-5" /> Pending Approval
                </div>
              </>
            ) : currentStatus === 'rejected' ? (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Request Rejected</h2>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">Unfortunately, your previous Digital ID request was not approved. {digitalId?.notes}</p>
                <button onClick={() => setShowRequestForm(true)} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                  Submit New Request
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No Digital ID Found</h2>
                <p className="text-gray-600 mb-8 max-w-sm mx-auto">You haven't set up your Digital ID yet. This ID acts as your official resident pass for community access.</p>
                <button onClick={() => setShowRequestForm(true)} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors inline-flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Request Digital ID
                </button>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-blue-600" /> Benefits of Digital ID</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-gray-600"><CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> Fast-track entry at all security gates</li>
              <li className="flex gap-3 text-sm text-gray-600"><CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> Access to community amenities (pool, gym)</li>
              <li className="flex gap-3 text-sm text-gray-600"><CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> Verified proof of residence for deliveries</li>
              <li className="flex gap-3 text-sm text-gray-600"><CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> Easier processing for guest passes</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-blue-600" /> Security Guidelines</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div> Do not screenshot or share your Digital ID.</li>
              <li className="flex gap-3 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div> IDs are non-transferable and strictly for registered residents.</li>
              <li className="flex gap-3 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div> Report immediately if you suspect unauthorized use.</li>
              <li className="flex gap-3 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div> Administration reserves the right to revoke access for violations.</li>
            </ul>
          </div>
        </div>
      </div>

      <Modal isOpen={showRequestForm} onClose={() => setShowRequestForm(false)} title="Digital ID Request" size="md">
        <form onSubmit={handleSubmitRequest} className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800 mb-6 flex gap-3 items-start">
            <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p>To verify your identity, we need details from a government-issued ID (Kebele ID, Passport, or Driver's License).</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Type *</label>
            <select required value={formData.idType} onChange={(e) => setFormData({ ...formData, idType: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Select ID type</option>
              <option value="National ID">National ID / Kebele ID</option>
              <option value="Passport">Passport</option>
              <option value="Driver License">Driver's License</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Number *</label>
            <input required type="text" value={formData.idNumber} onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., ET-12345678" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
            <input type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="pt-4 flex gap-3">
            <button disabled={submitting} type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
            <button type="button" onClick={() => setShowRequestForm(false)} className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
