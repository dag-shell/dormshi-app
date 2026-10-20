import { useState } from 'react';
import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import {
  OrderDetailsSection,
  OffersSection,
  OrderActionBar,
  type OfferData
} from './_components';
import { OfferDetailsSheet } from '@/ui/custom/OfferDetailsSheet';
import { ReasonSheet } from '@/ui/custom/ReasonSheet';
import { OfferSheet } from '../_components/OfferSheet';
import { Header } from '@/ui/layout/Header';
import type { OrderStatus } from '@/types/dormshi';
import { mockOrders } from '@/data';

export const Route = createFileRoute('/orders/$id/')({
  component: OrderDetailPage,
});

export function OrderDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = Route.useParams();
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

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header
        title={isMine ? 'Your order' : `Order #${id ? id.toUpperCase() : 'DMS-R1'}`}
      />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 space-y-5">
        <OrderDetailsSection
          requesterName={requesterName}
          requesterInitials={requesterInitials}
          rating="4.9"
          locationLabel="Requester · Hartley Hall 3B"
          pickup={pickup}
          destination={destination}
          items={items}
          instructions={instructions}
          isFinalized={isFinalized}
        />

        {isMine && (
          <OffersSection
            offers={offers}
            sort={sort}
            onSortChange={setSort}
            onSelectOffer={setSelectedOffer}
          />
        )}
      </main>

      <OrderActionBar
        isMine={isMine}
        status={status}
        onCancelClick={() => setCancelOpen(true)}
        onMakeOfferClick={() => setOfferSheetOpen(true)}
      />

      {/* Sheets & Dialogs */}
      <OfferDetailsSheet
        open={Boolean(selectedOffer)}
        onClose={() => setSelectedOffer(null)}
        offer={selectedOffer}
        viewMode="order_owner"
        fallbackItems={items}
        onAccept={(offer, total, acceptedItems) => {
          setSelectedOffer(null);
          navigate({
            to: '/orders/$id/track',
            params: { id: 'r2' },
            state: {
              acceptedOffer: offer,
              total: total.toFixed(2),
              items: acceptedItems
            } as any
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
          navigate({ to: '/' });
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
          navigate({ to: '/offers' });
        }}
      />
    </div>
  );
}

export const OrderDetails = OrderDetailPage;
