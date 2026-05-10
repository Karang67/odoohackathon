import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Clock, DollarSign, MapPin, GripVertical,
  Check, Edit2, ChevronDown, ChevronUp, Calendar, Map,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { mockItinerary } from '../data/mockData';
import toast from 'react-hot-toast';

const ACTIVITY_TYPES = ['Sightseeing', 'Food', 'Transport', 'Culture', 'Adventure', 'Shopping', 'Wellness', 'Logistics'];
const TYPE_COLORS = {
  Sightseeing: 'bg-blue-100 text-blue-700',
  Food: 'bg-orange-100 text-orange-700',
  Transport: 'bg-gray-100 text-gray-600',
  Culture: 'bg-purple-100 text-purple-700',
  Adventure: 'bg-red-100 text-red-700',
  Shopping: 'bg-pink-100 text-pink-700',
  Wellness: 'bg-green-100 text-green-700',
  Logistics: 'bg-yellow-100 text-yellow-700',
};

function ActivityRow({ activity, onDelete, onEdit }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 group transition-all">
      <div className="flex-shrink-0 mt-1 text-gray-300 dark:text-gray-600 cursor-grab">
        <GripVertical size={16} />
      </div>
      <div className="w-16 text-xs font-medium text-primary bg-primary/5 px-2 py-1 rounded-lg text-center flex-shrink-0">
        {activity.time}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{activity.name}</p>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[activity.type] || 'bg-gray-100 text-gray-600'}`}>
            {activity.type}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Clock size={11} />{activity.duration}</span>
          {activity.cost > 0 && <span className="flex items-center gap-1"><DollarSign size={11} />${activity.cost}</span>}
          {activity.notes && <span className="italic truncate max-w-[120px]">{activity.notes}</span>}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(activity)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
          <Edit2 size={13} />
        </button>
        <button onClick={() => onDelete(activity.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

function DayCard({ day, onAddActivity, onDeleteActivity, onEditActivity }) {
  const [collapsed, setCollapsed] = useState(false);
  const totalCost = day.activities.reduce((sum, a) => sum + (a.cost || 0), 0);

  return (
    <div className="card overflow-hidden">
      {/* Day Header */}
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {day.dayNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">Day {day.dayNumber}</h3>
              <span className="text-gray-400 text-sm">·</span>
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin size={13} className="text-primary" />
                {day.city}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
              <span className="flex items-center gap-1"><Calendar size={11} />{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              <span className="flex items-center gap-1"><DollarSign size={11} />Est. ${totalCost}</span>
              <span>{day.activities.length} activities</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onAddActivity(day.id); }}
            className="p-1.5 rounded-lg text-primary bg-primary/5 hover:bg-primary/10 transition-all"
          >
            <Plus size={14} />
          </button>
          {collapsed ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronUp size={16} className="text-gray-400" />}
        </div>
      </div>

      {/* Activities */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 dark:border-surface-dark-border px-3 pb-3 pt-1">
              {day.activities.length > 0 ? (
                <div className="space-y-1">
                  {day.activities.map((act) => (
                    <ActivityRow
                      key={act.id}
                      activity={act}
                      onDelete={onDeleteActivity}
                      onEdit={onEditActivity}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-400 mb-2">No activities planned yet</p>
                  <button
                    onClick={() => onAddActivity(day.id)}
                    className="text-xs text-primary font-medium hover:underline flex items-center gap-1 mx-auto"
                  >
                    <Plus size={12} />Add first activity
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ItineraryBuilder() {
  const [itinerary, setItinerary] = useState(mockItinerary);
  const [addingActivity, setAddingActivity] = useState(null); // dayId
  const [newActivity, setNewActivity] = useState({ name: '', time: '09:00', type: 'Sightseeing', duration: '1h', cost: 0, notes: '' });
  const [editingActivity, setEditingActivity] = useState(null);
  const [addingDay, setAddingDay] = useState(false);
  const [newCity, setNewCity] = useState('');
  const [newDate, setNewDate] = useState('');

  const handleAddActivity = (dayId) => {
    setAddingActivity(dayId);
    setNewActivity({ name: '', time: '09:00', type: 'Sightseeing', duration: '1h', cost: 0, notes: '' });
  };

  const handleSaveActivity = () => {
    if (!newActivity.name.trim()) { toast.error('Activity name required'); return; }
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map((d) => d.id === addingActivity
        ? { ...d, activities: [...d.activities, { ...newActivity, id: Date.now(), cost: Number(newActivity.cost) }] }
        : d
      ),
    }));
    setAddingActivity(null);
    toast.success('Activity added!');
  };

  const handleDeleteActivity = (actId) => {
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map((d) => ({
        ...d,
        activities: d.activities.filter((a) => a.id !== actId),
      })),
    }));
    toast.success('Activity removed');
  };

  const handleEditActivity = (activity) => setEditingActivity({ ...activity });

  const handleSaveEdit = () => {
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map((d) => ({
        ...d,
        activities: d.activities.map((a) => a.id === editingActivity.id ? { ...editingActivity, cost: Number(editingActivity.cost) } : a),
      })),
    }));
    setEditingActivity(null);
    toast.success('Activity updated!');
  };

  const handleAddDay = () => {
    if (!newCity.trim() || !newDate) { toast.error('City and date are required'); return; }
    setItinerary((prev) => ({
      ...prev,
      days: [...prev.days, {
        id: Date.now(),
        date: newDate,
        city: newCity,
        dayNumber: prev.days.length + 1,
        activities: [],
        estimatedCost: 0,
        accommodation: '',
      }],
    }));
    setAddingDay(false);
    setNewCity('');
    setNewDate('');
    toast.success('Day added!');
  };

  const totalBudget = itinerary.days.reduce((sum, d) => sum + d.activities.reduce((s, a) => s + (a.cost || 0), 0), 0);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Itinerary Builder</h1>
            <p className="text-sm text-gray-400 mt-0.5">{itinerary.days.length} days · Est. ${totalBudget} total</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" onClick={() => setAddingDay(true)} icon={Plus}>
              Add Day
            </Button>
            <Button variant="primary" size="sm" icon={Check} onClick={() => toast.success('Itinerary saved!')}>
              Save
            </Button>
          </div>
        </div>

        {/* Summary Bar */}
        <div className="card p-4 mb-6 grid grid-cols-3 gap-4">
          {[
            { label: 'Total Days', value: itinerary.days.length, icon: Calendar, color: 'text-primary' },
            { label: 'Activities', value: itinerary.days.reduce((s, d) => s + d.activities.length, 0), icon: Map, color: 'text-blue-500' },
            { label: 'Est. Cost', value: `$${totalBudget}`, icon: DollarSign, color: 'text-emerald-500' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="text-center">
              <Icon size={18} className={`${color} mx-auto mb-1`} />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="space-y-4">
          {itinerary.days.map((day) => (
            <DayCard
              key={day.id}
              day={day}
              onAddActivity={handleAddActivity}
              onDeleteActivity={handleDeleteActivity}
              onEditActivity={handleEditActivity}
            />
          ))}
        </div>

        {/* Add Activity Modal */}
        {addingActivity && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-surface-dark-card rounded-2xl p-6 w-full max-w-md shadow-float border border-gray-100 dark:border-surface-dark-border"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Activity</h3>
              <div className="space-y-3">
                <input className="input-field" placeholder="Activity name *" value={newActivity.name} onChange={(e) => setNewActivity((p) => ({ ...p, name: e.target.value }))} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="time" className="input-field" value={newActivity.time} onChange={(e) => setNewActivity((p) => ({ ...p, time: e.target.value }))} />
                  <select className="input-field" value={newActivity.type} onChange={(e) => setNewActivity((p) => ({ ...p, type: e.target.value }))}>
                    {ACTIVITY_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input className="input-field" placeholder="Duration (e.g. 2h)" value={newActivity.duration} onChange={(e) => setNewActivity((p) => ({ ...p, duration: e.target.value }))} />
                  <input type="number" className="input-field" placeholder="Cost ($)" min="0" value={newActivity.cost} onChange={(e) => setNewActivity((p) => ({ ...p, cost: e.target.value }))} />
                </div>
                <input className="input-field" placeholder="Notes (optional)" value={newActivity.notes} onChange={(e) => setNewActivity((p) => ({ ...p, notes: e.target.value }))} />
              </div>
              <div className="flex gap-3 mt-5">
                <Button variant="secondary" className="flex-1" onClick={() => setAddingActivity(null)}>Cancel</Button>
                <Button variant="primary" className="flex-1" onClick={handleSaveActivity} icon={Plus}>Add Activity</Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Activity Modal */}
        {editingActivity && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-surface-dark-card rounded-2xl p-6 w-full max-w-md shadow-float border border-gray-100 dark:border-surface-dark-border"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Activity</h3>
              <div className="space-y-3">
                <input className="input-field" value={editingActivity.name} onChange={(e) => setEditingActivity((p) => ({ ...p, name: e.target.value }))} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="time" className="input-field" value={editingActivity.time} onChange={(e) => setEditingActivity((p) => ({ ...p, time: e.target.value }))} />
                  <select className="input-field" value={editingActivity.type} onChange={(e) => setEditingActivity((p) => ({ ...p, type: e.target.value }))}>
                    {ACTIVITY_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input className="input-field" value={editingActivity.duration} onChange={(e) => setEditingActivity((p) => ({ ...p, duration: e.target.value }))} />
                  <input type="number" className="input-field" min="0" value={editingActivity.cost} onChange={(e) => setEditingActivity((p) => ({ ...p, cost: e.target.value }))} />
                </div>
                <input className="input-field" value={editingActivity.notes} onChange={(e) => setEditingActivity((p) => ({ ...p, notes: e.target.value }))} />
              </div>
              <div className="flex gap-3 mt-5">
                <Button variant="secondary" className="flex-1" onClick={() => setEditingActivity(null)}>Cancel</Button>
                <Button variant="primary" className="flex-1" onClick={handleSaveEdit} icon={Check}>Save</Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Day Modal */}
        {addingDay && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-surface-dark-card rounded-2xl p-6 w-full max-w-sm shadow-float border border-gray-100 dark:border-surface-dark-border"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Day</h3>
              <div className="space-y-3">
                <input className="input-field" placeholder="City name *" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
                <input type="date" className="input-field" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
              </div>
              <div className="flex gap-3 mt-5">
                <Button variant="secondary" className="flex-1" onClick={() => setAddingDay(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1" onClick={handleAddDay} icon={Plus}>Add Day</Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
