import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon, BuildingIcon, UploadIcon, EditIcon } from '../../utils/icons';
import { api, uploadFile } from '../../services/api';
import { Property } from '../../types';

const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay',
  'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii',
  'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', "Murang'a", 'Nairobi', 'Nakuru', 'Nandi',
  'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
  'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  landlordId: string;
  onSuccess: () => void;
  property?: Property | null;
}

export const AddPropertyModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, property }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [county, setCounty] = useState('');
  const [address, setAddress] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!property;

  useEffect(() => {
    if (property) {
      setName(property.name);
      setLocation(property.location);
      setCounty(property.county || '');
      setAddress(property.address || '');
      setMapsUrl(property.maps_url || '');
      setDescription(property.description || '');
      setImageUrl(property.image_url || '');
    } else {
      setName('');
      setLocation('');
      setCounty('');
      setAddress('');
      setMapsUrl('');
      setDescription('');
      setImageUrl('');
    }
  }, [property, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setImageUrl(url);
    } catch {
      // handle error
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data = {
        name: name || undefined,
        location: location || undefined,
        county: county || undefined,
        address: address || undefined,
        maps_url: mapsUrl || undefined,
        description: description || undefined,
        image_url: imageUrl || undefined,
      };

      if (isEdit && property) {
        await api.updateProperty(property.id, data);
      } else {
        await api.addProperty(data as any);
      }
      onSuccess();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Failed to save property');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-nyumba-ink/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-panel rounded-2xl max-w-lg w-full p-6 sm:p-7 relative shadow-lift border border-line animate-scale-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-fg/40 hover:text-fg/80 p-1.5 rounded-full hover:bg-panel-strong transition">
          <CloseIcon />
        </button>
        <div className="flex items-center gap-2 mb-4">
          {isEdit ? <EditIcon className="text-primary" size={22} /> : <BuildingIcon className="text-primary" size={22} />}
          <h3 className="text-lg font-bold text-fg">{isEdit ? 'Edit Property' : 'Add New Property'}</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-fg/80 mb-1">Property Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Westlands Crest Apartments"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-sm border border-line rounded-lg p-2.5 bg-panel text-fg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-fg/80 mb-1">Location *</label>
            <input
              type="text"
              required
              placeholder="e.g. Kilimani, Nairobi"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full text-sm border border-line rounded-lg p-2.5 bg-panel text-fg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-fg/80 mb-1">County</label>
            <select
              value={county}
              onChange={e => setCounty(e.target.value)}
              className="w-full text-sm border border-line rounded-lg p-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-panel text-fg"
            >
              <option value="">Select county</option>
              {KENYA_COUNTIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-fg/80 mb-1">Address / Landmark</label>
            <input
              type="text"
              placeholder="e.g. Off Ngong Road"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full text-sm border border-line rounded-lg p-2.5 bg-panel text-fg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-fg/80 mb-1">Google Maps URL</label>
            <input
              type="text"
              placeholder="https://maps.google.com/..."
              value={mapsUrl}
              onChange={e => setMapsUrl(e.target.value)}
              className="w-full text-sm border border-line rounded-lg p-2.5 bg-panel text-fg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-fg/80 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Water supply, security, parking..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full text-sm border border-line rounded-lg p-2.5 bg-panel text-fg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-fg/80 mb-1">Main Image</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="w-full text-sm border border-line rounded-lg p-2.5 bg-panel text-fg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-2.5 border border-line rounded-lg text-xs font-medium text-fg/60 hover:bg-panel-strong transition"
              >
                <UploadIcon size={16} />
              </button>
            </div>
          </div>
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">{error}</div>
          )}
          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full btn-primary !py-2.5 disabled:opacity-60"
          >
            {submitting ? 'Saving...' : isEdit ? 'Update Property' : 'Save Property'}
          </button>
        </form>
      </div>
    </div>
  );
};
