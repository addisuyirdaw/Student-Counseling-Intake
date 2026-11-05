import { useState } from 'react';
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight, Loader2, KeyRound, CheckCircle } from 'lucide-react';
import { loginAdvisor, resetPassword } from '../services/api';

export default function AdvisorLoginGate({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot / Reset Password state
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await loginAdvisor({
        email: email.trim(),
        password: password.trim(),
      });

      const user = res.user || {
        name: email.trim().split('@')[0],
        title: 'Lead Academic Counselor & Director',
        email: email.trim(),
        department: 'Counseling & Psychological Services',
      };

      sessionStorage.setItem('counselor_auth_user', JSON.stringify(user));
      onLoginSuccess(user);
    } catch (err) {
      if (err.response?.status === 429) {
        setError(
          err.response?.data?.error ||
          'Too many failed login attempts. Please wait a moment.'
        );
      } else if (err.response?.status === 401) {
        setError(err.response?.data?.error || 'Invalid email or staff passcode');
      } else if (err.response?.status === 500) {
        setError(err.response?.data?.error || 'Server error occurred during login. Please check backend logs.');
      } else if (!err.response) {
        setError('Cannot connect to backend server. Make sure the backend API is running on port 3001.');
      } else {
        setError(err.response?.data?.error || 'Invalid email or staff passcode');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (!resetEmail.trim() || !newPasswordVal.trim()) {
      setResetError('Please enter both your email and new passcode.');
      return;
    }

    setIsResetting(true);
    try {
      await resetPassword(resetEmail.trim(), newPasswordVal.trim());
      setResetSuccess('Passcode updated successfully! You can now sign in.');
      setEmail(resetEmail.trim());
      setPassword(newPasswordVal.trim());
      setTimeout(() => {
        setIsResetMode(false);
        setResetSuccess('');
      }, 1500);
    } catch (err) {
      setResetError(err.response?.data?.error || 'Failed to update passcode. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-3 sm:px-4 py-6 sm:py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 text-white p-5 sm:p-6 text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/15 shadow-inner">
            <ShieldCheck size={28} className="text-primary-300" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            {isResetMode ? 'Reset Staff Passcode' : 'Advisor & Staff Authentication'}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-300 mt-1">
            {isResetMode ? 'Set a new password for your account' : 'Confidential Student Counseling Records Portal'}
          </p>
        </div>

        {/* Security Warning Notice */}
        <div className="bg-amber-50/80 border-b border-amber-200/70 p-3 sm:p-3.5 px-4 sm:px-6 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="leading-relaxed text-[11px] sm:text-xs">
            <strong>Restricted Access:</strong> FERPA regulations and HIPAA privacy laws strictly protect all student intake submissions. Unauthorized access is prohibited.
          </p>
        </div>

        {/* Normal Login Form */}
        {!isResetMode ? (
          <form onSubmit={handleLogin} className="p-4 sm:p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Advisor University Email
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="advisor@university.edu"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Staff Passcode / Key
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setError('');
                    setIsResetMode(true);
                  }}
                  className="text-xs text-primary-600 hover:text-primary-800 font-medium cursor-pointer"
                >
                  Forgot passcode?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Academic Advisor</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Reset Password Form */
          <form onSubmit={handleResetPassword} className="p-4 sm:p-6 space-y-4">
            {resetSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            )}

            {resetError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {resetError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                New Passcode / Password
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={newPasswordVal}
                  onChange={(e) => setNewPasswordVal(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isResetting}
              className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isResetting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Updating Passcode...</span>
                </>
              ) : (
                <>
                  <span>Save New Passcode</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setResetError('');
                  setResetSuccess('');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium transition cursor-pointer"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
