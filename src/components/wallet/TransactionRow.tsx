import React from 'react';
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, Landmark, Lock, Plus, RotateCcw, Bike } from 'lucide-react';
import { formatAmount, timeAgo } from '../../utils/format';
import type { Transaction, TransactionType } from '../../types/dormshi';

const icons: Record<TransactionType, React.ElementType> = {
  purchase: Plus,
  sent: ArrowUpRight,
  received: ArrowDownLeft,
  reserved: Lock,
  released: CheckCircle2,
  earned: Bike,
  refund: RotateCcw,
  cash_out: Landmark
};

const typeLabels: Record<TransactionType, string> = {
  purchase: 'Bought',
  sent: 'Sent',
  received: 'Received',
  reserved: 'Reserved',
  released: 'Paid',
  earned: 'Earned',
  refund: 'Refund',
  cash_out: 'Cash out'
};

export function TransactionRow({ tx }: {tx: Transaction;}) {
  const Icon = icons[tx.type];
  const sign = tx.direction === 'in' ? '+' : tx.direction === 'out' ? '−' : '';
  return (
    <li className="flex items-center gap-3 py-3">
      <span className={`grid size-10 shrink-0 place-items-center rounded-full ${tx.direction === 'in' ? 'bg-primary-soft text-primary' : 'bg-secondary text-muted-foreground'}`}>
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{tx.label}</p>
        <p className="text-xs text-muted-foreground">
          {typeLabels[tx.type]} · {timeAgo(tx.createdAt)}
        </p>
      </div>
      <div className="text-right">
        <p className={`font-mono text-sm font-medium ${tx.direction === 'in' ? 'text-primary' : tx.direction === 'hold' ? 'text-muted-foreground' : ''}`}>
          {sign}
          {formatAmount(tx.amount)}
        </p>
        {tx.direction === 'hold' && <p className="text-xs text-muted-foreground">in escrow</p>}
      </div>
    </li>);

}