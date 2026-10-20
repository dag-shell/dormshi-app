import React from 'react';
import { TransactionRow, type Transaction } from './TransactionRow';

export type TransactionFilter = 'all' | 'in' | 'out' | 'hold';

export interface WalletTransactionsSectionProps {
  transactions: Transaction[];
  filter: TransactionFilter;
  onFilterChange: (filter: TransactionFilter) => void;
}

const filters: { id: TransactionFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'in', label: 'In' },
  { id: 'out', label: 'Out' },
  { id: 'hold', label: 'Escrow' }
];

export function WalletTransactionsSection({
  transactions,
  filter,
  onFilterChange
}: WalletTransactionsSectionProps) {
  const shown = filter === 'all'
    ? transactions
    : transactions.filter((t) => t.direction === filter);

  return (
    <section aria-labelledby="history-title" className="md:rounded-xl md:border md:bg-card md:px-6 md:pb-2 md:pt-5">
      <div className="flex items-center justify-between">
        <h2 id="history-title" className="font-semibold tracking-tight">Transactions</h2>
        <div className="flex rounded-full border border-border bg-card p-1 text-xs" role="group" aria-label="Filter transactions">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => onFilterChange(f.id)}
              className={`rounded-full px-3 py-1 font-medium transition-all ${
                filter === f.id ? 'bg-secondary font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-1 divide-y">
        {shown.map((tx) => (
          <TransactionRow key={tx.id} tx={tx} />
        ))}
      </ul>
    </section>
  );
}
