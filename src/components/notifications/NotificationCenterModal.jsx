import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Calendar,
  Trash2,
  ExternalLink,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'Agent Insight',
    title: 'Plastic-Free Kitchen Swap Available',
    body: 'Eco Agent reviewed your browsing and discovered a 100% compostable coconut coir dish scrubber that replaces synthetic foam sponges.',
    timestamp: '2 hours ago',
    unread: true,
    actionRoute: '/shop?category=Kitchen'
  },
  {
    id: 'notif-2',
    category: 'Weekly Reminder',
    title: 'Weekly Planetary Footprint Ready',
    body: 'Your household impact ledger has updated with current cart savings: 1.8 kg CO₂e avoided this week.',
    timestamp: 'Yesterday',
    unread: true,
    actionRoute: '/impact'
  },
  {
    id: 'notif-3',
    category: 'Claim Audit',
    title: 'Claim Investigation Logged Locally',
    body: 'A deceptive "100% natural pure chemical-free" marketing claim report was successfully stored to your local Truth Lab registry.',
    timestamp: '3 days ago',
    unread: false,
    actionRoute: '/truth-lab'
  },
  {
    id: 'notif-4',
    category: 'Circularity',
    title: 'Bengaluru Dry Waste Collection Schedule',
    body: 'BBMP dry recyclables (paperboard, clean PET) collection reminder for your local zone.',
    timestamp: '5 days ago',
    unread: false,
    actionRoute: '/learn'
  }
];

export default function NotificationCenterModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_notifications');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_NOTIFICATIONS;
  });

  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    try {
      localStorage.setItem('ecomart_notifications', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (item) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );
    if (item.actionRoute) {
      navigate(item.actionRoute);
      onClose();
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filtered =
    activeFilter === 'All'
      ? notifications
      : notifications.filter((n) => n.category.toLowerCase().includes(activeFilter.toLowerCase()));

  const getCategoryIcon = (category) => {
    if (category.includes('Insight')) return <Sparkles className="w-4 h-4 text-primary" />;
    if (category.includes('Reminder')) return <Calendar className="w-4 h-4 text-accent" />;
    if (category.includes('Audit')) return <ShieldAlert className="w-4 h-4 text-warning" />;
    return <Info className="w-4 h-4 text-secondary" />;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-modals flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface-raised border border-line rounded-3xl shadow-soft-xl flex flex-col max-h-[85vh] overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-line bg-surface flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                In-App Only
              </span>
              {unreadCount > 0 && (
                <span className="text-xs font-bold text-primary font-mono">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <h3 className="font-serif font-bold text-2xl text-heading mt-1">
              Notification Center
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              Local on-device agent updates, weekly reminders, and reported claim audit logs.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl text-muted hover:text-heading hover:bg-surface-sunken transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close Notifications"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="px-6 py-2.5 bg-surface-sunken border-b border-line flex items-center justify-between text-xs">
          <div className="flex gap-2">
            {['All', 'Insight', 'Reminder', 'Audit'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  activeFilter === tab
                    ? 'bg-primary text-primary-contrast font-bold'
                    : 'text-secondary hover:text-heading'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-primary hover:underline font-medium text-xs cursor-pointer"
              >
                Mark read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAllNotifications}
                className="text-muted hover:text-danger text-xs flex items-center gap-1 cursor-pointer"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="p-6 space-y-3 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Bell className="w-8 h-8 text-muted mx-auto opacity-50" />
              <div className="text-sm font-semibold text-heading">Inbox is clear</div>
              <p className="text-xs text-muted max-w-xs mx-auto">
                No new agent insights or reminders at this time.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  item.unread
                    ? 'bg-primary/5 border-primary/30 shadow-2xs'
                    : 'bg-surface border-line hover:bg-surface-sunken/60'
                }`}
              >
                <div className="p-2 rounded-xl bg-surface-sunken border border-line shrink-0 mt-0.5">
                  {getCategoryIcon(item.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold uppercase text-primary">
                      {item.category}
                    </span>
                    <span className="text-xs text-muted font-mono">{item.timestamp}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-heading mt-0.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-secondary leading-relaxed mt-1 font-sans">
                    {item.body}
                  </p>
                </div>

                {item.unread && (
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Privacy Note */}
        <div className="p-4 bg-surface border-t border-line text-xs text-muted text-left">
          <span>🔒 <strong>Local-Only Delivery:</strong> Notifications never ping remote tracking servers or request invasive browser push permissions.</span>
        </div>
      </div>
    </div>
  );
}
