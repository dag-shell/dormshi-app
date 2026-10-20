import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStore, faLocationDot, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { UserAvatar } from '@/ui/custom/UserAvatar';

export interface OrderItem {
  name: string;
  quantity: number;
  price?: number;
}

export interface OrderDetailsSectionProps {
  requesterName: string;
  requesterInitials: string;
  rating?: number | string;
  locationLabel?: string;
  pickup: string;
  destination: string;
  items: OrderItem[];
  instructions?: string;
  isFinalized?: boolean;
}

export function OrderDetailsSection({
  requesterName,
  requesterInitials,
  rating = '4.9',
  locationLabel = 'Requester · Hartley Hall 3B',
  pickup,
  destination,
  items,
  instructions,
  isFinalized = false
}: OrderDetailsSectionProps) {
  const totalItemsCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="space-y-5">
      {/* 1. Requester Header */}
      <div className="flex items-center justify-between border-y border-border/70 py-3">
        <div className="flex items-center gap-3">
          <UserAvatar initials={requesterInitials} size="md" />
          <div>
            <p className="text-sm font-semibold text-foreground">{requesterName}</p>
            <p className="text-xs text-muted-foreground">{locationLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
          <FontAwesomeIcon icon={faStar} className="size-3 text-amber-500" />
          <span>{rating}</span>
        </div>
      </div>

      {/* 2. Visual Route Timeline */}
      <section aria-label="Delivery Route" className="space-y-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Delivery route
        </h2>

        <div className="pt-2">
          {/* Pickup Store Node */}
          <div className="flex items-start gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
              <FontAwesomeIcon icon={faStore} className="size-3.5" />
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pickup</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{pickup}</p>
            </div>
          </div>

          {/* Transit line */}
          <div className="-mt-3 mb-1 ml-3.5 flex items-center gap-2 border-l-2 border-dashed border-border pl-6 py-2 text-xs text-muted-foreground font-medium" />

          {/* Dropoff Node */}
          <div className="flex items-start gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FontAwesomeIcon icon={faLocationDot} className="size-3.5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Deliver to</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{destination}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Items Manifest & Instructions */}
      <section aria-label="Order Items" className="border-t border-border/70 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Order items ({totalItemsCount})
          </h2>
        </div>

        <div className="divide-y divide-border/60">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-md bg-secondary text-xs font-bold font-mono text-foreground">
                  {item.quantity}x
                </span>
                <span className="text-sm font-medium text-foreground">{item.name}</span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {isFinalized && item.price ? `ETB ${(item.price * item.quantity).toFixed(2)}` : '-- --'}
              </span>
            </div>
          ))}
        </div>

        {/* Note / Special Instructions */}
        {instructions && (
          <div className="flex items-start gap-3 rounded-lg bg-secondary/80 p-3.5 text-xs text-foreground">
            <FontAwesomeIcon icon={faCommentDots} className="size-4 shrink-0 text-muted-foreground mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-foreground">Requester note:</p>
              <p className="text-muted-foreground leading-relaxed">{instructions}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
