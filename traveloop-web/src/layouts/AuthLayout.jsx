import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children, imageSrc, imageAlt = 'Travel', quote, quoteAuthor }) {
  return (
    <div className="min-h-screen flex bg-white dark:bg-surface-dark">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12 max-w-xl w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-primary">
            <Plane size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Travel<span className="gradient-text">oop</span>
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </div>

      {/* Right: Image (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Background image */}
        <img
          src={imageSrc || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80'}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/60" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          {/* Floating cards */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="glass rounded-2xl p-4 mb-4 max-w-xs"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Plane size={14} />
              </div>
              <div>
                <p className="text-xs font-semibold">Next Departure</p>
                <p className="text-xs opacity-70">Santorini, Greece</p>
              </div>
            </div>
            <p className="text-xs opacity-70">July 15, 2025 • 2 travelers</p>
          </motion.div>

          {quote && (
            <div className="mb-6">
              <blockquote className="text-xl font-semibold leading-snug mb-2">
                "{quote}"
              </blockquote>
              <p className="text-sm opacity-70">— {quoteAuthor}</p>
            </div>
          )}

          <div className="flex gap-4 text-sm">
            <div className="glass rounded-xl px-4 py-3 text-center">
              <p className="font-bold text-lg">50K+</p>
              <p className="opacity-70 text-xs">Travelers</p>
            </div>
            <div className="glass rounded-xl px-4 py-3 text-center">
              <p className="font-bold text-lg">195</p>
              <p className="opacity-70 text-xs">Countries</p>
            </div>
            <div className="glass rounded-xl px-4 py-3 text-center">
              <p className="font-bold text-lg">4.9★</p>
              <p className="opacity-70 text-xs">Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
