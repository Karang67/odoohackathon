import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Header({ onMenuToggle, showMenuButton }) {
  const { user } = useAuthContext();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState([
    { id: 1, text: 'Your trip to Greece starts in 5 days!', time: '2h ago', unread: true },
    { id: 2, text: 'Budget alert: 80% spent on accommodation', time: '5h ago', unread: true },
    { id: 3, text: 'New activity added to your wishlist', time: '1d ago', unread: false },
  ]);
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl border-b border-gray-100 dark:border-surface-dark-border px-4 md:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Menu button (mobile) + greeting */}
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors md:hidden"
          >
            <Menu size={20} />
          </button>
        )}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white hidden sm:block">
            Good morning, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h2>
          <p className="text-xs text-gray-400 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right: Search, notifications, theme, avatar */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <AnimatePresence>
          {searchOpen ? (
            <motion.form
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              onSubmit={handleSearch}
              className="overflow-hidden"
            >
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-card text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </motion.form>
          ) : null}
        </AnimatePresence>

        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="p-2.5 rounded-xl text-gray-500 hover:text-primary hover:bg-primary/5 transition-all"
          title="Search"
        >
          {searchOpen ? <X size={18} /> : <Search size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2.5 rounded-xl text-gray-500 hover:text-primary hover:bg-primary/5 transition-all relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white dark:ring-surface-dark" />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-surface-dark-card rounded-2xl shadow-float border border-gray-100 dark:border-surface-dark-border overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-gray-100 dark:border-surface-dark-border flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  <span className="badge-primary text-xs">{unreadCount} new</span>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-surface-dark-border max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className={`px-4 py-3 flex gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${n.unread ? 'bg-primary/3' : ''}`}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-primary' : 'bg-gray-200'}`} />
                      <div>
                        <p className="text-xs text-gray-700 dark:text-gray-300">{n.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100 dark:border-surface-dark-border">
                  <button className="text-xs text-primary font-medium hover:underline">Mark all as read</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-gray-500 hover:text-primary hover:bg-primary/5 transition-all"
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Avatar */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 pl-2"
        >
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20 hover:ring-primary/50 transition-all"
          />
        </button>
      </div>
    </header>
  );
}
