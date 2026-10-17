import React from 'react';
import type { OrderStatus } from '../types/dormshi';
import { statusLabels } from '../utils/orders';

const styles: Record<OrderStatus, string> = {
  open: 'border-border bg-card text-foreground',
  accepted: 'border-transparent bg-primary-soft text-primary',
  getting_food: 'border-transparent bg-primary-soft text-primary',
  picked_up: 'border-transparent bg-primary-soft text-primary',
  on_the_way: 'border-transparent bg-primary-soft text-primary',
  delivered: 'border-transparent bg-primary text-primary-foreground',
  completed: 'border-border bg-muted text-muted-foreground',
  cancelled: 'border-border bg-muted text-muted-foreground',
  disputed: 'border-transparent bg-destructive-soft text-destructive'
};

export function StatusBadge({ status }: {status: OrderStatus;}) {
  const live = ['getting_food', 'picked_up', 'on_the_way'].includes(status);
  return (
    <span className={`inline-flex h-6 items-center gap-2 rounded-md border px-2 text-xs font-medium ${styles[status]}`}>
      {(status === 'open' || live) &&
      <span className={`size-1.5 rounded-full bg-primary ${live ? 'animate-pulse' : ''}`} aria-hidden="true" />
      }
      {statusLabels[status]}
    </span>);

}