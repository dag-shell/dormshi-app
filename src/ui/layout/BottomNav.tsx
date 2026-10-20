import { Link, useLocation } from '@tanstack/react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBowlRice, faHandshake, faPlus, faUser, faWallet } from '@fortawesome/free-solid-svg-icons';

export function BottomNav() {
  const location = useLocation();
  const isOffersActive = location.pathname.startsWith('/offers');
  const isHomeActive = location.pathname === '/' || location.pathname.startsWith('/orders');
  const isWalletActive = location.pathname.startsWith('/wallet');
  const isProfileActive = location.pathname.startsWith('/profile');

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card"
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-3 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5">
        {/* 1. Home / Orders */}
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 rounded-full py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            isHomeActive
              ? 'text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FontAwesomeIcon icon={faBowlRice} className="size-4" aria-hidden="true" />
          <span>Orders</span>
        </Link>

        {/* 2. Offers */}
        <Link
          to="/offers"
          className={`flex flex-col items-center gap-1 rounded-full py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            isOffersActive
              ? 'text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FontAwesomeIcon icon={faHandshake} className="size-4" aria-hidden="true" />
          <span>Offers</span>
        </Link>

        {/* 3. Center (+) Post Order Button */}
        <Link
          to="/orders/new"
          aria-label="Post new order"
          className="group flex flex-col items-center -mt-5 focus-visible:outline-none"
        >
          <div className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 transition-transform group-hover:scale-105 group-active:scale-95">
            <FontAwesomeIcon icon={faPlus} className="size-4.5" aria-hidden="true" />
          </div>
        </Link>

        {/* 4. Wallet */}
        <Link
          to="/wallet"
          className={`flex flex-col items-center gap-1 rounded-full py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            isWalletActive
              ? 'text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FontAwesomeIcon icon={faWallet} className="size-4" aria-hidden="true" />
          <span>Wallet</span>
        </Link>

        {/* 5. Profile */}
        <Link
          to="/profile"
          className={`flex flex-col items-center gap-1 rounded-full py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            isProfileActive
              ? 'text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FontAwesomeIcon icon={faUser} className="size-4" aria-hidden="true" />
          <span>Account</span>
        </Link>
      </div>
    </nav>
  );
}
