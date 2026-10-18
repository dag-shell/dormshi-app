import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types/dormshi';

const statusLabels: Record<string, string> = {
  open: 'Open',
  accepted: 'Accepted',
  getting_food: 'Getting food',
  picked_up: 'Picked up',
  on_the_way: 'On the way',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
  disputed: 'Disputed'
};

const styles: Record<string, string> = {
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

export function StatusBadge({ status }: { status: OrderStatus | string }) {
  const label = statusLabels[status] ?? status;
  const style = styles[status] ?? styles.open;

  return (
    <Badge variant="outline" className={cn('h-6 px-2.5 text-xs font-medium', style)}>
      {label}
    </Badge>
  );
}