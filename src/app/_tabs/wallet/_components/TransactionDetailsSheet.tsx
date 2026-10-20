import React, { useState } from 'react';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy,
  faCheck,
  faClock,
  faCircleCheck,
  faShieldHalved,
  faArrowUp,
  faArrowDown,
  faPlus,
  faBicycle,
  faGift,
  faBagShopping,
  faLandmark,
  faLock,
  faRotateLeft
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { BottomSheet } from '@/ui/custom/BottomSheet';
import { Button } from '@/ui/button';
import type { Transaction } from '@/data/wallet';

export interface TransactionDetailsSheetProps {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
  currency?: string;
}

const typeIcons: Record<string, IconDefinition> = {
  deposit: faPlus,
  earned: faBicycle,
  reward: faGift,
  send: faArrowUp,
  sent: faArrowUp,
  ordered: faBagShopping,
  bought: faBagShopping,
  cashout: faLandmark,
  cash_out: faLandmark,
  reserved: faLock,
  received: faArrowDown,
  refund: faRotateLeft
};

const typeLabels: Record<string, string> = {
  deposit: 'Wallet Deposit',
  earned: 'Delivery Earnings',
  reward: 'Reward Bonus',
  send: 'Transfer Sent',
  ordered: 'Order Payment',
  cashout: 'Admin Payout',
  refund: 'Refund'
};

export function TransactionDetailsSheet({
  transaction,
  open,
  onClose,
  currency = 'ETB'
}: TransactionDetailsSheetProps) {
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const type = transaction.type;
  const icon = typeIcons[type] ?? faPlus;
  const label = typeLabels[type] ?? 'Transaction';
  const isHold = transaction.direction === 'hold';
  const isOut = transaction.direction === 'out';
  const sign = isHold ? '' : isOut ? '−' : '+';
  const amountStr = typeof transaction.amount === 'number'
    ? transaction.amount.toFixed(2)
    : transaction.amount;

  const referenceCode = transaction.id.toUpperCase().replace('_', '-');

  const handleCopyReference = () => {
    try {
      navigator.clipboard.writeText(referenceCode);
      setCopied(true);
      toast.success('Transaction reference copied.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy reference.');
    }
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Transaction Details"
      description="View full information about this transaction."
    >
      <div className="space-y-5 pt-2">
        {/* Main Amount & Status Header */}
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-secondary/40 p-5 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-foreground">
            <FontAwesomeIcon icon={icon} className="size-5" />
          </div>

          <p
            className={`mt-3 font-mono text-3xl font-bold tracking-tight ${
              isOut ? 'text-primary' : isHold ? 'text-muted-foreground' : 'text-foreground'
            }`}
          >
            {sign}
            {amountStr} <span className="text-base font-semibold text-muted-foreground">{currency}</span>
          </p>

          <div className="mt-2 flex items-center gap-1.5">
            {isHold ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <FontAwesomeIcon icon={faClock} className="size-3" />
                Held in Escrow
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <FontAwesomeIcon icon={faCircleCheck} className="size-3" />
                Completed
              </span>
            )}
          </div>
        </div>

        {/* Detailed Attribute Breakdown */}
        <div className="overflow-hidden rounded-lg border border-border bg-card divide-y divide-border text-xs">
          {/* Reference ID */}
          <div className="flex items-center justify-between p-3.5">
            <span className="text-muted-foreground font-medium">Reference ID</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-foreground">{referenceCode}</span>
              <button
                type="button"
                onClick={handleCopyReference}
                className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-95 transition-all"
                title="Copy reference ID"
                aria-label="Copy reference ID"
              >
                <FontAwesomeIcon
                  icon={copied ? faCheck : faCopy}
                  className={`size-3 ${copied ? 'text-primary font-bold' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between p-3.5">
            <span className="text-muted-foreground font-medium">Category</span>
            <span className="font-semibold text-foreground">{label}</span>
          </div>

          {/* Description */}
          <div className="flex items-start justify-between gap-4 p-3.5">
            <span className="text-muted-foreground font-medium shrink-0">Description</span>
            <span className="font-medium text-foreground text-right">{transaction.label}</span>
          </div>

          {/* Time */}
          <div className="flex items-center justify-between p-3.5">
            <span className="text-muted-foreground font-medium">Timestamp</span>
            <span className="font-medium text-foreground">{transaction.timeAgo}</span>
          </div>

          {/* Channel */}
          <div className="flex items-center justify-between p-3.5">
            <span className="text-muted-foreground font-medium">Channel</span>
            <span className="font-medium text-foreground">
              {type === 'deposit'
                ? 'Commercial Bank of Ethiopia'
                : type === 'earned' || type === 'ordered'
                ? 'Dormshi Campus Escrow'
                : 'Dormshi In-App Wallet'}
            </span>
          </div>
        </div>

        {/* Notice for escrow or payouts */}
        {isHold && (
          <div className="flex items-start gap-2.5 rounded-lg border border-border bg-secondary/50 p-3 text-xs text-muted-foreground">
            <FontAwesomeIcon icon={faShieldHalved} className="mt-0.5 size-3.5 text-primary shrink-0" />
            <p className="leading-relaxed">
              This payment is held securely in escrow and will be released to the deliverer once you confirm receipt of your order.
            </p>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="h-11 w-full rounded-full font-semibold"
        >
          Close
        </Button>
      </div>
    </BottomSheet>
  );
}
