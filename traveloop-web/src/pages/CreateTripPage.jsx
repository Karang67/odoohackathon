import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Image, FileText, DollarSign, Upload, X, Check, ArrowLeft } from 'lucide-react';
import { useTripContext } from '../context/TripContext';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

const COVER_SUGGESTIONS = [
  'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
  'https://images.unsplash.com/photo-1546436836-07a91091f160?w=600&q=80',
  'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80',
];

export default function CreateTripPage() {
  const navigate = useNavigate();
  const { createTrip } = useTripContext();
  const fileRef = useRef();

  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    currency: 'USD',
    coverImage: COVER_SUGGESTIONS[0],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(COVER_SUGGESTIONS[0]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Trip name is required';
    if (!form.startDate) errs.startDate = 'Start date is required';
    if (!form.endDate) errs.endDate = 'End date is required';
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      errs.endDate = 'End date must be after start date';
    if (form.budget && isNaN(Number(form.budget)))
      errs.budget = 'Budget must be a number';
    return errs;
  };

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setForm((p) => ({ ...p, coverImage: url }));
  };

  const handleSuggestionSelect = (url) => {
    setPreviewUrl(url);
    setForm((p) => ({ ...p, coverImage: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const trip = createTrip({
      ...form,
      budget: Number(form.budget) || 0,
      coverImage: previewUrl,
    });
    setLoading(false);
    navigate(`/trips`);
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Trips
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create New Trip</h1>
          <p className="text-gray-400 text-sm mb-8">Fill in the details to start planning your adventure</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Image */}
            <div className="card overflow-hidden p-0">
              {/* Preview */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-4 right-4 flex items-center gap-2 glass text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/20 transition-all"
                >
                  <Upload size={15} />
                  Upload Photo
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>

              {/* Suggestions */}
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
                  <Image size={13} />
                  Or choose a suggested cover:
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {COVER_SUGGESTIONS.map((url) => (
                    <button
                      type="button"
                      key={url}
                      onClick={() => handleSuggestionSelect(url)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all ${previewUrl === url ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80'}`}
                    >
                      <img src={url} alt="suggestion" className="w-full h-full object-cover" />
                      {previewUrl === url && (
                        <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="card space-y-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                Trip Details
              </h2>

              <Input
                label="Trip Name"
                placeholder="e.g. Greek Island Hopping 🏝"
                value={form.title}
                onChange={handleChange('title')}
                error={errors.title}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={handleChange('description')}
                  placeholder="What's this trip about? Any special plans or highlights..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="card space-y-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                Travel Dates
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange('startDate')}
                  error={errors.startDate}
                  required
                />
                <Input
                  label="End Date"
                  type="date"
                  value={form.endDate}
                  onChange={handleChange('endDate')}
                  error={errors.endDate}
                  required
                />
              </div>
              {form.startDate && form.endDate && form.endDate >= form.startDate && (
                <div className="bg-primary/5 dark:bg-primary/10 rounded-xl px-4 py-3 text-sm text-primary font-medium">
                  ✈️ {Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24))} days trip
                </div>
              )}
            </div>

            {/* Budget */}
            <div className="card space-y-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <DollarSign size={18} className="text-primary" />
                Budget (Optional)
              </h2>
              <div className="flex gap-3">
                <div className="w-28">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Currency</label>
                  <select
                    value={form.currency}
                    onChange={handleChange('currency')}
                    className="input-field"
                  >
                    {['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'INR'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <Input
                    label="Total Budget"
                    type="number"
                    placeholder="e.g. 5000"
                    value={form.budget}
                    onChange={handleChange('budget')}
                    error={errors.budget}
                    icon={DollarSign}
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="flex-1"
              >
                <Check size={16} />
                Create Trip
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </MainLayout>
  );
}
