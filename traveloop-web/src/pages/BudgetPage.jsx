import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { mockBudget } from '../data/mockData';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-surface-dark-card rounded-xl border border-gray-100 dark:border-surface-dark-border shadow-float px-4 py-3 text-sm">
        <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
        <p className="text-primary">${payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function BudgetPage() {
  const [budget, setBudget] = useState(mockBudget);
  const [newExpense, setNewExpense] = useState({ category: 'Accommodation', amount: '', description: '' });
  const [showAdd, setShowAdd] = useState(false);

  const pct = Math.round((budget.spent / budget.total) * 100);
  const remaining = budget.total - budget.spent;
  const isOverBudget = budget.spent > budget.total;

  const handleAddExpense = () => {
    if (!newExpense.amount) { toast.error('Please enter an amount'); return; }
    const cat = budget.categories.find((c) => c.name === newExpense.category);
    if (cat) {
      setBudget((prev) => ({
        ...prev,
        spent: prev.spent + Number(newExpense.amount),
        categories: prev.categories.map((c) =>
          c.name === newExpense.category ? { ...c, spent: c.spent + Number(newExpense.amount) } : c
        ),
      }));
      toast.success('Expense added!');
      setNewExpense({ category: 'Accommodation', amount: '', description: '' });
      setShowAdd(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budget Tracker</h1>
            <p className="text-sm text-gray-400 mt-0.5">Greek Island Hopping · {budget.currency}</p>
          </div>
          <Button variant="primary" icon={Plus} onClick={() => setShowAdd(!showAdd)}>
            Add Expense
          </Button>
        </div>

        {/* Add expense form */}
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-6 p-5"
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Add New Expense</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                className="input-field"
                value={newExpense.category}
                onChange={(e) => setNewExpense((p) => ({ ...p, category: e.target.value }))}
              >
                {budget.categories.map((c) => <option key={c.name}>{c.name}</option>)}
              </select>
              <input
                type="number"
                className="input-field"
                placeholder="Amount ($)"
                value={newExpense.amount}
                onChange={(e) => setNewExpense((p) => ({ ...p, amount: e.target.value }))}
              />
              <input
                className="input-field"
                placeholder="Description (optional)"
                value={newExpense.description}
                onChange={(e) => setNewExpense((p) => ({ ...p, description: e.target.value }))}
              />
            </div>
            <div className="flex gap-3 mt-3">
              <Button variant="secondary" size="sm" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleAddExpense}>Save Expense</Button>
            </div>
          </motion.div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Budget', value: `$${budget.total.toLocaleString()}`, icon: DollarSign, color: 'bg-gradient-primary text-white', sub: 'Overall budget' },
            { label: 'Total Spent', value: `$${budget.spent.toLocaleString()}`, icon: TrendingDown, color: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white', sub: `${pct}% used` },
            { label: 'Remaining', value: `$${Math.abs(remaining).toLocaleString()}`, icon: isOverBudget ? AlertCircle : TrendingUp, color: isOverBudget ? 'bg-gradient-to-br from-red-500 to-rose-500 text-white' : 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white', sub: isOverBudget ? 'Over budget!' : 'Left to spend' },
            { label: 'Daily Average', value: `$${Math.round(budget.spent / 5).toLocaleString()}`, icon: TrendingUp, color: 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white', sub: 'Per day spent' },
          ].map(({ label, value, icon: Icon, color, sub }) => (
            <div key={label} className={`rounded-2xl p-5 ${color} shadow-card`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium opacity-80">{label}</p>
                <Icon size={18} className="opacity-80" />
              </div>
              <p className="text-2xl font-bold mb-0.5">{value}</p>
              <p className="text-xs opacity-70">{sub}</p>
            </div>
          ))}
        </div>

        {/* Budget Progress Bar */}
        <div className="card mb-6 p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Overall Budget Progress</h3>
            <span className={`text-sm font-bold ${pct > 90 ? 'text-red-500' : pct > 70 ? 'text-amber-500' : 'text-emerald-500'}`}>{pct}%</span>
          </div>
          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, pct)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-amber-500' : 'bg-gradient-primary'}`}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>${budget.spent.toLocaleString()} spent</span>
            <span>${budget.total.toLocaleString()} total</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pie Chart */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budget.categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="spent"
                    nameKey="name"
                  >
                    {budget.categories.map((cat) => (
                      <Cell key={cat.name} fill={cat.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`$${val}`, 'Spent']} />
                  <Legend
                    formatter={(val) => <span className="text-xs text-gray-600 dark:text-gray-300">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Expenses Bar Chart */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Daily Expenses</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budget.dailyExpenses} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" fill="#5B4BFF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Category Breakdown</h3>
          <div className="space-y-4">
            {budget.categories.map((cat) => {
              const catPct = Math.round((cat.spent / cat.budget) * 100);
              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-400">${cat.spent} / ${cat.budget}</span>
                      <span className={`font-semibold w-10 text-right ${catPct > 90 ? 'text-red-500' : catPct > 70 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {catPct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, catPct)}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
