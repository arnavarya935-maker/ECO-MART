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
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-md max-w-2xl mx-auto space-y-6">
      <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
          Shared Collective Wisdom
        </span>
        <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 mt-2">
          Community Tips & Zero-Waste Stories
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Share your daily swaps, upcycling hacks, and learn from fellow conscious shoppers. Stored locally offline.
        </p>
      </div>

      {/* New Post Creator */}
      <form onSubmit={handleCreatePost} className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">✍️</span>
          <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
            Share a tip or swap experience:
          </span>
        </div>
        <textarea
          rows={3}
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          placeholder="e.g. Swapped to bamboo cutlery for work lunches and saved 5 plastic forks this week..."
          className="w-full p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-emerald-500 resize-none"
        />

        <div className="flex items-center justify-between pt-1">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-[11px] font-bold text-stone-700 dark:text-stone-300 focus:outline-hidden"
          >
            <option value="My Eco Tip">🌱 My Eco Tip</option>
            <option value="Kitchen Swap">🍴 Kitchen Swap</option>
            <option value="Personal Care">🧼 Personal Care</option>
            <option value="Zero Waste Hack">♻️ Zero Waste Hack</option>
          </select>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer"
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
            className="p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-lg">
                  {post.avatar}
                </div>
                <div>
                  <div className="font-black text-xs text-stone-900 dark:text-stone-100">{post.author}</div>
                  <div className="text-[10px] text-stone-400 font-medium">{post.location} • {post.time}</div>
                </div>
              </div>

              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {post.tag}
              </span>
            </div>

            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
              {post.content}
            </p>

            <div className="flex items-center gap-4 pt-2 border-t border-stone-200/50 dark:border-stone-700/50 text-xs text-stone-500">
              <button
                type="button"
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1 font-bold transition cursor-pointer ${
                  post.liked ? 'text-rose-600 dark:text-rose-400' : 'hover:text-stone-800'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${post.liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{post.likes} Helpful</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
