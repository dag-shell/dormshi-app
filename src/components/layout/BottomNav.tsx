import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake, faHouse, faPlus, faUser, faWallet } from '@fortawesome/free-solid-svg-icons';

export function BottomNav() {
  const location = useLocation();
  const isOffersActive = location.pathname.startsWith('/offers');
  const isHomeActive = location.pathname === '/';

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-3 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5">
        {/* 1. Home */}
        <NavLink
          to="/"
          className={`flex flex-col items-center gap-1 rounded-full py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            isHomeActive
              ? 'text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FontAwesomeIcon icon={faHouse} className="size-4" aria-hidden="true" />
          <span>Home</span>
        </NavLink>

        {/* 2. Offers */}
        <NavLink
          to="/offers"
          className={`flex flex-col items-center gap-1 rounded-full py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            isOffersActive
              ? 'text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FontAwesomeIcon icon={faHandshake} className="size-4" aria-hidden="true" />
          <span>Offers</span>
        </NavLink>

        {/* 3. Center (+) Post Order Button */}
        <NavLink
          to="/requests/new"
          aria-label="Post new order"
          className="group flex flex-col items-center -mt-5 focus-visible:outline-none"
        >
          <div className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 transition-transform group-hover:scale-105 group-active:scale-95">
            <FontAwesomeIcon icon={faPlus} className="size-4.5" aria-hidden="true" />
          </div>
          <span className="mt-1 text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
            Order
          </span>
        </NavLink>

        {/* 4. Wallet */}
        <NavLink
          to="/wallet"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 rounded-full py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isActive
                ? 'text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`
          }
        >
          <FontAwesomeIcon icon={faWallet} className="size-4" aria-hidden="true" />
          <span>Wallet</span>
        </NavLink>

        {/* 5. Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 rounded-full py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isActive
                ? 'text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`
          }
        >
          <FontAwesomeIcon icon={faUser} className="size-4" aria-hidden="true" />
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}
