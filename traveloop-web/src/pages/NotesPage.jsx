import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Pin, PinOff, Search, X, Check, BookOpen } from 'lucide-react';
import { mockNotes } from '../data/mockData';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={`card-hover p-5 group cursor-pointer ${note.pinned ? 'ring-2 ring-primary/20 dark:ring-primary/30' : ''}`}
      onClick={() => onEdit(note)}
    >
      {note.pinned && (
        <div className="flex items-center gap-1 text-primary text-xs font-medium mb-2">
          <Pin size={12} className="fill-current" />
          Pinned
        </div>
      )}
      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-1">{note.title}</h3>
      <div
        className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 mb-3 prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {note.tags.map((tag) => (
            <span key={tag} className="badge-primary text-xs">{tag}</span>
          ))}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onTogglePin(note.id); }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-all"
          >
            {note.pinned ? <PinOff size={13} /> : <Pin size={13} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-300 dark:text-gray-600 mt-2">
        {new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </p>
    </motion.div>
  );
}

export default function NotesPage() {
  const [notes, setNotes] = useState(mockNotes);
  const [search, setSearch] = useState('');
  const [editNote, setEditNote] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });

  const filtered = notes
    .filter((n) => {
      const q = search.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    })
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const handleCreate = () => {
    if (!newNote.title.trim()) { toast.error('Title required'); return; }
    const note = {
      id: Date.now(),
      title: newNote.title,
      content: newNote.content || '<p>Start typing your note...</p>',
      tags: newNote.tags.split(',').map((t) => t.trim()).filter(Boolean),
      tripId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false,
    };
    setNotes((p) => [note, ...p]);
    setNewNote({ title: '', content: '', tags: '' });
    setIsCreating(false);
    toast.success('Note created!');
  };

  const handleSaveEdit = () => {
    setNotes((p) => p.map((n) => n.id === editNote.id ? { ...editNote, updatedAt: new Date().toISOString() } : n));
    setEditNote(null);
    toast.success('Note saved!');
  };

  const handleDelete = (id) => {
    setNotes((p) => p.filter((n) => n.id !== id));
    toast.success('Note deleted');
  };

  const handleTogglePin = (id) => {
    setNotes((p) => p.map((n) => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Travel Notes</h1>
            <p className="text-sm text-gray-400 mt-0.5">{notes.length} notes</p>
          </div>
          <Button variant="primary" icon={Plus} onClick={() => setIsCreating(true)}>
            New Note
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="input-field pl-10"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Notes Grid */}
        {filtered.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={setEditNote}
                  onDelete={handleDelete}
                  onTogglePin={handleTogglePin}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title={search ? 'No notes found' : 'No notes yet'}
            description={search ? 'Try a different search' : 'Start capturing your travel thoughts, tips, and memories.'}
            action={!search && <Button variant="primary" icon={Plus} onClick={() => setIsCreating(true)}>Create First Note</Button>}
          />
        )}

        {/* Create Note Modal */}
        <Modal isOpen={isCreating} onClose={() => setIsCreating(false)} title="New Note" size="lg">
          <div className="p-6 space-y-4">
            <input
              autoFocus
              className="input-field text-base font-semibold"
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote((p) => ({ ...p, title: e.target.value }))}
            />
            <textarea
              className="input-field resize-none text-sm"
              rows={8}
              placeholder="Write your notes, tips, or thoughts here..."
              value={newNote.content}
              onChange={(e) => setNewNote((p) => ({ ...p, content: e.target.value }))}
            />
            <input
              className="input-field text-sm"
              placeholder="Tags (comma-separated): e.g. Santorini, Tips, Food"
              value={newNote.tags}
              onChange={(e) => setNewNote((p) => ({ ...p, tags: e.target.value }))}
            />
            <div className="flex gap-3 pt-1">
              <Button variant="secondary" className="flex-1" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button variant="primary" className="flex-1" icon={Check} onClick={handleCreate}>Create Note</Button>
            </div>
          </div>
        </Modal>

        {/* Edit Note Modal */}
        <Modal isOpen={!!editNote} onClose={() => setEditNote(null)} title="Edit Note" size="lg">
          {editNote && (
            <div className="p-6 space-y-4">
              <input
                autoFocus
                className="input-field text-base font-semibold"
                value={editNote.title}
                onChange={(e) => setEditNote((p) => ({ ...p, title: e.target.value }))}
              />
              <textarea
                className="input-field resize-none text-sm"
                rows={8}
                value={editNote.content.replace(/<[^>]+>/g, '')}
                onChange={(e) => setEditNote((p) => ({ ...p, content: e.target.value }))}
              />
              <input
                className="input-field text-sm"
                placeholder="Tags (comma-separated)"
                value={editNote.tags.join(', ')}
                onChange={(e) => setEditNote((p) => ({ ...p, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) }))}
              />
              <div className="flex gap-3 pt-1">
                <Button variant="secondary" className="flex-1" onClick={() => setEditNote(null)}>Cancel</Button>
                <Button variant="primary" className="flex-1" icon={Check} onClick={handleSaveEdit}>Save Note</Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
}
