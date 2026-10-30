import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
      <h1 className="text-2xl font-serif font-bold text-heading">Community Updates Paused</h1>
      <p className="text-secondary text-sm">
        Community features are currently being refreshed. Please explore our sustainable shopping catalog.
      </p>
      <Link to="/shop" className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>
    </div>
  );
}
