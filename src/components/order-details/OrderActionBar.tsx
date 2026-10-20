import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import type { OrderStatus } from '@/types/order';

export interface OrderActionBarProps {
  isMine: boolean;
  status: OrderStatus;
  onCancelClick: () => void;
  onMakeOfferClick: () => void;
}

export function OrderActionBar({
  isMine,
  status,
  onCancelClick,
  onMakeOfferClick
}: OrderActionBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card p-4 pb-[max(env(safe-area-inset-bottom),16px)] shadow-lg">
      <div className="mx-auto max-w-2xl">
        {isMine ? (
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Order status</p>
              <p className="text-sm font-bold text-foreground">
                {status === 'open' ? 'Waiting for offers' : 'In progress'}
              </p>
            </div>
            <Button
              variant="outline"
              className="h-11 rounded-full px-6 font-semibold text-destructive hover:bg-destructive/10"
              onClick={onCancelClick}
            >
              Cancel order
            </Button>
          </div>
        ) : (
          <Button
            size="lg"
            className="h-12 w-full rounded-full font-semibold gap-2 text-sm shadow-sm"
            onClick={onMakeOfferClick}
          >
            <FontAwesomeIcon icon={faHandshake} className="size-4" />
            Make delivery offer
          </Button>
        )}
      </div>
    </div>
  );
}
