import React from 'react';
import { OfferCard, type OfferData } from './OfferCard';

export interface OffersSectionProps {
  offers: OfferData[];
  sort: 'total' | 'eta';
  onSortChange: (sort: 'total' | 'eta') => void;
  onSelectOffer: (offer: OfferData) => void;
}

export function OffersSection({
  offers,
  sort,
  onSortChange,
  onSelectOffer
}: OffersSectionProps) {
  const sortedOffers = [...offers].sort((a, b) => {
    if (sort === 'total') {
      const totalA = Number(a.foodPrice || 0) + Number(a.deliveryFee || 0);
      const totalB = Number(b.foodPrice || 0) + Number(b.deliveryFee || 0);
      return totalA - totalB;
    }
    return Number(a.etaMinutes || 0) - Number(b.etaMinutes || 0);
  });

  return (
    <section aria-labelledby="offers-title" className="border-t border-border/70 pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 id="offers-title" className="text-sm font-semibold tracking-tight text-foreground">
          Delivery offers ({offers.length})
        </h2>
        <div className="flex rounded-full bg-secondary p-0.5 text-xs">
          <button
            type="button"
            onClick={() => onSortChange('total')}
            className={`rounded-full px-3 py-1 font-semibold transition-colors ${
              sort === 'total' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
            }`}
          >
            Lowest total
          </button>
          <button
            type="button"
            onClick={() => onSortChange('eta')}
            className={`rounded-full px-3 py-1 font-semibold transition-colors ${
              sort === 'eta' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
            }`}
          >
            Fastest
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {sortedOffers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            onClick={() => onSelectOffer(offer)}
          />
        ))}
      </div>
    </section>
  );
}
