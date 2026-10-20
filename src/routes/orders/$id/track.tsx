import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Header } from '@/components/layout/Header';
import {
  FulfillmentStatusSection,
  StatusTimeline,
  AgreementCard,
  ChangeProposalSheet
} from '@/components/fulfillment';
import { ReasonSheet } from '@/components/common/ReasonSheet';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/orders/$id/track')({
  component: FulfillmentPage,
});

export function FulfillmentPage() {
  const { id } = Route.useParams();
  const [proposeOpen, setProposeOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);

  return (
    <div>
      <Header title={`Order #${id ? id.toUpperCase() : 'DMS-4H'}`} />

      <div className="mx-auto grid max-w-6xl gap-4 px-5 py-5 lg:grid-cols-2 lg:items-start lg:gap-8 lg:px-10 lg:py-8">
        {/* Section 1: Courier Status & Confirmation Prompt */}
        <FulfillmentStatusSection
          courierName="Sam Whitaker"
          courierInitials="SW"
          rating="4.7"
          dorm="Brooks Hall"
          etaTime="3:15 PM"
          pickup="Halal Cart, 5th & Main"
          destination="Science Library, Room 204"
          note="Extra white sauce, no hot sauce."
          confirmUrl={`/orders/${id || 'r2'}/confirm`}
        />

        {/* Section 2: Order Progress & Agreement Details */}
        <div className="space-y-4">
          <section className="rounded-xl border bg-card p-4" aria-labelledby="progress-title">
            <h2 id="progress-title" className="mb-4 text-sm font-semibold">Progress</h2>
            <StatusTimeline
              request={{
                id: id || 'r2',
                requesterId: 'u_me',
                food: 'Chicken shawarma wrap + garlic fries',
                pickup: 'Halal Cart, 5th & Main',
                destination: 'Science Library, Room 204',
                paymentMethod: 'dc_wallet',
                status: 'on_the_way',
                offers: [],
                statusHistory: [
                  { status: 'open', at: '2:30 PM' },
                  { status: 'accepted', at: '2:38 PM' },
                  { status: 'getting_food', at: '2:40 PM' },
                  { status: 'picked_up', at: '2:52 PM' },
                  { status: 'on_the_way', at: '2:59 PM' }
                ],
                createdAt: '2:30 PM',
                distanceKm: 0
              }}
            />
          </section>

          <AgreementCard
            request={{
              agreement: {
                foodPrice: 11.5,
                deliveryFee: 3.0,
                etaMinutes: 20
              }
            }}
            canPropose={true}
            onPropose={() => setProposeOpen(true)}
          />

          <div className="flex gap-2 pb-4">
            <Button variant="outline" className="flex-1" onClick={() => setCancelOpen(true)}>
              Cancel request
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setDisputeOpen(true)}>
              Report a problem
            </Button>
          </div>
        </div>
      </div>

      <ChangeProposalSheet counterpartName="Sam" open={proposeOpen} onClose={() => setProposeOpen(false)} />

      <ReasonSheet
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel this request?"
        description="Sam Whitaker will be notified right away."
        reasons={['Taking too long', 'I no longer need it', 'Posted by mistake', 'Other']}
        note="14.50 DC reserved for this request will be refunded to your wallet immediately."
        confirmLabel="Cancel request"
        destructive
        onConfirm={() => setCancelOpen(false)}
      />

      <ReasonSheet
        open={disputeOpen}
        onClose={() => setDisputeOpen(false)}
        title="Report a problem"
        description="We’ll pause payment while support reviews."
        reasons={['Wrong or missing items', 'Food never arrived', 'Fulfiller asked for more DC', 'Other']}
        note="14.50 DC stays held in escrow. Support will reach out within 24 hours."
        confirmLabel="Open dispute"
        destructive
        onConfirm={() => setDisputeOpen(false)}
      />
    </div>
  );
}
