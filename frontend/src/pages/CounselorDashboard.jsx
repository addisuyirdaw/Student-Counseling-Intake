import { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, AlertCircle, Search, Loader2, 
  X, Eye, Calendar, User, FileText, Filter, GraduationCap, 
  AlertTriangle, ShieldCheck, LogOut, Check, ArrowRight, 
  Users, Inbox, CalendarCheck, CheckCheck, Sparkles, TrendingUp,
  Activity, UserCog
} from 'lucide-react';
import { getRequests, updateStatus, getCounts, getAuthMe, logoutAdvisor } from '../services/api';
import RequestDetailModal from '../components/RequestDetailModal';
import AdvisorLoginGate from '../components/AdvisorLoginGate';
import AdvisorProfileModal from '../components/AdvisorProfileModal';

const STATUS_COLORS = {
  PENDING: 'bg-amber-50 text-amber-800 border-amber-200/80',
  REVIEWED: 'bg-blue-50 text-blue-800 border-blue-200/80',
  SCHEDULED: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
  COMPLETED: 'bg-purple-50 text-purple-800 border-purple-200/80',
  REJECTED: 'bg-rose-50 text-rose-800 border-rose-200/80',
};

const STATUSES = ['PENDING', 'REVIEWED', 'SCHEDULED', 'COMPLETED', 'REJECTED'];

