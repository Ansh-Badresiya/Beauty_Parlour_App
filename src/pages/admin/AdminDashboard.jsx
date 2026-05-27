import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { demoServices, demoOffers, demoGallery } from '../../data/demoData';
import { CalendarCheck, Scissors, Tag, ToggleLeft, ToggleRight, TrendingUp, Database, Loader } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, query, limit, orderBy } from 'firebase/firestore';

export default function AdminDashboard() {
  const [bookingEnabled, setBookingEnabled] = useState(true);
  const [statsData, setStatsData] = useState({ services: 0, offers: 0, appointments: 0, todayAppts: 0 });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [seeding, setSeeding] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [servicesSnap, offersSnap, appointmentsSnap] = await Promise.all([
        getDocs(collection(db, 'services')),
        getDocs(collection(db, 'offers')),
        getDocs(query(collection(db, 'appointments'), orderBy('createdAt', 'desc'), limit(5)))
      ]);
      
      setStatsData(prev => ({
        ...prev,
        services: servicesSnap.size,
        offers: offersSnap.docs.filter(d => d.data().active).length,
        appointments: appointmentsSnap.size
      }));

      // Set recent appointments from Firebase
      setRecentAppointments(appointmentsSnap.docs.map(d => ({
        id: d.id,
        ...d.data()
      })));
    } catch (error) {
      console.error("Error fetching stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSeed = async () => {
    if (!window.confirm("This will inject demo data into your Firebase database. Are you sure?")) return;
    setSeeding(true);
    try {
      const servicesRef = collection(db, 'services');
      const offersRef = collection(db, 'offers');
      const galleryRef = collection(db, 'gallery');

      // Add services
      for (const s of demoServices) {
        const { id, ...data } = s; // remove hardcoded ID
        await addDoc(servicesRef, data);
      }
      // Add offers
      for (const o of demoOffers) {
        const { id, ...data } = o;
        await addDoc(offersRef, data);
      }
      // Add gallery
      for (const g of demoGallery) {
        const { id, ...data } = g;
        await addDoc(galleryRef, data);
      }

      alert("Data seeded successfully!");
      fetchStats();
    } catch (error) {
      console.error("Seeding error:", error);
      alert("Error seeding data.");
    } finally {
      setSeeding(false);
    }
  };

  const stats = [
    { label: 'Total Services', value: statsData.services, icon: Scissors, color: 'bg-rose-100 text-rose-600' },
    { label: 'Active Offers', value: statsData.offers, icon: Tag, color: 'bg-amber-100 text-amber-600' },
    { label: "Total Appointments", value: statsData.appointments, icon: CalendarCheck, color: 'bg-purple-100 text-purple-600' },
    { label: 'This Month', value: 47, icon: TrendingUp, color: 'bg-green-100 text-green-600' },
  ];

  const statusColor = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-600',
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Booking Toggle */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-800 text-base">Online Booking</p>
            <p className={`text-sm font-medium mt-0.5 ${bookingEnabled ? 'text-green-600' : 'text-red-500'}`}>
              {bookingEnabled ? '✅ Booking is ENABLED' : '🚫 Booking is DISABLED'}
            </p>
          </div>
          <button
            onClick={() => setBookingEnabled(e => !e)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              bookingEnabled
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {bookingEnabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            {bookingEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* DB Seeder Alert */}
        {statsData.services === 0 && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="font-bold text-blue-800 text-base">Your Database is Empty!</p>
              <p className="text-sm text-blue-600 mt-0.5">Click the button to inject demo services, offers, and gallery images.</p>
            </div>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {seeding ? <Loader className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
              {seeding ? 'Seeding...' : 'Seed Data'}
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Recent Appointments</h3>
            <a href="/admin/appointments" className="text-xs text-rose-500 font-medium hover:text-rose-700">View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Customer', 'Service', 'Date', 'Time', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentAppointments.length > 0 ? (
                  recentAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-rose-50/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{apt.name}</td>
                      <td className="px-4 py-3 text-gray-600">{apt.service}</td>
                      <td className="px-4 py-3 text-gray-600">{apt.date}</td>
                      <td className="px-4 py-3 text-gray-600">{apt.time}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColor[apt.status]}`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-6 text-center text-gray-400 text-sm">
                      No appointments yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Add Service', href: '/admin/services', color: 'from-rose-500 to-pink-600' },
            { label: 'Add Offer', href: '/admin/offers', color: 'from-amber-500 to-orange-500' },
            { label: 'Upload Photo', href: '/admin/gallery', color: 'from-purple-500 to-pink-600' },
            { label: 'View Appointments', href: '/admin/appointments', color: 'from-green-500 to-teal-600' },
          ].map(({ label, href, color }) => (
            <a
              key={label}
              href={href}
              className={`flex items-center justify-center text-center px-4 py-4 rounded-xl bg-gradient-to-r ${color} text-white font-semibold text-sm shadow-md hover:scale-105 transition-transform`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
