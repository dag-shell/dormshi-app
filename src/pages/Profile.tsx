import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { UserAvatar } from '@common/UserAvatar';
import { QRCode } from '@common/QRCode';

const stats = [
  { label: 'Requests', value: '4' },
  { label: 'Deliveries', value: '23' },
  { label: 'Rating', value: '4.9' }
];

export function Profile() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-5 pt-6 lg:px-10 lg:pt-10">
      <section className="flex items-center gap-4">
        <UserAvatar initials="MO" isMe size="xl" />
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight lg:text-2xl">Maya Okafor</h1>
          <p className="text-sm text-muted-foreground">Northfield University</p>
          <p className="text-sm text-muted-foreground">Hartley Hall 3B · Since Sep 2025</p>
        </div>
      </section>

      <dl className="grid grid-cols-3 divide-x rounded-xl border bg-card text-center">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse py-4">
            <dt className="text-xs text-muted-foreground">{s.label}</dt>
            <dd className="flex items-center justify-center gap-1 text-lg font-semibold">
              {s.label === 'Rating' && <Star className="size-4 fill-current" aria-hidden="true" />}
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      <section
        aria-labelledby="qr-title"
        className="flex flex-col items-center gap-4 rounded-xl border bg-card p-6 text-center sm:flex-row sm:text-left"
      >
        <div className="rounded-lg border p-2">
          <QRCode value="dormshi:user:u_me" size={144} label="Your personal Dormshi QR code" />
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
    </div>
  );
}