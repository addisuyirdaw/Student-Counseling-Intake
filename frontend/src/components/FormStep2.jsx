import { Sparkles, FileText, MessageSquare, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FormStep2({ formData, errors, updateField }) {
  const { t } = useLanguage();

  const topics = [
    { value: 'Anxiety', label: t('s2_topic_anxiety') },
    { value: 'Depression', label: t('s2_topic_depression') },
    { value: 'Academic Pressure', label: t('s2_topic_academic_pressure') },
    { value: 'Relationship Issues', label: t('s2_topic_relationship') },
    { value: 'Career Guidance', label: t('s2_topic_career') },
    { value: 'Stress Management', label: t('s2_topic_stress') },
    { value: 'Grief/Loss', label: t('s2_topic_grief') },
    { value: 'Self-Esteem', label: t('s2_topic_self_esteem') },
    { value: 'Substance Abuse', label: t('s2_topic_substance') },
    { value: 'Sleep Issues', label: t('s2_topic_sleep') },
    { value: 'Family Problems', label: t('s2_topic_family') },
    { value: 'Other', label: t('s2_topic_other') },
  ];

  const urgencyOptions = [
    {
      level: 'LOW',
      title: t('s2_urgency_low_title'),
      desc: t('s2_urgency_low_desc'),
      borderColor: formData.urgencyLevel === 'LOW' ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-2xs' : 'border-slate-200 hover:border-slate-300 bg-white',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      level: 'MEDIUM',
      title: t('s2_urgency_med_title'),
      desc: t('s2_urgency_med_desc'),
      borderColor: formData.urgencyLevel === 'MEDIUM' ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 shadow-2xs' : 'border-slate-200 hover:border-slate-300 bg-white',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      level: 'HIGH',
      title: t('s2_urgency_high_title'),
      desc: t('s2_urgency_high_desc'),
      borderColor: formData.urgencyLevel === 'HIGH' ? 'border-red-500 bg-red-50/60 ring-2 ring-red-500/20 shadow-2xs' : 'border-slate-200 hover:border-slate-300 bg-white',
      badgeColor: 'bg-red-100 text-red-800',
    },
  ];

  return (
    <div className="space-y-4 fade-in">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900">{t('s2_title')}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{t('s2_subtitle')}</p>
      </div>

      {/* Counseling Topic */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">{t('s2_topic')}</label>
        <div className="relative">
          <Sparkles size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={formData.counselingTopic}
            onChange={(e) => updateField('counselingTopic', e.target.value)}
            className={`w-full pl-9 pr-8 py-2 text-sm bg-slate-50/50 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition appearance-none cursor-pointer truncate ${
              errors.counselingTopic ? 'border-red-500' : 'border-slate-300'
            }`}
          >
            <option value="">{t('s2_topic_select')}</option>
            {topics.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        {errors.counselingTopic && <p className="text-red-500 text-xs mt-1">{errors.counselingTopic}</p>}
      </div>

      {/* Custom Topic Specification */}
      {formData.counselingTopic === 'Other' && (
        <div className="animate-fadeIn">
          <label className="block text-xs font-semibold text-slate-700 mb-1">{t('s2_custom_topic')}</label>
          <div className="relative">
            <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={formData.topicCustom}
              onChange={(e) => updateField('topicCustom', e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50/50 focus:bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              placeholder={t('s2_custom_topic_ph')}
            />
          </div>
        </div>
      )}

      {/* Concern Description */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
          <MessageSquare size={13} className="text-slate-400" />
          <span>{t('s2_concern_desc')}</span>
        </label>
        <div className="relative">
          <textarea
            value={formData.concernDescription}
            onChange={(e) => updateField('concernDescription', e.target.value)}
            rows={3}
            className={`w-full p-3 text-sm bg-slate-50/50 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-vertical ${
              errors.concernDescription ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder={t('s2_concern_ph')}
          />
        </div>
        {errors.concernDescription && <p className="text-red-500 text-xs mt-1">{errors.concernDescription}</p>}
      </div>

      {/* Urgency / Triage Level */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          {t('s2_urgency_label')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {urgencyOptions.map((item) => (
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
          <span className="text-xs font-medium text-slate-700">{t('s2_previous_check')}</span>
        </label>
      </div>

      {formData.hadPreviousCounseling && (
        <div className="animate-fadeIn">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
            <FileText size={13} className="text-slate-400" />
            <span>{t('s2_previous_details')}</span>
          </label>
          <textarea
            value={formData.previousCounselingDetails}
            onChange={(e) => updateField('previousCounselingDetails', e.target.value)}
            rows={2}
            className="w-full p-2.5 text-xs bg-slate-50/50 focus:bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-vertical"
            placeholder={t('s2_previous_details_ph')}
          />
        </div>
      )}
    </div>
  );
}