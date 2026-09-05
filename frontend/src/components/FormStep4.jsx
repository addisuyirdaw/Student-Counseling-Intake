import { ShieldCheck, PenTool } from 'lucide-react';
import SignatureCanvas from './SignatureCanvas';

export default function FormStep4({ formData, errors, updateField }) {
  return (
    <div className="space-y-4 fade-in">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Consent & Electronic Signature</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Please review the confidentiality terms and draw your signature below.
        </p>
      </div>

      <div className="bg-primary-50/70 border border-primary-200/80 rounded-xl p-3.5 sm:p-4 text-xs text-primary-900 leading-relaxed shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-primary-950 mb-1.5">
          <ShieldCheck size={16} className="text-primary-600 flex-shrink-0" />
          <span>Confidentiality & Care Agreement</span>
        </div>
        <p className="text-slate-700 leading-relaxed text-[11px] sm:text-xs">
          By submitting this intake form, I understand that all information provided is strictly confidential and
          protected in accordance with FERPA and university privacy standards. I understand this form is not a
          substitute for emergency medical services and that my responses will only be accessed by authorized counseling
          professionals. I consent to the collection and processing of my details for academic and wellness counseling.
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
            I have read, understood, and agree to the terms above <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.consentGiven && <p className="text-red-500 text-xs mt-1">{errors.consentGiven}</p>}
      </div>

      <div className="pt-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
          <PenTool size={14} className="text-primary-600" />
          <span>Electronic Signature <span className="text-red-500">*</span></span>
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