import { useState, useEffect, useRef } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Users,
  UserCog,
  RefreshCw,
  Camera,
  Upload,
  Trash2,
} from 'lucide-react';
import { updateAdvisorProfile, getStaffList, adminUpdateStaff } from '../services/api';

export default function AdvisorProfileModal({ isOpen, onClose, authUser, onProfileUpdated }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'staff'
  const isAdmin = authUser?.role === 'ADMIN';
  const fileInputRef = useRef(null);

  // Form State for Self Update
  const [name, setName] = useState(authUser?.name || '');
  const [email, setEmail] = useState(authUser?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(authUser?.avatarUrl || null);
  const [avatarPreview, setAvatarPreview] = useState(authUser?.avatarUrl || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility Toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Admin Staff Directory State
  const [staffList, setStaffList] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [adminNewPass, setAdminNewPass] = useState('');
  const [adminActionLoading, setAdminActionLoading] = useState(false);
  const [adminSuccessMsg, setAdminSuccessMsg] = useState(null);
  const [adminErrorMsg, setAdminErrorMsg] = useState(null);

  // Sync user state on open
  useEffect(() => {
    if (isOpen && authUser) {
      setName(authUser.name || '');
      setEmail(authUser.email || '');
      setAvatarUrl(authUser.avatarUrl || null);
      setAvatarPreview(authUser.avatarUrl || '');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen, authUser]);

  // Load staff list if admin and on staff tab
  useEffect(() => {
    if (isOpen && isAdmin && activeTab === 'staff') {
      loadStaff();
    }
  }, [isOpen, isAdmin, activeTab]);

  async function loadStaff() {
    setStaffLoading(true);
    setAdminErrorMsg(null);
    try {
      const res = await getStaffList();
      setStaffList(res.advisors || []);
    } catch (err) {
      setAdminErrorMsg(err.response?.data?.error || 'Failed to load staff list');
    } finally {
      setStaffLoading(false);
    }
  }

  if (!isOpen) return null;

  const getInitials = (fullName) => {
    if (!fullName) return 'AD';
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image file size must be under 5MB.');
      return;
    }

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        // Optimize & resize image to max 400x400 for crisp avatar rendering with minimal footprint
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setAvatarPreview(compressedDataUrl);
        setAvatarUrl(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarPreview('');
    setAvatarUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  async function handleSelfSubmit(e) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (!name.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setErrorMsg('New password must be at least 6 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('New passwords do not match.');
        return;
      }
      if (!currentPassword) {
        setErrorMsg('Current password is required to set a new password.');
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        avatarUrl: avatarUrl !== undefined ? avatarUrl : (authUser?.avatarUrl || null),
      };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await updateAdvisorProfile(payload);
      setSuccessMsg(res.message || 'Profile updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      if (res.user) {
        const updated = { ...authUser, ...res.user };
        sessionStorage.setItem('counselor_auth_user', JSON.stringify(updated));
        if (onProfileUpdated) onProfileUpdated(updated);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdminResetPassword(e) {
    e.preventDefault();
    if (!selectedStaff) return;
    if (!adminNewPass || adminNewPass.trim().length < 6) {
      setAdminErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setAdminActionLoading(true);
    setAdminErrorMsg(null);
    setAdminSuccessMsg(null);
    try {
      await adminUpdateStaff(selectedStaff.id, {
        password: adminNewPass.trim(),
      });
      setAdminSuccessMsg(`Password for ${selectedStaff.name} successfully updated!`);
      setAdminNewPass('');
      setSelectedStaff(null);
      loadStaff();
    } catch (err) {
      setAdminErrorMsg(err.response?.data?.error || 'Failed to reset counselor password');
    } finally {
      setAdminActionLoading(false);
    }
  }

  async function handleToggleActive(staff) {
    if (staff.id === authUser.id) {
      alert('You cannot deactivate your own account.');
      return;
    }
    const action = staff.isActive ? 'deactivate' : 'reactivate';
    if (!confirm(`Are you sure you want to ${action} ${staff.name}?`)) return;

    try {
      await adminUpdateStaff(staff.id, { isActive: !staff.isActive });
      loadStaff();
    } catch (err) {
      alert(err.response?.data?.error || `Failed to ${action} advisor`);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-600/30 text-primary-300 border border-primary-500/30 flex items-center justify-center">
              <UserCog size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white">Profile & Security Settings</h3>
              <p className="text-xs text-slate-400">Manage your credentials and counselor profile</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation (for Admins) */}
        {isAdmin && (
          <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-2 gap-4 flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`pb-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'profile'
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <User size={14} />
              My Profile & Password
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('staff')}
              className={`pb-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'staff'
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users size={14} />
              Staff Directory & Credentials
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSelfSubmit} className="space-y-4">
              {/* Alert Banners */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-800 text-xs font-semibold">
                  <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Profile Photo Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50/90 border border-slate-200/90 rounded-2xl">
                <div className="relative group flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary-500/40 shadow-sm bg-white flex items-center justify-center">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Profile Avatar Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-primary-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center tracking-tight shadow-inner">
                        {getInitials(name || authUser?.name)}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-md border-2 border-white transition cursor-pointer"
                    title="Change photo"
                    aria-label="Upload photo"
                  >
                    <Camera size={13} />
                  </button>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1 min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h5 className="text-xs font-bold text-slate-800">Profile Photo</h5>
                    {avatarPreview && (
                      <span className="text-[10px] font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-200/60">
                        Custom Avatar
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Upload a portrait (JPG, PNG, or WebP up to 5MB). Rendered on your staff dashboard and portal banner.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />

                  <div className="flex items-center justify-center sm:justify-start gap-2 pt-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload size={13} className="text-primary-600" />
                      <span>{avatarPreview ? 'Change Photo' : 'Upload Photo'}</span>
                    </button>

                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-2.5 py-1.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 text-xs font-semibold rounded-xl transition flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={12} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Account Details</h4>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    Role: {authUser?.role || 'COUNSELOR'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Dr. Jane Smith"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">University Email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="advisor@university.edu"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Change Password</h4>
                  <p className="text-[11px] text-slate-500">Leave blank if you do not wish to update your password.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password to verify"
                      className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                    <div className="relative">
                      <KeyRound size={15} className="absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <KeyRound size={15} className="absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type new password"
                        className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={14} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Admin Staff Directory & Credential Reset */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Counseling Staff Directory</h4>
                  <p className="text-[11px] text-slate-500">Admins can reset passwords and manage advisor status.</p>
                </div>
                <button
                  type="button"
                  onClick={loadStaff}
                  disabled={staffLoading}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition flex items-center gap-1 text-xs font-semibold cursor-pointer"
                >
                  <RefreshCw size={13} className={staffLoading ? 'animate-spin' : ''} />
                  <span>Refresh</span>
                </button>
              </div>

              {adminSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                  <span>{adminSuccessMsg}</span>
                </div>
              )}
              {adminErrorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                  <span>{adminErrorMsg}</span>
                </div>
              )}

              {/* Password Reset Sub-Form when a staff is selected */}
              {selectedStaff && (
                <form
                  onSubmit={handleAdminResetPassword}
                  className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2.5 border border-slate-800 animate-fadeIn"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary-300">
                      Reset Password for: {selectedStaff.name} ({selectedStaff.email})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStaff(null);
                        setAdminNewPass('');
                      }}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={adminNewPass}
                      onChange={(e) => setAdminNewPass(e.target.value)}
                      placeholder="Enter new temporary password (min 6 chars)"
                      required
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <button
                      type="submit"
                      disabled={adminActionLoading}
                      className="px-3 py-1.5 text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                    >
                      {adminActionLoading ? <Loader2 size={12} className="animate-spin" /> : 'Set Password'}
                    </button>
                  </div>
                </form>
              )}

              {/* Staff List */}
              {staffLoading ? (
                <div className="py-8 text-center text-slate-500 flex flex-col items-center gap-2">
                  <Loader2 size={24} className="animate-spin text-primary-600" />
                  <span className="text-xs font-medium">Loading advisor directory...</span>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {staffList.map((staff) => (
                    <div key={staff.id} className="p-3 flex items-center justify-between hover:bg-slate-50/70 transition gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900 truncate">{staff.name}</span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                              staff.role === 'ADMIN'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : staff.role === 'LEAD_ADVISOR'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {staff.role}
                          </span>
                          {!staff.isActive && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{staff.email}</p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStaff(staff);
                            setAdminNewPass('');
                            setAdminSuccessMsg(null);
                            setAdminErrorMsg(null);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-primary-700 hover:bg-primary-50 border border-primary-200 rounded-lg transition cursor-pointer"
                        >
                          Reset Pass
                        </button>
                        {staff.id !== authUser.id && (
                          <button
                            type="button"
                            onClick={() => handleToggleActive(staff)}
                            className={`px-2 py-1 text-[11px] font-semibold rounded-lg border transition cursor-pointer ${
                              staff.isActive
                                ? 'text-rose-700 hover:bg-rose-50 border-rose-200'
                                : 'text-emerald-700 hover:bg-emerald-50 border-emerald-200'
                            }`}
                          >
                            {staff.isActive ? 'Deactivate' : 'Reactivate'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
