import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function SuccessPage() {
  const { id } = useParams();
  const { t } = useLanguage();

  return (
    <div className="py-16 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('page_success_title')}</h1>
        <p className="text-gray-600 mb-4">{t('page_success_desc')}</p>
        <p className="text-sm text-gray-500">
          {t('page_success_req_id')} <span className="font-mono font-bold text-slate-800">{id}</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">{t('page_success_review_note')}</p>
        <a
          href="/"
          className="inline-block mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          {t('page_success_back')}
        </a>
      </div>
    </div>
  );
}