import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowUp, faLandmark, faPlus, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { TransactionRow } from '../components/wallet/TransactionRow';
import { WalletActionSheet, type WalletAction } from '../components/wallet/WalletActionSheet';

type Filter = 'all' | 'in' | 'out' | 'hold';

const actions: { id: WalletAction; label: string; icon: IconDefinition }[] = [
  { id: 'buy', label: 'Buy', icon: faPlus },
  { id: 'send', label: 'Send', icon: faArrowUp },
  { id: 'scan', label: 'Scan', icon: faQrcode },
  { id: 'cashout', label: 'Cash out', icon: faLandmark }
];

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'in', label: 'In' },
  { id: 'out', label: 'Out' },
  { id: 'hold', label: 'Escrow' }
];

const rawTransactions = [
  { id: 'tx_09', type: 'ordered', direction: 'hold', amount: 120.0, label: 'Taro milk tea, Boba · In escrow', timeAgo: '9m ago' },
  { id: 'tx_08', type: 'reward', direction: 'in', amount: 15.0, label: 'Delivery streak reward bonus', timeAgo: '2h ago' },
  { id: 'tx_07', type: 'earned', direction: 'in', amount: 35.0, label: 'Delivery for Dev Mehta · Hartley Hall', timeAgo: '5h ago' },
  { id: 'tx_06', type: 'ordered', direction: 'out', amount: 85.0, label: 'Shawarma wrap + fries · Delivered', timeAgo: 'Yesterday' },
  { id: 'tx_05', type: 'send', direction: 'out', amount: 25.0, label: 'To Jordan Reyes · Split lunch', timeAgo: 'Yesterday' },
  { id: 'tx_04', type: 'deposit', direction: 'in', amount: 150.0, label: 'Deposit · Telebirr', timeAgo: '2 days ago' },
  { id: 'tx_03', type: 'cashout', direction: 'out', amount: 80.0, label: 'Cash out to CBE •• 0921', timeAgo: '3 days ago' },
  { id: 'tx_02', type: 'reward', direction: 'in', amount: 10.0, label: 'Referral welcome reward', timeAgo: '4 days ago' },
  { id: 'tx_01', type: 'deposit', direction: 'in', amount: 100.0, label: 'Deposit · CBE Birr', timeAgo: '5 days ago' }
];

export function Wallet() {
  const [action, setAction] = useState<WalletAction | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  const shown = filter === 'all' ? rawTransactions : rawTransactions.filter((t) => t.direction === filter);

  return (
    <div className="mx-auto max-w-6xl px-5 pt-6 lg:px-10 lg:pt-10">
      <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">Wallet</h1>

      <div className="mt-5 space-y-8 lg:mt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <section aria-label="Balance" className="flex flex-col justify-between rounded-xl bg-foreground p-5 text-background lg:p-6">
            <p className="text-xs opacity-70">Available balance</p>
            <p className="mt-1 font-mono text-4xl font-semibold tracking-tight">
              42.75
              <span className="ml-2 text-base font-medium opacity-70">ETB</span>
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3 text-sm">
              <span className="opacity-70">Reserved in escrow</span>
              <span className="font-mono">32.00 ETB</span>
            </div>
          </section>

          <div className="grid grid-cols-4 gap-2 md:auto-rows-fr md:grid-cols-2 md:gap-4">
            {actions.map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setAction(id)}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-card py-4 text-xs font-medium transition-colors hover:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:flex-row md:justify-start md:gap-3 md:px-5 md:text-sm"
              >
                <span className={`grid size-9 place-items-center rounded-lg ${id === 'buy' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                  <FontAwesomeIcon icon={icon} className="size-4" aria-hidden="true" />
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>

        <section aria-labelledby="history-title" className="md:rounded-xl md:border md:bg-card md:px-6 md:pb-2 md:pt-5">
          <div className="flex items-center justify-between">
            <h2 id="history-title" className="font-semibold tracking-tight">Transactions</h2>
            <div className="flex rounded-full border border-border bg-card p-1 text-xs" role="group" aria-label="Filter transactions">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
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
      </div>

      <WalletActionSheet action={action} onChange={setAction} />
    </div>
  );
}