import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, User, Phone, ChevronDown, Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';

const WHATSAPP_NUMBER = '7096642804';

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM','6.30 PM','8.00 PM', '8.30 PM', '9.00 PM'
];

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function BookAppointment() {
  const { t, lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const preService = searchParams.get('service') || '';
  const [submitted, setSubmitted] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [bookingEnabled, setBookingEnabled] = useState(true);
  const [checkingBooking, setCheckingBooking] = useState(true);

  // Fetch booking setting from Firebase
  useEffect(() => {
    const fetchBookingSetting = async () => {
      try {
        const settingDoc = await getDoc(doc(db, 'settings', 'booking'));
        if (settingDoc.exists()) {
          setBookingEnabled(settingDoc.data().enabled);
        } else {
          // Default to true if setting doesn't exist
          setBookingEnabled(true);
        }
      } catch (error) {
        console.error('Error fetching booking setting:', error);
        setBookingEnabled(true); // Default to true on error
      } finally {
        setCheckingBooking(false);
      }
    };
    fetchBookingSetting();
  }, []);

  // Fetch services from Firebase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snap = await getDocs(collection(db, 'services'));
        const servicesList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(servicesList);
        console.log('✅ Services loaded:', servicesList);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ defaultValues: { service: preService } });

  const watchedService = watch('service');
  const watchedName = watch('name');
  const watchedDate = watch('date');
  const watchedTime = watch('time');

  // Build WhatsApp message from form data
  const buildWaLink = () => {
    const msg = `Hello! I'd like to book an appointment at Krisha Beauty Parlour.\n\n` +
      `Name: ${watchedName || 'Customer'}\n` +
      `Service: ${watchedService || 'To be decided'}\n` +
      `Date: ${watchedDate || 'Flexible'}\n` +
      `Time: ${watchedTime || 'Flexible'}\n\nPlease confirm availability. Thank you! 🙏`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const onSubmit = async (data) => {
    try {
      console.log("Submitting appointment data:", data);
      // Save appointment to Firebase
      const appointmentData = {
        name: data.name,
        phone: data.phone,
        service: data.service,
        date: data.date,
        time: data.time,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      console.log("Saving to Firebase:", appointmentData);
      const docRef = await addDoc(collection(db, 'appointments'), appointmentData);
      console.log("Appointment saved with ID:", docRef.id);
      setBookingData(data);
      setSubmitted(true);
      reset();
    } catch (error) {
      console.error("Error booking appointment:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      alert(`Error booking appointment: ${error.message}`);
    }
  };

  if (checkingBooking) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!bookingEnabled) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">Bookings Paused</h2>
          <p className="text-gray-500 mb-6">We are currently not accepting online bookings. Please contact us on WhatsApp.</p>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 text-white font-bold hover:bg-green-400 transition-colors">
            WhatsApp Us
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-700 via-pink-700 to-purple-800 text-white py-14 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-xs font-semibold mb-4 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" /> Book Appointment
        </div>
        <h1 className="font-display text-4xl font-bold mb-2">{t.bookingTitle}</h1>
        <p className="text-white/80 text-base">{t.bookingSubtitle}</p>
      </div>

      <div className="max-w-xl mx-auto px-4 py-10">
        {submitted ? (
          /* Success state */
          <div className="text-center fade-in-up">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-800 mb-3">{t.bookingSuccess}</h2>
            {bookingData && (
              <div className="glass-card rounded-2xl p-5 text-left mb-6 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">{t.yourName}:</span><span className="font-semibold text-gray-800">{bookingData.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">{t.phoneNumber}:</span><span className="font-semibold text-gray-800">{bookingData.phone}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">{t.service}:</span><span className="font-semibold text-gray-800">{bookingData.service}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">{t.date}:</span><span className="font-semibold text-gray-800">{bookingData.date}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">{t.time}:</span><span className="font-semibold text-gray-800">{bookingData.time}</span></div>
              </div>
            )}
            <button
              onClick={() => setSubmitted(false)}
              className="w-full py-3 rounded-xl border-2 border-rose-400 text-rose-600 font-semibold hover:bg-rose-50 transition-colors mb-3"
            >
              Book Another Appointment
            </button>
            <Link to="/" className="block text-gray-400 text-sm hover:text-gray-600">← Back to Home</Link>
          </div>
        ) : (
          /* Booking form */
          <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-rose-400" />{t.yourName} *</span>
                </label>
                <input
                  type="text"
                  placeholder={t.namePlaceholder}
                  {...register('name', { required: t.required })}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:outline-none text-base transition-colors bg-white"
                />
                {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-rose-400" />{t.phoneNumber} *</span>
                </label>
                <input
                  type="tel"
                  placeholder={t.phonePlaceholder}
                  {...register('phone', {
                    required: t.required,
                    pattern: { value: /^[6-9]\d{9}$/, message: t.invalidPhone }
                  })}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:outline-none text-base transition-colors bg-white"
                />
                {errors.phone && <p className="text-rose-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              {/* Service */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-rose-400" />{t.selectService} *</span>
                </label>
                <div className="relative">
                  <select
                    {...register('service', { required: t.required })}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:outline-none text-base transition-colors bg-white appearance-none pr-10"
                    disabled={loadingServices}
                  >
                    <option value="">{loadingServices ? 'Loading services...' : t.selectService}</option>
                    {services.map(s => (
                      <option key={s.id} value={s.name_en}>{lang === 'gu' ? s.name_gu : s.name_en} — ₹{s.price}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.service && <p className="text-rose-500 text-xs mt-1">{errors.service.message}</p>}
                {!loadingServices && services.length === 0 && <p className="text-amber-600 text-xs mt-1">⚠️ No services available</p>}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-rose-400" />{t.selectDate} *</span>
                </label>
                <input
                  type="date"
                  min={getTodayStr()}
                  {...register('date', { required: t.required })}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:outline-none text-base transition-colors bg-white"
                />
                {errors.date && <p className="text-rose-500 text-xs mt-1">{errors.date.message}</p>}
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-rose-400" />{t.selectTime} *</span>
                </label>
                <div className="relative">
                  <select
                    {...register('time', { required: t.required })}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:outline-none text-base transition-colors bg-white appearance-none pr-10"
                  >
                    <option value="">{t.selectTime}</option>
                    {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.time && <p className="text-rose-500 text-xs mt-1">{errors.time.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2"><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />{t.bookOnWebsite}...</span>
                ) : (
                  <><Heart className="w-5 h-5" />{t.bookOnWebsite}</>
                )}
              </button>
            </form>

            {/* Or divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm font-medium text-gray-600 px-2">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* WhatsApp shortcut */}
            <a
              href={buildWaLink()}
              target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-green-500 text-white font-bold text-base shadow-lg hover:bg-green-400 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {t.bookViaWhatsapp}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
