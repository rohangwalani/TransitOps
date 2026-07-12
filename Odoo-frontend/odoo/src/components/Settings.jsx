import React, { useState, useRef } from 'react';
import { useTransitOps } from '../hooks/TransitOpsContext';
import authService from '../services/authService';

const Settings = () => {
  const { triggerToast } = useTransitOps();
  const [activeSubTab, setActiveSubTab] = useState('account');
  const fileInputRef = useRef(null);
  
  // Default corporate portrait from user dashboard HTML
  const [profileImg, setProfileImg] = useState(
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCDNH81NEYgB9TZOK_MydQrV7XbwtbPD-nsRql4IelRXdvd8cJyrfjoc3uFRPu1dbMfhtid5uWKADnVHcI8YbdddAMpLbrtH-nKb-bOB-w1wyxQsXnRO5f2rZ9w-SSDLW4kvGrJ9W5RC51cg0HT5fawRVCGmYBlEuwA8WdLKCgdNJZjG9V2LnY3sp7DtpqRYO8z8r0UvNRUSJj7hRbEvYJM2FjHb7KQEK-R_-5MoNsRoHSq0muKpQkoLg"
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form State
  const getInitialUser = () => {
    try {
      const data = localStorage.getItem('user');
      return data ? JSON.parse(data) : { name: 'Alex Sterling', role: 'fleet_manager', email: 'alex@transitops.io' };
    } catch {
      return { name: 'Alex Sterling', role: 'fleet_manager', email: 'alex@transitops.io' };
    }
  };

  const activeUser = getInitialUser();

  const formatRole = (role) => {
    if (!role) return 'Fleet Manager';
    return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };
  const rawRole = activeUser?.selectedRole || activeUser?.role || (activeUser?.roles?.[0] ?? 'fleet_manager');
  const displayRole = formatRole(rawRole?.replace('ROLE_', '').toLowerCase());

  const getInitialCompanyProfile = () => {
    try {
      const data = localStorage.getItem('company_profile');
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  const companyProfile = getInitialCompanyProfile();

  const initialFormState = {
    fullName: activeUser.name || 'Alex Sterling',
    email: activeUser.email || 'alex@transitops.io',
    contactNumber: activeUser.contact || '+1 (555) 902-3482',
    timezone: 'Eastern Standard Time (EST)',
    dateFormat: 'MM/DD/YYYY',
    defaultDashboard: 'Fleet Overview',
    vehicleHealthAlerts: true,
    tripScheduleChanges: true,
    dailyOpsDigest: false,
    
    // Security & Privacy details
    loginEmail: activeUser.email || 'alex@transitops.io',
    recoveryPhone: '+1 (555) 902-3482',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    enable2FA: true,

    // Company profile details
    companyName: companyProfile.companyName || '',
    companyRegNo: companyProfile.companyRegNo || '',
    companyIndustry: companyProfile.companyIndustry || '',
    companyHQ: companyProfile.companyHQ || '',
    companyWebsite: companyProfile.companyWebsite || '',
    companyEmail: companyProfile.companyEmail || '',
    companyAbout: companyProfile.companyAbout || '',
  };

  const [formData, setFormData] = useState({ ...initialFormState });

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Save Settings
  const handleSave = async () => {
    try {
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          triggerToast('Please provide your current password to change it.', 'error');
          return;
        }
        if (formData.newPassword.length < 6) {
          triggerToast('New password must be at least 6 characters long.', 'error');
          return;
        }
        if (formData.newPassword !== formData.confirmNewPassword) {
          triggerToast('New passwords do not match.', 'error');
          return;
        }
        
        try {
          await authService.changePassword(formData.currentPassword, formData.newPassword);
          setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }));
          triggerToast('Password changed successfully!', 'success');
        } catch (err) {
          triggerToast(err.response?.data?.message || err.message || 'Failed to change password.', 'error');
          return;
        }
      }

      const updatedUser = {
        ...activeUser,
        name: formData.fullName,
        email: formData.email,
        contact: formData.contactNumber
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      const updatedCompanyProfile = {
        companyName: formData.companyName,
        companyRegNo: formData.companyRegNo,
        companyIndustry: formData.companyIndustry,
        companyHQ: formData.companyHQ,
        companyWebsite: formData.companyWebsite,
        companyEmail: formData.companyEmail,
        companyAbout: formData.companyAbout,
      };
      localStorage.setItem('company_profile', JSON.stringify(updatedCompanyProfile));

      // Dispatch storage event to alert persistent navbar
      window.dispatchEvent(new Event('user-profile-update'));
      triggerToast('Settings updated successfully.', 'success');
    } catch (err) {
      triggerToast('Failed to save settings.', 'error');
    }
  };

  // Discard Changes
  const handleDiscard = () => {
    setFormData({ ...initialFormState });
    triggerToast('Changes discarded.', 'info');
  };

  const subTabs = [
    { id: 'account', label: 'Account', icon: 'account_circle' },
    { id: 'company', label: 'Company Profile', icon: 'business' },
    { id: 'security', label: 'Security & Privacy', icon: 'security' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-margin-desktop py-unit-lg">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Settings</h2>
        <p className="text-on-surface-variant text-body-lg">
          Manage your logistics environment, team access, and notification preferences.
        </p>
      </div>

      {/* Bento Layout Settings Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Vertical Tab Navigation (Sub-Nav) */}
        <nav className="col-span-12 md:col-span-3 space-y-2">
          {subTabs.map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                  isActive
                    ? 'bg-primary text-white font-semibold shadow-md shadow-primary/20 active:scale-[0.98]'
                    : 'hover:bg-surface-container text-on-surface-variant font-medium'
                }`}
              >
                <span className="material-symbols-outlined">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Active View: Settings Content */}
        <div className="col-span-12 md:col-span-9 space-y-6">
          {activeSubTab === 'account' && (
            <>
              {/* Profile Hero Card */}
              <section className="settings-card-gradient p-8 rounded-xl border border-outline-variant shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-br from-white to-[#f8f9ff]">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                      <img
                        className="w-full h-full object-cover"
                        alt={`${formData.fullName} profile`}
                        src={profileImg}
                      />
                    </div>
                    <button
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">{formData.fullName}</h3>
                    <p className="text-on-surface-variant font-body-md">
                      {displayRole}
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-md text-[10px] uppercase font-semibold">
                        Verified Account
                      </span>
                      <span className="text-on-surface-variant text-[12px] font-label-md">
                        Last active: 14 mins ago
                      </span>
                    </div>
                  </div>
                </div>
              </section>


              {/* Personal Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Info Card 1 */}
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-title-md text-title-md text-on-surface">Personal Details</h4>
                    <span className="material-symbols-outlined text-outline">info</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary transition-all focus:ring-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary transition-all focus:ring-2 outline-none opacity-60 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase mb-1">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary transition-all focus:ring-2 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Info Card 2 */}
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-title-md text-title-md text-on-surface">Work Preferences</h4>
                    <span className="material-symbols-outlined text-outline">work</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase mb-1">
                        Timezone
                      </label>
                      <select
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary transition-all focus:ring-2 outline-none"
                      >
                        <option>Eastern Standard Time (EST)</option>
                        <option>Pacific Standard Time (PST)</option>
                        <option>Central European Time (CET)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase mb-1">
                        Date Format
                      </label>
                      <select
                        name="dateFormat"
                        value={formData.dateFormat}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary transition-all focus:ring-2 outline-none"
                      >
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase mb-1">
                        Default Dashboard
                      </label>
                      <select
                        name="defaultDashboard"
                        value={formData.defaultDashboard}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary transition-all focus:ring-2 outline-none"
                      >
                        <option>Fleet Overview</option>
                        <option>Driver Analytics</option>
                        <option>Financial Summary</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Toggle Section */}
              <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <div className="mb-6">
                  <h4 className="font-title-md text-title-md text-on-surface">System Notifications</h4>
                  <p className="text-on-surface-variant text-body-md">
                    Configure how you receive critical operational alerts.
                  </p>
                </div>
                <div className="space-y-4">
                  {/* Toggle Item 1 */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined">report_problem</span>
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface">Vehicle Health Alerts</p>
                        <p className="text-sm text-on-surface-variant">
                          Immediate notification for engine failures or critical maintenance issues.
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="vehicleHealthAlerts"
                        checked={formData.vehicleHealthAlerts}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {/* Toggle Item 2 */}
                  <div className="flex items-center justify-between py-2 border-t border-outline-variant/30">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined">schedule</span>
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface">Trip Schedule Changes</p>
                        <p className="text-sm text-on-surface-variant">
                          Notify when a trip is delayed by more than 15 minutes.
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="tripScheduleChanges"
                        checked={formData.tripScheduleChanges}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {/* Toggle Item 3 */}
                  <div className="flex items-center justify-between py-2 border-t border-outline-variant/30">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined">mail</span>
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface">Daily Ops Digest</p>
                        <p className="text-sm text-on-surface-variant">
                          Email summary of fleet performance sent every morning at 6:00 AM.
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="dailyOpsDigest"
                        checked={formData.dailyOpsDigest}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </section>

              {/* Danger Zone */}
              <section className="bg-error-container/20 p-6 rounded-xl border border-error/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-title-md text-title-md text-error">Danger Zone</h4>
                  <p className="text-on-surface-variant text-body-md mt-1">
                    Irreversible actions concerning your account data.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-error text-white font-semibold rounded-lg hover:opacity-90 transition-all text-body-md">
                      Deactivate Account
                    </button>
                    <button className="px-4 py-2 border border-error text-error font-semibold rounded-lg hover:bg-error/5 transition-all text-body-md bg-transparent">
                      Export All Data
                    </button>
                  </div>
                </div>
                <span className="material-symbols-outlined text-error text-3xl opacity-20 hidden sm:block">
                  warning
                </span>
              </section>

              {/* Footer Action Bar */}
              <div className="flex items-center justify-end gap-4 pt-4 pb-12">
                <button
                  onClick={handleDiscard}
                  className="px-6 py-2.5 text-on-surface-variant font-semibold rounded-lg hover:bg-surface-container transition-all"
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 transition-all"
                >
                  Save Settings
                </button>
              </div>
            </>
          )}

          {activeSubTab === 'security' && (
            <>
              {/* Security Details & Change Password Forms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Security details edit */}
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-title-md text-title-md text-on-surface">Security Details</h4>
                    <span className="material-symbols-outlined text-outline">verified_user</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase mb-1">
                        Login Email Address
                      </label>
                      <input
                        type="email"
                        name="loginEmail"
                        value={formData.loginEmail}
                        onChange={handleInputChange}
                        disabled
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary transition-all focus:ring-2 outline-none opacity-60 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase mb-1">
                        Recovery Phone Number
                      </label>
                      <input
                        type="text"
                        name="recoveryPhone"
                        value={formData.recoveryPhone}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary transition-all focus:ring-2 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Password change form */}
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-title-md text-title-md text-on-surface">Change Password</h4>
                    <span className="material-symbols-outlined text-outline">lock</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary transition-all focus:ring-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary transition-all focus:ring-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary transition-all focus:ring-2 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Action Bar */}
              <div className="flex items-center justify-end gap-4 pt-4 pb-12">
                <button
                  onClick={handleDiscard}
                  className="px-6 py-2.5 text-on-surface-variant font-semibold rounded-lg hover:bg-surface-container transition-all"
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 transition-all"
                >
                  Save Settings
                </button>
              </div>
            </>
          )}

          {activeSubTab === 'company' && (
            <>
              {/* Company Details & About Us Forms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Details */}
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-title-md text-title-md text-on-surface">Company Profile</h4>
                    <span className="material-symbols-outlined text-outline">business</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary transition-all focus:ring-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase mb-1">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        name="companyRegNo"
                        value={formData.companyRegNo}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary transition-all focus:ring-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase mb-1">
                        Industry Sector
                      </label>
                      <input
                        type="text"
                        name="companyIndustry"
                        value={formData.companyIndustry}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary transition-all focus:ring-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase mb-1">
                        Corporate Headquarters
                      </label>
                      <input
                        type="text"
                        name="companyHQ"
                        value={formData.companyHQ}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary transition-all focus:ring-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase mb-1">
                        Website Address
                      </label>
                      <input
                        type="text"
                        name="companyWebsite"
                        value={formData.companyWebsite}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary transition-all focus:ring-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase mb-1">
                        Contact Email Address
                      </label>
                      <input
                        type="email"
                        name="companyEmail"
                        value={formData.companyEmail}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary transition-all focus:ring-2 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* About Us Description */}
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-title-md text-title-md text-on-surface">About Us</h4>
                    <span className="material-symbols-outlined text-outline">description</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase mb-1">
                        Company Description
                      </label>
                      <textarea
                        name="companyAbout"
                        value={formData.companyAbout}
                        onChange={handleInputChange}
                        rows={12}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary focus:border-primary transition-all focus:ring-2 outline-none resize-none"
                      />
                    </div>
                    
                    {/* Visual Fleet Status Summary */}
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <h5 className="font-semibold text-sm text-primary mb-1">Associated Workspace</h5>
                      <p className="text-xs text-on-surface-variant">
                        You are currently administering assets linked to the primary logistics hub under the registration node <strong>{formData.companyRegNo}</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Action Bar */}
              <div className="flex items-center justify-end gap-4 pt-4 pb-12">
                <button
                  onClick={handleDiscard}
                  className="px-6 py-2.5 text-on-surface-variant font-semibold rounded-lg hover:bg-surface-container transition-all"
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 transition-all"
                >
                  Save Settings
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
