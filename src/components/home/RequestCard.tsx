import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faClock, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { StatusBadge } from '@common/StatusBadge';
import { Card } from '@/components/ui/card';
import type { OrderStatus } from '@/types/dormshi';

export interface RequestCardData {
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
  requesterId?: string;
}

interface RequestCardProps {
  request?: RequestCardData;
  action?: React.ReactNode;
  showRole?: boolean;
}

export function RequestCard({ request, action, showRole = false }: RequestCardProps) {
  const req = request ?? {
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

  const isMine = req.isMine ?? (req.requesterId === 'u_me');
  const isFulfilling = req.isFulfilling ?? (req.agreement?.fulfillerId === 'u_me');
  const offersCount = req.offerCount ?? (req.offers?.length ?? 0);
  const timeText = req.timeAgo ?? '11m ago';

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-xs">
      <div>
        {/* Top Header line: Status badge + Offer count + Role tag */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={req.status} />
            {offersCount > 0 && (
              <span className="text-xs text-muted-foreground">
                · {offersCount} {offersCount === 1 ? 'offer' : 'offers'}
              </span>
            )}
            {showRole && (isMine || isFulfilling) && (
              <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {isMine ? 'Your request' : 'You’re delivering'}
              </span>
            )}
          </div>

          <FontAwesomeIcon icon={faChevronRight} className="size-3.5 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-foreground" />
        </div>

        {/* Food Title with Link */}
        <h4 className="mt-3 text-base font-semibold text-foreground sm:text-lg">
          <Link
            to={`/requests/${req.id}`}
            className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {req.food}
          </Link>
        </h4>

        {/* Pickup & Destination */}
        <div className="mt-2 space-y-1 text-xs text-muted-foreground sm:text-sm">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faLocationDot} className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">
              <span className="font-medium text-foreground/85">From:</span> {req.pickup}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faLocationDot} className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">
              <span className="font-medium text-foreground/85">To:</span> {req.destination}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer: Time Ago & Price badge / Action */}
      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <FontAwesomeIcon icon={faClock} className="size-3.5 shrink-0" />
          <span>{timeText}</span>
        </div>

        {action ? (
          <div className="relative z-10 shrink-0">{action}</div>
        ) : (
          <span className="rounded-md bg-primary-soft px-3 py-1 font-mono text-xs font-bold text-primary">
            {req.price || (req.status === 'open' ? `${offersCount} offers` : 'Agreed')}
          </span>
        )}
      </div>
    </Card>
  );
}