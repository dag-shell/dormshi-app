import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Home, Plus, User, Wallet } from 'lucide-react';
import { UserAvatar } from './UserAvatar';
import { useDormshi } from '../contexts/DormshiContext';
import { formatAmount } from '../utils/format';

const items = [
{ to: '/', label: 'Home', icon: Home, end: true },
{ to: '/wallet', label: 'Wallet', icon: Wallet, end: false },
{ to: '/profile', label: 'Profile', icon: User, end: false }];


export function SideNav() {
  const { currentUser, wallet } = useDormshi();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-card px-4 py-6 lg:flex">
      <Link to="/" className="flex items-center gap-2 px-2">
        <span className="grid size-8 place-items-center rounded-lg bg-foreground text-sm font-semibold text-background" aria-hidden="true">d</span>
        <span className="text-lg font-semibold tracking-tight">Dormshi</span>
      </Link>

      <nav aria-label="Primary" className="mt-6">
        <ul className="space-y-1">
          {items.map(({ to, label, icon: Icon, end }) =>
          <li key={to}>
              <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isActive ? 'bg-primary-soft text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`

              }>
              
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <div className="mt-auto space-y-3">
        <Link to="/profile" className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-secondary">
          <UserAvatar user={currentUser} size="sm" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{currentUser.name}</span>
            <span className="block truncate text-xs text-muted-foreground">{currentUser.dorm}</span>
          </span>
        </Link>
        <p className="flex gap-3 px-2 text-xs text-muted-foreground">
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <span>© 2026 Dormshi</span>
        </p>
      </div>
    </aside>);

}