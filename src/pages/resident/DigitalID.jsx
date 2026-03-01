import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { IdCard, QrCode, CheckCircle, Clock, AlertCircle, Send, Download, Share2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Simulated ID state: 'none' | 'pending' | 'approved' | 'in-progress' | 'ready'
const SAMPLE_STATE = 'none'; // Change to test different states

export default function ResidentDigitalID() {
  const [idState, setIdState] = useState(SAMPLE_STATE);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestNote, setRequestNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Simulated ID data (shown when state is 'ready')
  const idData = {
    name: 'Samson Tadesse',
    unit: 'A-101',
    idNumber: 'RES-2026-0101',
    qrCode: 'QR-A101-AG-2026',
    issuedDate: '2026-02-27',
    validUntil: '2027-02-27',
    dueDate: '2026-03-05',
    assignedEmployee: 'Mekonnen Desta',
  };

  const handleSubmitRequest = () => {
    if (!requestNote.trim()) {
      toast.error('Please provide a reason for your ID request');
      return;
    }
    setIdState('pending');
    setSubmitted(true);
    setShowRequestForm(false);
    toast.success('Digital ID request submitted! Admin will review your request.');
  };

  // ── STATE: No request yet ──
  if (idState === 'none' && !showRequestForm) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="text-center">
            <h1>Digital ID</h1>
            <p className="text-gray-600 mt-1">Request your official resident digital identification card</p>
          </div>

          {/* How it works */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="mb-6 text-center">How It Works</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: '1', icon: <Send className="w-6 h-6" />, title: 'Submit Request', desc: 'Submit your Digital ID request through this page', color: 'bg-blue-100 text-blue-600' },
                { step: '2', icon: <CheckCircle className="w-6 h-6" />, title: 'Admin Review', desc: 'Admin reviews and approves your request', color: 'bg-purple-100 text-purple-600' },
                { step: '3', icon: <Clock className="w-6 h-6" />, title: 'Processing', desc: 'Staff prepares your ID — you receive a due date', color: 'bg-yellow-100 text-yellow-600' },
                { step: '4', icon: <IdCard className="w-6 h-6" />, title: 'ID Ready', desc: 'Your Digital ID appears here ready to use', color: 'bg-green-100 text-green-600' },
              ].map((s, idx) => (
                <div key={idx} className="text-center">
                  <div className={`w-14 h-14 ${s.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    {s.icon}
                  </div>
                  <p className="text-gray-900 mb-1">{s.title}</p>
                  <p className="text-gray-600">{s.desc}</p>
                  {idx < 3 && <ArrowRight className="w-5 h-5 text-gray-300 mx-auto mt-3 hidden lg:block" />}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <IdCard className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="mb-2">You don't have a Digital ID yet</h3>
            <p className="text-gray-600 mb-6">Request your Digital ID to access facilities, verify your residency, and use property services seamlessly.</p>
            <button
              onClick={() => setShowRequestForm(true)}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Request Digital ID
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── STATE: Request Form ──
  if (showRequestForm) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-2xl mx-auto">
          <div>
            <button onClick={() => setShowRequestForm(false)} className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2">
              ← Back
            </button>
            <h1>Request Digital ID</h1>
            <p className="text-gray-600 mt-1">Fill in the form below to submit your Digital ID request</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div><label className="block text-gray-600 mb-1">Full Name</label><p className="text-gray-900">Samson Tadesse</p></div>
              <div><label className="block text-gray-600 mb-1">Unit</label><p className="text-gray-900">A-101</p></div>
              <div><label className="block text-gray-600 mb-1">Email</label><p className="text-gray-900">samson.tadesse@email.com</p></div>
              <div><label className="block text-gray-600 mb-1">Phone</label><p className="text-gray-900">+251 911 234 567</p></div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Reason for Request *</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3">
                <option>First-time ID request (new resident)</option>
                <option>ID renewal</option>
                <option>Lost or damaged ID replacement</option>
                <option>Information update</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Additional Notes</label>
              <textarea
                value={requestNote}
                onChange={e => setRequestNote(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Any additional information about your request..."
              />
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-gray-900 mb-1">Required Documents</p>
              <ul className="text-gray-600 space-y-1">
                <li>• Valid government-issued ID (Kebele ID, Passport, or Driver's License)</li>
                <li>• Recent passport-sized photo</li>
                <li>• Lease agreement or proof of residence</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={handleSubmitRequest} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Send className="w-4 h-4" /> Submit Request
              </button>
              <button onClick={() => setShowRequestForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── STATE: Pending ──
  if (idState === 'pending') {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="text-center">
            <h1>Digital ID</h1>
            <p className="text-gray-600 mt-1">Track your Digital ID request status</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="mb-2">Request Pending Review</h2>
            <p className="text-gray-600 mb-6">Your Digital ID request has been submitted and is awaiting admin approval. You will be notified once it is reviewed.</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Submitted', active: true, done: true },
                { label: 'Admin Review', active: true, done: false },
                { label: 'Processing', active: false, done: false },
              ].map((step, idx) => (
                <div key={idx} className="text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${step.done ? 'bg-green-500' : step.active ? 'bg-yellow-400 animate-pulse' : 'bg-gray-200'}`}>
                    {step.done ? <CheckCircle className="w-5 h-5 text-white" /> : <span className="text-white text-sm">{idx + 1}</span>}
                  </div>
                  <p className={`text-sm ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
              <p className="text-gray-900 mb-1">Request Details</p>
              <p className="text-gray-600">Submitted: 2026-02-27</p>
              <p className="text-gray-600">Status: Pending admin approval</p>
            </div>

            <button
              onClick={() => { setIdState('none'); setShowRequestForm(false); }}
              className="mt-6 text-gray-600 hover:text-gray-900"
            >
              View ID workflow
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── STATE: In Progress (approved, employee assigned due date) ──
  if (idState === 'in-progress') {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="text-center"><h1>Digital ID</h1></div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IdCard className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="mb-2">ID Being Prepared</h2>
            <p className="text-gray-600 mb-6">Your Digital ID is currently being processed. An employee will complete it by the due date below.</p>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left space-y-2">
              <p className="text-gray-900">Processing Details</p>
              <p className="text-gray-600">Assigned Employee: {idData.assignedEmployee}</p>
              <p className="text-gray-600">Expected Due Date: <strong className="text-blue-700">{idData.dueDate}</strong></p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── STATE: Ready / Issued ──
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1>My Digital ID Card</h1>
          <p className="text-gray-600 mt-1">Your verified resident identification card</p>
        </div>

        {/* Digital ID Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-blue-100 mb-2">Property Management System — ንብረት አስተዳደር</p>
              <h2 className="text-white mb-1">{idData.name}</h2>
              <p className="text-blue-100">Unit {idData.unit}</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span>Verified</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-xl p-6 mx-auto my-6 w-full max-w-xs">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <QrCode className="w-40 h-40 text-gray-400" />
            </div>
            <p className="text-center text-gray-600 mt-4 font-mono text-sm">{idData.qrCode}</p>
          </div>

          {/* ID Details */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
            <div><p className="text-blue-200">ID Number</p><p className="text-white">{idData.idNumber}</p></div>
            <div><p className="text-blue-200">Valid Until</p><p className="text-white">{idData.validUntil}</p></div>
            <div><p className="text-blue-200">Issued Date</p><p className="text-white">{idData.issuedDate}</p></div>
            <div><p className="text-blue-200">Access Level</p><p className="text-white">Resident</p></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-3 gap-4">
          <button onClick={() => toast.success('Digital ID downloaded!')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5" /> Download PDF
          </button>
          <button onClick={() => toast.success('Link copied!')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Share2 className="w-5 h-5" /> Share
          </button>
          <button onClick={() => toast.info('QR code enlarged')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <QrCode className="w-5 h-5" /> View QR
          </button>
        </div>

        {/* Info */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-gray-900">Your ID is active and verified</p>
            <p className="text-gray-600">Present this QR code at building entrances, common facilities, or when requesting maintenance services.</p>
          </div>
        </div>

        {/* Simulate states for demo */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-gray-600 mb-3">Demo: Simulate different ID states</p>
          <div className="flex flex-wrap gap-2">
            {['none', 'pending', 'in-progress', 'ready'].map(s => (
              <button key={s} onClick={() => setIdState(s)}
                className={`px-4 py-2 rounded-lg border text-sm ${idState === s ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:bg-gray-50 text-gray-600'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
