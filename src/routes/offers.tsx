import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { OffersFeedSection } from '@/components/offers';
import { OfferDetailsSheet } from '@/components/common/OfferDetailsSheet';
import { Header } from '@/components/layout/Header';
import type { SentOfferData } from '@/components/order';

export const Route = createFileRoute('/offers')({
  component: OffersPage,
});

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
