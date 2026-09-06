import { ShieldCheck, PenTool } from 'lucide-react';
import SignatureCanvas from './SignatureCanvas';
import { useLanguage } from '../context/LanguageContext';

export default function FormStep4({ formData, errors, updateField }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 fade-in">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900">{t('s4_title')}</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('s4_subtitle')}
        </p>
      </div>

      <div className="bg-primary-50/70 border border-primary-200/80 rounded-xl p-3.5 sm:p-4 text-xs text-primary-900 leading-relaxed shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-primary-950 mb-1.5">
          <ShieldCheck size={16} className="text-primary-600 flex-shrink-0" />
          <span>{t('s4_agreement_title')}</span>
        </div>
        <p className="text-slate-700 leading-relaxed text-[11px] sm:text-xs">
          {t('s4_agreement_text')}
        </p>
      </div>

      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.consentGiven}
            onChange={(e) => updateField('consentGiven', e.target.checked)}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 border-slate-300 mt-0.5 flex-shrink-0"
          />
          <span className="text-xs font-semibold text-slate-700 leading-snug">
            {t('s4_consent_check')}
          </span>
        </label>
        {errors.consentGiven && <p className="text-red-500 text-xs mt-1">{errors.consentGiven}</p>}
      </div>

      <div className="pt-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
          <PenTool size={14} className="text-primary-600" />
          <span>{t('s4_signature_label')}</span>
        </div>
        <SignatureCanvas
          signatureDataUrl={formData.signatureDataUrl}
          onSignatureChange={(dataUrl) => updateField('signatureDataUrl', dataUrl)}
        />
        {errors.signatureDataUrl && (
          <p className="text-red-500 text-xs mt-1">{errors.signatureDataUrl}</p>
        )}
      </div>
    </div>
  );
}