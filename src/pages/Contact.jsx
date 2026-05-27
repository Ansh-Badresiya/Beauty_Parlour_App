import { Phone, MapPin, Clock, MessageCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { demoSettings } from '../data/demoData';

const WHATSAPP_NUMBER = '7096672804';

export default function Contact() {
  const { t } = useLanguage();

  const openingHours = [
    { day: t.monday, hours: demoSettings.opening_hours.monday },
    { day: t.tuesday, hours: demoSettings.opening_hours.tuesday },
    { day: t.wednesday, hours: demoSettings.opening_hours.wednesday },
    { day: t.thursday, hours: demoSettings.opening_hours.thursday },
    { day: t.friday, hours: demoSettings.opening_hours.friday },
    { day: t.saturday, hours: demoSettings.opening_hours.saturday },
    { day: t.sunday, hours: demoSettings.opening_hours.sunday },
  ];

  const waMsg = encodeURIComponent("Hello! I'd like to get in touch with Krisha Beauty Parlour.");

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-700 via-pink-700 to-purple-800 text-white py-14 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-xs font-semibold mb-4 uppercase tracking-wider">
          <MessageCircle className="w-3.5 h-3.5" /> Contact
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">{t.contactTitle}</h1>
        <p className="text-white/80 text-base">{t.contactSubtitle}</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {/* Quick contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="tel:+917096642804"
            className="glass-card card-hover rounded-2xl p-6 text-center group"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-100 group-hover:bg-rose-200 flex items-center justify-center mx-auto mb-3 transition-colors">
              <Phone className="w-6 h-6 text-rose-600" />
            </div>
            <p className="font-semibold text-gray-800 mb-1">{t.phone}</p>
            <p className="text-rose-600 font-bold text-lg">+91 7096642804</p>
          </a>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`}
            target="_blank" rel="noreferrer"
            className="glass-card card-hover rounded-2xl p-6 text-center group"
          >
            <div className="w-14 h-14 rounded-2xl bg-green-100 group-hover:bg-green-200 flex items-center justify-center mx-auto mb-3 transition-colors">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-green-600"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </div>
            <p className="font-semibold text-gray-800 mb-1">{t.whatsapp}</p>
            <p className="text-green-600 font-bold text-lg">Chat with Us</p>
          </a>

          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <p className="font-semibold text-gray-800 mb-1">{t.address}</p>
            <p className="text-gray-600 text-sm leading-relaxed">Near Main Chowk, Opp. Temple,<br />Your Town, Gujarat</p>
          </div>
        </div>

        {/* Map + Hours */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Map */}
          <div className="glass-card rounded-2xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" /> {t.findUs}
              </h3>
            </div>
            <div className="h-64 bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
              {/* Placeholder — replace src with real Google Maps embed */}
              <iframe
                title="Krisha Beauty Parlour Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.8941946073!2d72.58408!3d23.04137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAyJzI4LjkiTiA3MsKwMzUnMDIuNyJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Hours */}
          <div className="glass-card rounded-2xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" /> {t.hoursTitle}
              </h3>
            </div>
            <div>
              {openingHours.map(({ day, hours }, i) => (
                <div
                  key={day}
                  className={`flex justify-between items-center px-5 py-3 text-sm ${
                    i < openingHours.length - 1 ? 'border-b border-gray-100' : ''
                  } ${i % 2 === 0 ? '' : 'bg-rose-50/30'}`}
                >
                  <span className="font-medium text-gray-700">{day}</span>
                  <span className={`font-semibold ${hours === t.closed ? 'text-red-400' : 'text-rose-600'}`}>{hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" /> {t.followUs}
          </h3>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://instagram.com"
              target="_blank" rel="noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold hover:scale-105 transition-transform shadow-md"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              Instagram
            </a>
            <a
              href="https://facebook.com"
              target="_blank" rel="noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:scale-105 transition-transform shadow-md"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              Facebook
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-green-500 text-white font-semibold hover:scale-105 transition-transform shadow-md"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
