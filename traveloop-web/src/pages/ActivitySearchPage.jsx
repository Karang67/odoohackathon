import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Clock, DollarSign, Plus, Check, Filter } from 'lucide-react';
import { mockActivities, ACTIVITY_CATEGORIES } from '../data/mockData';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';

export default function ActivitySearchPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [added, setAdded] = useState(new Set());

  const filtered = mockActivities.filter((a) => {
    const q = query.toLowerCase();
    const matchQ = a.name.toLowerCase().includes(q) || a.city.toLowerCase().includes(q);
    const matchC = category === 'All' || a.category === category;
    return matchQ && matchC;
  });

  const handleAdd = (act) => {
    setAdded((p) => new Set([...p, act.id]));
    toast.success(`"${act.name}" added!`);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Discover Activities</h1>
          <p className="text-sm text-gray-400">Find unique experiences for your trip</p>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search activities or cities..." className="input-field pl-10" />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {ACTIVITY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                category === cat ? 'bg-primary text-white shadow-primary' : 'bg-white dark:bg-surface-dark-card text-gray-500 border border-gray-200 dark:border-surface-dark-border hover:border-primary/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Activities grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((act, idx) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="card overflow-hidden group hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={act.image} alt={act.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="glass text-white text-xs font-medium px-2.5 py-1 rounded-full">{act.category}</span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 glass rounded-full px-2.5 py-1 text-white text-xs">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    {act.rating}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1.5">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{act.name}</h3>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-primary font-bold text-sm">${act.price}</p>
                      <p className="text-xs text-gray-400">per person</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{act.city}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{act.description}</p>

                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Clock size={11} />{act.duration}</span>
                    <span className="text-gray-200 dark:text-gray-700">·</span>
                    <span>{act.reviewCount.toLocaleString()} reviews</span>
                  </div>

                  {act.included?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {act.included.map((inc) => (
                        <span key={inc} className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check size={9} />
                          {inc}
                        </span>
                      ))}
                    </div>
                  )}

                  <Button
                    variant={added.has(act.id) ? 'success' : 'primary'}
                    size="sm"
                    className="w-full"
                    icon={added.has(act.id) ? Check : Plus}
                    onClick={() => !added.has(act.id) && handleAdd(act)}
                    disabled={added.has(act.id)}
                  >
                    {added.has(act.id) ? 'Added' : 'Add to Itinerary'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Search} title="No activities found" description="Try a different search or category filter" />
        )}
      </div>
    </MainLayout>
  );
}
