import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  WalletSummarySection,
  WalletTransactionsSection,
  WalletActionSheet,
  type WalletAction,
  type TransactionFilter
} from './_components';
import { Header } from '@/ui/layout/Header';
import { rawTransactions } from '@/data';

export const Route = createFileRoute('/wallet/')({
  component: WalletPage,
});

export function WalletPage() {
  const [action, setAction] = useState<WalletAction | null>(null);
  const [filter, setFilter] = useState<TransactionFilter>('all');

  return (
    <div className="pb-24">
      <Header title="Wallet" showBackButton={false} />
      <div className="mx-auto max-w-6xl px-5 pt-4 lg:px-10">
        <div className="space-y-8">
          {/* Section 1: Balance & Quick Actions */}
          <WalletSummarySection
            availableBalance="42.75"
            escrowBalance="32.00"
            currency="ETB"
            onSelectAction={setAction}
          />

          {/* Section 2: Transaction History */}
          <WalletTransactionsSection
            transactions={rawTransactions}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>
      </div>

      <WalletActionSheet action={action} onChange={setAction} />
    </div>
  );
}
