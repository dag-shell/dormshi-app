import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { UserAvatar } from '../components/UserAvatar';
import { QRCode } from '../components/QRCode';
import { useDormshi } from '../contexts/DormshiContext';
import { CURRENT_USER_ID } from '../data/users';

export function Profile() {
  const { currentUser, requests } = useDormshi();
  const posted = requests.filter((r) => r.requesterId === CURRENT_USER_ID).length;

  const stats = [
  { label: 'Requests', value: String(posted) },
  { label: 'Deliveries', value: String(currentUser.deliveries) },
  { label: 'Rating', value: currentUser.rating.toFixed(1) }];


  return (
    <div className="mx-auto max-w-3xl space-y-6 px-5 pt-6 lg:px-10 lg:pt-10">
      <section className="flex items-center gap-4">
        <UserAvatar user={currentUser} size="xl" />
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight lg:text-2xl">{currentUser.name}</h1>
          <p className="text-sm text-muted-foreground">{currentUser.campus}</p>
          <p className="text-sm text-muted-foreground">{currentUser.dorm} · Since {currentUser.joined}</p>
        </div>
      </section>

      <dl className="grid grid-cols-3 divide-x rounded-xl border bg-card text-center">
        {stats.map((s) =>
        <div key={s.label} className="flex flex-col-reverse py-4">
            <dt className="text-xs text-muted-foreground">{s.label}</dt>
            <dd className="flex items-center justify-center gap-1 text-lg font-semibold">
              {s.label === 'Rating' && <Star className="size-4 fill-current" aria-hidden="true" />}
              {s.value}
            </dd>
          </div>
        )}
      </dl>

      <section aria-labelledby="qr-title" className="flex flex-col items-center gap-4 rounded-xl border bg-card p-6 text-center sm:flex-row sm:text-left">
        <div className="rounded-lg border p-2">
          <QRCode value={`dormshi:user:${CURRENT_USER_ID}`} size={144} label="Your personal Dormshi QR code" />
        </div>
        <div>
          <h2 id="qr-title" className="text-base font-semibold">Your QR code</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Show it when you deliver so the requester can confirm and release payment. Friends can also scan it to send you DC.
          </p>
        </div>
      </section>

      <p className="flex justify-center gap-4 pb-4 text-xs text-muted-foreground lg:hidden">
        <Link to="/terms" className="hover:text-foreground">Terms</Link>
        <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
        <span>© 2026 Dormshi</span>
      </p>
    </div>);

}