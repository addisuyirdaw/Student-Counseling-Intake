import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import {
  HeartHandshake,
  Languages,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import HomePage from './pages/HomePage';
import CounselingForm from './pages/CounselingForm';
import SuccessPage from './pages/SuccessPage';
import CounselorDashboard from './pages/CounselorDashboard';
import StaffLogin from './pages/StaffLogin';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { logoutAdvisor } from './services/api';

function NavigationBar() {
  const location = useLocation();
  const { lang, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if an advisor staff session is active
  const [hasStaffSession, setHasStaffSession] = useState(() => {
    try {
      const user = sessionStorage.getItem('counselor_auth_user');
      const token = sessionStorage.getItem('advisor_token');
      return Boolean(user || token);
    } catch {
      return false;
    }
  });

  const [staffUser, setStaffUser] = useState(() => {
    try {
      const user = sessionStorage.getItem('counselor_auth_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  });

  // Re-sync session and close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    try {
      const user = sessionStorage.getItem('counselor_auth_user');
      const token = sessionStorage.getItem('advisor_token');
      setHasStaffSession(Boolean(user || token));
      setStaffUser(user ? JSON.parse(user) : null);
    } catch {
      setHasStaffSession(false);
      setStaffUser(null);
    }
  }, [location.pathname]);

  const isStaffRoute =
    location.pathname === '/staff' ||
    location.pathname === '/requests' ||
    location.pathname.startsWith('/requests');

  // Completely remove top navbar on staff login and dashboard routes so only the dedicated portal banner shows
  if (isStaffRoute) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await logoutAdvisor();
    } catch (e) {
      console.error('Logout error:', e);
    }
    sessionStorage.removeItem('counselor_auth_user');
    sessionStorage.removeItem('advisor_token');
    setHasStaffSession(false);
    setStaffUser(null);
    window.location.href = '/';
  };

  const navLinks = [
    { label: t('nav_home'), to: '/' },
    { label: t('nav_services'), href: location.pathname === '/' ? '#services' : '/#services' },
    { label: t('nav_about'), href: location.pathname === '/' ? '#about' : '/#about' },
    { label: t('nav_faqs'), href: location.pathname === '/' ? '#faqs' : '/#faqs' },
    { label: t('nav_emergency'), href: location.pathname === '/' ? '#emergency' : '/#emergency' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-3">
          {/* Logo & Portal Brand */}
          <Link to="/" className="flex items-center gap-2.5 group min-w-0 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-xs group-hover:bg-primary-700 transition">
              <HeartHandshake size={20} />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none truncate">
                {t('nav_title')}
              </h1>
              <span className="text-[11px] text-slate-500 font-medium block truncate">
                {t('nav_subtitle')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {hasStaffSession ? (
              /* When staff session is active, hide public student links and show advisor dashboard link */
              <Link
                to="/requests"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 flex items-center gap-1.5 transition"
              >
                <LayoutDashboard size={14} />
                <span>Advisor Dashboard</span>
              </Link>
            ) : (
              /* Normal public student links */
              navLinks.map((item, idx) =>
                item.to ? (
                  <Link
                    key={idx}
                    to={item.to}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                      location.pathname === item.to
                        ? 'text-primary-700 font-bold bg-primary-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={idx}
                    href={item.href}
                    className="text-xs font-semibold px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition"
                  >
                    {item.label}
                  </a>
                )
              )
            )}
          </div>

          {/* Action Controls */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              title={lang === 'en' ? 'Switch to Amharic (አማርኛ)' : 'Switch to English'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-300/80 rounded-xl transition text-xs font-semibold cursor-pointer shadow-2xs group"
            >
              <Languages size={14} className="text-primary-600 group-hover:rotate-12 transition-transform" />
              <div className="flex items-center gap-1 text-[11px]">
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

            {hasStaffSession ? (
              /* Staff session badge & sign out button (CTA hidden) */
              <div className="flex items-center gap-2">
                {staffUser?.avatarUrl ? (
                  <img
                    src={staffUser.avatarUrl}
                    alt={staffUser.name || 'Staff Avatar'}
                    className="w-7 h-7 rounded-lg object-cover border border-primary-400/60 shadow-2xs flex-shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-primary-700 text-white font-bold text-[11px] flex items-center justify-center shadow-2xs flex-shrink-0">
                    {(staffUser?.name || 'A').slice(0, 1).toUpperCase()}
                  </div>
                )}
                <span className="text-[11px] font-medium text-slate-600 hidden md:inline">
                  Staff: <strong className="text-slate-900">{staffUser?.name || 'Advisor'}</strong>
                </span>
                <Link
                  to="/requests"
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition flex items-center gap-1 shadow-xs"
                >
                  <ShieldCheck size={13} />
                  <span>Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition border border-slate-200 cursor-pointer flex items-center gap-1"
                >
                  <LogOut size={12} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              /* Public Student Intake Form CTA */
              <Link
                to="/intake"
                className={`text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs ${
                  location.pathname === '/intake'
                    ? 'bg-primary-700 text-white shadow-primary-700/20'
                    : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/20'
                }`}
              >
                <span>{t('nav_start_intake')}</span>
                <ArrowRight size={13} />
              </Link>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-primary-700"
            >
              {lang === 'en' ? 'አማ' : 'EN'}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 animate-fadeIn shadow-lg">
          {hasStaffSession ? (
            /* Mobile view for logged in staff */
            <div className="space-y-2">
              <div className="px-3 py-2 bg-slate-50 rounded-lg text-xs font-semibold text-slate-700">
                Staff Session: <strong className="text-slate-900">{staffUser?.name || 'Advisor'}</strong>
              </div>
              <Link
                to="/requests"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                <LayoutDashboard size={14} />
                <span>Advisor Dashboard</span>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            /* Mobile view for public students */
            <>
              <div className="space-y-1">
                {navLinks.map((item, idx) =>
                  item.to ? (
                    <Link
                      key={idx}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={idx}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      {item.label}
                    </a>
                  )
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <Link
                  to="/intake"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  <span>{t('nav_start_intake')}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </>
          )}
        </div>
      )}
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
              <Route path="/" element={<HomePage />} />
              <Route path="/intake" element={<CounselingForm />} />
              <Route path="/success/:id" element={<SuccessPage />} />
              {/* /staff — hidden advisor login, not linked in public UI */}
              <Route path="/staff" element={<StaffLogin />} />
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