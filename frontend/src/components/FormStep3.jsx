import { Calendar, Clock, MessageSquare, Check } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening'];

export default function FormStep3({ formData, errors, updateField, updateArrayField }) {
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
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Availability & Meeting Preferences</h2>
        <p className="text-xs text-slate-500 mt-0.5">Select all days and time slots that work best with your weekly class schedule.</p>
      </div>

      {/* Days Selection */}
      <div>
        <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <Calendar size={14} className="text-primary-600" />
          Preferred Meeting Days * (Select at least one)
        </label>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5">
          {DAYS.map((day) => {
            const isSelected = formData.preferredDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-primary-600 text-white border-primary-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-primary-400 hover:bg-slate-50'
                }`}
              >
                {isSelected && <Check size={12} />}
                <span>{day}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots Selection */}
      <div>
        <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <Clock size={14} className="text-primary-600" />
          Preferred Time Slots * (Select at least one)
        </label>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5">
          {TIME_SLOTS.map((slot) => {
            const isSelected = formData.preferredTimeSlots.includes(slot);
            return (
              <button
                key={slot}
                type="button"
                onClick={() => toggleTimeSlot(slot)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-primary-600 text-white border-primary-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-primary-400 hover:bg-slate-50'
                }`}
              >
                {isSelected && <Check size={12} />}
                <span>{slot}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Comments */}
      <div>
        <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
          <MessageSquare size={14} className="text-slate-400" />
          Additional Notes or Special Accommodations (Optional)
        </label>
        <textarea
          value={formData.additionalComments}
          onChange={(e) => updateField('additionalComments', e.target.value)}
          rows={3}
          className="w-full p-3 text-sm bg-slate-50/50 focus:bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-vertical"
          placeholder="e.g. Prefer meeting via Zoom, wheelchair accessible room required, exam conflicts on Thursdays..."
        />
      </div>
    </div>
  );
}