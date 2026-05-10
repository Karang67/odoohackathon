import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Map, PlusCircle, ListChecks, DollarSign,
  BookOpen, Search, User, Settings, LogOut, ChevronLeft,
  ChevronRight, Plane, Star, Shield, Compass,
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/trips', icon: Map, label: 'My Trips' },
  { path: '/trips/create', icon: PlusCircle, label: 'Create Trip' },
  { path: '/itinerary', icon: Compass, label: 'Itinerary' },
  { path: '/budget', icon: DollarSign, label: 'Budget' },
  { path: '/checklist', icon: ListChecks, label: 'Checklist' },
  { path: '/notes', icon: BookOpen, label: 'Notes' },
  { path: '/discover', icon: Search, label: 'Discover' },
];

const bottomItems = [
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/admin', icon: Shield, label: 'Admin' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen bg-white dark:bg-surface-dark-card border-r border-gray-100 dark:border-surface-dark-border overflow-hidden flex-shrink-0 z-40"
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 z-50 w-6 h-6 bg-white dark:bg-surface-dark-card border border-gray-200 dark:border-surface-dark-border rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all text-gray-500 hover:text-primary"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-gray-100 dark:border-surface-dark-border">
        <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-primary">
          <Plane size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">
                Travel<span className="gradient-text">oop</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
              ${isActive
                ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={19}
                  className={`flex-shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200'}`}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-primary rounded-r-full"
                  />
                )}
                {/* Tooltip when collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50 shadow-lg">
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-1 border-t border-gray-100 dark:border-surface-dark-border pt-3">
        {bottomItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
              ${isActive
                ? 'bg-primary/10 text-primary'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <Icon size={19} className="flex-shrink-0 text-gray-400" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}

        {/* User avatar & logout */}
        <div className="flex items-center gap-3 px-3 py-2.5 mt-2">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-primary/20"
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
