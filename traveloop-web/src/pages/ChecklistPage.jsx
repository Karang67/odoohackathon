import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Trash2, RotateCcw, X } from 'lucide-react';
import { mockChecklist } from '../data/mockData';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

function ProgressRing({ pct, size = 44, stroke = 4 }) {
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-gray-100 dark:text-gray-700" />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke="url(#prog-grad)" strokeWidth={stroke}
        strokeDasharray={`${dash} ${c}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.5s ease' }}
      />
      <defs>
        <linearGradient id="prog-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5B4BFF" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function ChecklistPage() {
  const [categories, setCategories] = useState(mockChecklist);
  const [newItemInputs, setNewItemInputs] = useState({});
  const [adding, setAdding] = useState(null);

  const totalItems = categories.reduce((s, c) => s + c.items.length, 0);
  const packedItems = categories.reduce((s, c) => s + c.items.filter((i) => i.packed).length, 0);
  const overallPct = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  const toggleItem = (catId, itemId) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? { ...c, items: c.items.map((i) => i.id === itemId ? { ...i, packed: !i.packed } : i) }
          : c
      )
    );
  };

  const deleteItem = (catId, itemId) => {
    setCategories((prev) =>
      prev.map((c) => c.id === catId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c)
    );
  };

  const addItem = (catId) => {
    const name = newItemInputs[catId]?.trim();
    if (!name) { toast.error('Item name required'); return; }
    setCategories((prev) =>
      prev.map((c) => c.id === catId ? { ...c, items: [...c.items, { id: Date.now(), name, packed: false }] } : c)
    );
    setNewItemInputs((p) => ({ ...p, [catId]: '' }));
    setAdding(null);
    toast.success('Item added!');
  };

  const resetCategory = (catId) => {
    setCategories((prev) =>
      prev.map((c) => c.id === catId ? { ...c, items: c.items.map((i) => ({ ...i, packed: false })) } : c)
    );
    toast.success('Category reset');
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Packing Checklist</h1>
            <p className="text-sm text-gray-400 mt-0.5">Greek Island Hopping</p>
          </div>
          <button
            onClick={() => { setCategories(mockChecklist.map((c) => ({ ...c, items: c.items.map((i) => ({ ...i, packed: false })) }))); toast.success('All reset!'); }}
            className="btn-ghost text-sm"
          >
            <RotateCcw size={14} />
            Reset All
          </button>
        </div>

        {/* Overall Progress */}
        <div className="card p-5 mb-6">
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <ProgressRing pct={overallPct} size={80} stroke={6} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{overallPct}%</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Packing Progress</h3>
              <p className="text-sm text-gray-400 mb-3">
                {packedItems} of {totalItems} items packed
              </p>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${overallPct}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-primary rounded-full"
                />
              </div>
            </div>
          </div>
          {overallPct === 100 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-medium flex items-center gap-2"
            >
              <Check size={16} />
              All packed! Have a great trip! ✈️
            </motion.div>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {categories.map((cat) => {
            const catPacked = cat.items.filter((i) => i.packed).length;
            const catPct = cat.items.length > 0 ? Math.round((catPacked / cat.items.length) * 100) : 0;

            return (
              <motion.div key={cat.id} layout className="card overflow-hidden">
                {/* Category Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-surface-dark-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${cat.color}15` }}>
                      <span className="text-base">
                        {cat.icon === 'FileText' ? '📄' : cat.icon === 'Shirt' ? '👕' : cat.icon === 'Laptop' ? '💻' : '💊'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{cat.category}</h3>
                      <p className="text-xs text-gray-400">{catPacked}/{cat.items.length} packed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <ProgressRing pct={catPct} size={36} stroke={3} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-primary">{catPct}%</span>
                      </div>
                    </div>
                    <button
                      onClick={() => resetCategory(cat.id)}
                      className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                      title="Reset category"
                    >
                      <RotateCcw size={13} />
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="p-2 space-y-0.5">
                  <AnimatePresence>
                    {cat.items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 group transition-all"
                      >
                        <button
                          onClick={() => toggleItem(cat.id, item.id)}
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                            item.packed
                              ? 'bg-gradient-primary border-transparent'
                              : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                          }`}
                        >
                          {item.packed && <Check size={11} className="text-white" />}
                        </button>
                        <span className={`flex-1 text-sm transition-all ${item.packed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                          {item.name}
                        </span>
                        <button
                          onClick={() => deleteItem(cat.id, item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-300 dark:text-gray-600 hover:text-red-500 transition-all"
                        >
                          <X size={13} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Add item */}
                  {adding === cat.id ? (
                    <div className="flex items-center gap-2 px-3 py-2">
                      <input
                        autoFocus
                        className="flex-1 text-sm bg-transparent border-b border-primary/30 focus:border-primary outline-none py-1 text-gray-700 dark:text-gray-300 placeholder-gray-400"
                        placeholder="Item name..."
                        value={newItemInputs[cat.id] || ''}
                        onChange={(e) => setNewItemInputs((p) => ({ ...p, [cat.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') addItem(cat.id); if (e.key === 'Escape') setAdding(null); }}
                      />
                      <button onClick={() => addItem(cat.id)} className="p-1 text-primary hover:bg-primary/10 rounded-lg">
                        <Check size={15} />
                      </button>
                      <button onClick={() => setAdding(null)} className="p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg">
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAdding(cat.id)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-400 hover:text-primary transition-colors rounded-xl hover:bg-primary/5"
                    >
                      <Plus size={13} />
                      Add item
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
