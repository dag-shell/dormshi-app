import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { OffersFeedSection } from './_components';
import { OfferDetailsSheet } from '@/ui/custom/OfferDetailsSheet';
import { Header } from '@/ui/layout/Header';
import type { SentOfferData } from '../orders/_components';
import { initialOffers } from '@/data';

export const Route = createFileRoute('/offers/')({
  component: OffersPage,
});

export function OffersPage() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<SentOfferData[]>(initialOffers);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');
  const [selectedOffer, setSelectedOffer] = useState<SentOfferData | null>(null);

  const activeOffers = offers.filter((o) => o.status !== 'withdrawn');

  const handleWithdraw = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'withdrawn' } : o))
    );
  };

  return (
    <div className="pb-28">
      <Header title="My Offers" showBackButton={false} />
      <div className="mx-auto max-w-4xl space-y-6 px-4 pt-4 sm:px-6 lg:px-8">
        <OffersFeedSection
          offers={activeOffers}
          currentFilter={filter}
          onFilterChange={setFilter}
          onSelectOffer={setSelectedOffer}
        />

        {/* Shared Offer Details Sheet */}
        <OfferDetailsSheet
          open={Boolean(selectedOffer)}
          onClose={() => setSelectedOffer(null)}
          offer={selectedOffer}
          viewMode="offer_owner"
          onStartDelivery={() => {
            setSelectedOffer(null);
            navigate({ to: '/orders/r2/track' });
          }}
          onWithdraw={(id) => {
            handleWithdraw(id);
            setSelectedOffer(null);
            toast.success('Offer withdrawn.');
          }}
        />
      </div>
    </div>
  );
}
