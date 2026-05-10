import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

// Mock user for demo
const DEMO_USER = {
  id: 1,
  name: 'Alex Rivera',
  email: 'alex@traveloop.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
  bio: 'Avid traveler | 12 countries | 8 trips planned',
  location: 'San Francisco, CA',
  phone: '+1 (415) 555-0123',
  preferences: {
    currency: 'USD',
    language: 'en',
    notifications: true,
  },
  stats: {
    totalTrips: 8,
    countriesVisited: 12,
    totalDays: 47,
  },
  joinedAt: '2024-01-15T00:00:00Z',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('traveloop_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('traveloop_token'));
  const [loading, setLoading] = useState(false);

  const isAuthenticated = Boolean(user && token);

  useEffect(() => {
    if (user) localStorage.setItem('traveloop_user', JSON.stringify(user));
    else localStorage.removeItem('traveloop_user');
  }, [user]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1000));

      // Accept demo credentials or any non-empty input
      if (!email || !password) throw new Error('Please enter email and password');

      const mockToken = `mock_jwt_${Date.now()}`;
      const loggedUser = { ...DEMO_USER, email };

      setUser(loggedUser);
      setToken(mockToken);
      localStorage.setItem('traveloop_token', mockToken);
      toast.success(`Welcome back, ${loggedUser.name.split(' ')[0]}! ✈️`);
      return { user: loggedUser, token: mockToken };
    } catch (err) {
      toast.error(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));

      if (!name || !email || !password) throw new Error('All fields are required');
      if (password.length < 6) throw new Error('Password must be at least 6 characters');

      const mockToken = `mock_jwt_${Date.now()}`;
      const newUser = {
        ...DEMO_USER,
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=5B4BFF&color=fff&size=200`,
        bio: 'New Traveloop member',
        joinedAt: new Date().toISOString(),
        stats: { totalTrips: 0, countriesVisited: 0, totalDays: 0 },
      };

      setUser(newUser);
      setToken(mockToken);
      localStorage.setItem('traveloop_token', mockToken);
      toast.success(`Welcome to Traveloop, ${name.split(' ')[0]}! 🎉`);
      return { user: newUser, token: mockToken };
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('traveloop_token');
    localStorage.removeItem('traveloop_user');
    toast.success('Logged out successfully');
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
    toast.success('Profile updated!');
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
