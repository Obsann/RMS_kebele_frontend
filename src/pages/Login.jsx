import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Building2, Mail, Lock, UserCircle, Globe } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../contexts/LanguageContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { t, toggleLanguage } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('resident');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      toast.error('Please fill in all fields');
      return;
    }

    const success = login(email, password, role);
    if (success) {
      toast.success('Login successful!');
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'special-employee') navigate('/special-employee/dashboard');
      else if (role === 'employee') navigate('/employee/dashboard');
      else if (role === 'resident') navigate('/resident/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      {/* Language toggle — top right */}
      <div className="flex justify-end px-6 pt-4">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-300 bg-white text-blue-700 hover:bg-blue-50 transition-colors shadow-sm"
        >
          <Globe className="w-4 h-4" />
          <span>{t('switchLanguage')}</span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Building2 className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-blue-800 mb-2">{t('signIn')}</h1>
            <p className="text-gray-600">{t('signInSubtitle')}</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-gray-700 mb-2">{t('emailAddress')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 mb-2">{t('password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-gray-700 mb-2">{t('loginAs')}</label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="resident">Resident / ነዋሪ</option>
                    <option value="employee">Employee / ሠራተኛ</option>
                    <option value="special-employee">Special Employee / ልዩ ሠራተኛ</option>
                    <option value="admin">Administrator / አስተዳዳሪ</option>
                  </select>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('signIn')}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <button
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:text-blue-700"
              >
                {t('noAccount')}
              </button>
              <br />
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-700"
              >
                {t('backToHome')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}