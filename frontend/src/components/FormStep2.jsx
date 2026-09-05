import { Sparkles, FileText, MessageSquare, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react';

export default function FormStep2({ formData, errors, updateField }) {
  const topics = [
    'Anxiety', 'Depression', 'Academic Pressure', 'Relationship Issues',
    'Career Guidance', 'Stress Management', 'Grief/Loss', 'Self-Esteem',
    'Substance Abuse', 'Sleep Issues', 'Family Problems', 'Other'
  ];

  return (
    <div className="space-y-4 fade-in">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Counseling Context & Triage</h2>
        <p className="text-xs text-slate-500 mt-0.5">Help us understand your current challenges and urgency level.</p>
      </div>

      {/* Counseling Topic */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Counseling Topic *</label>
        <div className="relative">
          <Sparkles size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={formData.counselingTopic}
            onChange={(e) => updateField('counselingTopic', e.target.value)}
            className={`w-full pl-9 pr-8 py-2 text-sm bg-slate-50/50 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition appearance-none cursor-pointer truncate ${
              errors.counselingTopic ? 'border-red-500' : 'border-slate-300'
            }`}
          >
            <option value="">Select a Topic</option>
            {topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        {errors.counselingTopic && <p className="text-red-500 text-xs mt-1">{errors.counselingTopic}</p>}
      </div>

      {/* Custom Topic Specification */}
      {formData.counselingTopic === 'Other' && (
        <div className="animate-fadeIn">
          <label className="block text-xs font-semibold text-slate-700 mb-1">Please Specify Your Topic *</label>
          <div className="relative">
            <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={formData.topicCustom}
              onChange={(e) => updateField('topicCustom', e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50/50 focus:bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              placeholder="Briefly describe your topic"
            />
          </div>
        </div>
      )}

      {/* Concern Description */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
          <MessageSquare size={13} className="text-slate-400" />
          <span>Reason for Request / Concern Description *</span>
        </label>
        <div className="relative">
          <textarea
            value={formData.concernDescription}
            onChange={(e) => updateField('concernDescription', e.target.value)}
            rows={3}
            className={`w-full p-3 text-sm bg-slate-50/50 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-vertical ${
              errors.concernDescription ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Share what you are experiencing and what support would be most helpful..."
          />
        </div>
        {errors.concernDescription && <p className="text-red-500 text-xs mt-1">{errors.concernDescription}</p>}
      </div>

      {/* Urgency / Triage Level */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Urgency / Triage Level <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            {
              level: 'LOW',
              title: 'Low Urgency',
              desc: 'Routine guidance, study habits, general planning',
              borderColor: formData.urgencyLevel === 'LOW' ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-2xs' : 'border-slate-200 hover:border-slate-300 bg-white',
              badgeColor: 'bg-blue-100 text-blue-800'
            },
            {
              level: 'MEDIUM',
              title: 'Medium Urgency',
              desc: 'Noticeable stress, academic challenges, anxiety',
              borderColor: formData.urgencyLevel === 'MEDIUM' ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 shadow-2xs' : 'border-slate-200 hover:border-slate-300 bg-white',
              badgeColor: 'bg-amber-100 text-amber-800'
            },
            {
              level: 'HIGH',
              title: 'High Urgency',
              desc: 'Acute distress, impending crisis, urgent priority',
              borderColor: formData.urgencyLevel === 'HIGH' ? 'border-red-500 bg-red-50/60 ring-2 ring-red-500/20 shadow-2xs' : 'border-slate-200 hover:border-slate-300 bg-white',
              badgeColor: 'bg-red-100 text-red-800'
            },
          ].map((item) => (
            <div
              key={item.level}
              onClick={() => updateField('urgencyLevel', item.level)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${item.borderColor}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.title}
                </span>
                <input
                  type="radio"
                  name="urgencyLevel"
                  checked={formData.urgencyLevel === item.level}
                  onChange={() => updateField('urgencyLevel', item.level)}
                  className="w-3.5 h-3.5 text-primary-600 focus:ring-primary-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Previous Counseling Checkbox */}
      <div className="pt-1">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.hadPreviousCounseling}
            onChange={(e) => updateField('hadPreviousCounseling', e.target.checked)}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 border-slate-300"
          />
          <span className="text-xs font-medium text-slate-700">Have you had previous counseling or therapy?</span>
        </label>
      </div>

      {formData.hadPreviousCounseling && (
        <div className="animate-fadeIn">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
            <FileText size={13} className="text-slate-400" />
            <span>Previous Counseling Background</span>
          </label>
          <textarea
            value={formData.previousCounselingDetails}
            onChange={(e) => updateField('previousCounselingDetails', e.target.value)}
            rows={2}
            className="w-full p-2.5 text-xs bg-slate-50/50 focus:bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-vertical"
            placeholder="Tell us briefly about past experiences or what approaches helped you..."
          />
        </div>
      )}
    </div>
  );
}