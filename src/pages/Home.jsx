import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Star, Clock, Phone, MapPin, ChevronRight, Sparkles, Heart, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ServiceCard from '../components/ServiceCard';
import { db } from '../firebase/config';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { demoReviews, demoSettings } from '../data/demoData';
// import { demoServices, demoOffers, demoGallery } from '../data/demoData';

const WHATSAPP_NUMBER = '917096642804';

// const featuredServices = demoServices.slice(0, 6);

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
      ))}
    </div>
  );
}

export default function Home() {
  const { t, lang } = useLanguage();
  const waMsg = encodeURIComponent("Hello! I'd like to book an appointment at Krisha Beauty Parlour. 💄");

  const [services, setServices] = useState([]);
  const [offers, setOffers] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesSnap, offersSnap, gallerySnap] = await Promise.all([
          getDocs(query(collection(db, 'services'), limit(6))),
          getDocs(collection(db, 'offers')),
          getDocs(query(collection(db, 'gallery'), limit(8)))
        ]);

        setServices(servicesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setOffers(offersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setGallery(gallerySnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error fetching Firebase data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openingHours = [
    { day: t.monday, hours: demoSettings.opening_hours.monday },
    { day: t.tuesday, hours: demoSettings.opening_hours.tuesday },
    { day: t.wednesday, hours: demoSettings.opening_hours.wednesday },
    { day: t.thursday, hours: demoSettings.opening_hours.thursday },
    { day: t.friday, hours: demoSettings.opening_hours.friday },
    { day: t.saturday, hours: demoSettings.opening_hours.saturday },
    { day: t.sunday, hours: demoSettings.opening_hours.sunday },
  ];

  return (
    <div className="pt-16">
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-pink-800 to-purple-900" />
        <div className="absolute inset-0 opacity-20"
          style={{backgroundImage:"url('https://plus.unsplash.com/premium_photo-1684407616442-8d5a1b7c978e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",backgroundSize:'cover',backgroundPosition:'center'}}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-rose-600/10 blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
              <Sparkles className="w-4 h-4 text-pink-300" />
              <span>Trusted Beauty Parlour Since 2019</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
              {t.heroTagline}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-amber-300 mt-1 text-3xl md:text-5xl">
                — Krisha Beauty Parlour
              </span>
            </h1>

            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              {t.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/book"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-base shadow-xl hover:shadow-pink-500/40 hover:scale-105 transition-all duration-200"
              >
                <Heart className="w-5 h-5" />
                {t.bookNow}
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-green-500 text-white font-bold text-base shadow-xl hover:bg-green-400 hover:scale-105 transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {t.whatsappUs}
              </a>
              <a
                href="tel:+917096642804"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white font-bold text-base hover:bg-white/25 hover:scale-105 transition-all duration-200"
              >
                <Phone className="w-5 h-5" />
                {t.callUs}
              </a>
            </div>

            {/* Trust indicators */}
            {/* <div className="flex flex-wrap gap-6 mt-10">
              {[
                { icon: <Award className="w-5 h-5" />, text: '9+ Years Experience' },
                { icon: <Star className="w-5 h-5" />, text: '500+ Happy Customers' },
                { icon: <Heart className="w-5 h-5" />, text: 'Family-Run & Trusted' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-white/80 text-sm">
                  <span className="text-pink-300">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div> */}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#FDF5EC]" style={{clipPath:'ellipse(55% 100% at 50% 100%)'}} />
      </section>

      {/* ── ABOUT ── */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 text-rose-600 text-xs font-semibold mb-4 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> About Us
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              {t.aboutTitle}
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-6">{t.aboutText}</p>

            {/* <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { val: '9+', label: 'Years' },
                { val: '500+', label: 'Clients' },
                { val: '9', label: 'Services' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center p-4 rounded-2xl bg-rose-50">
                  <p className="font-display text-2xl font-bold text-rose-600">{val}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div> */}

            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-rose-600 font-semibold text-sm hover:gap-3 transition-all"
            >
              View All Services <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-pink-200">
              <img
                src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=500&fit=crop"
                alt="Krisha Beauty Parlour"
                className="w-full h-80 md:h-96 object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-200" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">Family-Run</p>
                <p className="text-xs text-gray-500">Trusted by locals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED SERVICES ── */}
      <section className="py-16 px-4 bg-gradient-to-b from-rose-50/50 to-[#FDF5EC]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 text-rose-600 text-xs font-semibold mb-3 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Services
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-800 mb-2">{t.servicesTitle}</h2>
            <p className="text-gray-500 text-base">{t.servicesSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {loading ? (
              <div className="col-span-full flex justify-center py-10">
                <span className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></span>
              </div>
            ) : (
              services.map(s => (
                <ServiceCard key={s.id} service={s} />
              ))
            )}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-rose-400 text-rose-600 font-semibold hover:bg-rose-50 transition-all"
            >
              View All Services <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CURRENT OFFER BANNER ── */}
      {offers.length > 0 && offers[0] && offers[0].active && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-600 to-pink-500 p-8 md:p-12 text-white shadow-2xl shadow-rose-300">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <span className="text-2xl mb-2 block">✨</span>
                  <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
                    {lang === 'gu' ? offers[0].title_gu : offers[0].title_en}
                  </h3>
                  <p className="text-white/85 text-sm md:text-base mb-3">
                    {lang === 'gu' ? offers[0].description_gu : offers[0].description_en}
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold">₹{offers[0].price}</span>
                    <span className="text-white/60 line-through text-lg">₹{offers[0].original_price}</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                      Save ₹{offers[0].original_price - offers[0].price}
                    </span>
                  </div>
                </div>
                <Link
                  to="/offers"
                  className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-rose-600 font-bold shadow-lg hover:scale-105 transition-transform"
                >
                  View All Offers <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── GALLERY PREVIEW ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold mb-3 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Gallery
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-800 mb-2">{t.galleryTitle}</h2>
            <p className="text-gray-500 text-base">{t.gallerySubtitle}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {loading ? (
              <div className="col-span-full flex justify-center py-10">
                <span className="w-10 h-10 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></span>
              </div>
            ) : gallery.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-10">More photos coming soon...</div>
            ) : (
              gallery.map(img => (
                <div key={img.id} className="rounded-2xl overflow-hidden group relative aspect-square">
                  <img
                    src={img.image_url}
                    alt={img.caption || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs font-medium">{img.caption}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-purple-400 text-purple-600 font-semibold hover:bg-purple-50 transition-all"
            >
              View Full Gallery <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-16 px-4 bg-gradient-to-b from-amber-50/40 to-[#FDF5EC]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-600 text-xs font-semibold mb-3 uppercase tracking-wider">
              <Star className="w-3.5 h-3.5" /> Reviews
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-800 mb-2">{t.reviewsTitle}</h2>
            <p className="text-gray-500 text-base">{t.reviewsSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {demoReviews.map(r => (
              <div key={r.id} className="glass-card card-hover rounded-2xl p-5">
                <StarRating rating={r.rating} />
                <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-4 italic">
                  "{lang === 'gu' ? r.text_gu : r.text_en}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                    {r.avatar}
                  </div>
                  <span className="font-semibold text-gray-700 text-sm">{r.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPENING HOURS ── */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-600 text-xs font-semibold mb-3 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" /> Hours
            </div>
            <h2 className="font-display text-3xl font-bold text-gray-800">{t.hoursTitle}</h2>
          </div>
          <div className="glass-card rounded-3xl overflow-hidden shadow-lg">
            {openingHours.map(({ day, hours }, i) => (
              <div
                key={day}
                className={`flex justify-between items-center px-6 py-3.5 ${i < openingHours.length - 1 ? 'border-b border-gray-100' : ''} ${i % 2 === 0 ? 'bg-white' : 'bg-rose-50/30'}`}
              >
                <span className="font-medium text-gray-700 text-sm">{day}</span>
                <span className="text-rose-600 font-semibold text-sm">{hours}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER BAND ── */}
      <section className="py-16 px-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Ready to look beautiful? ✨</h2>
        <p className="text-white/85 text-base mb-8">Book your appointment today — it's quick and easy!</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/book"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-rose-600 font-bold text-base shadow-lg hover:scale-105 transition-transform"
          >
            <Heart className="w-5 h-5" /> {t.bookAppointment}
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`}
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-green-500 text-white font-bold text-base shadow-lg hover:bg-green-400 hover:scale-105 transition-all"
          >
            {t.whatsappUs}
          </a>
        </div>
      </section>
    </div>
  );
}
