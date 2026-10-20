import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowDown,
  faArrowUp,
  faBagShopping,
  faBicycle,
  faGift,
  faLandmark,
  faLock,
  faPlus,
  faRotateLeft
} from '@fortawesome/free-solid-svg-icons';
import type { TransactionType } from '@/types/dormshi';

const icons: Record<string, IconDefinition> = {
  cashout: faLandmark,
  cash_out: faLandmark,
  deposit: faPlus,
  earned: faBicycle,
  reward: faGift,
  send: faArrowUp,
  sent: faArrowUp,
  bought: faBagShopping,
  ordered: faBagShopping,
  purchase: faPlus,
  received: faArrowDown,
  reserved: faLock,
  released: faBagShopping,
  refund: faRotateLeft
};

const typeLabels: Record<string, string> = {
  cashout: 'Cash out',
  cash_out: 'Cash out',
  deposit: 'Deposit',
  earned: 'Earned',
  reward: 'Reward',
  send: 'Sent',
  sent: 'Sent',
  bought: 'Ordered',
  ordered: 'Ordered',
  purchase: 'Deposit',
  received: 'Received',
  reserved: 'Reserved',
  released: 'Ordered',
  refund: 'Refund'
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
  const icon = icons[type] ?? faPlus;
  const sign = item.direction === 'in' ? '+' : item.direction === 'out' ? '−' : '';
  const timeText = item.timeAgo ?? '2h ago';
  const amountNumber = typeof item.amount === 'number' ? item.amount.toFixed(2) : String(item.amount ?? '25.00');

  return (
    <li className="flex items-center gap-3 py-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground">
        <FontAwesomeIcon icon={icon} className="size-4" aria-hidden="true" />
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
            item.direction === 'out'
              ? 'text-primary'
              : item.direction === 'hold'
              ? 'text-muted-foreground'
              : 'text-foreground'
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