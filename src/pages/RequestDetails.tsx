import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@common/StatusBadge';
import { OfferCard } from '@/components/request-details/OfferCard';
import { BottomSheet } from '@common/BottomSheet';
import { TermsBreakdown } from '@common/TermsBreakdown';
import { ReasonSheet } from '@/components/order/ReasonSheet';
import { Button } from '@/components/ui/button';
import type { OrderStatus } from '@/types/dormshi';

export function RequestDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sort, setSort] = useState<'total' | 'eta'>('total');
  const [pendingOpen, setPendingOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const state = (location.state as {
    food?: string;
    items?: { name: string; quantity: number; price?: number }[];
    pickup?: string;
    destination?: string;
    instructions?: string;
    status?: OrderStatus;
    agreement?: { foodPrice: number; deliveryFee: number };
  }) || {};

  const orderTitle = state.food || 'Taro milk tea, Boba';
  const pickup = state.pickup || 'Tea Lab, Union Square';
  const destination = state.destination || 'Hartley Hall, 3rd floor lounge';
  const instructions = state.instructions || 'Less ice on both please. Text me when downstairs.';
  const status: OrderStatus = state.status || 'open';
  const agreement = state.agreement;

  const isFinalized = Boolean(agreement || status !== 'open');

  const items = state.items || [
    { name: 'Taro milk tea', quantity: 2, price: isFinalized ? 50 : undefined },
    { name: 'Boba topping', quantity: 2, price: isFinalized ? 10 : undefined },
  ];

  const foodTotal = isFinalized ? (agreement?.foodPrice ?? 120) : null;
  const deliveryFee = isFinalized ? (agreement?.deliveryFee ?? 20) : null;
  const grandTotal = isFinalized && foodTotal && deliveryFee ? foodTotal + deliveryFee : null;

  return (
    <div>
      <PageHeader title="Your request" subtitle="Posted 11m ago" />

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-8 lg:px-10 lg:py-8">
        <section className="overflow-hidden rounded-lg border border-border bg-card p-5 lg:sticky lg:top-24">
          <div>
            <div className="flex items-center justify-between">
              <StatusBadge status={status} />
              <span className="font-mono text-xs text-muted-foreground">#DMS-R1</span>
            </div>
            <h2 className="mt-3 text-lg font-semibold leading-snug tracking-tight">
              {orderTitle}
            </h2>

            {/* Items Breakdown with Quantity and Price */}
            <div className="mt-5 border-t border-border/70 pt-4">
              <h3 className="text-xs font-semibold text-muted-foreground">
                Items ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h3>
              <ul className="mt-2 divide-y divide-border/50 text-sm">
                {items.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-muted-foreground">
                        {item.quantity}x
                      </span>
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                    <span className="font-mono text-xs font-medium text-foreground">
                      {isFinalized && item.price ? `ETB ${(item.price * item.quantity).toFixed(2)}` : '---'}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Price Breakdown: --- until offer accepted and finalized */}
              <div className="mt-3 space-y-1.5 border-t border-border/50 pt-3 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Food total</span>
                  <span className="font-mono font-medium text-foreground">
                    {isFinalized && foodTotal ? `ETB ${foodTotal.toFixed(2)}` : '---'}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery fee</span>
                  <span className="font-mono font-medium text-foreground">
                    {isFinalized && deliveryFee ? `ETB ${deliveryFee.toFixed(2)}` : '---'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border/40 pt-2 text-sm font-semibold text-foreground">
                  <span>Total</span>
                  <span className="font-mono">
                    {isFinalized && grandTotal ? `ETB ${grandTotal.toFixed(2)}` : '---'}
                  </span>
                </div>
              </div>
              {!isFinalized && (
                <p className="mt-2.5 text-[11px] text-muted-foreground">
                  Prices finalize once you accept an offer.
                </p>
              )}
            </div>

            {/* Pickup & Destination */}
            <dl className="mt-5 space-y-3 border-t border-border/70 pt-4 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Pickup</dt>
                <dd className="mt-1 font-medium">{pickup}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Deliver to</dt>
                <dd className="mt-1 font-medium">{destination}</dd>
              </div>
            </dl>

            {instructions && (
              <p className="mt-4 rounded-lg bg-secondary px-3 py-2 text-sm leading-6 text-muted-foreground">
                {instructions}
              </p>
            )}
          </div>
        </section>

        <section aria-labelledby="offers-title">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="offers-title" className="text-base font-semibold tracking-tight">
              Offers <span className="text-muted-foreground">(3)</span>
            </h2>
            <div className="flex rounded-lg border bg-card p-1 text-xs" role="group" aria-label="Sort offers">
              <button
                type="button"
                onClick={() => setSort('total')}
                aria-pressed={sort === 'total'}
                className={`rounded-md px-3 py-1 font-medium ${
                  sort === 'total' ? 'bg-secondary text-foreground' : 'text-muted-foreground'
                }`}
              >
                Lowest total
              </button>
              <button
                type="button"
                onClick={() => setSort('eta')}
                aria-pressed={sort === 'eta'}
                className={`rounded-md px-3 py-1 font-medium ${
                  sort === 'eta' ? 'bg-secondary text-foreground' : 'text-muted-foreground'
                }`}
              >
                Fastest
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <OfferCard
              offer={{
                name: 'Lena Park',
                initials: 'LP',
                rating: 4.9,
                deliveries: 84,
                dorm: 'Hartley Hall 1A',
                foodPrice: '12.80',
                deliveryFee: '3.00',
                etaMinutes: 12,
                total: 'ETB 128',
                note: 'Already at Union Square, can grab it right now.',
                timeAgo: '3m ago',
                highlight: 'Best price'
              }}
              onAccept={() => setPendingOpen(true)}
            />

            <OfferCard
              offer={{
                name: 'Jordan Reyes',
                initials: 'JR',
                rating: 4.8,
                deliveries: 61,
                dorm: 'Ellis Hall',
                foodPrice: '13.00',
                deliveryFee: '2.50',
                etaMinutes: 15,
                total: 'ETB 125',
                note: 'Heading back to Hartley anyway.',
                timeAgo: '6m ago',
                highlight: 'Fastest'
              }}
              onAccept={() => setPendingOpen(true)}
            />

            <OfferCard
              offer={{
                name: 'Dev Mehta',
                initials: 'DM',
                rating: 4.6,
                deliveries: 19,
                dorm: 'Okoro Commons',
                foodPrice: '13.00',
                deliveryFee: '1.75',
                etaMinutes: 25,
                total: 'ETB 118',
                note: 'Can pick up on my way out of class.',
                timeAgo: '8m ago'
              }}
              onAccept={() => setPendingOpen(true)}
            />
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            You choose who delivers. Accepting locks the price, fee, and time.
          </p>
          <Button variant="ghost" className="mt-4 w-full text-destructive" onClick={() => setCancelOpen(true)}>
            Cancel request
          </Button>
        </section>
      </div>

      <BottomSheet
        open={pendingOpen}
        onClose={() => setPendingOpen(false)}
        title="Accept this offer?"
        description="Lena Park will get your food."
      >
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <TermsBreakdown foodPrice={12.8} deliveryFee={3.0} etaLabel="12 min" />
          </div>
          <dl className="divide-y rounded-lg border bg-card text-sm">
            <div className="flex gap-4 px-4 py-3">
              <dt className="w-24 shrink-0 font-medium">Now</dt>
              <dd className="text-muted-foreground">15.80 ETB is reserved from your wallet.</dd>
            </div>
            <div className="flex gap-4 px-4 py-3">
              <dt className="w-24 shrink-0 font-medium">At delivery</dt>
              <dd className="text-muted-foreground">Released after you scan Lena’s QR code.</dd>
            </div>
            <div className="flex gap-4 px-4 py-3">
              <dt className="w-24 shrink-0 font-medium">If cancelled</dt>
              <dd className="text-muted-foreground">Full refund any time before pickup.</dd>
            </div>
          </dl>
          <Button
            size="lg"
            className="h-11 w-full"
            onClick={() => {
              setPendingOpen(false);
              navigate('/requests/r2/track');
            }}
          >
            Accept & reserve 15.80 ETB
          </Button>
        </div>
      </BottomSheet>

      <ReasonSheet
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel request?"
        description="Fulfillers who offered will be notified."
        reasons={['I don’t need it anymore', 'Offers are too expensive', 'I posted the wrong details', 'Other']}
        note="No funds have been reserved yet, so nothing needs to be refunded."
        confirmLabel="Cancel request"
        destructive
        onConfirm={() => {
          setCancelOpen(false);
          navigate('/');
        }}
      />
    </div>
  );
}