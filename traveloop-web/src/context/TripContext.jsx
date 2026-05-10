import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockTrips } from '../data/mockData';
import toast from 'react-hot-toast';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [trips, setTrips] = useState(() => {
    try {
      const stored = localStorage.getItem('traveloop_trips');
      return stored ? JSON.parse(stored) : mockTrips;
    } catch {
      return mockTrips;
    }
  });
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(false);

  // Persist to localStorage whenever trips change
  useEffect(() => {
    localStorage.setItem('traveloop_trips', JSON.stringify(trips));
  }, [trips]);

  const createTrip = useCallback((tripData) => {
    const newTrip = {
      id: Date.now(),
      ...tripData,
      status: 'planning',
      spent: 0,
      members: 1,
      stops: [],
      daysLeft: tripData.startDate
        ? Math.ceil((new Date(tripData.startDate) - new Date()) / (1000 * 60 * 60 * 24))
        : 0,
      createdAt: new Date().toISOString(),
    };
    setTrips((prev) => [newTrip, ...prev]);
    toast.success('Trip created successfully! 🎉');
    return newTrip;
  }, []);

  const updateTrip = useCallback((id, updates) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
    toast.success('Trip updated!');
  }, []);

  const deleteTrip = useCallback((id) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
    toast.success('Trip deleted');
  }, []);

  const getTripById = useCallback((id) => trips.find((t) => t.id === Number(id)), [trips]);

  const value = {
    trips,
    activeTrip,
    setActiveTrip,
    loading,
    createTrip,
    updateTrip,
    deleteTrip,
    getTripById,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTripContext() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTripContext must be used within TripProvider');
  return ctx;
}
