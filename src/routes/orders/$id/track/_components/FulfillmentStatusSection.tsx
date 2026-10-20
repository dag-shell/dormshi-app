import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faStar } from '@fortawesome/free-solid-svg-icons';
import { StatusBadge } from '@/ui/custom/StatusBadge';
import { UserAvatar } from '@/ui/custom/UserAvatar';

export interface FulfillmentStatusSectionProps {
  courierName?: string;
  courierInitials?: string;
  rating?: number | string;
  dorm?: string;
  etaTime?: string;
  pickup?: string;
  destination?: string;
  note?: string;
  confirmUrl?: string;
}

export function FulfillmentStatusSection({
  courierName = 'Sam Whitaker',
  courierInitials = 'SW',
  rating = '4.7',
  dorm = 'Brooks Hall',
  etaTime = '3:15 PM',
  pickup = 'Halal Cart, 5th & Main',
  destination = 'Science Library, Room 204',
  note = 'Extra white sauce, no hot sauce.',
  confirmUrl = '/orders/r2/confirm'
}: FulfillmentStatusSectionProps) {
  return (
    <div className="space-y-4">
      {/* Courier Status Card */}
      <section className="rounded-xl border bg-card p-5" aria-live="polite">
        <StatusBadge status="on_the_way" />
        <h2 className="mt-3 text-xl font-semibold tracking-tight">{courierName} is on the way</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Estimated arrival <span className="font-medium text-foreground">{etaTime}</span>
        </p>

        <div className="mt-4 flex items-center gap-3 border-t pt-4">
          <UserAvatar initials={courierInitials} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{courierName}</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              Fulfiller · <FontAwesomeIcon icon={faStar} className="size-3 text-foreground" aria-hidden="true" /> {rating} · {dorm}
            </p>
          </div>
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="w-10 shrink-0 text-muted-foreground">From</dt>
            <dd className="truncate">{pickup}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-10 shrink-0 text-muted-foreground">To</dt>
            <dd className="truncate">{destination}</dd>
          </div>
        </dl>
        {note && (
          <p className="mt-3 rounded-lg bg-secondary px-3 py-2 text-xs leading-5 text-muted-foreground">
            {note}
          </p>
        )}
      </section>

      {/* QR Confirmation Prompt */}
      <Link
        to={confirmUrl}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <FontAwesomeIcon icon={faQrcode} className="size-4" aria-hidden="true" /> Got it? Scan QR to confirm
      </Link>

      <p className="rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
        When your food arrives, scan {courierName}’s QR code to confirm and release payment.
      </p>
    </div>
  );
}
