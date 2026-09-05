import { useState } from 'react';
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { loginAdvisor } from '../services/api';

export default function AdvisorLoginGate({ onLoginSuccess }) {
  const [email, setEmail] = useState('advisor@university.edu');
  const [password, setPassword] = useState('counselor2024');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        name: 'Dr. Katherine Hayes',
        title: 'Lead Academic Counselor & Director',
        email: email.trim(),
        department: 'Counseling & Psychological Services',
      };

      // Keep user display cache in sessionStorage
      sessionStorage.setItem('counselor_auth_user', JSON.stringify(user));
      onLoginSuccess(user);
    } catch (err) {
      if (err.response?.status === 429) {
        setError(
          err.response?.data?.error ||
          'Too many failed login attempts. Please try again in 15 minutes.'
        );
      } else {
        // Sanitized generic error to prevent user enumeration
        setError('Invalid email or staff passcode');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail('advisor@university.edu');
    setPassword('counselor2024');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-3 sm:px-4 py-6 sm:py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 text-white p-5 sm:p-6 text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/15 shadow-inner">
            <ShieldCheck size={28} className="text-primary-300" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">Advisor & Staff Authentication</h2>
          <p className="text-[11px] sm:text-xs text-slate-300 mt-1">
            Confidential Student Counseling Records Portal
          </p>
        </div>

        {/* Security Warning Notice */}
        <div className="bg-amber-50/80 border-b border-amber-200/70 p-3 sm:p-3.5 px-4 sm:px-6 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="leading-relaxed text-[11px] sm:text-xs">
            <strong>Restricted Access:</strong> FERPA regulations and HIPAA privacy laws strictly protect all student intake submissions. Unauthorized access is prohibited.
          </p>
        </div>

        {/* Form */}
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
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Staff Passcode / Key
            </label>
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

          {/* Quick Demo Button - Completely stripped from production builds */}
          {import.meta.env.MODE === 'development' && (
            <div className="pt-2 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={handleQuickDemo}
                className="text-xs text-slate-500 hover:text-primary-600 font-medium transition cursor-pointer"
              >
                Demo: Instant Sign-In as Dr. Katherine Hayes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
