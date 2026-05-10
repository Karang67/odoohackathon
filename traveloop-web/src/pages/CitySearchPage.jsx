import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, DollarSign, Clock, Plus, Check, Globe, MapPin } from 'lucide-react';
import { mockDestinations, REGIONS } from '../data/mockData';
import MainLayout from '../layouts/MainLayout';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';

export default function CitySearchPage() {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [added, setAdded] = useState(new Set());

  const filtered = mockDestinations
    .filter((d) => {
      const q = query.toLowerCase();
      const matchQ = d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);
      const matchR = region === 'All' || d.region === region;
      return matchQ && matchR;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'cost_asc') return a.costPerDay - b.costPerDay;
      if (sortBy === 'cost_desc') return b.costPerDay - a.costPerDay;
      return 0;
    });

  const handleAdd = (dest) => {
    setAdded((p) => new Set([...p, dest.id]));
    toast.success(`${dest.name} added to your trip!`);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Discover Cities</h1>
          <p className="text-sm text-gray-400">Find your next destination from 195+ countries</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cities or countries..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-3 py-2 text-xs font-medium rounded-xl transition-all ${
                  region === r
                    ? 'bg-primary text-white shadow-primary'
                    : 'bg-white dark:bg-surface-dark-card text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-surface-dark-border hover:border-primary/30'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-auto"
          >
            <option value="rating">Top Rated</option>
            <option value="cost_asc">Cheapest</option>
            <option value="cost_desc">Most Expensive</option>
          </select>
        </div>

        {/* Result count */}
        <p className="text-xs text-gray-400 mb-4">{filtered.length} destinations found</p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((dest, idx) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="card overflow-hidden group hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 flex items-center gap-1 glass rounded-full px-2.5 py-1 text-white text-xs font-medium">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    {dest.rating}
                    <span className="text-white/60">({dest.reviewCount.toLocaleString()})</span>
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    {dest.tags.map((tag) => (
                      <span key={tag} className="glass text-white text-xs px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{dest.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <MapPin size={11} className="text-primary" />
                        {dest.country} · {dest.region}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-primary font-bold text-sm">${dest.costPerDay}</p>
                      <p className="text-xs text-gray-400">/day</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{dest.description}</p>

                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Clock size={11} />Best: {dest.bestTime}</span>
                    <span className="flex items-center gap-1">🌡️ {dest.temperature}</span>
                  </div>

                  <Button
                    variant={added.has(dest.id) ? 'success' : 'primary'}
                    size="sm"
                    className="w-full"
                    icon={added.has(dest.id) ? Check : Plus}
                    onClick={() => !added.has(dest.id) && handleAdd(dest)}
                    disabled={added.has(dest.id)}
                  >
                    {added.has(dest.id) ? 'Added to Trip' : 'Add to Trip'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Globe}
            title="No destinations found"
            description="Try a different search or region filter"
          />
        )}
      </div>
    </MainLayout>
  );
}
