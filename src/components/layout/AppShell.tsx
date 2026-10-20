import React, { useEffect } from 'react';
import { Outlet, useLocation } from '@tanstack/react-router';
import { BottomNav } from './BottomNav';

const hideNavPatterns = [
  /^\/orders\/new$/,
  /^\/orders\/[^/]+$/,
  /^\/orders\/[^/]+\/track$/,
  /^\/orders\/[^/]+\/confirm$/,
  /^\/requests\/new$/,
  /^\/requests\/[^/]+$/,
  /^\/requests\/[^/]+\/track$/,
  /^\/requests\/[^/]+\/confirm$/
];

const titles: [RegExp, string][] = [
  [/^\/$/, 'Orders'],
  [/^\/orders$/, 'Orders'],
  [/^\/orders\/new$/, 'New order'],
  [/^\/orders\/[^/]+$/, 'Order details'],
  [/^\/orders\/[^/]+\/confirm$/, 'Confirm delivery'],
  [/^\/orders\/[^/]+\/track$/, 'Order tracking'],
  [/^\/requests\/new$/, 'New order'],
  [/^\/requests\/[^/]+$/, 'Order details'],
  [/^\/requests\/[^/]+\/confirm$/, 'Confirm delivery'],
  [/^\/requests\/[^/]+\/track$/, 'Order tracking'],
  [/^\/offers$/, 'Offers'],
  [/^\/wallet$/, 'Wallet'],
  [/^\/profile$/, 'Profile'],
  [/^\/terms$/, 'Terms of Service'],
  [/^\/privacy$/, 'Privacy Policy'],
];

const DESCRIPTION =
  'Dormshi is campus food delivery between students. Post what you want, pick the best offer, and pay in Dormshi Coin only after QR-verified delivery.';

export function AppShell() {
  const { pathname } = useLocation();
  const showBottomNav = !hideNavPatterns.some((p) => p.test(pathname));

  useEffect(() => {
    window.scrollTo(0, 0);
    const page = titles.find(([p]) => p.test(pathname))?.[1];
    document.title = page ? `${page} · Dormshi` : 'Dormshi';
  }, [pathname]);

  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = DESCRIPTION;
  }, []);

  return (
    <div className="min-h-screen w-full bg-background">
      <main className={`mx-auto w-full ${showBottomNav ? 'pb-20' : 'pb-16'}`}>
        <Outlet />
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}