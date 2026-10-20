import React from 'react';
import { Link } from '@tanstack/react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronRight, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import type { OrderStatus } from '@/types/dormshi';

// FontAwesome outline map marker definition
const faLocationDotOutline: IconDefinition = {
  prefix: 'far',
  iconName: 'location-dot' as any,
  icon: [
    384,
    512,
    [],
    'f3c5',
    'M192 48c77.3 0 144 61.4 144 140.6 0 85.3-88.7 197.8-144 260.6-55.3-62.8-144-175.3-144-260.6C48 109.4 114.7 48 192 48zm0-48C86 0 0 84.4 0 188.6c0 119.3 120.2 262.3 170.4 316.8 11.8 12.8 31.5 12.8 43.3 0C263.8 450.9 384 307.9 384 188.6 384 84.4 298 0 192 0z'
  ]
};

export interface OrderCardData {
  id: string;
  food: string;
  pickup: string;
  destination: string;
  status: OrderStatus;
  createdAt?: string;
  timeAgo?: string;
  distanceKm?: number;
  requesterName?: string;
  requesterInitials?: string;
  isMine?: boolean;
  isFulfilling?: boolean;
  offerCount?: number;
  price?: string;
  offers?: unknown[];
  agreement?: { fulfillerId?: string };
  statusBadge?: React.ReactNode;
  footerLeft?: React.ReactNode;
}

export type RequestCardData = OrderCardData;

export interface OrderCardProps {
  request?: OrderCardData;
  order?: OrderCardData;
  onClick?: () => void;
}

export type RequestCardProps = OrderCardProps;

export function OrderCard({ request, order, onClick }: OrderCardProps) {
  const req = order ?? request ?? {
    id: 'r1',
    food: '2 large taro milk teas, 50% sugar, with boba',
    pickup: 'Tea Lab, Union Square',
    destination: 'Hartley Hall, 3rd floor lounge',
    status: 'open' as OrderStatus,
    timeAgo: '11m ago',
    distanceKm: 0,
    requesterName: 'Maya Okafor',
    requesterInitials: 'MO',
    isMine: true,
    offerCount: 2,
    price: 'ETB 120'
  };

  const offersCount = req.offerCount ?? (req.offers?.length ?? 0);
  const timeText = req.timeAgo ?? '11m ago';

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/40">
      <div>
        {/* Top Header: [Status] on left, [Time] on opposite right */}
        <div className="flex items-center justify-between gap-3">
          {req.statusBadge ?? <StatusBadge status={req.status} />}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{timeText}</span>
          </div>
        </div>

        {/* Food Title with Link or Button */}
        <h4 className="mt-3 text-base font-semibold text-foreground sm:text-lg">
          {onClick ? (
            <button
              type="button"
              onClick={onClick}
              className="text-left font-semibold text-foreground after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
            >
              {req.food}
            </button>
          ) : (
            <Link
              to={`/orders/${req.id}`}
              className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
            >
              {req.food}
            </Link>
          )}
        </h4>

        {/* Pickup & Destination Transit Route */}
        <div className="mt-2.5 space-y-2 text-xs sm:text-sm">
          {/* From (Pickup) */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center size-3.5 shrink-0">
              <FontAwesomeIcon
                icon={faLocationDotOutline}
                className="size-3.5 text-muted-foreground"
              />
              {/* Connecting Line running directly down into destination icon */}
              <span className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-3.5 bg-neutral-300 dark:bg-neutral-600" />
            </div>
            <p className="truncate">
              <span className="text-muted-foreground">From </span>
              <span className="font-semibold text-foreground">{req.pickup}</span>
            </p>
          </div>

          {/* To (Destination) */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-3.5 shrink-0">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="size-3.5 text-primary"
              />
            </div>
            <p className="truncate">
              <span className="text-muted-foreground">To </span>
              <span className="font-semibold text-foreground">{req.destination}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
        {req.footerLeft ?? (
          <span className="text-xs font-medium text-muted-foreground">
            {offersCount} {offersCount === 1 ? 'offer' : 'offers'}
          </span>
        )}

        <FontAwesomeIcon
          icon={faChevronRight}
          className="size-3.5 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
        />
      </div>
    </Card>
  );
}

export const RequestCard = OrderCard;
