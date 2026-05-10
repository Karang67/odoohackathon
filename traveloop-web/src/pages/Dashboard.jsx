import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Map, DollarSign, Calendar, ArrowRight, TrendingUp,
  Globe, Plus, Star, Clock, ChevronRight, Plane, CheckCircle,
} from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { useTripContext } from '../context/TripContext';
import { mockDestinations, mockStats } from '../data/mockData';
import MainLayout from '../layouts/MainLayout';
import Badge from '../components/common/Badge';
import { SkeletonStatCard, SkeletonTripCard } from '../components/common/Skeleton';

// Stat Card
function StatCard({ label, value, icon: Icon, color, trend, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card-hover p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={17} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
      {trend && (
        <div className="flex items-center gap-1 text-xs text-emerald-500">
          <TrendingUp size={12} />
          <span>{trend}</span>
        </div>
      )}
    </motion.div>
  );
}

// Trip Card
function TripCard({ trip, delay = 0 }) {
  const navigate = useNavigate();
  const statusVariant = { upcoming: 'upcoming', ongoing: 'ongoing', completed: 'completed', planning: 'planning' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card group overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300"
      onClick={() => navigate(`/trips/${trip.id}`)}
    >
      <div className="relative h-36 overflow-hidden rounded-xl mb-4">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge variant={statusVariant[trip.status] || 'gray'}>{trip.status}</Badge>
        </div>
        {trip.daysLeft > 0 && (
          <div className="absolute bottom-3 right-3 glass text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock size={11} />
            {trip.daysLeft}d to go
          </div>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{trip.title}</h3>
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
        <Calendar size={12} />
        <span>{new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
      {/* Budget bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-400">Budget used</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            ${trip.spent?.toLocaleString()} / ${trip.budget?.toLocaleString()}
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-primary rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, (trip.spent / trip.budget) * 100)}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// Recommended Card
function RecommendedCard({ dest, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer group"
    >
      <img src={dest.image} alt={dest.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{dest.name}</p>
        <p className="text-xs text-gray-400">{dest.country}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Star size={11} className="fill-amber-400 text-amber-400" />
          <span className="text-xs text-gray-500">{dest.rating}</span>
          <span className="text-xs text-gray-300 dark:text-gray-600 mx-1">·</span>
          <span className="text-xs text-primary font-medium">${dest.costPerDay}/day</span>
        </div>
      </div>
      <ChevronRight size={15} className="text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors flex-shrink-0" />
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuthContext();
  const { trips } = useTripContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const upcomingTrips = trips.filter((t) => t.status === 'upcoming' || t.status === 'planning').slice(0, 3);
  const completedCount = trips.filter((t) => t.status === 'completed').length;

  const stats = [
    { label: 'Total Trips', value: trips.length, icon: Map, color: 'bg-gradient-primary', trend: '+2 this year' },
    { label: 'Countries Visited', value: user?.stats?.countriesVisited ?? 12, icon: Globe, color: 'bg-gradient-to-br from-blue-500 to-cyan-500', trend: '+3 this year' },
    { label: 'Days Traveled', value: user?.stats?.totalDays ?? 47, icon: Calendar, color: 'bg-gradient-to-br from-emerald-500 to-teal-500', trend: '+14 days' },
    { label: 'Trips Completed', value: completedCount, icon: CheckCircle, color: 'bg-gradient-to-br from-amber-500 to-orange-500' },
  ];

  return (
    <MainLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>! ✈️
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {upcomingTrips.length > 0
                ? `You have ${upcomingTrips.length} upcoming trip${upcomingTrips.length > 1 ? 's' : ''}. Let's plan!`
                : "Ready to plan your next adventure?"}
            </p>
          </div>
          <button
            onClick={() => navigate('/trips/create')}
            className="btn-primary self-start sm:self-auto flex-shrink-0"
          >
            <Plus size={16} />
            New Trip
          </button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading
            ? [0,1,2,3].map((i) => <SkeletonStatCard key={i} />)
            : stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.08} />)
          }
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Trips */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Trips</h2>
              <Link to="/trips" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SkeletonTripCard /><SkeletonTripCard />
              </div>
            ) : upcomingTrips.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingTrips.map((trip, i) => (
                  <TripCard key={trip.id} trip={trip} delay={i * 0.1} />
                ))}
              </div>
            ) : (
              <div className="card flex flex-col items-center py-12 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <Plane size={28} className="text-primary/60" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No upcoming trips</h3>
                <p className="text-sm text-gray-400 mb-4">Start planning your next adventure</p>
                <button onClick={() => navigate('/trips/create')} className="btn-primary text-sm px-5 py-2.5">
                  <Plus size={15} />Create Trip
                </button>
              </div>
            )}
          </div>

          {/* Sidebar: Recommendations */}
          <div className="space-y-6">
            {/* Recommended Destinations */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recommended</h2>
                <Link to="/discover" className="text-xs text-primary hover:underline">See all</Link>
              </div>
              <div className="space-y-1">
                {mockDestinations.slice(0, 4).map((dest, i) => (
                  <RecommendedCard key={dest.id} dest={dest} delay={i * 0.06} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { label: 'Build Itinerary', path: '/itinerary', icon: Map, color: 'text-primary bg-primary/10' },
                  { label: 'Track Budget', path: '/budget', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
                  { label: 'Packing List', path: '/checklist', icon: CheckCircle, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
                  { label: 'Discover Cities', path: '/discover', icon: Globe, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
                ].map(({ label, path, icon: Icon, color }) => (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left group"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color} flex-shrink-0`}>
                      <Icon size={15} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">{label}</span>
                    <ChevronRight size={14} className="ml-auto text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
