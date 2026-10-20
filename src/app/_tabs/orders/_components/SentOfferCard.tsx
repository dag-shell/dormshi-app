import React from 'react';
import { Link } from '@tanstack/react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { toast } from 'sonner';

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

export interface SentOfferData {
  id: string;
  requestId: string;
  food: string;
  pickup: string;
  destination: string;
  requesterName: string;
  requesterInitials: string;
  status: 'pending' | 'accepted' | 'completed' | 'withdrawn';
  availableItems: string;
  foodPrice: number;
  deliveryFee: number;
  etaMinutes: number;
  timeAgo: string;
  note?: string;
  itemsAvailability?: {
    name: string;
    quantity: number;
    unitPrice?: number;
    price?: number;
    available?: boolean;
  }[];
}

interface SentOfferCardProps {
  offer: SentOfferData;
  onWithdraw?: (id: string) => void;
}

const statusBadgeStyles: Record<SentOfferData['status'], { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-secondary text-muted-foreground'
  },
  accepted: {
    label: 'Accepted',
    className: 'bg-primary-soft text-primary font-semibold'
  },
  completed: {
    label: 'Delivered',
    className: 'bg-secondary text-muted-foreground'
  },
  withdrawn: {
    label: 'Withdrawn',
    className: 'bg-muted text-muted-foreground'
  }
};

export function SentOfferCard({ offer, onWithdraw }: SentOfferCardProps) {
  const statusInfo = statusBadgeStyles[offer.status] ?? statusBadgeStyles.pending;

  return (
    <Card className="rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40">
      {/* Top: Status badge & timestamp */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
        <span className="text-muted-foreground">{offer.timeAgo}</span>
      </div>

      {/* Main Info: Food & Route */}
      <div className="mt-2">
        <h4 className="text-sm font-semibold text-foreground sm:text-base">
          {offer.food}
        </h4>

        {/* Transit Route */}
        <div className="mt-2 space-y-2 text-xs">
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
              <span className="font-semibold text-foreground">{offer.pickup}</span>
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
              <span className="font-semibold text-foreground">{offer.destination}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics & Action */}
      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="font-semibold text-primary">
            +ETB {offer.deliveryFee.toFixed(2)}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span>~{offer.etaMinutes} min</span>
          <span className="text-muted-foreground/40">·</span>
          <span>{offer.availableItems}</span>
        </div>

        <div>
          {offer.status === 'pending' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (onWithdraw) onWithdraw(offer.id);
                toast.success('Offer withdrawn.');
              }}
              className="h-7 rounded-full px-3 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              Withdraw
            </Button>
          )}

          {offer.status === 'accepted' && (
            <Link to="/orders/r2/track">
              <Button size="sm" className="h-7 rounded-full px-3.5 text-xs font-semibold">
                Start delivery
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
