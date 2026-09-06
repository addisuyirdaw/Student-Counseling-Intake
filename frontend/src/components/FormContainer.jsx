import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, CheckCircle2, ShieldCheck, Check } from 'lucide-react';
import FormStep1 from './FormStep1';
import FormStep2 from './FormStep2';
import FormStep3 from './FormStep3';
import FormStep4 from './FormStep4';
import { submitCounseling } from '../services/api';
import { validateStep } from '../utils/validation';
import { useLanguage } from '../context/LanguageContext';

const STEP_KEYS = [
  { num: 1, key: 'step1_name' },
  { num: 2, key: 'step2_name' },
  { num: 3, key: 'step3_name' },
  { num: 4, key: 'step4_name' },
];

export default function FormContainer({ formData, errors, updateField, updateArrayField, setErrors, setIsSubmitting, isSubmitting }) {
  const { t, lang } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const canProceed = () => {
    if (currentStep === 1) {
      const hasDept = formData.department === 'Other (Specify Custom Department)'
        ? Boolean(formData.departmentCustom?.trim())
        : Boolean(formData.department?.trim());
      const hasYear = formData.yearInSchool === 'Other (Specify Custom Year)'
        ? Boolean(formData.yearCustom?.trim())
        : Boolean(formData.yearInSchool?.trim());

      return (
        Boolean(formData.firstName?.trim()) &&
        Boolean(formData.lastName?.trim()) &&
        Boolean(formData.email?.trim()) &&
        Boolean(formData.phone?.trim()) &&
        Boolean(formData.studentId?.trim()) &&
        hasDept &&
        hasYear
      );
    }
    if (currentStep === 2) {
      const hasTopic = formData.counselingTopic === 'Other'
        ? Boolean(formData.topicCustom?.trim())
        : Boolean(formData.counselingTopic?.trim());
      return hasTopic && Boolean(formData.concernDescription?.trim());
    }
    if (currentStep === 3) {
      return formData.preferredDays.length > 0 && formData.preferredTimeSlots.length > 0;
    }
    if (currentStep === 4) {
      return formData.consentGiven && Boolean(formData.signatureDataUrl);
    }
    return false;
  };

  const handleNextStep = () => {
    const check = validateStep(currentStep, formData, lang);
    if (!check.success) {
      setErrors(check.errors);
      return;
    }
    setErrors({});
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const check = validateStep(4, formData, lang);
    if (!check.success) {
      setErrors(check.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitCounseling(formData);
      setSubmittedData(res.data);
      setSubmitSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.errors
        ? err.response.data.errors.map((e) => `${e.field}: ${e.message}`).join(', ')
        : err.response?.data?.error || (lang === 'am' ? 'ጥያቄውን ማስገባት አልተሳካም' : 'Submission failed');
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden animate-fadeIn">
        {/* Top Accent Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-primary-600 to-indigo-700" />

        <div className="p-8 sm:p-10 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1.5">{t('success_received_title')}</h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-5 max-w-md mx-auto leading-relaxed">
            {t('success_thank_you', { name: formData.firstName })}
          </p>

          {submittedData && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 max-w-sm mx-auto mb-5 text-xs text-left space-y-1 font-mono text-slate-700">
              <div>
                <span className="font-bold text-slate-500 font-sans">{t('success_lbl_student')}</span> {formData.firstName} {formData.lastName} ({formData.studentId})
              </div>
              <div>
                <span className="font-bold text-slate-500 font-sans">{t('success_lbl_dept')}</span> {formData.department === 'Other (Specify Custom Department)' ? formData.departmentCustom : formData.department}
              </div>
              <div>
                <span className="font-bold text-slate-500 font-sans">{t('success_lbl_year')}</span> {formData.yearInSchool === 'Other (Specify Custom Year)' ? formData.yearCustom : formData.yearInSchool}
              </div>
              <div>
                <span className="font-bold text-slate-500 font-sans">{t('success_lbl_topic')}</span> {formData.counselingTopic === 'Other' ? formData.topicCustom : formData.counselingTopic}
              </div>
              <div>
                <span className="font-bold text-slate-500 font-sans">{t('success_lbl_triage')}</span> <span className={formData.urgencyLevel === 'HIGH' ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>{formData.urgencyLevel || 'MEDIUM'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 font-sans">{t('success_lbl_case_id')}</span> {submittedData.id}
              </div>
            </div>
          )}

          <div className="bg-primary-50 border border-primary-200 rounded-xl p-3.5 max-w-md mx-auto text-xs text-primary-900 leading-relaxed text-left mb-5 flex items-start gap-2.5">
            <ShieldCheck size={18} className="text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>{t('success_next_title')}</strong> {t('success_next_desc', { email: formData.email })}
            </div>
          </div>

          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            {t('success_btn_another')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-md hover:border-slate-300 transition-all overflow-hidden">
      {/* 1. Subtle top gradient accent bar (from indigo-600 to primary-700) */}
      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-primary-600 to-indigo-700" />

      <div className="p-4 sm:p-6 md:p-7">
        {/* 2. Step Progress Indicator */}
        <div className="mb-6">
          <div className="relative px-2">
            {/* Absolute background connecting track */}
            <div className="absolute top-4 left-6 right-6 -translate-y-1/2 h-0.5 bg-slate-200 z-0">
              <div
                className="h-full bg-primary-600 transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep - 1) / (STEP_KEYS.length - 1)) * 100}%` }}
              />
            </div>

            {/* Step Nodes */}
            <div className="flex items-start justify-between relative z-10">
              {STEP_KEYS.map((step) => {
                const isCompleted = step.num < currentStep;
                const isCurrent = step.num === currentStep;
                const title = t(step.key);

                return (
                  <div key={step.num} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-primary-600 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-primary-600 text-white ring-4 ring-primary-500/20 shadow-sm scale-110'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <Check size={13} strokeWidth={3} /> : step.num}
                    </div>
                    <span
                      className={`text-[11px] font-semibold mt-1.5 hidden sm:block ${
                        isCurrent
                          ? 'text-primary-700 font-bold'
                          : isCompleted
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Current Step Tag */}
          <div className="mt-3 text-center sm:hidden text-xs font-bold text-primary-700 bg-primary-50 py-1.5 px-3 rounded-lg border border-primary-100 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse" />
            {t('step_indicator', { current: currentStep, title: t(STEP_KEYS[currentStep - 1].key) })}
          </div>
        </div>

        {/* Dynamic Form Step Content */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="min-h-[280px]">
            {currentStep === 1 && (
              <FormStep1
                formData={formData}
                errors={errors}
                updateField={updateField}
                updateArrayField={updateArrayField}
              />
            )}
            {currentStep === 2 && (
              <FormStep2
                formData={formData}
                errors={errors}
                updateField={updateField}
                updateArrayField={updateArrayField}
              />
            )}
            {currentStep === 3 && (
              <FormStep3
                formData={formData}
                errors={errors}
                updateField={updateField}
                updateArrayField={updateArrayField}
              />
            )}
            {currentStep === 4 && (
              <FormStep4
                formData={formData}
                errors={errors}
                updateField={updateField}
              />
            )}
          </div>

          {submitError && (
            <div className="error-banner bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 font-medium animate-shake">
              {submitError}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-5 border-t border-slate-100 gap-2">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex-shrink-0"
            >
              <ChevronLeft size={14} /> {t('btn_back')}
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!canProceed()}
                className="flex items-center gap-1 sm:gap-1.5 px-4 sm:px-6 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs hover:shadow-sm transition cursor-pointer"
              >
                <span>{t('btn_continue')}</span>
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !canProceed()}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs hover:shadow-md transition cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    <span>{t('btn_submitting')}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    <span>{t('btn_submit')}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}