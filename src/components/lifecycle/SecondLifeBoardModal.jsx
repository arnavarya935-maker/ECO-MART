import {
  Repeat,
  Plus,
  X,
  MapPin,
  CheckCircle2,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { getSecondLifePosts, addSecondLifePost } from '../../lib/circularityEngine';

const CATEGORIES = ['All', 'Kitchen', 'Home', 'Accessories', 'Garden', 'Personal Care'];

export default function SecondLifeBoardModal({ isOpen, onClose }) {
  const [posts, setPosts] = useState(() => getSecondLifePosts());
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Kitchen');
  const [newCity, setNewCity] = useState('Bengaluru');
  const [newArea, setNewArea] = useState('');
  const [newCondition, setNewCondition] = useState('Like New');
  const [newDescription, setNewDescription] = useState('');

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const updated = addSecondLifePost({
      title: newTitle,
      category: newCategory,
      city: newCity,
      area: newArea || 'Local Ward',
      condition: newCondition,
      description: newDescription
    });

    setPosts(updated);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowAddForm(false);
    }, 1500);

    setNewTitle('');
    setNewArea('');
    setNewDescription('');
  };

  const filteredPosts = posts.filter((p) => {
    return filterCategory === 'All' || p.category === filterCategory;
  });

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-surface-raised border border-line rounded-3xl shadow-soft-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-line flex items-center justify-between bg-surface-sunken">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-heading">
                  Community Second Life Board
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-raised border border-line text-text-muted">
                  Peer Upcycling Desk
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Pass along clean jars, seedling pots, and surplus containers. 100% local, zero personal tracking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-mono font-medium flex items-center gap-1 shadow-soft-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'View Listings' : 'List an Item'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="p-2 rounded-xl border border-line bg-surface hover:bg-surface-sunken text-text-muted hover:text-heading text-xs font-mono transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-line text-text-muted hover:text-heading hover:bg-surface transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* How it works drawer */}
        {showHowItWorks && (
          <div className="p-4 bg-surface border-b border-line text-xs space-y-1.5 animate-fade-in text-left">
            <div className="flex items-center gap-1.5 font-serif font-bold text-heading">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>About Second Life Exchange</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              To guarantee complete consumer privacy, listings are stored exclusively in your local browser sandbox. No phone numbers, payment details, or personal telemetry are transmitted to any cloud servers.
            </p>
          </div>
        )}

        {/* Category Filter Toolbar */}
        {!showAddForm && (
          <div className="p-3 border-b border-line bg-surface flex gap-1.5 overflow-x-auto scrollbar-thin">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-mono transition cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-primary text-white font-semibold'
                    : 'bg-surface-sunken border border-line text-text-secondary hover:text-heading'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-left font-sans">
          {showAddForm ? (
            /* Submission Form */
            <form onSubmit={handleCreatePost} className="space-y-4 max-w-xl mx-auto">
              <div className="border-b border-line pb-2">
                <h4 className="font-serif font-bold text-base text-heading">
                  Give Away or Share a Reusable Item
                </h4>
                <p className="text-xs text-text-secondary">
                  Help local neighbors find clean glass jars, fabric scraps, or seedling containers.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-mono text-text-muted uppercase block mb-1">
                  Item Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 6x Clean glass honey jars for bulk spices"
                  className="w-full p-2.5 rounded-xl bg-surface-sunken border border-line text-xs text-heading font-sans focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-text-muted uppercase block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-sunken border border-line text-xs text-heading font-sans focus:outline-none focus:border-primary"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-text-muted uppercase block mb-1">
                    Condition
                  </label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-sunken border border-line text-xs text-heading font-sans focus:outline-none focus:border-primary"
                  >
                    <option value="Like New (Sterilized)">Like New (Sterilized)</option>
                    <option value="Gently Used">Gently Used</option>
                    <option value="Good Condition">Good Condition</option>
                    <option value="Needs Cleaning">Needs Cleaning</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-text-muted uppercase block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-sunken border border-line text-xs text-heading font-sans focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-text-muted uppercase block mb-1">
                    Locality / Ward
                  </label>
                  <input
                    type="text"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    placeholder="e.g. Indiranagar / Bandra"
                    className="w-full p-2.5 rounded-xl bg-surface-sunken border border-line text-xs text-heading font-sans focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-text-muted uppercase block mb-1">
                  Notes / Suggested Repurpose Use
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe dimensions or how you suggest repurposing this..."
                  className="w-full p-2.5 rounded-xl bg-surface-sunken border border-line text-xs text-heading font-sans focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-primary text-white font-mono text-xs font-bold hover:opacity-90 transition shadow-soft-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Publish to Local Second Life Board</span>
              </button>

              {submitted && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Item added to local community board!</span>
                </div>
              )}
            </form>
          ) : (
            /* Listings Grid */
            <div className="space-y-3">
              {filteredPosts.length === 0 ? (
                <div className="p-8 text-center text-xs text-text-muted bg-surface-sunken rounded-2xl border border-line">
                  No listings found for this category. Be the first to share an upcycled item!
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-3xl bg-surface-sunken border border-line space-y-2 hover:border-primary/40 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                            {post.category}
                          </span>
                          <span className="text-text-muted">•</span>
                          <span className="text-xs text-text-muted font-mono">{post.condition}</span>
                        </div>
                        <h4 className="font-serif font-bold text-base text-heading mt-0.5">
                          {post.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface border border-line text-text-muted shrink-0 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span>{post.city} ({post.area})</span>
                      </span>
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed">
                      {post.description}
                    </p>

                    <div className="pt-2 border-t border-line/60 flex items-center justify-between text-[10px] font-mono text-text-muted">
                      <span>Posted: {post.date}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">Free for Community Pickup</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
