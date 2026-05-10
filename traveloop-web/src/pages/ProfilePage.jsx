import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Camera, Edit2, Check, X,
  Globe, Bell, Lock, Trash2, LogOut, Shield,
} from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuthContext();
  const fileRef = useRef();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar);
  const [activeTab, setActiveTab] = useState('profile');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    updateProfile({ avatar: url });
    toast.success('Profile photo updated!');
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Name required'); return; }
    updateProfile({ ...form, avatar: avatarPreview });
    setEditing(false);
    toast.success('Profile updated!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Profile & Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar: Avatar + tabs */}
          <div className="lg:col-span-1 space-y-4">
            {/* Avatar */}
            <div className="card p-6 text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={avatarPreview}
                  alt={user?.name}
                  className="w-24 h-24 rounded-2xl object-cover mx-auto ring-4 ring-primary/20"
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-primary hover:scale-110 transition-transform"
                >
                  <Camera size={14} className="text-white" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{user?.name}</h3>
              <p className="text-xs text-gray-400 mb-3">{user?.email}</p>
              <div className="grid grid-cols-3 gap-2 text-center border-t border-gray-100 dark:border-surface-dark-border pt-3">
                <div>
                  <p className="text-base font-bold text-primary">{user?.stats?.totalTrips || 0}</p>
                  <p className="text-xs text-gray-400">Trips</p>
                </div>
                <div>
                  <p className="text-base font-bold text-primary">{user?.stats?.countriesVisited || 0}</p>
                  <p className="text-xs text-gray-400">Countries</p>
                </div>
                <div>
                  <p className="text-base font-bold text-primary">{user?.stats?.totalDays || 0}</p>
                  <p className="text-xs text-gray-400">Days</p>
                </div>
              </div>
            </div>

            {/* Tab Nav */}
            <div className="card p-2 space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === id
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
              <div className="border-t border-gray-100 dark:border-surface-dark-border pt-1">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">Personal Information</h2>
                  {editing ? (
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" icon={X} onClick={() => setEditing(false)}>Cancel</Button>
                      <Button variant="primary" size="sm" icon={Check} onClick={handleSave}>Save</Button>
                    </div>
                  ) : (
                    <Button variant="secondary" size="sm" icon={Edit2} onClick={() => setEditing(true)}>Edit</Button>
                  )}
                </div>

                {editing ? (
                  <div className="space-y-4">
                    <Input label="Full Name" icon={User} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
                    <Input label="Email Address" type="email" icon={Mail} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                    <Input label="Phone Number" type="tel" icon={Phone} value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                    <Input label="Location" icon={MapPin} value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bio</label>
                      <textarea
                        value={form.bio}
                        onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                        rows={3}
                        className="input-field resize-none"
                        placeholder="Tell us about your travel style..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[
                      { icon: User, label: 'Full Name', value: user?.name },
                      { icon: Mail, label: 'Email', value: user?.email },
                      { icon: Phone, label: 'Phone', value: user?.phone || 'Not set' },
                      { icon: MapPin, label: 'Location', value: user?.location || 'Not set' },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-3 py-2.5 border-b border-gray-50 dark:border-surface-dark-border last:border-0">
                        <Icon size={16} className="text-primary flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-400">{label}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
                        </div>
                      </div>
                    ))}
                    {user?.bio && (
                      <div className="pt-1">
                        <p className="text-xs text-gray-400 mb-1">Bio</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{user.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="card p-6 space-y-6">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Default Currency</label>
                    <select className="input-field max-w-xs">
                      {['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Language</label>
                    <select className="input-field max-w-xs">
                      {['English', 'Spanish', 'French', 'German', 'Japanese'].map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date Format</label>
                    <select className="input-field max-w-xs">
                      {['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].map((f) => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
                <Button variant="primary" icon={Check} onClick={() => toast.success('Preferences saved!')}>Save Preferences</Button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card p-6 space-y-6">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Notification Settings</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Trip reminders', desc: 'Get notified before your trips', on: true },
                    { label: 'Budget alerts', desc: 'Alert when near budget limit', on: true },
                    { label: 'Shared itinerary updates', desc: 'When someone copies your itinerary', on: false },
                    { label: 'Travel tips & news', desc: 'Weekly travel inspiration', on: false },
                    { label: 'Email digest', desc: 'Weekly summary of your trips', on: true },
                  ].map(({ label, desc, on }, i) => {
                    const [enabled, setEnabled] = useState(on);
                    return (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-surface-dark-border last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                          <p className="text-xs text-gray-400">{desc}</p>
                        </div>
                        <button
                          onClick={() => setEnabled(!enabled)}
                          className={`relative w-10 h-6 rounded-full transition-all duration-200 ${enabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${enabled ? 'left-5' : 'left-1'}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <Button variant="primary" icon={Check} onClick={() => toast.success('Notification settings saved!')}>Save Settings</Button>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                <div className="card p-6 space-y-4">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">Change Password</h2>
                  <Input label="Current Password" type="password" icon={Lock} placeholder="••••••••" />
                  <Input label="New Password" type="password" icon={Lock} placeholder="••••••••" hint="At least 8 characters" />
                  <Input label="Confirm New Password" type="password" icon={Lock} placeholder="••••••••" />
                  <Button variant="primary" icon={Check} onClick={() => toast.success('Password updated!')}>Update Password</Button>
                </div>
                <div className="card p-6 border-red-200 dark:border-red-800/30">
                  <h2 className="text-base font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Once you delete your account, there is no going back. All your trips and data will be permanently removed.
                  </p>
                  <Button variant="danger" icon={Trash2} onClick={() => toast.error('Account deletion requires confirmation email')}>
                    Delete Account
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
