import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Sparkles, Tag, Calendar, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
// import { demoOffers } from '../data/demoData';

const WHATSAPP_NUMBER = '917096642804';

export default function Offers() {
  const { t, lang } = useLanguage();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const snap = await getDocs(collection(db, 'offers'));
        setOffers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(o => o.active));
      } catch (error) {
        console.error("Error fetching offers:", error);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const formatDate = (str) => {
    if (!str) return '';
    const d = new Date(str);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-600 via-rose-600 to-pink-700 text-white py-14 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-xs font-semibold mb-4 uppercase tracking-wider">
          <Tag className="w-3.5 h-3.5" /> Special Offers
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">{t.offersTitle}</h1>
        <p className="text-white/80 text-base max-w-md mx-auto">{t.offersSubtitle}</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></span>
          </div>
        ) : fetchError ? (
          <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
            <p className="text-red-500 font-medium mb-1">⚠️ Could not load offers</p>
            <p className="text-gray-400 text-sm">Please try again later or contact us on WhatsApp.</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎁</div>
            <p className="text-gray-500 text-lg">{t.noOffers}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {offers.map(offer => {
              const title = lang === 'gu' ? offer.title_gu : offer.title_en;
              const desc = lang === 'gu' ? offer.description_gu : offer.description_en;
              const savings = offer.original_price - offer.price;
              const pct = Math.round((savings / offer.original_price) * 100);

              const waMsg = encodeURIComponent(`Hello! I'd like to book the offer: "${offer.title_en}" at ₹${offer.price}. Please confirm availability. 🙏`);

              return (
                <div key={offer.id} className="glass-card card-hover rounded-3xl overflow-hidden shadow-lg">
                  {offer.image_url && (
                    <div className="h-48 md:h-56 overflow-hidden relative">
                      <img
                        src={offer.image_url}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      {/* Discount badge */}
                      <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex flex-col items-center justify-center text-white shadow-lg">
                        <span className="text-xs font-bold leading-none">{pct}%</span>
                        <span className="text-[10px]">OFF</span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="font-display text-2xl font-bold text-gray-800 mb-2">{title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{desc}</p>

                    {/* Price row */}
                    <div className="flex items-center gap-4 mb-4">
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider block">Offer Price</span>
                        <span className="text-3xl font-bold text-rose-600">₹{offer.price}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider block">Original</span>
                        <span className="text-xl text-gray-400 line-through">₹{offer.original_price}</span>
                      </div>
                      <div className="ml-auto">
                        <span className="inline-block px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-bold">
                          Save ₹{savings}
                        </span>
                      </div>
                    </div>

                    {/* Valid till */}
                    {offer.valid_till && (
                      <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg mb-5">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>{t.validTill}: <strong>{formatDate(offer.valid_till)}</strong></span>
                      </div>
                    )}

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        to={`/book?service=${encodeURIComponent(offer.title_en)}`}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold hover:shadow-lg hover:scale-[1.02] transition-all"
                      >
                        {t.bookOffer} <ChevronRight className="w-4 h-4" />
                      </Link>
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`}
                        target="_blank" rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-400 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