export default function CounselorDashboard() {
  const [authUser, setAuthUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('counselor_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [authChecking, setAuthChecking] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Verify HttpOnly cookie session on page load
  useEffect(() => {
    async function verifySession() {
      try {
        const res = await getAuthMe();
        if (res.user) {
          setAuthUser(res.user);
          sessionStorage.setItem('counselor_auth_user', JSON.stringify(res.user));
        }
      } catch (err) {
        // No active HttpOnly cookie session
        sessionStorage.removeItem('counselor_auth_user');
        setAuthUser(null);
      } finally {
        setAuthChecking(false);
      }
    }
    verifySession();
  }, []);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState(''); // '' | 'HIGH' | 'MEDIUM' | 'LOW'
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [counts, setCounts] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionInProgressId, setActionInProgressId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (authUser) {
      fetchRequests();
      fetchCounts();
    }
  }, [statusFilter, page, authUser]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const normalizedFilter = statusFilter ? statusFilter.trim().toUpperCase() : '';
      const data = await getRequests({ status: normalizedFilter, page, limit: 12 });
      const items = data.data || [];
      setRequests(items);
      setPagination(data.pagination || { total: 0, totalPages: 1 });

      // Keep open modal synced with latest data
      if (selectedRequest) {
        const fresh = items.find((r) => r.id === selectedRequest.id);
        if (fresh) setSelectedRequest(fresh);
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const data = await getCounts();
      setCounts(data.data || {});
    } catch (err) {
      console.error('Failed to fetch counts:', err);
    }
  };

  const showToast = (msg, targetTab) => {
    setToastMessage({ text: msg, tab: targetTab });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleStatusChange = async (id, newStatus) => {
    const normStatus = (newStatus || 'PENDING').trim().toUpperCase();
    setActionInProgressId(id);

    // Optimistic local update
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: normStatus } : r))
    );
    setSelectedRequest((prev) =>
      prev && prev.id === id ? { ...prev, status: normStatus } : prev
    );

    try {
      await updateStatus(id, normStatus);
      await Promise.all([fetchRequests(), fetchCounts()]);
      showToast(`Student request updated to ${normStatus}.`, normStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
      await Promise.all([fetchRequests(), fetchCounts()]);
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleNotesUpdated = (id, notes) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, advisorNotes: notes } : r))
    );
    setSelectedRequest((prev) =>
      prev && prev.id === id ? { ...prev, advisorNotes: notes } : prev
    );
  };

  const handleSignOut = async () => {
    try {
      await logoutAdvisor();
    } catch (e) {
      console.error('Logout error:', e);
    }
    sessionStorage.removeItem('counselor_auth_user');
    setAuthUser(null);
  };

  // While checking HttpOnly cookie session
  if (authChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 gap-3">
        <Loader2 className="animate-spin text-primary-600" size={36} />
        <p className="text-sm font-medium">Verifying advisor credentials...</p>
      </div>
    );
  }

  // If user is not authenticated as an advisor, present the login security gate
  if (!authUser) {
    return <AdvisorLoginGate onLoginSuccess={(user) => setAuthUser(user)} />;
  }

  const totalCalculated =
    ((counts && counts.PENDING) || 0) +
    ((counts && counts.REVIEWED) || 0) +
    ((counts && counts.SCHEDULED) || 0) +
    ((counts && counts.COMPLETED) || 0) +
    ((counts && counts.REJECTED) || 0);

  const totalSubmissions = counts.TOTAL || totalCalculated;
  const pendingCount = counts.PENDING || 0;
  const scheduledCount = counts.SCHEDULED || 0;
  const urgentCount = counts.URGENT || requests.filter((r) => r.urgencyLevel === 'HIGH').length;

  // Normalized client-side filter
  const filteredRequests = requests.filter((req) => {
    const reqStatus = (req.status || 'PENDING').trim().toUpperCase();
    const activeStatus = (statusFilter || '').trim().toUpperCase();

    if (activeStatus && reqStatus !== activeStatus) return false;

    if (urgencyFilter) {
      const reqUrgency = (req.urgencyLevel || 'MEDIUM').trim().toUpperCase();
      if (reqUrgency !== urgencyFilter.trim().toUpperCase()) return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const student = req.student || {};
    return (
      (student.firstName && student.firstName.toLowerCase().includes(q)) ||
      (student.lastName && student.lastName.toLowerCase().includes(q)) ||
      (student.studentId && student.studentId.toLowerCase().includes(q)) ||
      (student.email && student.email.toLowerCase().includes(q)) ||
      (student.department && student.department.toLowerCase().includes(q)) ||
      (req.counselingTopic && req.counselingTopic.toLowerCase().includes(q))
    );
  });

  return (
    <div className="py-4 sm:py-8 px-3 sm:px-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCheck size={16} className="text-emerald-600" />
            <span>{toastMessage.text}</span>
          </div>
          {toastMessage.tab && statusFilter !== toastMessage.tab && (
            <button
              onClick={() => {
                setStatusFilter(toastMessage.tab);
                setPage(1);
                setToastMessage(null);
              }}
              className="text-primary-700 hover:text-primary-900 underline ml-3 cursor-pointer"
            >
              Switch to {toastMessage.tab} tab &rarr;
            </button>
          )}
        </div>
      )}

      {/* Advisor Authentication Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 text-white rounded-2xl p-3.5 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary-200 border border-white/15 shadow-inner flex-shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold tracking-tight truncate">Academic Advisor Portal</h2>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Staff Session
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 truncate">
              Logged in as <strong className="text-white">{authUser.name}</strong> ({authUser.title || authUser.role})
            </p>
          </div>
        </div>

        <div className="self-end sm:self-center flex items-center gap-2">
          <button
            type="button"
            onClick={() => setProfileModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition border border-white/15 cursor-pointer shadow-xs"
            title="Profile & Password Settings"
          >
            <UserCog size={14} />
            <span>Profile & Password</span>
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition border border-white/10 cursor-pointer"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Polished Top Quick Stats Summary Row with Border Gradients & Trends */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Card 1: Total Intake */}
        <div
          onClick={() => {
            setStatusFilter('');
            setUrgencyFilter('');
            setPage(1);
          }}
          className={`rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between ${
            !statusFilter && !urgencyFilter
              ? 'border-primary-500 ring-2 ring-primary-500/20 shadow-sm'
              : 'border-slate-200/90 hover:border-primary-400'
          }`}
        >
          <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-primary-600 to-indigo-600" />
          <div className="p-3 sm:p-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider truncate">Total Intake</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shadow-2xs flex-shrink-0">
                <Inbox size={15} />
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-1 flex-wrap">
              <div className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{totalSubmissions}</div>
              <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 whitespace-nowrap">
                <TrendingUp size={9} /> Active
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 font-medium hidden sm:block">All logged student requests</p>
          </div>
        </div>

        {/* Card 2: Pending Triage */}
        <div
          onClick={() => {
            setStatusFilter('PENDING');
            setUrgencyFilter('');
            setPage(1);
          }}
          className={`rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between ${
            statusFilter === 'PENDING'
              ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
              : 'border-slate-200/90 hover:border-amber-400'
          }`}
        >
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500" />
          <div className="p-3 sm:p-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-xs font-bold text-amber-700 uppercase tracking-wider truncate">Pending Triage</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs flex-shrink-0">
                <Clock size={15} />
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-1 flex-wrap">
              <div className="text-xl sm:text-3xl font-extrabold text-amber-700 tracking-tight">{pendingCount}</div>
              <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 whitespace-nowrap">
                <Activity size={9} /> Review
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 font-medium hidden sm:block">Awaiting advisor evaluation</p>
          </div>
        </div>

        {/* Card 3: Scheduled Sessions */}
        <div
          onClick={() => {
            setStatusFilter('SCHEDULED');
            setUrgencyFilter('');
            setPage(1);
          }}
          className={`rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between ${
            statusFilter === 'SCHEDULED'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
              : 'border-slate-200/90 hover:border-emerald-400'
          }`}
        >
          <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />
          <div className="p-3 sm:p-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-xs font-bold text-emerald-700 uppercase tracking-wider truncate">Scheduled</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs flex-shrink-0">
                <CalendarCheck size={15} />
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-1 flex-wrap">
              <div className="text-xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">{scheduledCount}</div>
              <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 whitespace-nowrap">
                <CheckCircle size={9} /> Booked
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 font-medium hidden sm:block">Active upcoming appointments</p>
          </div>
        </div>

        {/* Card 4: Urgent Attention */}
        <div
          onClick={() => {
            setUrgencyFilter('HIGH');
            setStatusFilter('');
            setPage(1);
          }}
          className={`rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between ${
            urgencyFilter === 'HIGH'
              ? 'border-red-500 ring-2 ring-red-500/20 shadow-sm'
              : 'border-slate-200/90 hover:border-red-400'
          }`}
        >
          <div className="h-1 w-full bg-gradient-to-r from-rose-500 via-red-600 to-red-700" />
          <div className="p-3 sm:p-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-xs font-bold text-red-700 uppercase tracking-wider truncate">Urgent Attention</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shadow-2xs flex-shrink-0">
                <AlertTriangle size={15} />
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-1 flex-wrap">
              <div className="text-xl sm:text-3xl font-extrabold text-red-600 tracking-tight">{urgentCount}</div>
              <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-red-600 text-white shadow-2xs animate-pulse whitespace-nowrap">
                🚨 Priority
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 font-medium hidden sm:block">High triage cases requiring care</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        {/* Status Navigation Tabs with smooth horizontal scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 max-w-full -mx-1 px-1 scrollbar-none">
          <button
            onClick={() => {
              setStatusFilter('');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
              !statusFilter
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All ({totalSubmissions})
          </button>

          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
                statusFilter === s
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{s}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  statusFilter === s ? 'bg-white/25 text-white font-bold' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {counts[s] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Urgency Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-56 md:w-60">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student or ID..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer shadow-2xs w-full sm:w-auto"
          >
            <option value="">All Triage</option>
            <option value="HIGH">🚨 High Urgency</option>
            <option value="MEDIUM">Medium Urgency</option>
            <option value="LOW">Low Urgency</option>
          </select>
        </div>
      </div>

      {/* Main Request Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
          <Loader2 className="animate-spin text-primary-600" size={36} />
          <p className="text-sm font-medium">Loading counseling records...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8 shadow-xs">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <FileText size={26} />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">No requests in this view</h3>
          <p className="text-xs text-slate-500 mb-6">
            {statusFilter || urgencyFilter || searchQuery
              ? 'No student records match your active filters. Reset filters to view all cases.'
              : 'There are currently no counseling requests in this category.'}
          </p>
          {(statusFilter || urgencyFilter || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('');
                setUrgencyFilter('');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {filteredRequests.map((req) => {
            const student = req.student || {};
            const isHighUrgency = (req.urgencyLevel || '').toUpperCase() === 'HIGH';
            const hasNotes = Boolean(req.advisorNotes && req.advisorNotes.trim().length > 0);
            const isUpdating = actionInProgressId === req.id;
            const currentStatus = (req.status || 'PENDING').toUpperCase();

            // Student initials avatar calculation
            const initials = `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`.toUpperCase() || 'ST';

            return (
              <div
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={`group bg-white rounded-2xl border transition-all p-4 sm:p-5 flex flex-col justify-between cursor-pointer relative shadow-xs hover:shadow-md ${
                  isHighUrgency 
                    ? 'border-red-300 border-l-4 border-l-red-600 bg-red-50/10' 
                    : 'border-slate-200/90 hover:border-primary-400'
                }`}
              >
                <div>
                  {/* Card Header with Student Avatar */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      {/* Avatar */}
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-primary-700 text-white font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0 tracking-wider">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors text-sm truncate">
                            {student.firstName} {student.lastName}
                          </h3>

                          {/* High Urgency Priority Indicator Badge */}
                          {isHighUrgency && (
                            <span className="flex items-center gap-1 px-1.5 sm:px-2 py-0.2 rounded-full text-[9px] sm:text-[10px] font-black bg-red-600 text-white shadow-2xs animate-pulse tracking-wide whitespace-nowrap">
                              <AlertTriangle size={10} />
                              URGENT
                            </span>
                          )}
                        </div>

                        {/* ID & Department Badges */}
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500 flex-wrap">
                          <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium">
                            {student.studentId}
                          </span>
                          <span>•</span>
                          <span className="bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium border border-slate-200/60 truncate max-w-[120px] sm:max-w-[140px]">
                            {student.department || 'General'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider border flex-shrink-0 ${
                        STATUS_COLORS[currentStatus] || 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {currentStatus}
                    </span>
                  </div>

                  {/* Topic & Academic Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <span className="px-2.5 py-1 bg-primary-50 text-primary-800 font-medium text-xs rounded-lg border border-primary-100 truncate max-w-full">
                      Topic: {req.counselingTopic}
                    </span>

                    {student.yearInSchool && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] rounded-md font-medium">
                        {student.yearInSchool}
                      </span>
                    )}

                    {student.gpa && (
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] rounded-md font-semibold">
                        GPA {student.gpa}
                      </span>
                    )}
                  </div>

                  {/* Concern Description Snippet */}
                  {req.concernDescription && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {req.concernDescription}
                    </p>
                  )}
                </div>

                {/* Card Footer with Direct Action Buttons */}
                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-[11px]">
                      <Clock size={12} />
                      <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                      {hasNotes && (
                        <span className="ml-1 flex items-center gap-0.5 text-[9px] sm:text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-100">
                          <FileText size={10} /> Notes
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequest(req);
                      }}
                      className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-800 transition py-0.5 px-2 rounded-md hover:bg-primary-50 cursor-pointer"
                    >
                      <Eye size={13} />
                      <span>Details</span>
                    </button>
                  </div>

                  {/* Direct Progression Action Buttons with Hover States */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 pt-0.5">
                    {isUpdating ? (
                      <div className="w-full py-1 text-xs text-primary-600 flex items-center justify-center gap-1.5">
                        <Loader2 size={13} className="animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      <>
                        {currentStatus === 'PENDING' && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(req.id, 'REVIEWED');
                              }}
                              className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 border border-blue-200/80 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs hover:shadow-xs"
                            >
                              <Check size={12} />
                              Mark Reviewed
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(req.id, 'SCHEDULED');
                              }}
                              className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs hover:shadow-xs"
                            >
                              <Calendar size={12} />
                              Schedule
                            </button>
                          </>
                        )}

                        {currentStatus === 'REVIEWED' && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(req.id, 'SCHEDULED');
                              }}
                              className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                            >
                              <Calendar size={12} />
                              Schedule Session
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(req.id, 'COMPLETED');
                              }}
                              className="py-1.5 px-2.5 bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 border border-purple-200/80 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs hover:shadow-xs"
                            >
                              <CheckCircle size={12} />
                              Complete
                            </button>
                          </>
                        )}

                        {currentStatus === 'SCHEDULED' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(req.id, 'COMPLETED');
                            }}
                            className="w-full py-1.5 px-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                          >
                            <CheckCircle size={12} />
                            Mark Case Completed
                          </button>
                        )}

                        {currentStatus === 'COMPLETED' && (
                          <div className="w-full flex items-center justify-between text-[11px] text-slate-400">
                            <span className="flex items-center gap-1 text-purple-700 font-medium">
                              <CheckCheck size={13} /> Case Complete
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(req.id, 'REVIEWED');
                              }}
                              className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
                            >
                              Reopen
                            </button>
                          </div>
                        )}

                        {currentStatus === 'REJECTED' && (
                          <div className="w-full flex items-center justify-between text-[11px] text-slate-400">
                            <span className="text-rose-600 font-medium">Declined</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(req.id, 'PENDING');
                              }}
                              className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
                            >
                              Restore to Pending
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
          >
            Previous
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-xl text-xs font-semibold transition cursor-pointer ${
                page === i + 1
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-3 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

      {/* Full Request Details Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onStatusChange={handleStatusChange}
          onNotesUpdated={handleNotesUpdated}
        />
      )}

      {/* Advisor Profile & Password Update Modal */}
      <AdvisorProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        authUser={authUser}
        onProfileUpdated={(updated) => setAuthUser(updated)}
      />
    </div>
  );
}