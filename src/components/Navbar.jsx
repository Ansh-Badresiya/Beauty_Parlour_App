import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { t, lang, toggleLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: t.home },
    { to: '/services', label: t.services },
    { to: '/gallery', label: t.gallery },
    { to: '/offers', label: t.offers },
    { to: '/contact', label: t.contact },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-pink-100' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-14 h-14 overflow-hidden rounded-full group-hover:scale-105 transition-transform">
              <img
                src="logo-1.png"
                alt="Krisha Beauty Parlour Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-500 leading-none block">
                Krisha
              </span>
              <span className="text-[10px] text-pink-400 tracking-widest uppercase leading-none">Beauty Parlour</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-pink-200 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all duration-200"
              aria-label="Switch language"
            >
              <span className={lang === 'en' ? 'text-rose-600' : 'text-gray-400'}>EN</span>
              <span className="text-gray-300">|</span>
              <span className={lang === 'gu' ? 'text-rose-600 font-gujarati' : 'text-gray-400 font-gujarati'}>ગુજ</span>
            </button>

            {/* Book button desktop */}
            <Link
              to="/book"
              className="hidden md:inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              {t.bookAppointment}
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-rose-50"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-pink-100 px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all ${
                isActive(link.to)
                  ? 'text-rose-600 bg-rose-50'
                  : 'text-gray-700 hover:text-rose-600 hover:bg-rose-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/book"
            className="flex items-center justify-center mx-2 mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-base font-semibold shadow-md"
          >
            {t.bookAppointment}
          </Link>
        </div>
      </div>
    </nav>
  );
}
