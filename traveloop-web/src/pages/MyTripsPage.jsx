import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Calendar, DollarSign, Trash2, Edit2, Eye,
  Map, Share2, MoreVertical, Clock, X, Check,
} from 'lucide-react';
import { useTripContext } from '../context/TripContext';
import MainLayout from '../layouts/MainLayout';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { TRIP_STATUSES } from '../data/mockData';
import toast from 'react-hot-toast';

function TripCard({ trip, onDelete, onEdit }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const pct = trip.budget > 0 ? Math.min(100, Math.round((trip.spent / trip.budget) * 100)) : 0;
  const barColor = pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-amber-500' : 'bg-gradient-primary';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card overflow-hidden group hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
    >
      {/* Cover Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={trip.status}>{trip.status}</Badge>
        </div>

        {/* Actions menu */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              className="w-8 h-8 glass text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <MoreVertical size={14} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 4 }}
                  className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-surface-dark-card rounded-xl shadow-float border border-gray-100 dark:border-surface-dark-border overflow-hidden z-20"
                >
                  <button
                    onClick={() => { navigate(`/trips/${trip.id}`); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <Eye size={14} className="text-primary" /> View Trip
                  </button>
                  <button
                    onClick={() => { onEdit(trip); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <Edit2 size={14} className="text-blue-500" /> Edit Trip
                  </button>
                  <button
                    onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/shared/${trip.id}`); toast.success('Share link copied!'); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <Share2 size={14} className="text-emerald-500" /> Share Trip
                  </button>
                  <button
                    onClick={() => { onDelete(trip.id); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    <Trash2 size={14} /> Delete Trip
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {trip.daysLeft > 0 && (
          <div className="absolute bottom-3 left-3 glass text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock size={11} />
            {trip.daysLeft} days to go
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{trip.title}</h3>
        {trip.description && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-3">{trip.description}</p>
        )}

        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          {trip.stops?.length > 0 && (
            <span className="flex items-center gap-1">
              <Map size={12} />
              {trip.stops.length} stops
            </span>
          )}
          {trip.budget > 0 && (
            <span className="flex items-center gap-1">
              <DollarSign size={12} />
              ${trip.budget.toLocaleString()} budget
            </span>
          )}
        </div>

        {/* Budget bar */}
        {trip.budget > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Spent</span>
              <span className={`font-medium ${pct > 90 ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
                {pct}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/trips/${trip.id}`)}
            icon={Eye}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => navigate('/itinerary')}
            icon={Map}
          >
            Itinerary
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function MyTripsPage() {
  const navigate = useNavigate();
  const { trips, deleteTrip, updateTrip } = useTripContext();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editTrip, setEditTrip] = useState(null);

  const filtered = trips.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleDelete = (id) => setDeleteConfirm(id);
  const confirmDelete = () => { deleteTrip(deleteConfirm); setDeleteConfirm(null); };
  const handleEdit = (trip) => setEditTrip({ ...trip });
  const handleEditSave = () => { updateTrip(editTrip.id, editTrip); setEditTrip(null); };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Trips</h1>
            <p className="text-sm text-gray-400 mt-0.5">{trips.length} trip{trips.length !== 1 ? 's' : ''} total</p>
          </div>
          <Button variant="primary" onClick={() => navigate('/trips/create')} icon={Plus}>
            New Trip
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trips..."
              className="input-field pl-10"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="flex gap-2 flex-wrap">
            {TRIP_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 text-xs font-medium rounded-xl transition-all capitalize ${
                  filterStatus === s
                    ? 'bg-primary text-white shadow-primary'
                    : 'bg-white dark:bg-surface-dark-card text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-surface-dark-border hover:border-primary/30 hover:text-primary'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Trip Grid */}
        {filtered.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {filtered.map((trip) => (
                <TripCard key={trip.id} trip={trip} onDelete={handleDelete} onEdit={handleEdit} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState
            icon={Map}
            title={search ? `No trips matching "${search}"` : 'No trips found'}
            description={search ? 'Try a different search term' : "You haven't created any trips yet. Start planning!"}
            action={
              !search && (
                <Button variant="primary" onClick={() => navigate('/trips/create')} icon={Plus}>
                  Create Your First Trip
                </Button>
              )
            }
          />
        )}

        {/* Delete Confirm Modal */}
        <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Trip" size="sm">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Are you sure you want to delete this trip? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="danger" className="flex-1" onClick={confirmDelete} icon={Trash2}>Delete</Button>
            </div>
          </div>
        </Modal>

        {/* Edit Modal */}
        <Modal isOpen={!!editTrip} onClose={() => setEditTrip(null)} title="Edit Trip">
          {editTrip && (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Trip Name</label>
                <input
                  className="input-field"
                  value={editTrip.title}
                  onChange={(e) => setEditTrip((p) => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                <select
                  className="input-field"
                  value={editTrip.status}
                  onChange={(e) => setEditTrip((p) => ({ ...p, status: e.target.value }))}
                >
                  {['planning', 'upcoming', 'ongoing', 'completed'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  value={editTrip.description}
                  onChange={(e) => setEditTrip((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" onClick={() => setEditTrip(null)}>Cancel</Button>
                <Button variant="primary" className="flex-1" onClick={handleEditSave} icon={Check}>Save Changes</Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
}
