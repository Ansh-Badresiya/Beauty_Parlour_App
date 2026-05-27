import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, Upload, Loader } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
// import { demoGallery } from '../../data/demoData';

const CATEGORIES = ['bridal', 'mehendi', 'hairstyles', 'makeup'];
const CLOUDINARY_CLOUD_NAME = 'dh2k5zo5y';
const CLOUDINARY_UPLOAD_PRESET = 'krisha_beauty_parlour_uploads'; // Change this to your upload preset name if different

export default function AdminGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ category: 'bridal', image_url: '', caption: '', cloudinary_id: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleAdd = () => {
    setFormData({ category: 'bridal', image_url: '', caption: '', cloudinary_id: '' });
    setEditingId(null);
    setIsAdding(true);
    setPreviewUrl(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formDataUpload,
        }
      );

      const data = await response.json();
      if (data.secure_url && data.public_id) {
        setFormData(prev => ({ ...prev, image_url: data.secure_url, cloudinary_id: data.public_id }));
        console.log('✅ Image uploaded to Cloudinary:', data.secure_url);
        console.log('📁 Public ID:', data.public_id);
      } else {
        alert('Failed to upload image. Check your upload preset name.');
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      alert('Error uploading image to Cloudinary');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (image) => {
    setFormData(image);
    setEditingId(image.id);
    setIsAdding(false);
    setPreviewUrl(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isAdding) {
        // Validate image URL before saving
        if (!formData.image_url) {
          alert('Please upload an image first');
          setSaving(false);
          return;
        }
        
        console.log('💾 Saving to Firebase:', formData);
        const docRef = await addDoc(collection(db, 'gallery'), formData);
        console.log('✅ Document saved with ID:', docRef.id);
      } else {
        const { id, ...dataToUpdate } = formData;
        await updateDoc(doc(db, 'gallery', id), dataToUpdate);
      }
      await fetchGallery();
      setIsAdding(false);
      setEditingId(null);
      setFormData({ category: 'bridal', image_url: '', caption: '', cloudinary_id: '' });
      setPreviewUrl(null);
      alert('✅ Image saved successfully!');
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Error saving image: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, cloudinaryId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        // Delete from Cloudinary first
        if (cloudinaryId) {
          try {
            const deleteResponse = await fetch('/api/delete-cloudinary-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ public_id: cloudinaryId }),
            });
            const deleteResult = await deleteResponse.json();
            if (deleteResult.success) {
              console.log('✅ Image deleted from Cloudinary');
            } else {
              console.warn('⚠️ Could not delete from Cloudinary:', deleteResult.error);
            }
          } catch (cloudError) {
            console.error('Error deleting from Cloudinary:', cloudError);
          }
        }
        
        // Delete from Firebase
        await deleteDoc(doc(db, 'gallery', id));
        await fetchGallery();
        alert('Image deleted successfully!');
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Error deleting image");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Gallery</h1>
          <p className="text-sm text-gray-500">Upload and organize portfolio images</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Image</span>
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 border-t-4 border-t-purple-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">{isAdding ? 'Add New Image' : 'Edit Image'}</h2>
            <button onClick={() => { setIsAdding(false); setEditingId(null); setPreviewUrl(null); }} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">Upload Image (Cloudinary)</label>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-purple-300 rounded-xl bg-purple-50 cursor-pointer hover:border-purple-500 transition-colors">
                    <div className="flex items-center gap-2 text-purple-600">
                      <Upload className="w-5 h-5" />
                      <span className="text-sm font-medium">Choose Image</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
                {uploading && <Loader className="w-5 h-5 text-purple-600 animate-spin" />}
              </div>
              {formData.image_url && <p className="text-xs text-green-600 mt-2">✅ Image uploaded successfully</p>}
            </div>
            
            {(previewUrl || formData.image_url) && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                <img 
                  src={previewUrl || formData.image_url} 
                  alt="Preview" 
                  className="max-w-xs h-auto rounded-xl border border-gray-200 shadow-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
              <input type="text" value={formData.caption} onChange={e => setFormData({ ...formData, caption: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none" />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => { setIsAdding(false); setEditingId(null); setPreviewUrl(null); }} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100" disabled={saving}>Cancel</button>
            <button onClick={handleSave} disabled={saving || !formData.image_url} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-green-500 hover:bg-green-600 shadow-sm disabled:opacity-70">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : `${isAdding ? 'Add' : 'Update'} Image`}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <span className="w-10 h-10 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></span>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {gallery.map(img => (
          <div key={img.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <img src={img.image_url} alt={img.caption} className="w-full h-auto object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs font-semibold px-2 py-1 bg-white/20 text-white rounded-full backdrop-blur-sm">
                  {img.category}
                </span>
                <div className="flex gap-1.5">
                  <button onClick={() => handleEdit(img)} className="p-1.5 bg-blue-500/80 text-white rounded-lg hover:bg-blue-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(img.id, img.cloudinary_id)} className="p-1.5 bg-red-500/80 text-white rounded-lg hover:bg-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {img.caption && <span className="text-white text-sm font-medium truncate">{img.caption}</span>}
            </div>
          </div>
        ))}
      </div>
      )}
    </AdminLayout>
  );
}
