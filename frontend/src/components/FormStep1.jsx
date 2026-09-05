import { User, Mail, Phone, CreditCard, Award, BookOpen, GraduationCap, ChevronDown, Edit3 } from 'lucide-react';

export default function FormStep1({ formData, errors, updateField }) {
  const departments = [
    'Freshman / Remedial',
    'Social Sciences',
    'Natural Sciences',
    'Computer Science (CS)',
    'Software Engineering (SE)',
    'Engineering (Other)',
    'Other (Specify Custom Department)',
  ];

  const years = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
    '5th Year',
    'Other (Specify Custom Year)',
  ];

  const isCustomDepartment = formData.department === 'Other (Specify Custom Department)';
  const isCustomYear = formData.yearInSchool === 'Other (Specify Custom Year)';

  return (
    <div className="space-y-4 fade-in">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Student Academic & Contact Details</h2>
        <p className="text-xs text-slate-500 mt-0.5">Please provide your official university contact information.</p>
      </div>

      {/* Name Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50/50 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.firstName ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="e.g. Alex"
            />
          </div>
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50/50 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.lastName ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="e.g. Rivera"
            />
          </div>
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      {/* Email & Phone Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">University Email *</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50/50 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.email ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="student@university.edu"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
          <div className="relative">
            <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50/50 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.phone ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="(555) 000-0000"
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      {/* Student ID & GPA Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Student ID *</label>
          <div className="relative">
            <CreditCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) => updateField('studentId', e.target.value)}
              className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50/50 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.studentId ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="e.g. 20240001"
            />
          </div>
          {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Cumulative GPA (Optional)</label>
          <div className="relative">
            <Award size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={formData.gpa}
              onChange={(e) => updateField('gpa', e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50/50 focus:bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              placeholder="e.g. 3.75"
            />
          </div>
        </div>
      </div>

      {/* Department & Year in School Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Program *</label>
          <div className="relative">
            <BookOpen size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={formData.department}
              onChange={(e) => updateField('department', e.target.value)}
              className={`w-full pl-9 pr-8 py-2 text-sm bg-slate-50/50 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition appearance-none cursor-pointer truncate ${
                errors.department ? 'border-red-500' : 'border-slate-300'
              }`}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Year in School *</label>
          <div className="relative">
            <GraduationCap size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={formData.yearInSchool}
              onChange={(e) => updateField('yearInSchool', e.target.value)}
              className={`w-full pl-9 pr-8 py-2 text-sm bg-slate-50/50 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition appearance-none cursor-pointer truncate ${
                errors.yearInSchool ? 'border-red-500' : 'border-slate-300'
              }`}
            >
              <option value="">Select Academic Year</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {errors.yearInSchool && <p className="text-red-500 text-xs mt-1">{errors.yearInSchool}</p>}
        </div>
      </div>

      {/* Conditionally Rendered Custom Department & Year Row */}
      {(isCustomDepartment || isCustomYear) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 animate-fadeIn">
          {isCustomDepartment ? (
            <div>
              <label className="block text-xs font-semibold text-primary-700 mb-1">
                Specify Custom Department / Major *
              </label>
              <div className="relative">
                <Edit3 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-500 pointer-events-none" />
                <input
                  type="text"
                  value={formData.departmentCustom || ''}
                  onChange={(e) => updateField('departmentCustom', e.target.value)}
                  className={`w-full pl-9 pr-3.5 py-2 text-sm bg-primary-50/30 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                    errors.departmentCustom ? 'border-red-500' : 'border-primary-300'
                  }`}
                  placeholder="e.g. Biomedical Engineering, Architecture"
                />
              </div>
              {errors.departmentCustom && (
                <p className="text-red-500 text-xs mt-1">{errors.departmentCustom}</p>
              )}
            </div>
          ) : (
            <div className="hidden sm:block" />
          )}

          {isCustomYear ? (
            <div>
              <label className="block text-xs font-semibold text-primary-700 mb-1">
                Specify Custom Academic Year *
              </label>
              <div className="relative">
                <Edit3 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-500 pointer-events-none" />
                <input
                  type="text"
                  value={formData.yearCustom || ''}
                  onChange={(e) => updateField('yearCustom', e.target.value)}
                  className={`w-full pl-9 pr-3.5 py-2 text-sm bg-primary-50/30 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                    errors.yearCustom ? 'border-red-500' : 'border-primary-300'
                  }`}
                  placeholder="e.g. Master's 1st Year, PhD Candidate"
                />
              </div>
              {errors.yearCustom && (
                <p className="text-red-500 text-xs mt-1">{errors.yearCustom}</p>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}