import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faStar } from '@fortawesome/free-solid-svg-icons';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@common/StatusBadge';
import { UserAvatar } from '@common/UserAvatar';
import { StatusTimeline } from '@/components/order/StatusTimeline';
import { AgreementCard } from '@/components/order/AgreementCard';
import { ChangeProposalSheet } from '@/components/order/ChangeProposalSheet';
import { ReasonSheet } from '@/components/order/ReasonSheet';
import { Button } from '@/components/ui/button';

export function Fulfillment() {
  const [proposeOpen, setProposeOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);

  return (
    <div>
      <PageHeader title="Request #DMS-4H" subtitle="Chicken shawarma wrap + garlic fries" backTo="/" />

      <div className="mx-auto grid max-w-6xl gap-4 px-5 py-5 lg:grid-cols-2 lg:items-start lg:gap-8 lg:px-10 lg:py-8">
        <div className="space-y-4">
          <section className="rounded-xl border bg-card p-5" aria-live="polite">
            <StatusBadge status="on_the_way" />
            <h2 className="mt-3 text-xl font-semibold tracking-tight">Sam Whitaker is on the way</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Estimated arrival <span className="font-medium text-foreground">3:15 PM</span>
            </p>

            <div className="mt-4 flex items-center gap-3 border-t pt-4">
              <UserAvatar initials="SW" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">Sam Whitaker</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  Fulfiller · <FontAwesomeIcon icon={faStar} className="size-3 text-foreground" aria-hidden="true" /> 4.7 · Brooks Hall
                </p>
              </div>
            </div>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="w-10 shrink-0 text-muted-foreground">From</dt>
                <dd className="truncate">Halal Cart, 5th & Main</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-10 shrink-0 text-muted-foreground">To</dt>
                <dd className="truncate">Science Library, Room 204</dd>
              </div>
            </dl>
            <p className="mt-3 rounded-lg bg-secondary px-3 py-2 text-xs leading-5 text-muted-foreground">
              Extra white sauce, no hot sauce.
            </p>
          </section>

          <Link
            to="/requests/r2/confirm"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <FontAwesomeIcon icon={faQrcode} className="size-4" aria-hidden="true" /> Got it? Scan QR to confirm
          </Link>

          <p className="rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
            When your food arrives, scan Sam Whitaker’s QR code to confirm and release payment.
          </p>
        </div>

        <div className="space-y-4">
          <section className="rounded-xl border bg-card p-4" aria-labelledby="progress-title">
            <h2 id="progress-title" className="mb-4 text-sm font-semibold">Progress</h2>
            <StatusTimeline
              request={{
                id: 'r2',
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