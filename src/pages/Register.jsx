import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Building2, User, Mail, Lock, Phone, Home, Globe } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../contexts/LanguageContext';
export default function Register() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const { t, toggleLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    unitNumber: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.unitNumber) {
      toast.error('Please fill in all fields');
      return;
    }

    const success = register(formData);
    if (success) {
      toast.success('Registration successful!');
      navigate('/resident/dashboard');
    } else {
      toast.error('Registration failed');
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

      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Building2 className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-blue-800 mb-2">{t('createAccount')}</h1>
            <p className="text-gray-600">{t('createAccountSubtitle')}</p>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-gray-700 mb-2">{t('fullName')}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ለምሳሌ፡ Samson Tadesse"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 mb-2">{t('emailAddress')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="samson@example.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-700 mb-2">{t('phone')}</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+251 9XX XXX XXX"
                    />
                  </div>
                </div>

                {/* Unit Number */}
                <div>
                  <label className="block text-gray-700 mb-2">{t('unitNumber')}</label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="unitNumber"
                      value={formData.unitNumber}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="A-101"
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
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-gray-700 mb-2">{t('confirmPassword')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('createAccount')}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-700"
              >
                {t('alreadyHaveAccount')}
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
