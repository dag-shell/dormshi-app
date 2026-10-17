import React, { useState } from 'react';
import { ArrowUpRight, Landmark, Plus, ScanLine } from 'lucide-react';
import { TransactionRow } from '../components/wallet/TransactionRow';
import { WalletActionSheet, type WalletAction } from '../components/wallet/WalletActionSheet';
import { useDormshi } from '../contexts/DormshiContext';
import { formatAmount } from '../utils/format';

type Filter = 'all' | 'in' | 'out' | 'hold';

const actions: {id: WalletAction;label: string;icon: React.ElementType;}[] = [
{ id: 'buy', label: 'Buy', icon: Plus },
{ id: 'send', label: 'Send', icon: ArrowUpRight },
{ id: 'scan', label: 'Scan', icon: ScanLine },
{ id: 'cashout', label: 'Cash out', icon: Landmark }];


const filters: {id: Filter;label: string;}[] = [
{ id: 'all', label: 'All' },
{ id: 'in', label: 'In' },
{ id: 'out', label: 'Out' },
{ id: 'hold', label: 'Escrow' }];


export function Wallet() {
  const { wallet, transactions } = useDormshi();
  const [action, setAction] = useState<WalletAction | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const shown = filter === 'all' ? transactions : transactions.filter((t) => t.direction === filter);

  return (
    <div className="mx-auto max-w-6xl px-5 pt-6 lg:px-10 lg:pt-10">
      <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">Wallet</h1>

      <div className="mt-5 space-y-8 lg:mt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <section aria-label="Balance" className="flex flex-col justify-between rounded-xl bg-foreground p-5 text-background lg:p-6">
            <p className="text-xs opacity-70">Available balance</p>
            <p className="mt-1 font-mono text-4xl font-semibold tracking-tight">
              {formatAmount(wallet.available)}
              <span className="ml-2 text-base font-medium opacity-70">DC</span>
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3 text-sm">
              <span className="opacity-70">Reserved in escrow</span>
              <span className="font-mono">{formatAmount(wallet.reserved)} DC</span>
            </div>
          </section>

          <div className="grid grid-cols-4 gap-2 md:auto-rows-fr md:grid-cols-2 md:gap-4">
            {actions.map(({ id, label, icon: Icon }) =>
            <button
              key={id}
              type="button"
              onClick={() => setAction(id)}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-card py-4 text-xs font-medium transition-colors hover:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:flex-row md:justify-start md:gap-3 md:px-5 md:text-sm">
              
                <span className={`grid size-9 place-items-center rounded-lg ${id === 'buy' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {label}
              </button>
            )}
          </div>
        </div>

        <section aria-labelledby="history-title" className="md:rounded-xl md:border md:bg-card md:px-6 md:pb-2 md:pt-5">
          <div className="flex items-center justify-between">
            <h2 id="history-title" className="font-semibold tracking-tight">Transactions</h2>
            <div className="flex rounded-lg border bg-card p-1 text-xs" role="group" aria-label="Filter transactions">
              {filters.map((f) =>
              <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)} className={`rounded-md px-3 py-1 font-medium ${filter === f.id ? 'bg-secondary text-foreground' : 'text-muted-foreground'}`}>
                  {f.label}
                </button>
              )}
            </div>
          </div>
          {shown.length === 0 ?
          <p className="py-10 text-center text-sm text-muted-foreground">No transactions here yet.</p> :

          <ul className="mt-1 divide-y">
              {shown.map((tx) =>
            <TransactionRow key={tx.id} tx={tx} />
            )}
            </ul>
          }
        </section>
      </div>

      <WalletActionSheet action={action} onChange={setAction} />
    </div>);

}