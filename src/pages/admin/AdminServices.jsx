import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
// import { demoServices } from '../../data/demoData';

const CATEGORIES = ['facial', 'cleanup', 'waxing', 'hairSpa', 'hairCut', 'hairstyle', 'threading', 'bridalMakeup', 'mehendi', 'sareeDraping'];

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service) => {
    setFormData(service);
    setEditingId(service.id);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setFormData({
      name_en: '', name_gu: '',
      category: 'facial',
      price: '', duration: '',
      description_en: '', description_gu: '',
      image_url: '', active: true
    });
    setEditingId(null);
    setIsAdding(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isAdding) {
        await addDoc(collection(db, 'services'), formData);
      } else {
        const { id, ...dataToUpdate } = formData;
        await updateDoc(doc(db, 'services', id), dataToUpdate);
      }
      await fetchServices();
      setEditingId(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Error saving service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteDoc(doc(db, 'services', id));
        await fetchServices();
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Error deleting service");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Services</h1>
          <p className="text-sm text-gray-500">Add, edit, or remove beauty services</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Service</span>
        </button>
      </div>

      {(editingId || isAdding) && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">{isAdding ? 'Add New Service' : 'Edit Service'}</h2>
            <button onClick={() => { setEditingId(null); setIsAdding(false); }} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
              <input type="text" value={formData.name_en || ''} onChange={e => setFormData({ ...formData, name_en: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-rose-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (Gujarati)</label>
              <input type="text" value={formData.name_gu || ''} onChange={e => setFormData({ ...formData, name_gu: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-rose-400 focus:outline-none font-gujarati" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={formData.category || 'facial'} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-rose-400 focus:outline-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input type="number" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-rose-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                <input type="number" value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })} className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-rose-400 focus:outline-none" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="text" value={formData.image_url || ''} onChange={e => setFormData({ ...formData, image_url: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-rose-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
              <textarea value={formData.description_en || ''} onChange={e => setFormData({ ...formData, description_en: e.target.value })} rows="3" className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-rose-400 focus:outline-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Gujarati)</label>
              <textarea value={formData.description_gu || ''} onChange={e => setFormData({ ...formData, description_gu: e.target.value })} rows="3" className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-rose-400 focus:outline-none font-gujarati"></textarea>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => { setEditingId(null); setIsAdding(false); }} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100" disabled={saving}>Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-green-500 hover:bg-green-600 shadow-sm disabled:opacity-70">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <span className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map(s => (
          <div key={s.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
            {s.image_url && <img src={s.image_url} alt={s.name_en} className="w-full h-32 object-cover" />}
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{s.category}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {s.active ? 'Active' : 'Hidden'}
                </span>
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">{s.name_en}</h3>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{s.description_en}</p>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-rose-600 font-bold text-lg">₹{s.price}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(s)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </AdminLayout>
  );
}
