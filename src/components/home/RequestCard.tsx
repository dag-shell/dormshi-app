import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@common/StatusBadge';
import { UserAvatar } from '@common/UserAvatar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
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
    offerCount: 3,
    price: '15.80 DC'
  };

  const isMine = req.isMine ?? (req.requesterId === 'u_me');
  const isFulfilling = req.isFulfilling ?? (req.agreement?.fulfillerId === 'u_me');
  const requesterName = req.requesterName ?? (isMine ? 'Maya Okafor' : 'Jordan Reyes');
  const requesterInitials = req.requesterInitials ?? (isMine ? 'MO' : 'JR');
  const offersCount = req.offerCount ?? (req.offers?.length ?? 0);
  const timeText = req.timeAgo ?? '11m ago';

  return (
    <Card className="relative flex flex-col transition-colors hover:border-ring">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <div className="flex items-center gap-2">
          <StatusBadge status={req.status} />
          {showRole && (isMine || isFulfilling) && (
            <span className="text-xs text-muted-foreground">
              {isMine ? 'You requested' : 'You’re delivering'}
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{timeText}</span>
      </CardHeader>

      <CardContent className="flex-1 p-4 pt-1">
        <CardTitle className="text-base font-medium leading-6">
          <Link
            to={`/requests/${req.id}`}
            className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {req.food}
          </Link>
        </CardTitle>

        <dl className="mb-0 mt-3 space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="w-10 shrink-0 text-muted-foreground">From</dt>
            <dd className="truncate">{req.pickup}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-10 shrink-0 text-muted-foreground">To</dt>
            <dd className="truncate">{req.destination}</dd>
          </div>
        </dl>
      </CardContent>

      <CardFooter className="mt-auto flex items-center justify-between gap-3 border-t p-4 pt-3">
        <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          <UserAvatar initials={requesterInitials} isMe={isMine} size="sm" />
          <span className="truncate">
            {isMine ? 'You' : requesterName}
            {!isMine && req.distanceKm && req.distanceKm > 0 ? ` · ${req.distanceKm} km` : ''}
          </span>
        </div>
        {action ? (
          <div className="relative z-10 shrink-0">{action}</div>
        ) : req.price ? (
          <span className="shrink-0 font-mono text-sm font-medium">{req.price}</span>
        ) : (
          <span className="shrink-0 text-xs font-medium text-muted-foreground">
            {offersCount === 0 ? 'No offers yet' : `${offersCount} offer${offersCount > 1 ? 's' : ''}`}
          </span>
        )}
      </CardFooter>
    </Card>
  );
}