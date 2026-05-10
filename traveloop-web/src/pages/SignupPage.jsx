import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Check } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const passwordStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

export default function SignupPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuthContext();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', terms: false });
  const [errors, setErrors] = useState({});
  const strength = passwordStrength(form.password);

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-500'];

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Must be at least 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    if (!form.terms) errs.terms = 'You must accept the terms';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch {
      setErrors({ form: 'Registration failed. Please try again.' });
    }
  };

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  return (
    <AuthLayout
      imageSrc="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&q=80"
      imageAlt="Travel adventure"
      quote="Not all those who wander are lost."
      quoteAuthor="J.R.R. Tolkien"
    >
      <div className="max-w-sm">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create your account</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>

        {/* Google */}
        <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 dark:border-surface-dark-border rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-sm font-medium text-gray-700 dark:text-gray-300 mb-6">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200 dark:bg-surface-dark-border" />
          <span className="text-xs text-gray-400">or sign up with email</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-surface-dark-border" />
        </div>

        {errors.form && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-800"
          >
            {errors.form}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Alex Rivera"
            icon={User}
            value={form.name}
            onChange={handleChange('name')}
            error={errors.name}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="alex@example.com"
            icon={Mail}
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
            required
          />
          <div>
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              icon={Lock}
              value={form.password}
              onChange={handleChange('password')}
              error={errors.password}
              required
            />
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : 'bg-gray-200 dark:bg-gray-700'}`}
                    />
                  ))}
                </div>
                <p className={`text-xs ${strength >= 3 ? 'text-emerald-500' : strength >= 2 ? 'text-amber-500' : 'text-red-500'}`}>
                  {strengthLabel[strength]} password
                </p>
              </div>
            )}
          </div>
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            icon={Lock}
            value={form.confirm}
            onChange={handleChange('confirm')}
            error={errors.confirm}
            required
          />

          {/* Terms */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={handleChange('terms')}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${form.terms ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                  {form.terms && <Check size={12} className="text-white" />}
                </div>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <Link to="/terms" className="text-primary font-medium hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary font-medium hover:underline">Privacy Policy</Link>
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-500 mt-1 ml-8">{errors.terms}</p>}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            loading={loading}
          >
            Create Account
            <ArrowRight size={16} />
          </Button>
        </form>

        {/* Perks */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          {['Free forever', 'No credit card', 'Cancel anytime'].map((perk) => (
            <div key={perk} className="flex items-center gap-1.5 text-xs text-gray-400">
              <Check size={12} className="text-emerald-500 flex-shrink-0" />
              {perk}
            </div>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}
