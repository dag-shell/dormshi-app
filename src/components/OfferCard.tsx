import React from 'react';
import { Star } from 'lucide-react';
import { Button } from './Button';
import { UserAvatar } from './UserAvatar';
import { useDormshi } from '../contexts/DormshiContext';
import { formatAmount, formatDC, timeAgo } from '../utils/format';
import { totalOf } from '../utils/orders';
import type { Offer } from '../types/dormshi';

interface OfferCardProps {
  offer: Offer;
  highlight?: string;
  onAccept?: () => void;
}

export function OfferCard({ offer, highlight, onAccept }: OfferCardProps) {
  const { getUser } = useDormshi();
  const fulfiller = getUser(offer.fulfillerId);

  return (
    <article className="rounded-xl border bg-card p-4">
      <div className="flex items-start gap-3">
        <UserAvatar user={fulfiller} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-medium">{fulfiller.name}</p>
            {highlight &&
            <span className="shrink-0 rounded-md bg-primary-soft px-2 py-1 text-xs font-medium leading-none text-primary">{highlight}</span>
            }
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3 fill-current text-foreground" aria-label="Rating" />
            <span className="font-medium text-foreground">{fulfiller.rating.toFixed(1)}</span>
            <span>· {fulfiller.deliveries} deliveries · {fulfiller.dorm}</span>
          </p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-3 divide-x rounded-lg border bg-background text-center">
        <Cell label="Food" value={formatAmount(offer.foodPrice)} unit="DC" />
        <Cell label="Delivery" value={formatAmount(offer.deliveryFee)} unit="DC" />
        <Cell label="Arrives in" value={String(offer.etaMinutes)} unit="min" />
      </dl>

      {offer.note && <p className="mt-3 text-sm text-muted-foreground">“{offer.note}”</p>}

      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Total · offered {timeAgo(offer.createdAt)}</p>
          <p className="font-mono text-lg font-semibold">{formatDC(totalOf(offer))}</p>
        </div>
        {onAccept &&
        <Button size="lg" onClick={onAccept} className="h-10 px-5">
            Accept offer
          </Button>
        }
      </div>
    </article>);

}

function Cell({ label, value, unit }: {label: string;value: string;unit: string;}) {
  return (
    <div className="px-2 py-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono text-sm font-medium">
        {value} <span className="text-xs text-muted-foreground">{unit}</span>
      </dd>
    </div>);

}