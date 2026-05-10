import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import MyTripsPage from './pages/MyTripsPage';
import CreateTripPage from './pages/CreateTripPage';
import ItineraryBuilder from './pages/ItineraryBuilder';
import BudgetPage from './pages/BudgetPage';
import ChecklistPage from './pages/ChecklistPage';
import NotesPage from './pages/NotesPage';
import ProfilePage from './pages/ProfilePage';
import CitySearchPage from './pages/CitySearchPage';
import ActivitySearchPage from './pages/ActivitySearchPage';
import SharedItinerary from './pages/SharedItinerary';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthContext();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// Public-only route (redirects logged-in users)
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthContext();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/shared/:id" element={<SharedItinerary />} />

      {/* Auth routes (redirect if already logged in) */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

      {/* Protected app routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute><MyTripsPage /></ProtectedRoute>} />
      <Route path="/trips/create" element={<ProtectedRoute><CreateTripPage /></ProtectedRoute>} />
      <Route path="/trips/:id" element={<ProtectedRoute><MyTripsPage /></ProtectedRoute>} />
      <Route path="/itinerary" element={<ProtectedRoute><ItineraryBuilder /></ProtectedRoute>} />
      <Route path="/budget" element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />
      <Route path="/checklist" element={<ProtectedRoute><ChecklistPage /></ProtectedRoute>} />
      <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/discover" element={<ProtectedRoute><CitySearchPage /></ProtectedRoute>} />
      <Route path="/activities" element={<ProtectedRoute><ActivitySearchPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TripProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  borderRadius: '12px',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  fontSize: '14px',
                  fontFamily: 'Poppins, sans-serif',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  padding: '12px 16px',
                },
                success: {
                  iconTheme: { primary: '#5B4BFF', secondary: '#fff' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#fff' },
                },
              }}
            />
          </TripProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
