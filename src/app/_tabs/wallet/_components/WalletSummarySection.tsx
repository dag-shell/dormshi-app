import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowUp, faLandmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import type { WalletAction } from './WalletActionSheet';

export interface WalletSummarySectionProps {
  availableBalance?: string;
  escrowBalance?: string;
  currency?: string;
  onSelectAction: (action: WalletAction) => void;
}

const actions: { id: WalletAction; label: string; icon: IconDefinition }[] = [
  { id: 'buy', label: 'Buy', icon: faPlus },
  { id: 'send', label: 'Send', icon: faArrowUp },
  { id: 'cashout', label: 'Cash out', icon: faLandmark }
];

export function WalletSummarySection({
  availableBalance = '42.75',
  escrowBalance = '32.00',
  currency = 'ETB',
  onSelectAction
}: WalletSummarySectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Balance Card */}
      <section aria-label="Balance" className="flex flex-col justify-between rounded-xl bg-foreground p-5 text-background lg:p-6">
        <p className="text-xs opacity-70">Available balance</p>
        <p className="mt-1 font-mono text-4xl font-semibold tracking-tight">
          {availableBalance}
          <span className="ml-2 text-base font-medium opacity-70">{currency}</span>
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3 text-sm">
          <span className="opacity-70">Reserved in escrow</span>
          <span className="font-mono">{escrowBalance} {currency}</span>
        </div>
      </section>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-3 gap-2 md:auto-rows-fr md:grid-cols-3 md:gap-3">
        {actions.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelectAction(id)}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border border-border bg-card p-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:aspect-auto md:flex-row md:justify-start md:gap-3 md:px-5 md:py-4 md:text-sm"
          >
            <span
              className={`grid size-8 place-items-center rounded-lg md:size-9 ${
                id === 'buy' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              }`}
            >
              <FontAwesomeIcon icon={icon} className="size-3.5 md:size-4" aria-hidden="true" />
            </span>
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
