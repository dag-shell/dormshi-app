import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  WalletSummarySection,
  WalletTransactionsSection,
  WalletActionSheet,
  type WalletAction,
  type TransactionFilter
} from '@/components/wallet';
import { Header } from '@/components/layout/Header';

export const Route = createFileRoute('/wallet')({
  component: WalletPage,
});

const rawTransactions = [
  { id: 'tx_09', type: 'ordered' as const, direction: 'hold' as const, amount: 120.0, label: 'Taro milk tea, Boba · In escrow', timeAgo: '9m ago' },
  { id: 'tx_08', type: 'reward' as const, direction: 'in' as const, amount: 15.0, label: 'Delivery streak reward bonus', timeAgo: '2h ago' },
  { id: 'tx_07', type: 'earned' as const, direction: 'in' as const, amount: 35.0, label: 'Delivery for Dev Mehta · Hartley Hall', timeAgo: '5h ago' },
  { id: 'tx_06', type: 'ordered' as const, direction: 'out' as const, amount: 85.0, label: 'Shawarma wrap + fries · Delivered', timeAgo: 'Yesterday' },
  { id: 'tx_05', type: 'send' as const, direction: 'out' as const, amount: 25.0, label: 'To Jordan Reyes · Split lunch', timeAgo: 'Yesterday' },
  { id: 'tx_04', type: 'deposit' as const, direction: 'in' as const, amount: 150.0, label: 'Deposit · Telebirr', timeAgo: '2 days ago' },
  { id: 'tx_03', type: 'cashout' as const, direction: 'out' as const, amount: 80.0, label: 'Cash out to CBE •• 0921', timeAgo: '3 days ago' },
  { id: 'tx_02', type: 'reward' as const, direction: 'in' as const, amount: 10.0, label: 'Referral welcome reward', timeAgo: '4 days ago' },
  { id: 'tx_01', type: 'deposit' as const, direction: 'in' as const, amount: 100.0, label: 'Deposit · CBE Birr', timeAgo: '5 days ago' }
];

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
