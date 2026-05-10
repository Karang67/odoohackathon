import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import { Users, Map, Globe, TrendingUp, Activity, Shield } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const userGrowth = [
  { month: 'Jan', users: 1200, trips: 340 },
  { month: 'Feb', users: 1900, trips: 520 },
  { month: 'Mar', users: 2800, trips: 780 },
  { month: 'Apr', users: 4100, trips: 1050 },
  { month: 'May', users: 5600, trips: 1480 },
  { month: 'Jun', users: 7200, trips: 1920 },
];

const popularCities = [
  { city: 'Paris', trips: 2841 },
  { city: 'Tokyo', trips: 2390 },
  { city: 'Bali', trips: 1980 },
  { city: 'New York', trips: 1756 },
  { city: 'Santorini', trips: 1540 },
  { city: 'London', trips: 1320 },
];

const mockUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', trips: 8, joined: '2024-01-15', status: 'active' },
  { id: 2, name: 'Bob Chen', email: 'bob@example.com', trips: 5, joined: '2024-02-20', status: 'active' },
  { id: 3, name: 'Carol Davis', email: 'carol@example.com', trips: 12, joined: '2024-01-08', status: 'active' },
  { id: 4, name: 'David Park', email: 'david@example.com', trips: 3, joined: '2024-03-12', status: 'inactive' },
  { id: 5, name: 'Emma Wilson', email: 'emma@example.com', trips: 7, joined: '2024-02-05', status: 'active' },
];

function StatCard({ label, value, icon: Icon, color, change }) {
  return (
    <div className={`rounded-2xl p-5 text-white ${color} shadow-card`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium opacity-80">{label}</p>
        <Icon size={18} className="opacity-80" />
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      {change && (
        <div className="flex items-center gap-1 text-xs opacity-80">
          <TrendingUp size={12} />
          {change} this month
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm text-gray-400">Platform analytics & user management</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Users" value="7,241" icon={Users} color="bg-gradient-primary" change="+12.4%" />
          <StatCard label="Active Trips" value="1,923" icon={Map} color="bg-gradient-to-br from-blue-500 to-cyan-500" change="+8.7%" />
          <StatCard label="Countries" value="195" icon={Globe} color="bg-gradient-to-br from-emerald-500 to-teal-500" change="+3" />
          <StatCard label="Avg. Trip Duration" value="8.4 days" icon={Activity} color="bg-gradient-to-br from-amber-500 to-orange-500" change="+0.6 days" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">User Growth</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowth} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5B4BFF" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#5B4BFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stroke="#5B4BFF" strokeWidth={2} fill="url(#userGrad)" name="Users" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Popular Cities */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Popular Destinations</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularCities} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <YAxis dataKey="city" type="category" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <Tooltip />
                  <Bar dataKey="trips" fill="#5B4BFF" radius={[0, 6, 6, 0]} name="Trips" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Trip Trends Line Chart */}
        <div className="card p-5 mb-8">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Trip vs User Growth</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#5B4BFF" strokeWidth={2} dot={{ fill: '#5B4BFF', strokeWidth: 2 }} name="Users" />
                <Line type="monotone" dataKey="trips" stroke="#A78BFA" strokeWidth={2} dot={{ fill: '#A78BFA', strokeWidth: 2 }} name="Trips" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-surface-dark-border flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Users</h3>
            <span className="badge-primary">{mockUsers.length} users</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 dark:border-surface-dark-border">
                  {['User', 'Email', 'Trips', 'Joined', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-surface-dark-border">
                {mockUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{u.email}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-700 dark:text-gray-300">{u.trips}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{new Date(u.joined).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-gray'}`}>{u.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-primary hover:underline">Edit</button>
                        <button className="text-xs text-red-500 hover:underline">Ban</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
