import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Minus, Plus as PlusIcon, Upload, Images, Play } from 'lucide-react';
import { api, uploadFile } from '../../services/api';
import { UnitCategory } from '../../types';
import { resolveMediaUrl } from '../../utils/image';

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
  const [uploadingVideo, setUploadingVideo] = useState(false);
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

  const handleAddPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        urls.push(await uploadFile(file));
      }
      setPhotos(prev => [...prev, ...urls]);
    } catch {
      // handle error
    } finally {
      setUploading(false);
    }
  };

  const handleAddVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadingVideo(true);
    try {
      setVideoUrl(await uploadFile(file));
    } catch {
      // handle error
    } finally {
      setUploadingVideo(false);
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
          // Always send media fields on edit so clearing them persists
          // (the backend treats a missing field as "no change").
          photos,
          video_url: videoUrl,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-nyumba-ink/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-panel rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-7 relative shadow-lift border border-line animate-scale-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-fg/40 hover:text-fg/80 p-1.5 rounded-full hover:bg-slate-100 transition">
          <X size={20} />
        </button>
        <h3 className="text-lg font-bold text-fg mb-4">Manage Categories</h3>

        {loading ? (
          <p className="text-sm text-fg/40 text-center py-8">Loading...</p>
        ) : (
          <>
            {categories.length === 0 && !showForm && (
              <p className="text-sm text-fg/40 text-center py-8">No categories yet.</p>
            )}

            <div className="space-y-3 mb-6">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-3 bg-panel rounded-lg border border-line">
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-fg">{cat.name}</div>
                    <div className="text-xs text-fg/50">KES {Number(cat.rent_amount).toLocaleString()}</div>
                    <div className="text-xs text-fg/40">{cat.description}</div>
                    {(cat.photos?.length > 0 || cat.video_url) && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {cat.photos?.length > 0 && (
                          <span className="inline-flex items-center gap-1 bg-panel-strong text-fg/60 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            <Images size={10} />
                            {cat.photos.length} pic{cat.photos.length === 1 ? '' : 's'}
                          </span>
                        )}
                        {cat.video_url && (
                          <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            <Play size={10} className="fill-primary" />
                            Video
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 border rounded-lg px-2 py-1">
                      <button
                        onClick={() => handleAdjust(cat.id, -1)}
                        className="p-0.5 text-fg/40 hover:text-fg/80"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-bold w-6 text-center">{cat.quantity_available}</span>
                      <button
                        onClick={() => handleAdjust(cat.id, 1)}
                        className="p-0.5 text-fg/40 hover:text-fg/80"
                      >
                        <PlusIcon size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => openEdit(cat)}
                      className="text-xs text-primary hover:text-primary-dark font-medium"
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
                <h4 className="font-semibold text-sm text-fg/80">
                  {editingId ? 'Edit Category' : 'New Category'}
                </h4>
                <div>
                  <label className="block text-xs font-semibold text-fg/80 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1-Bedroom, Studio, 2-Bedroom"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full text-sm border border-line rounded-lg p-2.5 bg-panel text-fg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-fg/80 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Self-contained with balcony"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full text-sm border border-line rounded-lg p-2.5 bg-panel text-fg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-fg/80 mb-1">Monthly Rent (KES) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="25000"
                      value={rentAmount}
                      onChange={e => setRentAmount(e.target.value)}
                      className="w-full text-sm border border-line rounded-lg p-2.5 bg-panel text-fg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-fg/80 mb-1">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={quantityAvailable}
                      onChange={e => setQuantityAvailable(Number(e.target.value))}
                      className="w-full text-sm border border-line rounded-lg p-2.5 bg-panel text-fg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-fg/80 mb-1">
                    Pics &amp; Videos
                    <span className="font-normal text-fg/40 ml-1">(shown to tenants on this unit's card)</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {photos.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={resolveMediaUrl(url) ?? url} alt="" className="w-16 h-16 object-cover rounded-lg border border-line" />
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
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddPhotos}
                    className="hidden"
                    id="cat-photo-upload"
                    disabled={uploading}
                  />
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleAddVideoFile}
                    className="hidden"
                    id="cat-video-upload"
                    disabled={uploadingVideo}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <label
                      htmlFor="cat-photo-upload"
                      className={`inline-flex items-center gap-1.5 px-3 py-2 border border-line rounded-lg text-xs font-medium text-fg/60 hover:bg-panel-strong cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <Images size={14} />
                      {uploading ? 'Uploading…' : 'Upload pics'}
                    </label>
                    <label
                      htmlFor="cat-video-upload"
                      className={`inline-flex items-center gap-1.5 px-3 py-2 border border-line rounded-lg text-xs font-medium text-fg/60 hover:bg-panel-strong cursor-pointer ${uploadingVideo ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <Upload size={14} />
                      {uploadingVideo ? 'Uploading…' : 'Upload video'}
                    </label>
                    <span className="text-[10px] text-fg/30">or paste links below · videos max 50MB</span>
                    {videoUrl && (
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full">
                        <Play size={10} className="fill-primary" />
                        Video ready
                        <button type="button" onClick={() => setVideoUrl('')} className="text-fg/40 hover:text-red-500 ml-0.5">
                          <X size={11} />
                        </button>
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <input
                      type="text"
                      placeholder="Paste image URL"
                      value={photoInput}
                      onChange={e => setPhotoInput(e.target.value)}
                      className="flex-1 min-w-[140px] text-sm border border-line rounded-lg p-2 bg-panel text-fg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddPhotoUrl}
                      className="px-3 py-2 border border-line rounded-lg text-xs font-medium text-fg/60 hover:bg-panel-strong"
                    >
                      Add URL
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Video tour URL (YouTube, Vimeo, or direct link)"
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    className="w-full mt-2 text-sm border border-line rounded-lg p-2 bg-panel text-fg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="flex-1 btn-primary !py-2 disabled:opacity-60"
                  >
                    {submitting ? 'Saving...' : editingId ? 'Update' : 'Add Category'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 border border-line rounded-lg text-sm text-fg/60 hover:bg-panel-strong transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-line rounded-lg py-3 text-sm text-fg/50 hover:border-primary hover:text-primary transition"
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
