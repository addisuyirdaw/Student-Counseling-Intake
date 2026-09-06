import { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, Phone, 
  ChevronDown, ChevronUp, HelpCircle, HeartHandshake, Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SupportInfoPanel() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('steps'); // 'steps' | 'faqs'
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const steps = [
    {
      step: '1',
      title: t('panel_step1_title'),
      desc: t('panel_step1_desc'),
    },
    {
      step: '2',
      title: t('panel_step2_title'),
      desc: t('panel_step2_desc'),
    },
    {
      step: '3',
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

  const toggleFaq = (idx) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-4">
      {/* Primary Card: University Counseling & Confidentiality */}
      <div className="bg-gradient-to-br from-slate-900 via-primary-950 to-indigo-950 text-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary-300 border border-white/15 shadow-inner flex-shrink-0">
            <HeartHandshake size={22} />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold tracking-tight leading-tight">
              {t('panel_title')}
            </h2>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {t('panel_subtitle')}
            </p>
          </div>
        </div>

        {/* Confidentiality Badge */}
        <div className="mt-3.5 flex items-center gap-2 px-3 py-2 bg-white/10 rounded-xl border border-white/15 text-xs text-primary-200">
          <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0" />
          <span className="font-semibold text-[11px] tracking-wide">{t('panel_confidential_badge')}</span>
        </div>

        {/* Compact Crisis Alert Strip */}
        <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-rose-300 font-medium flex-shrink-0">
            <AlertTriangle size={14} className="text-rose-400 flex-shrink-0" />
            <span className="text-[11px]">{t('panel_crisis_label')}</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="tel:5550199"
              className="flex-1 sm:flex-none text-center px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-lg transition flex items-center justify-center gap-1 shadow-2xs"
            >
              <Phone size={10} /> 555-0199
            </a>
            <a
              href="tel:988"
              className="flex-1 sm:flex-none text-center px-2.5 py-1.5 bg-white/15 hover:bg-white/25 text-white font-bold text-[10px] rounded-lg transition border border-white/15 flex items-center justify-center shadow-2xs"
            >
              {t('panel_crisis_lifeline')}
            </a>
          </div>
        </div>
      </div>

      {/* Balanced Tabbed Widget: How It Works & FAQs */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('steps')}
            className={`flex-1 py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'steps'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles size={13} className={activeTab === 'steps' ? 'text-primary-600' : 'text-slate-400'} />
            <span>{t('panel_tab_how_it_works')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('faqs')}
            className={`flex-1 py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'faqs'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle size={13} className={activeTab === 'faqs' ? 'text-primary-600' : 'text-slate-400'} />
            <span>{t('panel_tab_faqs')}</span>
          </button>
        </div>

        {/* Tab 1: How It Works */}
        {activeTab === 'steps' && (
          <div className="space-y-3.5 animate-fadeIn">
            {steps.map((item, idx) => (
              <div key={item.step} className="flex items-start gap-3 relative">
                {idx < steps.length - 1 && (
                  <div className="absolute left-3.5 top-6 bottom-0 w-0.5 bg-slate-200 -mb-1" />
                )}
                <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 border border-primary-200 font-bold text-xs flex items-center justify-center flex-shrink-0 z-10 shadow-2xs">
                  {item.step}
                </div>
                <div className="pt-0.5">
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Frequently Asked Questions */}
        {activeTab === 'faqs' && (
          <div className="divide-y divide-slate-100 animate-fadeIn">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-2 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left py-1 text-xs font-semibold text-slate-800 hover:text-primary-600 transition cursor-pointer"
                  >
                    <span className="pr-2">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp size={14} className="text-primary-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 animate-fadeIn">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
