import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Header } from '@/ui/layout/Header';
import {
  FulfillmentStatusSection,
  StatusTimeline,
  AgreementCard,
  ChangeProposalSheet
} from './_components';
import { ReasonSheet } from '@/ui/custom/ReasonSheet';
import { Button } from '@/ui/button';
import { sampleCourierStatus, sampleTimelineRequest } from '@/data';

export const Route = createFileRoute('/orders/$id/track/')({
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
          courierName={sampleCourierStatus.courierName}
          courierInitials={sampleCourierStatus.courierInitials}
          rating={sampleCourierStatus.rating}
          dorm={sampleCourierStatus.dorm}
          etaTime={sampleCourierStatus.etaTime}
          pickup={sampleCourierStatus.pickup}
          destination={sampleCourierStatus.destination}
          note={sampleCourierStatus.note}
          confirmUrl={`/orders/${id || 'r2'}/confirm`}
        />

        {/* Section 2: Order Progress & Agreement Details */}
        <div className="space-y-4">
          <section className="rounded-xl border bg-card p-4" aria-labelledby="progress-title">
            <h2 id="progress-title" className="mb-4 text-sm font-semibold">Progress</h2>
            <StatusTimeline
              request={{
                ...sampleTimelineRequest,
                id: id || sampleTimelineRequest.id
              }}
            />
          </section>

          <AgreementCard
            request={sampleTimelineRequest}
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
