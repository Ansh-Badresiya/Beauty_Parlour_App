import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ServiceCard from '../components/ServiceCard';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
// import { demoServices } from '../data/demoData';

const CATEGORIES = ['all', 'facial', 'cleanup', 'waxing', 'hairSpa', 'hairCut', 'threading', 'bridalMakeup', 'mehendi', 'sareeDraping'];

export default function Services() {
  const { t } = useLanguage();
  const [active, setActive] = useState('all');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snap = await getDocs(collection(db, 'services'));
        setServices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filtered = active === 'all' ? services : services.filter(s => s.category === active);

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-700 via-pink-700 to-purple-800 text-white py-14 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white/90 text-xs font-semibold mb-4 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Our Services
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">{t.servicesTitle}</h1>
        <p className="text-white/80 text-base max-w-md mx-auto">{t.servicesSubtitle}</p>
      </div>

      {/* Category Filter */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  active === cat
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                }`}
              >
                {cat === 'all' ? t.allCategories : t[cat]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Service Grid */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No services found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(s => <ServiceCard key={s.id} service={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}
