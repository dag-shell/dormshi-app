import { useState } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { BottomSheet } from '@/ui/custom/BottomSheet';
import { MoneyField } from '@/ui/custom/MoneyField';
import { QRScanner } from '@/ui/custom/QRScanner';
import { UserAvatar } from '@/ui/custom/UserAvatar';

export type WalletAction = 'buy' | 'send' | 'scan' | 'cashout';

interface WalletActionSheetProps {
  action: WalletAction | null;
  onChange: (action: WalletAction | null) => void;
}

import { buyPresets, payMethods, sampleRecipients } from '@/data';

const titles: Record<WalletAction, { title: string; description: string }> = {
  buy: { title: 'Buy DC', description: '1 DC costs $1.00. No fees.' },
  send: { title: 'Send DC', description: 'Instant transfer to any Dormshi user.' },
  scan: { title: 'Scan to pay', description: 'Scan someone’s personal QR code.' },
  cashout: { title: 'Cash out', description: 'Move available DC to your linked bank.' }
};

export function WalletActionSheet({ action, onChange }: WalletActionSheetProps) {
  const [amount, setAmount] = useState('25');
  const [method, setMethod] = useState(payMethods[0]);
  const [recipient, setRecipient] = useState<typeof sampleRecipients[0] | null>(sampleRecipients[0]);
  const [note, setNote] = useState('');

  const close = () => onChange(null);

  const optionClass = "rounded-lg text-sm font-medium transition-colors";

  return (
    <BottomSheet
      open={!!action}
      onClose={close}
      title={action ? titles[action].title : ''}
      description={action ? titles[action].description : undefined}
    >
      {action === 'buy' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {buyPresets.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={amount === String(p)}
                onClick={() => setAmount(String(p))}
                className={`h-11 font-mono ${optionClass}`}
              >
                {p}
              </button>
            ))}
          </div>
          <MoneyField id="buy-amount" label="Amount" value={amount} onChange={setAmount} />
          <fieldset>
            <legend className="text-sm font-medium">Pay with</legend>
            <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup">
              {payMethods.map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={method === m}
                  onClick={() => setMethod(m)}
                  className={`h-11 px-4 ${optionClass}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </fieldset>
          <Button size="lg" className="h-11 w-full" onClick={close}>
            Buy {amount || '25'} DC for ${amount || '25.00'}
          </Button>
        </div>
      )}

      {action === 'scan' && (
        <div className="pt-2">
          <QRScanner
            targetValue="dormshi:user:u_jordan"
            hint="Looking for a Dormshi QR code…"
            onDetected={() => {
              setRecipient(sampleRecipients[0]);
              onChange('send');
            }}
          />
        </div>
      )}

      {action === 'send' && (
        <div className="space-y-4">
          <fieldset>
            <legend className="text-sm font-medium">Recipient</legend>
            {recipient ? (
              <div className="mt-2 flex items-center gap-3 rounded-lg border border-primary bg-card px-3 py-2">
                <UserAvatar initials={recipient.initials} size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{recipient.name}</p>
                  <p className="text-xs text-muted-foreground">{recipient.dorm}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setRecipient(null)}>Change</Button>
              </div>
            ) : (
              <div className="mt-2 flex gap-3 overflow-x-auto pb-1">
                {sampleRecipients.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setRecipient(u)}
                    className="flex w-16 shrink-0 flex-col items-center gap-2 rounded-lg py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <UserAvatar initials={u.initials} />
                    <span className="w-full truncate text-center">{u.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </fieldset>
          <MoneyField id="send-amount" label="Amount (42.75 DC available)" value={amount} onChange={setAmount} />
          <div className="space-y-2">
            <Label htmlFor="send-note">Note (optional)</Label>
            <Input id="send-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What’s it for?" className="h-10" />
          </div>
          <Button size="lg" className="h-11 w-full" onClick={close}>
            {recipient ? `Send ${amount || '10'} DC to ${recipient.name.split(' ')[0]}` : 'Choose a recipient'}
          </Button>
        </div>
      )}

      {action === 'cashout' && (
        <div className="space-y-4">
          <div className="relative">
            <MoneyField id="cashout-amount" label="Amount (42.75 DC available)" value={amount} onChange={setAmount} />
            <button type="button" onClick={() => setAmount('42.75')} className="absolute right-0 top-0 text-xs font-medium text-primary hover:underline">
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
              <dd className="font-mono font-medium">${amount || '42.75'}</dd>
            </div>
          </dl>
          <p className="text-xs text-muted-foreground">Reserved DC can’t be cashed out until its request settles.</p>
          <Button size="lg" className="h-11 w-full" onClick={close}>
            Cash out {amount || '42.75'} DC
          </Button>
        </div>
      )}
    </BottomSheet>
  );
}