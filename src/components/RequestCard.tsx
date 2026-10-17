import React from 'react';
import { Link } from 'react-router-dom';
import { useDormshi } from '../contexts/DormshiContext';
import { CURRENT_USER_ID } from '../data/users';
import { StatusBadge } from './StatusBadge';
import { UserAvatar } from './UserAvatar';
import { formatDC, timeAgo } from '../utils/format';
import { requestPath, totalOf } from '../utils/orders';
import type { FoodRequest } from '../types/dormshi';

interface RequestCardProps {
  request: FoodRequest;
  action?: React.ReactNode;
  showRole?: boolean;
}

export function RequestCard({ request, action, showRole = false }: RequestCardProps) {
  const { getUser } = useDormshi();
  const requester = getUser(request.requesterId);
  const isMine = request.requesterId === CURRENT_USER_ID;
  const isFulfilling = request.agreement?.fulfillerId === CURRENT_USER_ID;
  const offerCount = request.offers.length;

  return (
    <article className="relative flex flex-col rounded-xl border bg-card p-4 transition-colors hover:border-ring">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <StatusBadge status={request.status} />
          {showRole && (isMine || isFulfilling) &&
          <span className="text-xs text-muted-foreground">{isMine ? 'You requested' : 'You’re delivering'}</span>
          }
        </div>
        <span className="text-xs text-muted-foreground">{timeAgo(request.createdAt)}</span>
      </div>

      <h3 className="mt-3 text-base font-medium leading-6">
        <Link to={requestPath(request)} className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring">
          {request.food}
        </Link>
      </h3>

      <dl className="mb-4 mt-2 space-y-1 text-sm">
        <div className="flex gap-2">
          <dt className="w-10 shrink-0 text-muted-foreground">From</dt>
          <dd className="truncate">{request.pickup}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-10 shrink-0 text-muted-foreground">To</dt>
          <dd className="truncate">{request.destination}</dd>
        </div>
      </dl>

      <div className="mt-auto flex items-center justify-between gap-3 border-t pt-3">
        <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          <UserAvatar user={requester} size="sm" />
          <span className="truncate">
            {isMine ? 'You' : requester.name}
            {!isMine && request.distanceKm > 0 && ` · ${request.distanceKm} km`}
          </span>
        </div>
        {action ?
        <div className="relative z-10 shrink-0">{action}</div> :
        request.agreement ?
        <span className="shrink-0 font-mono text-sm font-medium">{formatDC(totalOf(request.agreement))}</span> :

        <span className="shrink-0 text-xs font-medium text-muted-foreground">
            {offerCount === 0 ? 'No offers yet' : `${offerCount} offer${offerCount > 1 ? 's' : ''}`}
          </span>
        }
      </div>
    </article>);

}