import React from 'react';

const howItWorks = [
  { title: 'Request', body: 'Post what you want, where from, and where to.' },
  { title: 'Offer', body: 'Nearby students reply with price, fee, and ETA.' },
  { title: 'Agree', body: 'You pick an offer. Terms lock and DC is reserved.' },
  { title: 'Fulfill', body: 'They get your food and update the status.' },
  { title: 'Receive', body: 'Scan their QR code when it arrives.' },
  { title: 'Settle', body: 'DC is released only after verified delivery.' }
];

export function HowItWorksCard() {
  return (
    <aside aria-labelledby="how-title" className="hidden rounded-xl border bg-card p-6 lg:sticky lg:top-24 lg:block">
      <h2 id="how-title" className="text-base font-semibold tracking-tight">How it works</h2>
      <ol className="mt-4 space-y-4">
        {howItWorks.map((s, i) => (
          <li key={s.title} className="flex gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary-soft font-mono text-xs font-semibold text-primary">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium">{s.title}</p>
              <p className="text-xs leading-5 text-muted-foreground">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
