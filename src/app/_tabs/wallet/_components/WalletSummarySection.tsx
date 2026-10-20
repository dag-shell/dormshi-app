import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faArrowRightArrowLeft, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/ui/button';
import type { WalletAction } from './WalletActionSheet';

export interface WalletSummarySectionProps {
  availableBalance?: string;
  escrowBalance?: string;
  currency?: string;
  onSelectAction: (action: WalletAction) => void;
}

interface ActionItem {
  id: WalletAction;
  label: string;
  icon: IconDefinition;
  isPrimary?: boolean;
}

const actions: ActionItem[] = [
  {
    id: 'deposit',
    label: 'Deposit',
    icon: faPlus,
    isPrimary: true,
  },
  {
    id: 'transfer',
    label: 'Transfer',
    icon: faArrowRightArrowLeft,
    isPrimary: false,
  },
];

export function WalletSummarySection({
  availableBalance = '42.75',
  escrowBalance = '32.00',
  currency = 'ETB',
  onSelectAction,
}: WalletSummarySectionProps) {
  return (
    <div className="space-y-4">
      {/* Top Grid: Balance Card + Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 md:items-center">
        {/* Balance Card */}
        <section
          aria-label="Balance"
          className="flex flex-col justify-between rounded-lg border border-border bg-foreground p-5 text-background lg:p-6 shadow-sm"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-background/70">
              Available Balance
            </p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-tight sm:text-4xl text-background">
              {availableBalance}
              <span className="ml-2 text-base font-semibold text-background/70">{currency}</span>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-background/15 pt-3 text-xs sm:text-sm">
            <span className="text-background/70 font-medium">Reserved in escrow</span>
            <span className="font-mono font-semibold text-background">
              {escrowBalance} {currency}
            </span>
          </div>
        </section>

        {/* Quick Action Buttons (Deposit & Transfer only) */}
        <div className="grid grid-cols-2 gap-3">
          {actions.map(({ id, label, icon, isPrimary }) => (
            <Button
              key={id}
              type="button"
              variant={isPrimary ? 'default' : 'outline'}
              size="lg"
              onClick={() => onSelectAction(id)}
              className="h-12 w-full gap-2.5 rounded-full font-semibold shadow-none"
            >
              <FontAwesomeIcon icon={icon} className="size-4" aria-hidden="true" />
              <span>{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Admin Payouts Informational Notice */}
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3.5 text-xs text-muted-foreground">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
          <FontAwesomeIcon icon={faCircleInfo} className="size-3.5" />
        </div>
        <p className="leading-relaxed">
          Delivery earnings are safely audited and sent to your bank/Telebirr account periodically by administrators.
        </p>
      </div>
    </div>
  );
}
