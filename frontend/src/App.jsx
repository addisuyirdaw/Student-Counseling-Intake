import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Shield, GraduationCap, HeartHandshake, LogIn } from 'lucide-react';
import CounselingForm from './pages/CounselingForm';
import SuccessPage from './pages/SuccessPage';
import CounselorDashboard from './pages/CounselorDashboard';

function NavigationBar() {
  const location = useLocation();
  const [hasAdvisorSession, setHasAdvisorSession] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const stored = sessionStorage.getItem('counselor_auth_user');
      setHasAdvisorSession(Boolean(stored));
    };
    checkAuth();
    // Check when route changes
  }, [location.pathname]);

  return (
    <nav className="bg-white shadow-xs border-b border-slate-200">
      <div className="flex flex-wrap justify-between items-center px-3 sm:px-6 max-w-7xl mx-auto py-2.5 sm:py-3.5 gap-2 sm:gap-3">
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-xs group-hover:bg-primary-700 transition flex-shrink-0">
            <HeartHandshake size={18} />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none truncate">
              Student Counseling Intake
            </h1>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block truncate">
              University Mental Health & Academic Support
            </span>
          </div>
        </Link>

        {/* Public Navigation - 'Requests' is removed for general users */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Link
            to="/"
            className={`text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition ${
              location.pathname === '/' 
                ? 'bg-slate-100 text-slate-900' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Intake Form
          </Link>

          {/* Secure Advisor Portal Entry Point */}
          <Link
            to="/requests"
            className={`text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 border ${
              location.pathname === '/requests'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Shield size={13} className={location.pathname === '/requests' ? 'text-primary-300' : 'text-slate-400'} />
            <span>Advisor Portal</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <NavigationBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<CounselingForm />} />
            <Route path="/success/:id" element={<SuccessPage />} />
            <Route path="/requests" element={<CounselorDashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;