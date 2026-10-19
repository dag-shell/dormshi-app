import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RequestCard } from '@/components/home/RequestCard';
import { OfferDetailsSheet } from '@common/OfferDetailsSheet';
import type { SentOfferData } from '@/components/home/SentOfferCard';

const initialOffers: SentOfferData[] = [
  {
    id: 'off_sent_1',
    requestId: 'r4',
    food: 'Iced oat latte, Blueberry muffin',
    pickup: 'Bean Counter Café',
    destination: 'Engineering Building, Lab 1.12',
    requesterName: 'Aisha Bello',
    requesterInitials: 'AB',
    status: 'pending',
    availableItems: '2 of 2 in stock',
    foodPrice: 110.0,
    deliveryFee: 20.0,
    etaMinutes: 15,
    timeAgo: '5m ago',
    note: 'Already at the counter, can deliver right away.',
    itemsAvailability: [
      { name: 'Iced oat latte', quantity: 1, unitPrice: 70, price: 70, available: true },
      { name: 'Blueberry muffin', quantity: 1, unitPrice: 40, price: 40, available: true }
    ]
  },
  {
    id: 'off_sent_2',
    requestId: 'r5',
    food: 'Pad thai, Tofu',
    pickup: 'Thai Orchid, Campus Ave',
    destination: 'Ellis Hall, Room 410',
    requesterName: 'Tomás Ruiz',
    requesterInitials: 'TR',
    status: 'accepted',
    availableItems: 'All in stock',
    foodPrice: 135.0,
    deliveryFee: 25.0,
    etaMinutes: 12,
    timeAgo: '18m ago',
    note: 'Order confirmed with counter. Walking over now.',
    itemsAvailability: [
      { name: 'Pad thai', quantity: 1, unitPrice: 95, price: 95, available: true },
      { name: 'Tofu', quantity: 1, unitPrice: 40, price: 40, available: true }
    ]
  },
  {
    id: 'off_sent_3',
    requestId: 'r7',
    food: 'Pepperoni pizza, Coke',
    pickup: "Gino's Pizza",
    destination: 'Music Hall, practice room 7',
    requesterName: 'Dev Mehta',
    requesterInitials: 'DM',
    status: 'pending',
    availableItems: '1 of 2 in stock',
    foodPrice: 40.0,
    deliveryFee: 15.0,
    etaMinutes: 20,
    timeAgo: '35m ago',
    note: 'Coke ready, pizza will be fresh out of the oven.',
    itemsAvailability: [
      { name: 'Pepperoni pizza', quantity: 1, unitPrice: 90, price: 90, available: false },
      { name: 'Coke', quantity: 2, unitPrice: 20, price: 40, available: true }
    ]
  },
  {
    id: 'off_sent_4',
    requestId: 'r6',
    food: 'Clif bar, Sparkling water',
    pickup: 'CVS on College St',
    destination: 'Rec Center front desk',
    requesterName: 'Lena Park',
    requesterInitials: 'LP',
    status: 'completed',
    availableItems: 'All (2)',
    foodPrice: 70.0,
    deliveryFee: 20.0,
    etaMinutes: 10,
    timeAgo: 'Yesterday',
    itemsAvailability: [
      { name: 'Clif bar', quantity: 2, unitPrice: 20, price: 40, available: true },
      { name: 'Sparkling water', quantity: 1, unitPrice: 30, price: 30, available: true }
    ]
  }
];

export function Offers() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<SentOfferData[]>(initialOffers);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');
  const [selectedOffer, setSelectedOffer] = useState<SentOfferData | null>(null);

  const activeOffers = offers.filter((o) => o.status !== 'withdrawn');
  const filteredOffers = filter === 'all'
    ? activeOffers
    : activeOffers.filter((o) => o.status === filter);

  const handleWithdraw = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'withdrawn' } : o))
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pt-4 pb-28 sm:px-6 lg:px-8 lg:pt-8">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          My Offers
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Offers you sent to deliver other students' orders. Tap any card to view your offer details.
        </p>
      </header>

      {/* Filter Tabs (horizontally scrollable) */}
      <div
        className="flex items-center gap-2 overflow-x-auto py-1 -mx-4 px-4 sm:mx-0 sm:px-0 flex-nowrap scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
      >
        {(['all', 'pending', 'accepted', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={filter === tab}
            onClick={() => setFilter(tab)}
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
              filter === tab
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Offer List using the same RequestCard */}
      <main className="space-y-3">
        {filteredOffers.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-10 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <FontAwesomeIcon icon={faHandshake} className="size-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {filter === 'all' ? 'No active offers sent yet' : `No ${filter} offers`}
            </p>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
              Check out campus orders waiting for delivery and send an offer to earn money.
            </p>
            <Link to="/" className="inline-block mt-4">
              <Button size="sm" className="rounded-full px-5 text-xs font-semibold">
                Browse orders
              </Button>
            </Link>
          </div>
        ) : (
          filteredOffers.map((offer) => (
            <RequestCard
              key={offer.id}
              request={{
                id: offer.requestId,
                food: offer.food,
                pickup: offer.pickup,
                destination: offer.destination,
                status: offer.status === 'accepted' ? 'accepted' : (offer.status === 'completed' ? 'completed' : 'open'),
                timeAgo: offer.timeAgo,
                requesterName: offer.requesterName,
                requesterInitials: offer.requesterInitials,
                statusBadge: (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      offer.status === 'accepted'
                        ? 'bg-primary-soft text-primary font-semibold'
                        : offer.status === 'completed'
                        ? 'bg-secondary text-muted-foreground'
                        : offer.status === 'withdrawn'
                        ? 'bg-muted text-muted-foreground'
                        : 'border border-border bg-card text-foreground'
                    }`}
                  >
                    {offer.status === 'accepted'
                      ? 'Accepted'
                      : offer.status === 'completed'
                      ? 'Delivered'
                      : offer.status === 'withdrawn'
                      ? 'Withdrawn'
                      : 'Pending'}
                  </span>
                ),
                footerLeft: (
                  <span className="text-xs font-medium text-muted-foreground">
                    Your offer: <strong className="text-foreground font-semibold">ETB {(offer.foodPrice + offer.deliveryFee).toFixed(2)}</strong>
                  </span>
                )
              }}
              onClick={() => setSelectedOffer(offer)}
            />
          ))
        )}
      </main>

      {/* Shared Offer Details Sheet (identical to the one under order details) */}
      <OfferDetailsSheet
        open={Boolean(selectedOffer)}
        onClose={() => setSelectedOffer(null)}
        offer={selectedOffer}
        viewMode="offer_owner"
        onStartDelivery={() => {
          setSelectedOffer(null);
          navigate('/requests/r2/track');
        }}
        onWithdraw={(id) => {
          handleWithdraw(id);
          setSelectedOffer(null);
          toast.success('Offer withdrawn.');
        }}
      />
    </div>
  );
}
