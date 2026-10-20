import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  WalletSummarySection,
  WalletTransactionsSection,
  WalletActionSheet,
  TransactionDetailsSheet,
  type WalletAction,
  type TransactionFilter
} from './_components';
import { Header } from '@/ui/layout/Header';
import { rawTransactions, type Transaction } from '@/data';

export const Route = createFileRoute('/_tabs/wallet/')({
  component: WalletPage,
});

export function WalletPage() {
  const [action, setAction] = useState<WalletAction | null>(null);
  const [filter, setFilter] = useState<TransactionFilter>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  return (
    <div className="pb-24">
      <Header title="Wallet" showBackButton={false} />
      <div className="mx-auto max-w-6xl px-5 pt-4 lg:px-10">
        <div className="space-y-8">
          {/* Section 1: Balance & Quick Actions */}
          <WalletSummarySection
            availableBalance="42.75"
            escrowBalance="32.00"
            earnedBalance="35.00"
            rewardBalance="25.00"
            currency="ETB"
            onSelectAction={setAction}
          />

          {/* Section 2: Transaction History */}
          <WalletTransactionsSection
            transactions={rawTransactions}
            filter={filter}
            onFilterChange={setFilter}
            onSelectTransaction={setSelectedTx}
          />
        </div>
      </div>

      {/* Action Sheet (Deposit / Transfer) */}
      <WalletActionSheet
        action={action}
        onChange={setAction}
        availableBalance="42.75"
        currency="ETB"
      />

      {/* Transaction Details Sheet */}
      <TransactionDetailsSheet
        open={Boolean(selectedTx)}
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
        currency="ETB"
      />
    </div>
  );
}
