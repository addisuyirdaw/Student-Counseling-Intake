import { Calendar, Clock, MessageSquare, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FormStep3({ formData, errors, updateField, updateArrayField }) {
  const { t } = useLanguage();

  const days = [
    { value: 'Monday', label: t('s3_day_mon') },
    { value: 'Tuesday', label: t('s3_day_tue') },
    { value: 'Wednesday', label: t('s3_day_wed') },
    { value: 'Thursday', label: t('s3_day_thu') },
    { value: 'Friday', label: t('s3_day_fri') },
  ];

  const timeSlots = [
    { value: 'Morning', label: t('s3_slot_morning') },
    { value: 'Afternoon', label: t('s3_slot_afternoon') },
    { value: 'Evening', label: t('s3_slot_evening') },
  ];

  const toggleDay = (day) => {
    const updated = formData.preferredDays.includes(day)
      ? formData.preferredDays.filter((d) => d !== day)
      : [...formData.preferredDays, day];
    updateArrayField('preferredDays', updated);
  };

  const toggleTimeSlot = (slot) => {
    const updated = formData.preferredTimeSlots.includes(slot)
      ? formData.preferredTimeSlots.filter((s) => s !== slot)
      : [...formData.preferredTimeSlots, slot];
    updateArrayField('preferredTimeSlots', updated);
  };

  return (
    <div className="space-y-4 fade-in">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900">{t('s3_title')}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{t('s3_subtitle')}</p>
      </div>

      {/* Days Selection */}
      <div>
        <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <Calendar size={14} className="text-primary-600" />
          {t('s3_days_label')}
        </label>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5">
          {days.map((item) => {
            const isSelected = formData.preferredDays.includes(item.value);
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => toggleDay(item.value)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-primary-600 text-white border-primary-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-primary-400 hover:bg-slate-50'
                }`}
              >
                {isSelected && <Check size={12} />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots Selection */}
      <div>
        <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <Clock size={14} className="text-primary-600" />
          {t('s3_slots_label')}
        </label>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5">
          {timeSlots.map((item) => {
            const isSelected = formData.preferredTimeSlots.includes(item.value);
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => toggleTimeSlot(item.value)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-primary-600 text-white border-primary-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-primary-400 hover:bg-slate-50'
                }`}
              >
                {isSelected && <Check size={12} />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Comments */}
      <div>
        <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
          <MessageSquare size={14} className="text-slate-400" />
          {t('s3_comments')}
        </label>
        <textarea
          value={formData.additionalComments}
          onChange={(e) => updateField('additionalComments', e.target.value)}
          rows={3}
          className="w-full p-3 text-sm bg-slate-50/50 focus:bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-vertical"
          placeholder={t('s3_comments_ph')}
        />
      </div>
    </div>
  );
}