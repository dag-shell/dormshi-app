import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { SideNav } from './SideNav';

const hideNavPatterns = [/^\/requests\/new$/, /^\/requests\/[^/]+\/confirm$/];

const titles: [RegExp, string][] = [
[/^\/$/, 'Home'],
[/^\/requests\/new$/, 'New request'],
[/^\/requests\/[^/]+$/, 'Request details'],
[/^\/requests\/[^/]+\/confirm$/, 'Confirm delivery'],
[/^\/requests\/[^/]+\/track$/, 'Request tracking'],
[/^\/wallet$/, 'Wallet'],
[/^\/profile$/, 'Profile'],
[/^\/terms$/, 'Terms of Service'],
[/^\/privacy$/, 'Privacy Policy']];


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
      <SideNav />
      <div className="lg:pl-64">
        <main className={showBottomNav ? 'pb-24 lg:pb-12' : 'pb-12'}>
          <Outlet />
        </main>
      </div>
      {showBottomNav && <BottomNav />}
    </div>);

}