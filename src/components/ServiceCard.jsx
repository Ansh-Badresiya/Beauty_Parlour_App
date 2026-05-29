import { Clock, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function ServiceCard({ service, compact = false }) {
  const { lang, t } = useLanguage();

  const name = lang === 'gu' ? (service.name_gu || service.name_en) : service.name_en;
  const desc = lang === 'gu' ? (service.description_gu || service.description_en) : service.description_en;

  // Category color map
  const catColors = {
    facial: 'bg-rose-100 text-rose-600',
    cleanup: 'bg-orange-100 text-orange-600',
    waxing: 'bg-amber-100 text-amber-600',
    hairSpa: 'bg-purple-100 text-purple-600',
    hairCut: 'bg-blue-100 text-blue-600',
    hairstyle: 'bg-cyan-100 text-cyan-600',
    threading: 'bg-green-100 text-green-600',
    bridalMakeup: 'bg-pink-100 text-pink-700',
    mehendi: 'bg-emerald-100 text-emerald-700',
    sareeDraping: 'bg-indigo-100 text-indigo-600',
  };
  const catColor = catColors[service.category] || 'bg-gray-100 text-gray-600';
  const catLabel = t[service.category] || service.category;

  if (compact) {
    return (
      <div className="glass-card card-hover rounded-2xl overflow-hidden">
        {service.image_url && (
          <div className="h-36 overflow-hidden">
            <img src={service.image_url} alt={name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        )}
        <div className="p-4">
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${catColor}`}>{catLabel}</span>
          <h3 className="font-semibold text-gray-800 text-sm leading-tight">{name}</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-rose-600 font-bold text-base">₹{service.price}</span>
            {service.duration && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />{service.duration} {t.min}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card card-hover rounded-2xl overflow-hidden">
      {service.image_url && (
        <div className="h-48 overflow-hidden relative">
          <img src={service.image_url} alt={name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${catColor}`}>{catLabel}</span>
        </div>
      )}
      <div className="p-5">
        <h3 className="font-display font-semibold text-gray-800 text-lg leading-tight mb-1">{name}</h3>
        {desc && <p className="text-gray-500 text-sm leading-relaxed mb-3">{desc}</p>}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wider">{t.price}</span>
            <p className="text-rose-600 font-bold text-xl">₹{service.price}</p>
          </div>
          {service.duration && (
            <div className="text-right">
              <span className="text-xs text-gray-400 uppercase tracking-wider">{t.duration}</span>
              <p className="text-gray-600 font-semibold text-sm flex items-center gap-1 justify-end">
                <Clock className="w-3 h-3" />{service.duration} {t.min}
              </p>
            </div>
          )}
        </div>
        <Link
          to={`/book?service=${encodeURIComponent(service.name_en)}`}
          className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
        >
          {t.bookService}
        </Link>
      </div>
    </div>
  );
}
