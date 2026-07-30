import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Minus, Plus as PlusIcon, Upload } from 'lucide-react';
import { api, uploadFile } from '../../services/api';
import { UnitCategory } from '../../types';

interface Props {
  propertyId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const CategoryManager: React.FC<Props> = ({ propertyId, onClose, onSuccess }) => {
  const [categories, setCategories] = useState<UnitCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [quantityAvailable, setQuantityAvailable] = useState(1);
  const [photos, setPhotos] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [photoInput, setPhotoInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const props = await api.getLandlordProperties();
      const prop = props.find(p => p.id === propertyId);
      setCategories(prop?.categories || []);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, [propertyId]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setRentAmount('');
    setQuantityAvailable(1);
    setPhotos([]);
    setVideoUrl('');
    setPhotoInput('');
    setShowForm(false);
    setEditingId(null);
  };

  const openEdit = (cat: UnitCategory) => {
    setName(cat.name);
    setDescription(cat.description || '');
    setRentAmount(String(cat.rent_amount));
    setQuantityAvailable(cat.quantity_available);
    setPhotos(cat.photos || []);
    setVideoUrl(cat.video_url || '');
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setPhotos(prev => [...prev, url]);
    } catch {
      // handle error
    } finally {
      setUploading(false);
    }
  };

  const handleAddPhotoUrl = () => {
    if (photoInput.trim()) {
      setPhotos(prev => [...prev, photoInput.trim()]);
      setPhotoInput('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rentAmount) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await api.updateCategory(editingId, {
          name: name || undefined,
          description: description || undefined,
          rent_amount: Number(rentAmount) || undefined,
          quantity_available: quantityAvailable || undefined,
          photos: photos.length > 0 ? photos : undefined,
          video_url: videoUrl || undefined,
        });
      } else {
        await api.addCategory(propertyId, {
          name,
          description: description || undefined,
          rent_amount: Number(rentAmount),
          quantity_available: quantityAvailable,
          photos: photos.length > 0 ? photos : undefined,
          video_url: videoUrl || undefined,
        });
      }
      resetForm();
      onSuccess();
      await loadCategories();
    } catch {
      // handle error
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (catId: string) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.deleteCategory(catId);
      onSuccess();
      await loadCategories();
    } catch {
      // handle error
    }
  };

  const handleAdjust = async (catId: string, delta: number) => {
    try {
      await api.adjustQuantity(catId, delta);
      await loadCategories();
    } catch {
      // handle error
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 relative shadow-2xl border border-slate-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
          <X size={20} />
        </button>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Manage Categories</h3>

        {loading ? (
          <p className="text-sm text-slate-400 text-center py-8">Loading...</p>
        ) : (
          <>
            {categories.length === 0 && !showForm && (
              <p className="text-sm text-slate-400 text-center py-8">No categories yet.</p>
            )}

            <div className="space-y-3 mb-6">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-slate-900">{cat.name}</div>
                    <div className="text-xs text-slate-500">KES {Number(cat.rent_amount).toLocaleString()}</div>
                    <div className="text-xs text-slate-400">{cat.description}</div>
                    {cat.photos && cat.photos.length > 0 && (
                      <div className="text-[10px] text-slate-400 mt-1">{cat.photos.length} photo(s)</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 border rounded-lg px-2 py-1">
                      <button
                        onClick={() => handleAdjust(cat.id, -1)}
                        className="p-0.5 text-slate-400 hover:text-slate-700"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-bold w-6 text-center">{cat.quantity_available}</span>
                      <button
                        onClick={() => handleAdjust(cat.id, 1)}
                        className="p-0.5 text-slate-400 hover:text-slate-700"
                      >
                        <PlusIcon size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => openEdit(cat)}
                      className="text-xs text-emerald-600 hover:text-emerald-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showForm ? (
              <form onSubmit={handleSubmit} className="border-t pt-4 space-y-3">
                <h4 className="font-semibold text-sm text-slate-700">
                  {editingId ? 'Edit Category' : 'New Category'}
                </h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1-Bedroom, Studio, 2-Bedroom"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Self-contained with balcony"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Rent (KES) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="25000"
                      value={rentAmount}
                      onChange={e => setRentAmount(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={quantityAvailable}
                      onChange={e => setQuantityAvailable(Number(e.target.value))}
                      className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Photos</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {photos.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(i)}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={photoInput}
                      onChange={e => setPhotoInput(e.target.value)}
                      className="flex-1 text-sm border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddPhotoUrl}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Add URL
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAddPhoto}
                      className="hidden"
                      id="cat-photo-upload"
                    />
                    <label
                      htmlFor="cat-photo-upload"
                      className={`px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer ${uploading ? 'opacity-50' : ''}`}
                    >
                      <Upload size={16} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Video Tour URL</label>
                  <input
                    type="text"
                    placeholder="https://youtube.com/..."
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="flex-1 bg-nyumba-emerald hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold py-2 rounded-lg text-sm transition"
                  >
                    {submitting ? 'Saving...' : editingId ? 'Update' : 'Add Category'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg py-3 text-sm text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition"
              >
                <Plus size={16} />
                Add Category
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
