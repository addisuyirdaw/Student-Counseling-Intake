import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthMe } from '../services/api';
import AdvisorLoginGate from '../components/AdvisorLoginGate';

/**
 * Dedicated staff-only login page accessible at /staff.
 * Not linked anywhere in the public UI — advisors must know the URL.
 * On successful login, redirects to the /requests dashboard.
 */
export default function StaffLogin() {
  const navigate = useNavigate();

  // If an active session already exists, skip the login and go straight to dashboard
  useEffect(() => {
    getAuthMe()
      .then(() => navigate('/requests', { replace: true }))
      .catch(() => {/* No session — stay on login page */});
  }, [navigate]);

  function handleLoginSuccess(user) {
    sessionStorage.setItem('counselor_auth_user', JSON.stringify(user));
    navigate('/requests', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Minimal branded header — no public nav links exposed */}
      <header className="px-6 py-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-slate-200 tracking-tight">
            StudentCareHub <span className="text-slate-500 font-normal">— Staff Portal</span>
          </span>
        </div>
      </header>

      {/* Login card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <AdvisorLoginGate onLoginSuccess={handleLoginSuccess} />
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-[11px] text-slate-600 border-t border-slate-800">
        Restricted access — authorized university counseling staff only.
        Unauthorized access is prohibited under FERPA and institutional policy.
      </footer>
    </div>
  );
}
