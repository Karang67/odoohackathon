import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, ArrowRight, Star, CheckCircle, Menu, X,
  Map, DollarSign, ListChecks, Users, BookOpen, Search,
  Globe, ChevronDown, Play,
} from 'lucide-react';
import { mockDestinations, mockTestimonials, mockFeatures } from '../data/mockData';
import { useAuthContext } from '../context/AuthContext';
import Footer from '../components/layout/Footer';

// Navbar
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl shadow-nav' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-primary">
            <Plane size={18} className="text-white" />
          </div>
          <span className={`text-xl font-bold ${scrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
            Travel<span className="gradient-text">oop</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Destinations', 'Pricing', 'Blog'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                scrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white/80 hover:text-white'
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary text-sm px-5 py-2.5"
            >
              Go to Dashboard <ArrowRight size={15} />
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm font-medium transition-colors ${
                  scrolled ? 'text-gray-600 dark:text-gray-300 hover:text-primary' : 'text-white/90 hover:text-white'
                }`}
              >
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary text-sm px-5 py-2.5">
                Get Started Free <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 rounded-xl transition-colors ${scrolled ? 'text-gray-600' : 'text-white'}`}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-white/10 px-4 py-4 space-y-3"
          >
            {['Features', 'Destinations', 'Pricing', 'Blog'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="block text-sm text-gray-600 dark:text-gray-300 hover:text-primary py-2">
                {item}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-white/10">
              <Link to="/login" className="btn-secondary text-center text-sm">Sign In</Link>
              <Link to="/signup" className="btn-primary text-center text-sm">Get Started Free</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// Hero Section
function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"
          alt="Travel background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/75 to-secondary-700/60" />
      </div>

      {/* Decorative orbs */}
      <div className="orb orb-primary absolute top-1/4 -left-32 w-96 h-96 opacity-40" />
      <div className="orb orb-secondary absolute bottom-1/4 -right-32 w-80 h-80 opacity-30" />

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4 sm:px-6 py-32">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 text-sm font-medium mb-8"
        >
          <Globe size={14} />
          <span>Plan smarter. Travel better.</span>
          <span className="w-px h-4 bg-white/30" />
          <span className="text-accent-light">New: AI trip suggestions</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
        >
          Your Dream Trips,
          <br />
          <span className="gradient-text-hero">Perfectly Planned</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The all-in-one travel planning platform. Build itineraries, track budgets,
          discover destinations, and share adventures — all in one beautiful app.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={() => navigate('/signup')}
            className="group flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-2xl shadow-float hover:shadow-glass hover:scale-105 transition-all duration-200 text-base"
          >
            Start Planning Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="flex items-center gap-2 glass text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-200 text-base">
            <Play size={16} className="fill-current" />
            Watch Demo
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10"
        >
          {[
            { value: '50K+', label: 'Active Travelers' },
            { value: '195', label: 'Countries Covered' },
            { value: '2M+', label: 'Trips Planned' },
            { value: '4.9★', label: 'Average Rating' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
              <p className="text-xs text-white/60 mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ChevronDown size={24} className="text-white/50" />
        </motion.div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const iconMap = { Map, DollarSign, ListChecks, Users, BookOpen, Search };

  return (
    <section id="features" className="py-24 bg-white dark:bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/5 dark:bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Star size={14} />
            Everything you need
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Plan Every Detail,{' '}
            <span className="gradient-text">Effortlessly</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Traveloop combines powerful planning tools with a beautiful interface so you can focus on the joy of travel.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockFeatures.map((feature, idx) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="card-hover p-6 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                  {Icon && <Icon size={22} className="text-white" />}
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Destinations Section
function DestinationsSection() {
  return (
    <section id="destinations" className="py-24 bg-surface-light dark:bg-surface-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/5 dark:bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Globe size={14} />
            Popular Destinations
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Discover <span className="gradient-text">Dream Places</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Explore hand-picked destinations with all the information you need to plan your perfect trip.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDestinations.slice(0, 6).map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
              className="group relative overflow-hidden rounded-3xl shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 cursor-pointer aspect-[4/3]"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Rating */}
              <div className="absolute top-4 right-4 flex items-center gap-1 glass rounded-full px-2.5 py-1 text-white text-xs font-medium">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                {dest.rating}
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{dest.name}</h3>
                    <p className="text-white/70 text-sm">{dest.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">${dest.costPerDay}</p>
                    <p className="text-white/60 text-xs">per day</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {dest.tags.map((tag) => (
                    <span key={tag} className="glass rounded-full px-2.5 py-0.5 text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/discover" className="btn-secondary">
            Explore All Destinations <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Testimonials
function TestimonialsSection() {
  return (
    <section className="py-24 bg-white dark:bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Loved by <span className="gradient-text">50,000+ Travelers</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400">Real stories from real wanderers</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockTestimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="card p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-primary p-12 text-center text-white"
        >
          <div className="orb orb-secondary absolute -top-20 -right-20 w-64 h-64 opacity-30" />
          <div className="orb orb-primary absolute -bottom-20 -left-20 w-64 h-64 opacity-20" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Next Adventure?</h2>
            <p className="text-white/75 mb-8 max-w-xl mx-auto">
              Join 50,000+ travelers using Traveloop to plan unforgettable trips. Free to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className="bg-white text-primary font-bold px-8 py-4 rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Get Started — It's Free
              </button>
              <button className="border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all duration-200">
                View Demo
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-white/60 text-sm">
              {['No credit card required', 'Free forever plan', 'Cancel anytime'].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-white/40" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Main Landing Page
export default function LandingPage() {
  return (
    <div className="bg-white dark:bg-surface-dark">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <DestinationsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
