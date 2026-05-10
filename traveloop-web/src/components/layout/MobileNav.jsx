import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Compass, DollarSign, User } from 'lucide-react';

const mobileNav = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/trips', icon: Map, label: 'Trips' },
  { path: '/discover', icon: Compass, label: 'Explore' },
  { path: '/budget', icon: DollarSign, label: 'Budget' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-surface-dark-card/90 backdrop-blur-xl border-t border-gray-100 dark:border-surface-dark-border md:hidden">
      <div className="flex items-center justify-around px-2 py-2 safe-bottom">
        {mobileNav.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[56px]
              ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-primary/10' : ''}`}>
                  <Icon size={20} className={isActive ? 'text-primary' : 'text-gray-400'} />
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
