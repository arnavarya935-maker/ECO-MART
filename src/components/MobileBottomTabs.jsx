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

  if (path.startsWith('/product/')) {
    return null;
  }

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-line shadow-[0_-4px_20px_rgba(20,40,30,0.05)] px-3 py-1 flex items-center justify-around safe-area-bottom"
    >
      <Link
        to="/"
        className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 transition-colors ${
          isActive('/') ? 'text-heading font-semibold' : 'text-muted hover:text-heading'
        }`}
      >
        <Home className={`w-5 h-5 ${isActive('/') ? 'stroke-[2.2] text-primary' : 'stroke-[1.8]'}`} />
        <span className="text-xs font-sans mt-0.5 tracking-tight">Home</span>
      </Link>

      <Link
        to="/shop"
        className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 transition-colors ${
          isActive('/shop') ? 'text-heading font-semibold' : 'text-muted hover:text-heading'
        }`}
      >
        <Store className={`w-5 h-5 ${isActive('/shop') ? 'stroke-[2.2] text-primary' : 'stroke-[1.8]'}`} />
        <span className="text-xs font-sans mt-0.5 tracking-tight">Shop</span>
      </Link>

      <Link
        to="/tools"
        className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 transition-colors ${
          isActive('/tools') ? 'text-heading font-semibold' : 'text-muted hover:text-heading'
        }`}
      >
        <Wrench className={`w-5 h-5 ${isActive('/tools') ? 'stroke-[2.2] text-primary' : 'stroke-[1.8]'}`} />
        <span className="text-xs font-sans mt-0.5 tracking-tight">Tools</span>
      </Link>

      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 text-muted hover:text-heading transition-colors relative cursor-pointer"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
          {impact.totalItems > 0 && (
            <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 bg-primary text-primary-contrast text-xs font-sans font-bold rounded-full shadow-xs">
              {impact.totalItems}
            </span>
          )}
        </div>
        <span className="text-xs font-sans mt-0.5 tracking-tight">Cart</span>
      </button>

      <Link
        to="/profile"
        className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 transition-colors ${
          isActive('/profile') ? 'text-heading font-semibold' : 'text-muted hover:text-heading'
        }`}
      >
        <User className={`w-5 h-5 ${isActive('/profile') ? 'stroke-[2.2] text-primary' : 'stroke-[1.8]'}`} />
        <span className="text-xs font-sans mt-0.5 tracking-tight">Profile</span>
      </Link>
    </nav>
  );
}

