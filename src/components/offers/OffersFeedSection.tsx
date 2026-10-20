import React from 'react';
import { Link } from '@tanstack/react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { OrderCard } from '@/components/order';
import type { SentOfferData } from '@/components/order';

export type OfferFilterType = 'all' | 'pending' | 'accepted' | 'completed';

export interface OffersFeedSectionProps {
  offers: SentOfferData[];
  currentFilter: OfferFilterType;
  onFilterChange: (filter: OfferFilterType) => void;
  onSelectOffer: (offer: SentOfferData) => void;
}

const tabs: OfferFilterType[] = ['all', 'pending', 'accepted', 'completed'];

export function OffersFeedSection({
  offers,
  currentFilter,
  onFilterChange,
  onSelectOffer
}: OffersFeedSectionProps) {
  const filteredOffers = currentFilter === 'all'
    ? offers
    : offers.filter((o) => o.status === currentFilter);

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div
        className="flex items-center gap-2 overflow-x-auto py-1 -mx-4 px-4 sm:mx-0 sm:px-0 flex-nowrap scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={currentFilter === tab}
            onClick={() => onFilterChange(tab)}
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
              currentFilter === tab
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Offers List or Empty State */}
      <main className="space-y-3">
        {filteredOffers.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-10 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <FontAwesomeIcon icon={faHandshake} className="size-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {currentFilter === 'all' ? 'No active offers sent yet' : `No ${currentFilter} offers`}
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
            <OrderCard
              key={offer.id}
              order={{
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
              onClick={() => onSelectOffer(offer)}
            />
          ))
        )}
      </main>
    </div>
  );
}
