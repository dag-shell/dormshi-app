import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@common/StatusBadge';
import { OfferCard, type OfferData } from '@/components/request-details/OfferCard';
import { OfferDetailsSheet } from '@common/OfferDetailsSheet';
import { ReasonSheet } from '@/components/order/ReasonSheet';
import { OfferSheet } from '@/components/home/OfferSheet';
import { Button } from '@/components/ui/button';
import type { OrderStatus } from '@/types/dormshi';

const mockOrders: Record<string, {
  food: string;
  items: { name: string; quantity: number; price?: number }[];
  pickup: string;
  destination: string;
  instructions?: string;
  requesterName: string;
  requesterInitials: string;
  isMine: boolean;
  timeAgo: string;
  status: OrderStatus;
}> = {
  r1: {
    food: 'Taro milk tea, Boba',
    items: [
      { name: 'Taro milk tea', quantity: 2, price: 50 },
      { name: 'Boba topping', quantity: 2, price: 10 }
    ],
    pickup: 'Tea Lab, Union Square',
    destination: 'Hartley Hall, 3rd floor lounge',
    instructions: 'Less ice on both please. Text me when downstairs.',
    requesterName: 'Maya Okafor',
    requesterInitials: 'MO',
    isMine: true,
    timeAgo: '11m ago',
    status: 'open'
  },
  r2: {
    food: 'Chicken shawarma wrap, Garlic fries',
    items: [
      { name: 'Chicken shawarma wrap', quantity: 1, price: 100 },
      { name: 'Garlic fries', quantity: 1, price: 40 }
    ],
    pickup: 'Halal Cart, 5th & Main',
    destination: 'Science Library, Room 204',
    instructions: 'Extra white sauce, please.',
    requesterName: 'Maya Okafor',
    requesterInitials: 'MO',
    isMine: true,
    timeAgo: '34m ago',
    status: 'on_the_way'
  },
  r4: {
    food: 'Iced oat latte, Blueberry muffin',
    items: [
      { name: 'Iced oat latte', quantity: 1 },
      { name: 'Blueberry muffin', quantity: 1 }
    ],
    pickup: 'Bean Counter Café',
    destination: 'Engineering Building, Lab 1.12',
    instructions: 'Please call when arriving at the lab door.',
    requesterName: 'Aisha Bello',
    requesterInitials: 'AB',
    isMine: false,
    timeAgo: '4m ago',
    status: 'open'
  },
  r5: {
    food: 'Pad thai, Tofu',
    items: [
      { name: 'Pad thai', quantity: 1 },
      { name: 'Tofu', quantity: 1 }
    ],
    pickup: 'Thai Orchid, Campus Ave',
    destination: 'Ellis Hall, Room 410',
    instructions: 'Medium spice. Leave at door if room locked.',
    requesterName: 'Tomás Ruiz',
    requesterInitials: 'TR',
    isMine: false,
    timeAgo: '7m ago',
    status: 'open'
  },
  r6: {
    food: 'Clif bar, Sparkling water',
    items: [
      { name: 'Clif bar', quantity: 2 },
      { name: 'Sparkling water', quantity: 1 }
    ],
    pickup: 'CVS on College St',
    destination: 'Rec Center front desk',
    instructions: 'Any flavor Clif bar is fine.',
    requesterName: 'Lena Park',
    requesterInitials: 'LP',
    isMine: false,
    timeAgo: '13m ago',
    status: 'open'
  },
  r7: {
    food: 'Pepperoni pizza, Coke',
    items: [
      { name: 'Pepperoni pizza', quantity: 1 },
      { name: 'Coke', quantity: 2 }
    ],
    pickup: "Gino's Pizza",
    destination: 'Music Hall, practice room 7',
    instructions: 'Practice room is down the hall on the left.',
    requesterName: 'Dev Mehta',
    requesterInitials: 'DM',
    isMine: false,
    timeAgo: '18m ago',
    status: 'open'
  },
  r8: {
    food: 'Burrito bowl, Chicken',
    items: [
      { name: 'Burrito bowl', quantity: 1, price: 150 }
    ],
    pickup: 'Chipotle, Main St',
    destination: 'Hartley Hall 3B',
    requesterName: 'Maya Okafor',
    requesterInitials: 'MO',
    isMine: true,
    timeAgo: 'Yesterday',
    status: 'completed'
  }
};

