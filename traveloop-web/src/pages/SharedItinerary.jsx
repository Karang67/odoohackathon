import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, DollarSign, Share2, Copy, Check, Plane, Users } from 'lucide-react';
import { mockItinerary, mockTrips } from '../data/mockData';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const TYPE_EMOJI = {
  Sightseeing: '🏛️', Food: '🍽️', Transport: '🚌', Culture: '🎭',
  Adventure: '🧗', Shopping: '🛍️', Wellness: '🧘', Logistics: '📋',
};

export default function SharedItinerary() {
  const [copied, setCopied] = useState(false);
  const trip = mockTrips[0];
  const itinerary = mockItinerary;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyTrip = () => {
    toast.success('Trip copied to your account!');
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      {/* Navbar */}
      <nav className="bg-white/90 dark:bg-surface-dark-card/90 backdrop-blur-xl border-b border-gray-100 dark:border-surface-dark-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Plane size={14} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-sm">
              Travel<span className="gradient-text">oop</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={copied ? Check : Copy} onClick={handleCopyLink}>
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            <Button variant="primary" size="sm" icon={Share2} onClick={handleCopyTrip}>
              Copy Trip
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Trip Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-8 h-56 sm:h-72"
        >
          <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="upcoming">Shared Itinerary</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{trip.title}</h1>
            <p className="text-white/70 text-sm line-clamp-2">{trip.description}</p>
          </div>
        </motion.div>

        {/* Trip Info Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: Calendar, label: 'Start Date', value: new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
            { icon: Calendar, label: 'End Date', value: new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
            { icon: MapPin, label: 'Stops', value: `${trip.stops.length} cities` },
            { icon: DollarSign, label: 'Budget', value: `$${trip.budget.toLocaleString()}` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="card p-4 text-center">
              <Icon size={18} className="text-primary mx-auto mb-2" />
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Stops */}
        <div className="flex flex-wrap gap-2 mb-8">
          {trip.stops.map((stop, i) => (
            <span key={stop} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-surface-dark-card border border-gray-100 dark:border-surface-dark-border rounded-full text-sm text-gray-700 dark:text-gray-300">
              {i > 0 && <span className="w-1 h-1 bg-primary rounded-full" />}
              <MapPin size={12} className="text-primary" />
              {stop}
            </span>
          ))}
        </div>

        {/* Timeline */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Day-by-Day Itinerary</h2>
          <div className="space-y-4">
            {itinerary.days.map((day, dayIdx) => (
              <motion.div
                key={day.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIdx * 0.1 }}
                className="card overflow-hidden"
              >
                {/* Day header */}
                <div className="bg-gradient-primary px-5 py-4 flex items-center justify-between">
                  <div className="text-white">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">Day {day.dayNumber}</span>
                      <span className="text-white/60">·</span>
                      <span className="flex items-center gap-1 text-sm">
                        <MapPin size={13} className="text-white/70" />
                        {day.city}
                      </span>
                    </div>
                    <p className="text-white/60 text-xs mt-0.5">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-white text-right">
                    <p className="text-xs text-white/60">Est. cost</p>
                    <p className="font-bold">${day.activities.reduce((s, a) => s + (a.cost || 0), 0)}</p>
                  </div>
                </div>

                {/* Activities */}
                <div className="divide-y divide-gray-50 dark:divide-surface-dark-border">
                  {day.activities.map((act, actIdx) => (
                    <div key={act.id} className="flex items-start gap-4 px-5 py-3.5">
                      <div className="flex-shrink-0 w-14 text-center">
                        <span className="text-xs font-semibold text-primary bg-primary/5 rounded-lg px-2 py-1 block">{act.time}</span>
                      </div>
                      <div className="w-8 flex flex-col items-center flex-shrink-0 mt-1">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                          {TYPE_EMOJI[act.type] || '📌'}
                        </div>
                        {actIdx < day.activities.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-100 dark:bg-gray-700 mt-1 flex-1 min-h-[16px]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{act.name}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-0.5">
                          <span className="flex items-center gap-1"><Clock size={11} />{act.duration}</span>
                          {act.cost > 0 && <span className="flex items-center gap-1"><DollarSign size={11} />${act.cost}</span>}
                          <span className="badge-info">{act.type}</span>
                        </div>
                        {act.notes && (
                          <p className="text-xs text-gray-400 italic mt-1">💡 {act.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {day.accommodation && (
                  <div className="px-5 py-3 border-t border-gray-50 dark:border-surface-dark-border bg-gray-50/50 dark:bg-white/2">
                    <p className="text-xs text-gray-400">
                      🏨 Accommodation: <span className="font-medium text-gray-700 dark:text-gray-300">{day.accommodation}</span>
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="card bg-gradient-primary p-6 text-white text-center">
          <h3 className="font-bold text-lg mb-2">Love this itinerary?</h3>
          <p className="text-white/75 text-sm mb-4">Copy it to your Traveloop account and customize it for your trip.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup" className="bg-white text-primary font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all text-sm">
              Sign Up & Copy Trip
            </Link>
            <button onClick={handleCopyTrip} className="border-2 border-white/50 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-all text-sm">
              Already have an account?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
