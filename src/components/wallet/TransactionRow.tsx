import React from 'react';
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, Landmark, Lock, Plus, RotateCcw, Bike } from 'lucide-react';
import type { TransactionType } from '@/types/dormshi';

const icons: Record<string, React.ElementType> = {
  purchase: Plus,
  sent: ArrowUpRight,
  received: ArrowDownLeft,
  reserved: Lock,
  released: CheckCircle2,
  earned: Bike,
  refund: RotateCcw,
  cash_out: Landmark
};

const typeLabels: Record<string, string> = {
  purchase: 'Bought',
  sent: 'Sent',
  received: 'Received',
  reserved: 'Reserved',
  released: 'Paid',
  earned: 'Earned',
  refund: 'Refund',
  cash_out: 'Cash out'
};

export interface TransactionItemData {
  id?: string;
  type?: TransactionType | string;
  direction?: 'in' | 'out' | 'hold' | string;
  amount?: number | string;
  label?: string;
  timeAgo?: string;
  createdAt?: string;
}

export function TransactionRow({ tx }: { tx?: TransactionItemData }) {
  const item = tx ?? {
    type: 'purchase',
    direction: 'in',
    amount: '25.00',
    label: 'Bought DC · Visa •• 4242',
    timeAgo: '2h ago'
  };

  const type = item.type ?? 'purchase';
  const Icon = icons[type] ?? Plus;
  const sign = item.direction === 'in' ? '+' : item.direction === 'out' ? '−' : '';
  const timeText = item.timeAgo ?? '2h ago';
  const amountNumber = typeof item.amount === 'number' ? item.amount.toFixed(2) : String(item.amount ?? '25.00');

  return (
    <li className="flex items-center gap-3 py-3">
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-full ${
          item.direction === 'in'
            ? 'bg-primary-soft text-primary'
            : 'bg-secondary text-muted-foreground'
        }`}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.label}</p>
        <p className="text-xs text-muted-foreground">
          {typeLabels[type] ?? 'Transaction'} · {timeText}
        </p>
      </div>
      <div className="text-right">
        <p
          className={`font-mono text-sm font-medium ${
            item.direction === 'in'
              ? 'text-primary'
              : item.direction === 'hold'
              ? 'text-muted-foreground'
              : ''
          }`}
        >
          {sign}
          {amountNumber}
        </p>
        {item.direction === 'hold' && <p className="text-xs text-muted-foreground">in escrow</p>}
      </div>
    </li>
  );
}