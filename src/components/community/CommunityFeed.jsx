import React, { useState } from 'react';
import { Heart, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const INITIAL_POSTS = [
  {
    id: 1,
    author: 'Priya Narang',
    avatar: '👩🏽‍🌾',
    location: 'Bengaluru',
    time: '2 hours ago',
    content: 'Swapped my synthetic dish sponges for natural coconut coir scrubbers! They lather just as well and go straight into my balcony compost pot when done. Zero microplastics down the sink! 🌿🥥',
    likes: 24,
    liked: false,
    tag: 'Kitchen Swap'
  },
  {
    id: 2,
    author: 'Kabir Varma',
    avatar: '👨🏽‍🎓',
    location: 'Pune',
    time: '5 hours ago',
    content: 'Refilled my travel pouch with solid shampoo and neem toothbrush before a 3-day trek. Saved 4 mini hotel plastic bottles and zero leaks in my backpack! 🎒✨',
    likes: 19,
    liked: false,
    tag: 'Travel Zero-Waste'
  },
  {
    id: 3,
    author: 'Sumanth K.',
    avatar: '👨🏽‍🌾',
    location: 'Kochi',
    time: 'Yesterday',
    content: 'Beeswax food wraps are magical. Kept half a papaya fresh for 4 days without any plastic cling film! 🐝🥭',
    likes: 31,
    liked: false,
    tag: 'Food Preservation'
  }
];

export default function CommunityFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('eco_community_posts');
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [newPostText, setNewPostText] = useState('');
  const [selectedTag, setSelectedTag] = useState('My Eco Tip');

  const handleLike = (id) => {
    const updated = posts.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
          liked: !p.liked
        };
      }
      return p;
    });
    setPosts(updated);
    try {
      localStorage.setItem('eco_community_posts', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: Date.now(),
      author: user?.name || 'Conscious Explorer',
      avatar: user?.avatar?.length <= 4 ? user.avatar : '🌱',
      location: 'Local Artisan Hub',
      time: 'Just now',
      content: newPostText.trim(),
      likes: 1,
      liked: true,
      tag: selectedTag
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    setNewPostText('');
    try {
      localStorage.setItem('eco_community_posts', JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm max-w-2xl mx-auto space-y-6">
      <div className="border-b border-line pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
            Shared Collective Wisdom
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted bg-surface-sunken border border-line px-2 py-0.5 rounded-full">
            Demo Data
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-heading mt-2">
          Community Tips & Zero-Waste Stories
        </h3>
        <p className="text-xs sm:text-sm text-secondary mt-0.5">
          Share your daily swaps, upcycling hacks, and learn from fellow conscious shoppers. Seeded sample contributions.
        </p>
      </div>

      {/* New Post Creator */}
      <form onSubmit={handleCreatePost} className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-base">✍️</span>
          <span className="text-xs font-semibold text-heading">
            Share a tip or swap experience:
          </span>
        </div>
        <textarea
          rows={3}
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          placeholder="e.g. Swapped to bamboo cutlery for work lunches and saved 5 plastic forks this week..."
          className="w-full p-3.5 rounded-2xl bg-surface border border-line text-xs text-heading placeholder:text-muted focus:outline-2 focus:outline-focus focus:border-primary resize-none shadow-soft-xs min-h-[44px]"
        />

        <div className="flex items-center justify-between pt-1">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2 rounded-full bg-surface border border-line text-[11px] font-medium text-secondary focus:outline-2 focus:outline-focus shadow-soft-xs min-h-[44px] cursor-pointer"
          >
            <option value="My Eco Tip">🌱 My Eco Tip</option>
            <option value="Kitchen Swap">🍴 Kitchen Swap</option>
            <option value="Personal Care">🧼 Personal Care</option>
            <option value="Zero Waste Hack">♻️ Zero Waste Hack</option>
          </select>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs shadow-soft-xs transition active:scale-95 cursor-pointer min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post to Community</span>
          </button>
        </div>
      </form>

      {/* Feed List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-3 transition hover:bg-surface-sunken/80"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-lg shadow-soft-xs">
                  {post.avatar}
                </div>
                <div>
                  <div className="font-semibold text-xs text-heading">{post.author}</div>
                  <div className="text-[10px] text-muted font-normal">{post.location} • {post.time}</div>
                </div>
              </div>

              <span className="text-[10px] font-medium uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {post.tag}
              </span>
            </div>

            <p className="text-xs text-secondary leading-relaxed font-normal">
              {post.content}
            </p>

            <div className="flex items-center gap-4 pt-2.5 border-t border-line text-xs text-muted">
              <button
                type="button"
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 font-medium transition cursor-pointer min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus ${
                  post.liked ? 'text-danger' : 'hover:text-heading'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${post.liked ? 'fill-danger text-danger' : ''}`} />
                <span>{post.likes} Helpful</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
