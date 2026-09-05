import React, { useState, useEffect } from 'react';
import { 
  X, User, Mail, Phone, GraduationCap, Award, BookOpen, 
  Calendar, Clock, FileText, CheckCircle2, Save, Loader2, 
  Check, AlertCircle, ShieldCheck, ArrowRight, AlertTriangle
} from 'lucide-react';
import { updateNotes } from '../services/api';

const STATUS_CONFIG = {
  PENDING: { bg: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500', label: 'Pending Review' },
  REVIEWED: { bg: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500', label: 'Under Review' },
  SCHEDULED: { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', label: 'Session Scheduled' },
  COMPLETED: { bg: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500', label: 'Case Completed' },
  REJECTED: { bg: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500', label: 'Declined' },
};

const URGENCY_CONFIG = {
  HIGH: { badge: 'bg-red-600 text-white font-bold animate-pulse', icon: AlertTriangle, text: 'HIGH URGENCY' },
  MEDIUM: { badge: 'bg-amber-100 text-amber-800 border border-amber-200', icon: AlertCircle, text: 'Medium Urgency' },
  LOW: { badge: 'bg-blue-100 text-blue-800 border border-blue-200', icon: CheckCircle2, text: 'Low Urgency' },
};

export default function RequestDetailModal({ request, onClose, onStatusChange, onNotesUpdated }) {
  const normalizedCurrentStatus = (request.status || 'PENDING').trim().toUpperCase();
  const normalizedUrgency = (request.urgencyLevel || 'MEDIUM').trim().toUpperCase();

  const [notes, setNotes] = useState(request.advisorNotes || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [targetStatus, setTargetStatus] = useState(getDefaultNextStatus(normalizedCurrentStatus));

  function getDefaultNextStatus(current) {
    const s = (current || '').toUpperCase();
    if (s === 'PENDING') return 'REVIEWED';
    if (s === 'REVIEWED') return 'SCHEDULED';
    if (s === 'SCHEDULED') return 'COMPLETED';
    return s;
  }

  function getPrimaryActionLabel(current, target) {
    const c = (current || '').toUpperCase();
    const t = (target || '').toUpperCase();
    if (c === 'PENDING' && t === 'REVIEWED') return 'Mark as Reviewed & Save Notes';
    if (c === 'REVIEWED' && t === 'SCHEDULED') return 'Schedule Session & Save Notes';
    if (c === 'SCHEDULED' && t === 'COMPLETED') return 'Mark Case Completed & Save Notes';
    if (t !== c) return `Set Status to ${t} & Save Notes`;
    return 'Save Advisor Notes';
  }

  useEffect(() => {
    setNotes(request.advisorNotes || '');
    setTargetStatus(getDefaultNextStatus(normalizedCurrentStatus));
    setSuccessMessage('');
  }, [request.id, request.status, request.advisorNotes]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Single action that saves notes AND updates status simultaneously
  const handlePrimaryAction = async () => {
    setIsProcessing(true);
    setSuccessMessage('');

    const normTarget = (targetStatus || normalizedCurrentStatus).trim().toUpperCase();

    try {
      // 1. Save notes
      await updateNotes(request.id, notes);
      if (onNotesUpdated) {
        onNotesUpdated(request.id, notes);
      }

      // 2. Update status
      if (normTarget !== normalizedCurrentStatus) {
        await onStatusChange(request.id, normTarget);
      }

      setSuccessMessage('Advisor notes saved & status updated successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Failed to execute advisor action:', err);
      alert('Failed to update request or notes. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentStatusConfig = STATUS_CONFIG[normalizedCurrentStatus] || STATUS_CONFIG.PENDING;
  const urgencyInfo = URGENCY_CONFIG[normalizedUrgency] || URGENCY_CONFIG.MEDIUM;
  const UrgencyIcon = urgencyInfo.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[96vh] sm:max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 z-10">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-5 bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 text-white flex items-center justify-between flex-shrink-0 gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-primary-200 font-bold text-base sm:text-lg border border-white/10 flex-shrink-0">
              {request.student?.firstName?.[0] || 'S'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-bold tracking-tight truncate">
                  {request.student?.firstName} {request.student?.lastName}
                </h2>
                <span className="px-2 py-0.2 sm:px-2.5 sm:py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-white/20 text-white">
                  ID: {request.student?.studentId}
                </span>

                {/* Urgency Badge */}
                <span className={`inline-flex items-center gap-1 px-2 py-0.2 sm:px-2.5 sm:py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${urgencyInfo.badge}`}>
                  <UrgencyIcon size={11} />
                  {urgencyInfo.text}
                </span>

                {/* Status Badge */}
                <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.2 sm:px-2.5 sm:py-0.5 rounded-full text-[10px] sm:text-xs font-medium border ${currentStatusConfig.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${currentStatusConfig.dot}`} />
                  {currentStatusConfig.label}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                Submitted on {new Date(request.createdAt).toLocaleString(undefined, { 
                  dateStyle: 'medium', 
                  timeStyle: 'short' 
                })}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none cursor-pointer flex-shrink-0"
            title="Close modal (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 text-slate-800">
          
          {/* High Urgency Alert Banner if applicable */}
          {normalizedUrgency === 'HIGH' && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start gap-3 text-red-900 shadow-sm">
              <AlertTriangle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <h4 className="text-sm font-bold text-red-800">HIGH URGENCY TRIAGE ADVISORY</h4>
                <p className="text-xs text-red-700 mt-0.5">
                  The student indicated severe distress or an urgent academic/crisis situation. Prioritize immediate advisor outreach or triage according to department protocol.
                </p>
              </div>
            </div>
          )}

          {/* Section 1: Academic & Student Profile */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3.5 flex items-center gap-2">
              <GraduationCap size={18} className="text-primary-600" />
              Student Academic & Contact Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-2.5">
                <User size={16} className="text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">Full Name</div>
                  <div className="text-sm font-semibold text-slate-900">
                    {request.student?.firstName} {request.student?.lastName}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <BookOpen size={16} className="text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">Department / Program</div>
                  <div className="text-sm font-semibold text-slate-900">
                    {request.student?.department || '—'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <GraduationCap size={16} className="text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">Year in School</div>
                  <div className="text-sm font-semibold text-slate-900">
                    {request.student?.yearInSchool || '—'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Award size={16} className="text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">Cumulative GPA</div>
                  <div className="text-sm font-bold text-primary-700">
                    {request.student?.gpa ? `${request.student.gpa} / 4.0` : 'Not Provided'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail size={16} className="text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">Student Email</div>
                  <a 
                    href={`mailto:${request.student?.email}`} 
                    className="text-sm font-medium text-primary-600 hover:text-primary-800 hover:underline break-all"
                  >
                    {request.student?.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone size={16} className="text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">Phone Contact</div>
                  <a 
                    href={`tel:${request.student?.phone}`} 
                    className="text-sm font-medium text-primary-600 hover:text-primary-800 hover:underline"
                  >
                    {request.student?.phone || '—'}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Counseling Context & Details */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText size={18} className="text-primary-600" />
              Counseling Context & Request Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-2 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-500 block font-medium mb-1">Primary Topic</span>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-800 font-medium text-sm border border-primary-100">
                  <span>{request.counselingTopic}</span>
                  {request.topicCustom && (
                    <span className="text-xs text-primary-600 font-normal">({request.topicCustom})</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 block font-medium mb-1">Urgency Level</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${urgencyInfo.badge}`}>
                  <UrgencyIcon size={12} />
                  {urgencyInfo.text}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 block font-medium mb-1">Prior Counseling</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  request.hadPreviousCounseling 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {request.hadPreviousCounseling ? 'Yes (Previous History)' : 'No Prior Counseling'}
                </span>
              </div>
            </div>

            {/* Concern Description */}
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
                Reason for Request / Concern Description
              </span>
              <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-700 leading-relaxed border border-slate-200 whitespace-pre-wrap">
                {request.concernDescription}
              </div>
            </div>

            {/* Previous counseling notes if any */}
            {request.hadPreviousCounseling && request.previousCounselingDetails && (
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                  Previous Counseling Background
                </span>
                <div className="p-3.5 bg-amber-50/70 rounded-lg text-sm text-amber-900 border border-amber-200/60 leading-relaxed">
                  {request.previousCounselingDetails}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Availability & Preferred Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-primary-600" />
                Preferred Days
              </h3>
              <div className="flex flex-wrap gap-2">
                {request.preferredDays && request.preferredDays.length > 0 ? (
                  request.preferredDays.map((d) => (
                    <span key={d} className="px-3 py-1 bg-white text-slate-800 border border-slate-300 rounded-lg text-xs font-medium shadow-2xs">
                      {d}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No specific days listed</span>
                )}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock size={16} className="text-primary-600" />
                Preferred Timeslots
              </h3>
              <div className="flex flex-wrap gap-2">
                {request.preferredTimeSlots && request.preferredTimeSlots.length > 0 ? (
                  request.preferredTimeSlots.map((slot) => (
                    <span key={slot} className="px-3 py-1 bg-white text-slate-800 border border-slate-300 rounded-lg text-xs font-medium shadow-2xs">
                      {slot}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No specific times listed</span>
                )}
              </div>
            </div>
          </div>

          {request.additionalComments && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                Additional Student Notes / Scheduling Preferences
              </span>
              <p className="text-sm text-slate-600 leading-relaxed">{request.additionalComments}</p>
            </div>
          )}

          {/* Section 4: Legal Consent & E-Signature Preview */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              Informed Consent & Electronic Signature
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div>
                <div className="flex items-center gap-2 text-emerald-700 font-medium text-sm mb-1.5">
                  <CheckCircle2 size={16} />
                  <span>Confidentiality & Service Agreement Verified</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Student provided explicit digital consent to privacy terms. Signature legally timestamped on intake submission.
                </p>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1.5 flex justify-between items-center">
                  <span>Student E-Signature Preview</span>
                  <span className="text-[11px] text-slate-400">Captured in-app</span>
                </div>
                <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-3 flex items-center justify-center min-h-[100px]">
                  {request.signatureDataUrl ? (
                    <img 
                      src={request.signatureDataUrl} 
                      alt="Student E-Signature" 
                      className="max-h-24 max-w-full object-contain filter contrast-125"
                    />
                  ) : (
                    <span className="text-xs text-slate-400 italic">No electronic signature captured</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Counselor / Advisor Private Notes */}
          <div className="bg-gradient-to-br from-indigo-50/70 via-blue-50/40 to-slate-50 rounded-xl p-5 border border-indigo-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText size={18} className="text-indigo-600" />
                Counselor & Advisor Private Notes
              </h3>
              <span className="text-xs text-indigo-700 bg-indigo-100/70 px-2.5 py-0.5 rounded-full font-medium">
                Confidential Session Notes
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Record private notes, meeting outcomes, recommended academic interventions, or referral steps for this student. These notes will be saved when you execute the action below.
            </p>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Met with student on Sept 5. Discussed workload reduction and stress management strategies. Referral made to Tutoring Center..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-vertical text-slate-800 placeholder:text-slate-400 shadow-2xs"
            />
          </div>

        </div>

        {/* Modal Footer with Dedicated Primary Action Button */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600">Workflow Status:</span>
            <select
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value.toUpperCase())}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 font-medium text-xs focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer"
            >
              <option value="PENDING">PENDING</option>
              <option value="REVIEWED">REVIEWED</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            {successMessage && (
              <span className="text-emerald-700 font-semibold flex items-center gap-1 text-xs">
                <Check size={14} /> {successMessage}
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 font-medium text-xs hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>

            {/* Dedicated Primary Action Button */}
            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={isProcessing}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Saving & Updating...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  <span>{getPrimaryActionLabel(normalizedCurrentStatus, targetStatus)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
