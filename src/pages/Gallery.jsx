import { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
// import { demoGallery } from '../data/demoData';

const CATS = ['all', 'bridal', 'mehendi', 'hairstyles', 'makeup'];

export default function Gallery() {
  const { t } = useLanguage();
  const [active, setActive] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const snap = await getDocs(collection(db, 'gallery'));
        setGallery(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filtered = active === 'all' ? gallery : gallery.filter(g => g.category === active);

  const catLabel = (cat) => {
    const map = { all: t.allWork, bridal: t.bridal, mehendi: t.mehendiArt, hairstyles: t.hairstyles, makeup: t.makeup };
    return map[cat] || cat;
  };

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-800 via-pink-700 to-rose-700 text-white py-14 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-xs font-semibold mb-4 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Gallery
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">{t.galleryTitle}</h1>
        <p className="text-white/80 text-base max-w-md mx-auto">{t.gallerySubtitle}</p>
      </div>

      {/* Filter tabs */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3">
            {CATS.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  active === cat
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                {catLabel(cat)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="w-10 h-10 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No photos found in this category.</div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {filtered.map((img) => (
              <div
                key={img.id}
                className="break-inside-avoid rounded-2xl overflow-hidden cursor-pointer group relative"
                onClick={() => setLightbox(img)}
              >
                <img
                  src={img.image_url}
                  alt={img.caption || 'Gallery Image'}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-xs font-medium">{img.caption}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
            onClick={() => setLightbox(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightbox.image_url}
            alt={lightbox.caption}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
            onClick={e => e.stopPropagation()}
          />
          {lightbox.caption && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/40 px-4 py-1.5 rounded-full">
              {lightbox.caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
