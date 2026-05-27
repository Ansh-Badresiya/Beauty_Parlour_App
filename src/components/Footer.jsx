import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const WHATSAPP_NUMBER = '917096642804'; // Replace with actual number

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { to: '/', label: t.home },
    { to: '/services', label: t.services },
    { to: '/gallery', label: t.gallery },
    { to: '/offers', label: t.offers },
    { to: '/book', label: t.bookAppointment },
    { to: '/contact', label: t.contact },
  ];

  return (
    <footer className="bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 text-white mt-16">
      {/* Top wave */}
      <div className="h-8 bg-[#FDF5EC]" style={{clipPath: 'ellipse(55% 100% at 50% 0%)' }}></div>

      <div className="max-w-6xl mx-auto px-4 pt-8 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-14 h-14 overflow-hidden rounded-full group-hover:scale-105 transition-transform">
                <img
                  src="logo-inv.png"
                  alt="Krisha Beauty Parlour Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-display font-bold text-xl leading-none">Krisha</p>
                <p className="text-xs text-pink-300 tracking-widest uppercase">Beauty Parlour</p>
              </div>
            </div>
            <p className="text-pink-200 text-sm leading-relaxed mb-4">{t.footerTagline}</p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-pink-500 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-green-500 flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t.quickLinks}</h3>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-pink-200 hover:text-white text-sm transition-colors flex items-center gap-1"
                  >
                    <span className="text-pink-400">›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t.contact}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-pink-200 text-sm">
                <MapPin className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                <span>Sarasvatnagar-3, I/O Veer Imitation,<br/>near Jalaramnagar society,<br /> new 80 feet road, <br/> Wadhwan, Surendranagar, Gujarat.</span>
              </li>
              <li>
                <a
                  href="tel:+917096642804"
                  className="flex items-center gap-3 text-pink-200 hover:text-white text-sm transition-colors"
                >
                  <Phone className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>+91 70966 42804</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-pink-200 text-sm">
                <Clock className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                <span>Mon–Sat: 9:00 AM – 7:00 PM<br />Sun: 10:00 AM – 4:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-pink-300 text-xs">© 2024 Krisha Beauty Parlour. {t.allRights}</p>
          <p className="text-pink-400 text-xs flex items-center gap-1">
            Made with <Heart className="w-3 h-3 fill-pink-400" /> for beautiful women
          </p>
        </div>
      </div>
    </footer>
  );
}
