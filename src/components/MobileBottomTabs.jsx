import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Store, Wrench, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MobileBottomTabs() {
  const location = useLocation();
  const { impact, setIsCartOpen } = useCart();
  const path = location.pathname;

  const isActive = (target) => {
    if (target === '/' && path === '/') return true;
    if (target !== '/' && path.startsWith(target)) return true;
    return false;
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-3 py-1 flex items-center justify-around safe-area-bottom"
    >
      <Link
        to="/"
        className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 transition-colors ${
          isActive('/') ? 'text-emerald-700 font-extrabold' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        <Home className={`w-5 h-5 ${isActive('/') ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
      </Link>

      <Link
        to="/shop"
        className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 transition-colors ${
          isActive('/shop') ? 'text-emerald-700 font-extrabold' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        <Store className={`w-5 h-5 ${isActive('/shop') ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Shop</span>
      </Link>

      <Link
        to="/tools"
        className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 transition-colors ${
          isActive('/tools') ? 'text-emerald-700 font-extrabold' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        <Wrench className={`w-5 h-5 ${isActive('/tools') ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Tools</span>
      </Link>

      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 text-stone-500 hover:text-stone-900 transition-colors relative"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
          {impact.totalItems > 0 && (
            <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 bg-emerald-600 text-white text-[9px] font-black rounded-full shadow-xs">
              {impact.totalItems}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight">Cart</span>
      </button>

      <Link
        to="/profile"
        className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 transition-colors ${
          isActive('/profile') ? 'text-emerald-700 font-extrabold' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        <User className={`w-5 h-5 ${isActive('/profile') ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Profile</span>
      </Link>
    </nav>
  );
}
