import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
// import { demoOffers } from '../../data/demoData';

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchOffers = async () => {
    try {
      const snap = await getDocs(collection(db, 'offers'));
      setOffers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleEdit = (offer) => {
    setFormData(offer);
    setEditingId(offer.id);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setFormData({
      title_en: '', title_gu: '',
      description_en: '', description_gu: '',
      price: '', original_price: '',
      valid_till: '', image_url: '', active: true
    });
    setEditingId(null);
    setIsAdding(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isAdding) {
        await addDoc(collection(db, 'offers'), formData);
      } else {
        const { id, ...dataToUpdate } = formData;
        await updateDoc(doc(db, 'offers', id), dataToUpdate);
      }
      await fetchOffers();
      setEditingId(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Error saving offer:", error);
      alert("Error saving offer");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await deleteDoc(doc(db, 'offers', id));
        await fetchOffers();
      } catch (error) {
        console.error("Error deleting offer:", error);
        alert("Error deleting offer");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Offers</h1>
          <p className="text-sm text-gray-500">Create or edit seasonal discounts and packages</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Offer</span>
        </button>
      </div>

      {(editingId || isAdding) && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">{isAdding ? 'Add New Offer' : 'Edit Offer'}</h2>
            <button onClick={() => { setEditingId(null); setIsAdding(false); }} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
              <input type="text" value={formData.title_en || ''} onChange={e => setFormData({ ...formData, title_en: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (Gujarati)</label>
              <input type="text" value={formData.title_gu || ''} onChange={e => setFormData({ ...formData, title_gu: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none font-gujarati" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price</label>
                <input type="number" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                <input type="number" value={formData.original_price || ''} onChange={e => setFormData({ ...formData, original_price: Number(e.target.value) })} className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid Till Date</label>
              <input type="date" value={formData.valid_till || ''} onChange={e => setFormData({ ...formData, valid_till: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="text" value={formData.image_url || ''} onChange={e => setFormData({ ...formData, image_url: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
              <textarea value={formData.description_en || ''} onChange={e => setFormData({ ...formData, description_en: e.target.value })} rows="2" className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Gujarati)</label>
              <textarea value={formData.description_gu || ''} onChange={e => setFormData({ ...formData, description_gu: e.target.value })} rows="2" className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none font-gujarati"></textarea>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => { setEditingId(null); setIsAdding(false); }} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100" disabled={saving}>Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-green-500 hover:bg-green-600 shadow-sm disabled:opacity-70">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Offer'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <span className="w-10 h-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {offers.map(o => (
          <div key={o.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
            {o.image_url && <img src={o.image_url} alt={o.title_en} className="w-full h-40 object-cover" />}
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-gray-800 text-lg mb-1">{o.title_en}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{o.description_en}</p>
              
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-4">
                <div>
                  <span className="text-xs text-gray-400 block">Offer Price</span>
                  <span className="text-rose-600 font-bold">₹{o.price}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Original</span>
                  <span className="text-gray-400 line-through">₹{o.original_price}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-auto">
                <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2.5 py-1 rounded-full">
                  Valid: {o.valid_till}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(o)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(o.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
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
