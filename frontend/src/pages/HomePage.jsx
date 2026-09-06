import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartHandshake, ShieldCheck, Sparkles, Brain, GraduationCap, 
  AlertTriangle, Phone, ChevronRight, ChevronDown, ChevronUp, 
  Clock, ArrowRight, CheckCircle2, UserCheck, HelpCircle, Lock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const { t, lang } = useLanguage();
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const services = [
    {
      id: 'mental-health',
      icon: <Brain size={24} className="text-primary-600" />,
      title: t('service1_title'),
      desc: t('service1_desc'),
      bg: 'bg-primary-50/60 border-primary-100',
    },
    {
      id: 'academic-guidance',
      icon: <GraduationCap size={24} className="text-indigo-600" />,
      title: t('service2_title'),
      desc: t('service2_desc'),
      bg: 'bg-indigo-50/60 border-indigo-100',
    },
    {
      id: 'crisis-intervention',
      icon: <AlertTriangle size={24} className="text-rose-600" />,
      title: t('service3_title'),
      desc: t('service3_desc'),
      bg: 'bg-rose-50/60 border-rose-100',
    },
    {
      id: 'wellness-skills',
      icon: <Sparkles size={24} className="text-emerald-600" />,
      title: t('service4_title'),
      desc: t('service4_desc'),
      bg: 'bg-emerald-50/60 border-emerald-100',
    },
  ];

  const steps = [
    {
      num: '01',
      title: t('panel_step1_title'),
      desc: t('panel_step1_desc'),
    },
    {
      num: '02',
      title: t('panel_step2_title'),
      desc: t('panel_step2_desc'),
    },
    {
      num: '03',
      title: t('panel_step3_title'),
      desc: t('panel_step3_desc'),
    },
  ];

  const faqs = [
    {
      q: t('panel_faq1_q'),
      a: t('panel_faq1_a'),
    },
    {
      q: t('panel_faq2_q'),
      a: t('panel_faq2_a'),
    },
    {
      q: t('panel_faq3_q'),
      a: t('panel_faq3_a'),
    },
  ];

  return (
    <div className="w-full bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-slate-50 to-white text-slate-900 py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
        <div className="relative max-w-5xl mx-auto text-center z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-bold mb-6 shadow-2xs">
            <Sparkles size={14} className="text-blue-600" />
            <span>{t('hero_badge')}</span>
          </div>

          {/* Main Title - High-contrast deep navy/slate */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight mb-5 max-w-4xl mx-auto text-[#0f172a]">
            {t('hero_title')}
          </h1>

          {/* Subtitle - High-contrast slate gray */}
          <p className="text-sm sm:text-lg text-[#334155] max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal">
            {t('hero_subtitle')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-12">
            <Link
              to="/intake"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#2563eb] hover:bg-blue-700 text-white text-sm sm:text-base font-bold rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{t('hero_cta_primary')}</span>
              <ArrowRight size={18} />
            </Link>

            <a
              href="#services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 text-sm sm:text-base font-semibold rounded-xl shadow-2xs transition cursor-pointer"
            >
              <span>{t('hero_cta_secondary')}</span>
              <ChevronDown size={18} />
            </a>
          </div>

          {/* Trust Highlights Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 border-t border-slate-200 max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
              <span className="text-xs font-bold text-slate-800">{t('hero_trust_free')}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <Lock size={18} className="text-blue-600 flex-shrink-0" />
              <span className="text-xs font-bold text-slate-800">{t('hero_trust_confidential')}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <UserCheck size={18} className="text-indigo-600 flex-shrink-0" />
              <span className="text-xs font-bold text-slate-800">{t('hero_trust_licensed')}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <Clock size={18} className="text-amber-600 flex-shrink-0" />
              <span className="text-xs font-bold text-slate-800">{t('hero_trust_speed')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES OFFERED SECTION */}
      <section id="services" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-block text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-3 border border-primary-100">
            {t('services_section_tag')}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            {t('services_title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {t('services_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-primary-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${item.bg} group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              <Link
                to="/intake"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 transition"
              >
                <span>{t('hero_cta_primary')}</span>
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ABOUT US & FERPA GUARANTEE SECTION */}
      <section id="about" className="py-16 sm:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-block text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-3 border border-primary-100">
                {t('about_section_tag')}
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-5 leading-tight">
                {t('about_title')}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {t('about_p1')}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-8">
                {t('about_p2')}
              </p>

              <Link
                to="/intake"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition"
              >
                <span>{t('nav_start_intake')}</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right Pillars / Trust Badges */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-2xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      {t('about_badge_ferpa_title')}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {t('about_badge_ferpa_desc')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-2xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
                    <UserCheck size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      {t('about_badge_licensed_title')}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {t('about_badge_licensed_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS 3-STEP TIMELINE */}
      <section id="how-it-works" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-3 border border-primary-100">
            {t('panel_tab_how_it_works')}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How It Works in 3 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item, idx) => (
            <div
              key={item.num}
              className="relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl sm:text-4xl font-black text-primary-600/30 mb-2 block font-mono">
                  {item.num}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {idx === 0 && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <Link
                    to="/intake"
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                  >
                    <span>{t('hero_cta_primary')}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. QUICK FAQS SECTION */}
      <section id="faqs" className="py-16 sm:py-20 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-3 border border-primary-100">
              <HelpCircle size={13} />
              <span>{t('panel_tab_faqs')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-slate-900 hover:text-primary-600 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp size={16} className="text-primary-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. EMERGENCY CONTACTS SECTION */}
      <section id="emergency" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-rose-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-lg border border-rose-900/50">
          <div className="max-w-3xl mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-300 bg-rose-500/20 px-3 py-1 rounded-full mb-3 border border-rose-500/30">
              <AlertTriangle size={13} className="text-rose-400" />
              <span>{t('emergency_section_tag')}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              {t('emergency_title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('emergency_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-xs flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-rose-300 mb-1">{t('emergency_card1_title')}</h4>
                <p className="text-[11px] text-slate-300 leading-snug mb-4">{t('emergency_card1_desc')}</p>
              </div>
              <a
                href={`tel:${t('emergency_card1_num')}`}
                className="inline-flex items-center justify-center gap-2 py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <Phone size={13} />
                <span>Call {t('emergency_card1_num')}</span>
              </a>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-xs flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-amber-300 mb-1">{t('emergency_card2_title')}</h4>
                <p className="text-[11px] text-slate-300 leading-snug mb-4">{t('emergency_card2_desc')}</p>
              </div>
              <a
                href="tel:988"
                className="inline-flex items-center justify-center gap-2 py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <Phone size={13} />
                <span>Call or Text 988</span>
              </a>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-xs flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-primary-300 mb-1">{t('emergency_card3_title')}</h4>
                <p className="text-[11px] text-slate-300 leading-snug mb-4">{t('emergency_card3_desc')}</p>
              </div>
              <a
                href={`tel:${t('emergency_card3_num')}`}
                className="inline-flex items-center justify-center gap-2 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <Phone size={13} />
                <span>Call {t('emergency_card3_num')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary-600 text-white flex items-center justify-center">
              <HeartHandshake size={14} />
            </div>
            <span className="font-bold text-slate-800">{t('nav_title')}</span>
            <span>—</span>
            <span>{t('footer_privacy_note')}</span>
          </div>

          <div>{t('footer_rights')}</div>

          <a
            href="#"
            className="text-primary-600 hover:text-primary-700 font-semibold transition"
          >
            {t('footer_back_to_top')} ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
