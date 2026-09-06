import { User, Mail, Phone, CreditCard, Award, BookOpen, GraduationCap, ChevronDown, Edit3 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FormStep1({ formData, errors, updateField }) {
  const { t } = useLanguage();

  const departments = [
    { value: 'Freshman / Remedial', label: t('s1_dept_freshman') },
    { value: 'Social Sciences', label: t('s1_dept_social') },
    { value: 'Natural Sciences', label: t('s1_dept_natural') },
    { value: 'Computer Science (CS)', label: t('s1_dept_cs') },
    { value: 'Software Engineering (SE)', label: t('s1_dept_se') },
    { value: 'Engineering (Other)', label: t('s1_dept_engineering') },
    { value: 'Other (Specify Custom Department)', label: t('s1_dept_other') },
  ];

  const years = [
    { value: '1st Year', label: t('s1_year_1') },
    { value: '2nd Year', label: t('s1_year_2') },
    { value: '3rd Year', label: t('s1_year_3') },
    { value: '4th Year', label: t('s1_year_4') },
    { value: '5th Year', label: t('s1_year_5') },
    { value: 'Other (Specify Custom Year)', label: t('s1_year_other') },
  ];

  const isCustomDepartment = formData.department === 'Other (Specify Custom Department)';
  const isCustomYear = formData.yearInSchool === 'Other (Specify Custom Year)';

  return (
    <div className="space-y-4 fade-in">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900">{t('s1_title')}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{t('s1_subtitle')}</p>
      </div>

      {/* Name Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">{t('s1_first_name')}</label>
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50/50 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.firstName ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder={t('s1_first_name_ph')}
            />
          </div>
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">{t('s1_last_name')}</label>
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50/50 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.lastName ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder={t('s1_last_name_ph')}
            />
          </div>
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      {/* Email & Phone Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">{t('s1_email')}</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50/50 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.email ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder={t('s1_email_ph')}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">{t('s1_phone')}</label>
          <div className="relative">
            <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50/50 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.phone ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder={t('s1_phone_ph')}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      {/* Student ID & GPA Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">{t('s1_student_id')}</label>
          <div className="relative">
            <CreditCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) => updateField('studentId', e.target.value)}
              className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50/50 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.studentId ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder={t('s1_student_id_ph')}
            />
          </div>
          {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">{t('s1_gpa')}</label>
          <div className="relative">
            <Award size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={formData.gpa}
              onChange={(e) => updateField('gpa', e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50/50 focus:bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              placeholder={t('s1_gpa_ph')}
            />
          </div>
        </div>
      </div>

      {/* Department & Year in School Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">{t('s1_department')}</label>
          <div className="relative">
            <BookOpen size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={formData.department}
              onChange={(e) => updateField('department', e.target.value)}
              className={`w-full pl-9 pr-8 py-2 text-sm bg-slate-50/50 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition appearance-none cursor-pointer truncate ${
                errors.department ? 'border-red-500' : 'border-slate-300'
              }`}
            >
              <option value="">{t('s1_department_select')}</option>
              {departments.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">{t('s1_year')}</label>
          <div className="relative">
            <GraduationCap size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={formData.yearInSchool}
              onChange={(e) => updateField('yearInSchool', e.target.value)}
              className={`w-full pl-9 pr-8 py-2 text-sm bg-slate-50/50 focus:bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition appearance-none cursor-pointer truncate ${
                errors.yearInSchool ? 'border-red-500' : 'border-slate-300'
              }`}
            >
              <option value="">{t('s1_year_select')}</option>
              {years.map((y) => (
                <option key={y.value} value={y.value}>{y.label}</option>
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
                {t('s1_custom_dept')}
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
                  placeholder={t('s1_custom_dept_ph')}
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
                {t('s1_custom_year')}
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
                  placeholder={t('s1_custom_year_ph')}
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