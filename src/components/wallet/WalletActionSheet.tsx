import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Label } from '../Label';
import { BottomSheet } from '../BottomSheet';
import { MoneyField } from '../MoneyField';
import { QRScanner } from '../QRScanner';
import { UserAvatar } from '../UserAvatar';
import { useDormshi } from '../../contexts/DormshiContext';
import { CURRENT_USER_ID } from '../../data/users';
import { formatAmount, formatDC, roundDC } from '../../utils/format';
import { delay } from '../../utils/time';

export type WalletAction = 'buy' | 'send' | 'scan' | 'cashout';

interface WalletActionSheetProps {
  action: WalletAction | null;
  onChange: (action: WalletAction | null) => void;
}

const titles: Record<WalletAction, {title: string;description: string;}> = {
  buy: { title: 'Buy DC', description: '1 DC costs $1.00. No fees.' },
  send: { title: 'Send DC', description: 'Instant transfer to any Dormshi user.' },
  scan: { title: 'Scan to pay', description: 'Scan someone’s personal QR code.' },
  cashout: { title: 'Cash out', description: 'Move available DC to your linked bank.' }
};

const buyPresets = [10, 25, 50, 100];
const payMethods = ['Visa •• 4242', 'Apple Pay'];

export function WalletActionSheet({ action, onChange }: WalletActionSheetProps) {
  const { users, wallet, buyDC, sendDC, cashOut, getUser } = useDormshi();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState(payMethods[0]);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (action === 'buy') setAmount('25');
    if (action === 'cashout') setAmount('');
    if (action === 'buy' || action === 'cashout' || action === null) {
      setRecipientId(null);
      setNote('');
    }
    if (action === 'send' && !recipientId) setAmount('');
    setError('');
    setBusy(false);
  }, [action]);

  const close = () => onChange(null);
  const value = roundDC(parseFloat(amount) || 0);

  const run = async (fn: () => void | {ok: boolean;error?: string;}, success: string) => {
    if (value <= 0) {
      setError('Enter an amount greater than 0');
      return;
    }
    setBusy(true);
    await delay(800);
    const result = fn();
    setBusy(false);
    if (result && !result.ok) {
      setError(result.error ?? 'Something went wrong');
      return;
    }
    toast.success(success);
    close();
  };

  const optionClass = (active: boolean) =>
  `rounded-lg border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
  active ? 'border-primary bg-primary-soft text-primary' : 'bg-card hover:bg-secondary'}`;


  return (
    <BottomSheet open={!!action} onClose={close} title={action ? titles[action].title : ''} description={action ? titles[action].description : undefined}>
      {action === 'buy' &&
      <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {buyPresets.map((p) =>
          <button key={p} type="button" aria-pressed={value === p} onClick={() => setAmount(String(p))} className={`h-11 font-mono ${optionClass(value === p)}`}>
                {p}
              </button>
          )}
          </div>
          <MoneyField id="buy-amount" label="Amount" value={amount} onChange={setAmount} error={error} />
          <fieldset>
            <legend className="text-sm font-medium">Pay with</legend>
            <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup">
              {payMethods.map((m) =>
            <button key={m} type="button" role="radio" aria-checked={method === m} onClick={() => setMethod(m)} className={`h-11 px-4 ${optionClass(method === m)}`}>
                  {m}
                </button>
            )}
            </div>
          </fieldset>
          <Button size="lg" className="h-11 w-full" disabled={busy} onClick={() => run(() => buyDC(value, method), `${formatDC(value)} added to your wallet`)}>
            {busy ? <><Loader2 className="animate-spin" aria-hidden="true" /> Processing</> : `Buy ${formatAmount(value)} DC for $${formatAmount(value)}`}
          </Button>
        </div>
      }

      {action === 'scan' &&
      <div className="pt-2">
          <QRScanner
          targetValue="dormshi:user:u_jordan"
          hint="Looking for a Dormshi QR code…"
          onDetected={(v) => {
            setRecipientId(v.replace('dormshi:user:', ''));
            setAmount('');
            onChange('send');
          }} />
        
        </div>
      }

      {action === 'send' &&
      <div className="space-y-4">
          <fieldset>
            <legend className="text-sm font-medium">Recipient</legend>
            {recipientId ?
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-primary bg-card px-3 py-2">
                <UserAvatar user={getUser(recipientId)} size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{getUser(recipientId).name}</p>
                  <p className="text-xs text-muted-foreground">{getUser(recipientId).dorm}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setRecipientId(null)}>Change</Button>
              </div> :

          <div className="mt-2 flex gap-3 overflow-x-auto pb-1">
                {users.filter((u) => u.id !== CURRENT_USER_ID).map((u) =>
            <button key={u.id} type="button" onClick={() => setRecipientId(u.id)} className="flex w-16 shrink-0 flex-col items-center gap-2 rounded-lg py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <UserAvatar user={u} />
                    <span className="w-full truncate text-center">{u.name.split(' ')[0]}</span>
                  </button>
            )}
              </div>
          }
          </fieldset>
          <MoneyField id="send-amount" label={`Amount (${formatDC(wallet.available)} available)`} value={amount} onChange={setAmount} error={error} />
          <div className="space-y-2">
            <Label htmlFor="send-note">Note (optional)</Label>
            <Input id="send-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What’s it for?" className="h-10" />
          </div>
          <Button
          size="lg"
          className="h-11 w-full"
          disabled={busy || !recipientId}
          onClick={() => recipientId && run(() => sendDC(recipientId, value, note.trim() || undefined), `${formatDC(value)} sent to ${getUser(recipientId).name}`)}>
          
            {busy ? <><Loader2 className="animate-spin" aria-hidden="true" /> Sending</> : recipientId ? `Send ${formatDC(value)}` : 'Choose a recipient'}
          </Button>
        </div>
      }

      {action === 'cashout' &&
      <div className="space-y-4">
          <div className="relative">
            <MoneyField id="cashout-amount" label={`Amount (${formatDC(wallet.available)} available)`} value={amount} onChange={setAmount} error={error} />
            <button type="button" onClick={() => setAmount(formatAmount(wallet.available))} className="absolute right-0 top-0 text-xs font-medium text-primary hover:underline">
              Max
            </button>
          </div>
          <dl className="space-y-2 rounded-lg border bg-card px-4 py-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">To</dt>
              <dd className="font-medium">Chase •• 0921</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Arrives</dt>
              <dd className="font-medium">1 to 2 business days</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">You receive</dt>
              <dd className="font-mono font-medium">${formatAmount(value)}</dd>
            </div>
          </dl>
          <p className="text-xs text-muted-foreground">Reserved DC can’t be cashed out until its request settles.</p>
          <Button size="lg" className="h-11 w-full" disabled={busy} onClick={() => run(() => cashOut(value), `Cash out of ${formatDC(value)} started`)}>
            {busy ? <><Loader2 className="animate-spin" aria-hidden="true" /> Processing</> : `Cash out ${formatDC(value)}`}
          </Button>
        </div>
      }
    </BottomSheet>);

}