export function RequestDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const mockOrder = (id && mockOrders[id]) || null;
  const isMine = mockOrder ? mockOrder.isMine : (id === 'r1' || id === 'r2' || id === 'r8');
  const [offerSheetOpen, setOfferSheetOpen] = useState(false);
  const [sort, setSort] = useState<'total' | 'eta'>('total');
  const [selectedOffer, setSelectedOffer] = useState<OfferData | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);

  const offers: OfferData[] = [
    {
      id: 'off_1',
      name: 'Lena Park',
      initials: 'LP',
      rating: 4.9,
      deliveries: 84,
      dorm: 'Hartley Hall 1A',
      foodPrice: 120.0,
      deliveryFee: 25.0,
      etaMinutes: 12,
      total: '145.00 ETB',
      availableItems: 'All (2)',
      itemsAvailability: [
        { name: 'Taro milk tea', quantity: 2, available: true, unitPrice: 50.0, price: 100.0 },
        { name: 'Boba topping', quantity: 2, available: true, unitPrice: 10.0, price: 20.0 }
      ],
      note: 'Already at Union Square, verified pricing at the counter.',
      timeAgo: '3m ago',
      highlight: 'Best price'
    },
    {
      id: 'off_2',
      name: 'Jordan Reyes',
      initials: 'JR',
      rating: 4.8,
      deliveries: 61,
      dorm: 'Ellis Hall',
      foodPrice: 100.0,
      deliveryFee: 20.0,
      etaMinutes: 15,
      total: '120.00 ETB',
      availableItems: '1 of 2',
      itemsAvailability: [
        { name: 'Taro milk tea', quantity: 2, unitPrice: 50.0, price: 100.0 },
        { name: 'Boba topping', quantity: 2 }
      ],
      note: 'Heading to Hartley now. Boba is out of stock today, so only charging for the tea.',
      timeAgo: '6m ago',
      highlight: 'Fastest'
    },
    {
      id: 'off_3',
      name: 'Dev Mehta',
      initials: 'DM',
      rating: 4.6,
      deliveries: 19,
      dorm: 'Okoro Commons',
      foodPrice: 120.0,
      deliveryFee: 15.0,
      etaMinutes: 25,
      total: '135.00 ETB',
      availableItems: 'All (2)',
      itemsAvailability: [
        { name: 'Taro milk tea', quantity: 2, available: true, unitPrice: 50.0, price: 100.0 },
        { name: 'Boba topping', quantity: 2, available: true, unitPrice: 10.0, price: 20.0 }
      ],
      note: 'Can pick up on my way out of class. Store price confirmed.',
      timeAgo: '8m ago'
    }
  ];

  const state = (location.state as {
    food?: string;
    items?: { name: string; quantity: number; price?: number }[];
    pickup?: string;
    destination?: string;
    instructions?: string;
    status?: OrderStatus;
    agreement?: { foodPrice: number; deliveryFee: number };
  }) || {};

  const pickup = state.pickup || mockOrder?.pickup || 'Tea Lab, Union Square';
  const destination = state.destination || mockOrder?.destination || 'Hartley Hall, 3rd floor lounge';
  const instructions = state.instructions || mockOrder?.instructions || 'Less ice on both please. Text me when downstairs.';
  const status: OrderStatus = state.status || mockOrder?.status || 'open';
  const agreement = state.agreement;

  const isFinalized = Boolean(agreement || status !== 'open');

  const items = state.items || mockOrder?.items || [
    { name: 'Taro milk tea', quantity: 2, price: isFinalized ? 50 : undefined },
    { name: 'Boba topping', quantity: 2, price: isFinalized ? 10 : undefined },
  ];
  const requesterName = mockOrder?.requesterName || 'Maya Okafor';
  const requesterInitials = mockOrder?.requesterInitials || 'MO';
  const food = mockOrder?.food || items.map((i) => `${i.quantity}x ${i.name}`).join(', ');

  const foodTotal = isFinalized ? (agreement?.foodPrice ?? 120) : null;
  const deliveryFee = isFinalized ? (agreement?.deliveryFee ?? 20) : null;
  const grandTotal = isFinalized && foodTotal && deliveryFee ? foodTotal + deliveryFee : null;

  const sortedOffers = [...offers].sort((a, b) => {
    if (sort === 'total') {
      const totalA = Number(a.foodPrice || 0) + Number(a.deliveryFee || 0);
      const totalB = Number(b.foodPrice || 0) + Number(b.deliveryFee || 0);
      return totalA - totalB;
    }
    return Number(a.etaMinutes || 0) - Number(b.etaMinutes || 0);
  });

  return (
    <div>
      <PageHeader
        title={isMine ? "Your order" : `Order from ${requesterName}`}
        subtitle={`Posted ${mockOrder?.timeAgo || '11m ago'}`}
      />

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-8 lg:px-10 lg:py-8">
        <section className="overflow-hidden rounded-lg border border-border bg-card p-5 lg:sticky lg:top-24">
          <div>
            <div className="flex items-center justify-between">
              <StatusBadge status={status} />
              <span className="font-mono text-xs text-muted-foreground">
                #{id ? id.toUpperCase() : 'DMS-R1'}
              </span>
            </div>

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

            {isMine ? (
              <Button
                variant="secondary"
                className="mt-4 w-full rounded-full text-destructive"
                onClick={() => setCancelOpen(true)}
              >
                Cancel order
              </Button>
            ) : (
              <Button
                className="mt-4 w-full rounded-full font-semibold"
                onClick={() => setOfferSheetOpen(true)}
              >
                Make delivery offer
              </Button>
            )}
          </div>
        </section>

        <section aria-labelledby="offers-title">
          {!isMine ? (
            <div className="rounded-lg border border-border bg-card p-6 text-center space-y-4">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FontAwesomeIcon icon={faHandshake} className="size-5" />
              </div>
              <div>
                <h2 id="offers-title" className="font-semibold text-foreground text-base">Deliver this order</h2>
                <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                  Set your store price, item availability, and delivery fee. The requester chooses which offer to accept.
                </p>
              </div>
              <Button
                className="rounded-full px-6 font-semibold"
                onClick={() => setOfferSheetOpen(true)}
              >
                Make delivery offer
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <h2 id="offers-title" className="text-base font-semibold tracking-tight">
                  Offers <span className="text-muted-foreground">({offers.length})</span>
                </h2>
                <div className="flex rounded-full border bg-card p-1 text-xs" role="group" aria-label="Sort offers">
                  <button
                    type="button"
                    onClick={() => setSort('total')}
                    aria-pressed={sort === 'total'}
                    className={`rounded-full px-3 py-1 font-medium transition-colors ${sort === 'total' ? 'bg-secondary text-foreground' : 'text-muted-foreground'
                      }`}
                  >
                    Lowest total
                  </button>
                  <button
                    type="button"
                    onClick={() => setSort('eta')}
                    aria-pressed={sort === 'eta'}
                    className={`rounded-full px-3 py-1 font-medium transition-colors ${sort === 'eta' ? 'bg-secondary text-foreground' : 'text-muted-foreground'
                      }`}
                  >
                    Fastest
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="mt-4 text-xs text-muted-foreground">
                  You choose who delivers. Accepting locks the price, fee, and time.
                </p>
                {sortedOffers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    onClick={() => setSelectedOffer(offer)}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {/* Offer Details Sheet: Shows confirmed item availability and itemized pricing */}
      <OfferDetailsSheet
        open={Boolean(selectedOffer)}
        onClose={() => setSelectedOffer(null)}
        offer={selectedOffer}
        viewMode="order_owner"
        fallbackItems={items}
        onAccept={(offer, total, acceptedItems) => {
          setSelectedOffer(null);
          navigate('/requests/r2/track', {
            state: {
              acceptedOffer: offer,
              total: total.toFixed(2),
              items: acceptedItems
            }
          });
        }}
      />

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

      <OfferSheet
        request={offerSheetOpen ? {
          id: id || 'r4',
          food,
          items,
          pickup,
          destination,
          requesterName,
          requesterInitials
        } : null}
        onClose={() => setOfferSheetOpen(false)}
        onSubmitOffer={() => {
          setOfferSheetOpen(false);
          toast.success(`Offer sent to ${requesterName}!`);
          navigate('/offers');
        }}
      />
    </div>
  );
}