import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { CalendarCheck, Phone, Check, X } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchAppointments = async () => {
    try {
      const snap = await getDocs(collection(db, 'appointments'));
      setAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status: newStatus });
      await fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment status:", error);
      alert("Error updating appointment");
    }
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <p className="text-sm text-gray-500">Manage customer bookings</p>
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'confirmed', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f ? 'bg-teal-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></span>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(apt => (
                <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800">{apt.name}</div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                      <Phone className="w-3 h-3" /> {apt.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">{apt.service}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-800 font-medium">{apt.date}</div>
                    <div className="text-gray-500 text-xs">{apt.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize inline-flex items-center gap-1 ${statusColors[apt.status]}`}>
                      {apt.status === 'pending' && <CalendarCheck className="w-3 h-3" />}
                      {apt.status === 'confirmed' && <Check className="w-3 h-3" />}
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {apt.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(apt.id, 'confirmed')} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="Confirm">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => updateStatus(apt.id, 'cancelled')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Cancel">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {apt.status === 'confirmed' && (
                        <button onClick={() => updateStatus(apt.id, 'completed')} className="px-3 py-1.5 bg-green-50 text-green-700 font-medium rounded-lg hover:bg-green-100 text-xs">
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </AdminLayout>
  );
}
