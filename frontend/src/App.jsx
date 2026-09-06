import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Shield, HeartHandshake, Languages } from 'lucide-react';
import CounselingForm from './pages/CounselingForm';
import SuccessPage from './pages/SuccessPage';
import CounselorDashboard from './pages/CounselorDashboard';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function NavigationBar() {
  const location = useLocation();
  const { lang, toggleLanguage, t } = useLanguage();
  const [hasAdvisorSession, setHasAdvisorSession] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const stored = sessionStorage.getItem('counselor_auth_user');
      setHasAdvisorSession(Boolean(stored));
    };
    checkAuth();
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
              {t('nav_title')}
            </h1>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block truncate">
              {t('nav_subtitle')}
            </span>
          </div>
        </Link>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Prominent Language Switcher */}
          <button
            type="button"
            onClick={toggleLanguage}
            title={lang === 'en' ? 'Switch to Amharic (አማርኛ)' : 'Switch to English'}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-300/80 rounded-xl transition text-xs font-semibold cursor-pointer shadow-2xs group"
          >
            <Languages size={15} className="text-primary-600 group-hover:rotate-12 transition-transform" />
            <div className="flex items-center gap-1 text-[11px] sm:text-xs">
              <span
                className={`px-1.5 py-0.5 rounded-md transition ${
                  lang === 'en'
                    ? 'bg-primary-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </span>
              <span className="text-slate-300">|</span>
              <span
                className={`px-1.5 py-0.5 rounded-md transition font-amharic ${
                  lang === 'am'
                    ? 'bg-primary-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                አማርኛ
              </span>
            </div>
          </button>

          {/* Intake Form Link */}
          <Link
            to="/"
            className={`text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition ${
              location.pathname === '/'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('nav_intake_form')}
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
            <span>{t('nav_advisor_portal')}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <LanguageProvider>
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
    </LanguageProvider>
  );
}

export default App;