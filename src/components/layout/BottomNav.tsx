import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Wallet } from 'lucide-react';

const items = [
{ to: '/', label: 'Home', icon: Home, end: true },
{ to: '/wallet', label: 'Wallet', icon: Wallet, end: false },
{ to: '/profile', label: 'Profile', icon: User, end: false }];


export function BottomNav() {
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 border-t bg-card lg:hidden">
      <ul className="mx-auto grid max-w-xl grid-cols-3 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2">
        {items.map(({ to, label, icon: Icon, end }) =>
        <li key={to}>
            <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
            `flex flex-col items-center gap-1 rounded-lg py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`

            }>
            
              <Icon className="size-5" aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        )}
      </ul>
    </nav>);

}