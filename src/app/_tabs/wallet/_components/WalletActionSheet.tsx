import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { BottomSheet } from '@/ui/custom/BottomSheet';
import { MoneyField } from '@/ui/custom/MoneyField';
import { UserAvatar } from '@/ui/custom/UserAvatar';
import { buyPresets, payMethods, sampleRecipients } from '@/data';

export type WalletAction = 'deposit' | 'transfer';

interface WalletActionSheetProps {
  action: WalletAction | null;
  onChange: (action: WalletAction | null) => void;
  availableBalance?: string;
  currency?: string;
}

const titles: Record<WalletAction, { title: string; description: string }> = {
  deposit: { title: 'Deposit Funds', description: 'Top up your Dormshi wallet balance.' },
  transfer: { title: 'Transfer Funds', description: 'Send funds instantly to another student.' }
};

export function WalletActionSheet({
  action,
  onChange,
  availableBalance = '42.75',
  currency = 'ETB'
}: WalletActionSheetProps) {
  const [depositAmount, setDepositAmount] = useState('100');
  const [depositMethod, setDepositMethod] = useState(payMethods[0]);

  const [transferAmount, setTransferAmount] = useState('25');
  const [recipient, setRecipient] = useState<typeof sampleRecipients[0] | null>(sampleRecipients[0]);
  const [note, setNote] = useState('');

  const close = () => onChange(null);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(depositAmount);
    if (isNaN(val) || val <= 0) {
      toast.error('Please enter a valid deposit amount.');
      return;
    }
    close();
    toast.success(`Deposit request of ${depositAmount} ${currency} via ${depositMethod} initiated.`);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient) {
      toast.error('Please select a recipient.');
      return;
    }
    const val = parseFloat(transferAmount);
    if (isNaN(val) || val <= 0) {
      toast.error('Please enter a valid transfer amount.');
      return;
    }
    const currentBal = parseFloat(availableBalance);
    if (val > currentBal) {
      toast.error(`Insufficient balance. You only have ${availableBalance} ${currency} available.`);
      return;
    }
    close();
    toast.success(`Transferred ${transferAmount} ${currency} to ${recipient.name}.`);
  };

  const optionClass =
    'rounded-lg text-sm font-medium transition-colors border border-border bg-card hover:bg-secondary';

  return (
    <BottomSheet
      open={!!action}
      onClose={close}
      title={action ? titles[action].title : ''}
      description={action ? titles[action].description : undefined}
    >
      {/* 1. Deposit Action */}
      {action === 'deposit' && (
        <form onSubmit={handleDepositSubmit} className="space-y-5 pt-1">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quick Presets
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {buyPresets.map((p) => {
                const isSelected = depositAmount === String(p);
                return (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setDepositAmount(String(p))}
                    className={`h-11 font-mono text-sm font-semibold ${optionClass} ${
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/95'
                        : ''
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          <MoneyField
            id="deposit-amount"
            label="Deposit Amount"
            value={depositAmount}
            onChange={setDepositAmount}
            unit={currency}
          />

          <fieldset className="space-y-2">
            <legend className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Payment Method
            </legend>
            <div className="grid grid-cols-3 gap-2" role="radiogroup">
              {payMethods.map((m) => {
                const isChecked = depositMethod === m;
                return (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={isChecked}
                    onClick={() => setDepositMethod(m)}
                    className={`h-11 px-2 text-xs truncate ${optionClass} ${
                      isChecked
                        ? 'border-primary bg-primary-soft text-primary font-semibold ring-1 ring-primary'
                        : ''
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <Button type="submit" size="lg" className="h-11 w-full rounded-full font-semibold">
            Deposit {depositAmount || '0'} {currency} via {depositMethod}
          </Button>
        </form>
      )}

      {/* 2. Transfer Action */}
      {action === 'transfer' && (
        <form onSubmit={handleTransferSubmit} className="space-y-5 pt-1">
          <fieldset className="space-y-2">
            <legend className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Recipient
            </legend>
            {recipient ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <UserAvatar initials={recipient.initials} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{recipient.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{recipient.dorm}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full h-8 px-3 text-xs"
                  onClick={() => setRecipient(null)}
                >
                  Change
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-2 pt-1">
                {sampleRecipients.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setRecipient(u)}
                    className="flex w-16 shrink-0 flex-col items-center gap-1.5 rounded-lg border border-border bg-card p-2 text-xs hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <UserAvatar initials={u.initials} size="sm" />
                    <span className="w-full truncate text-center text-[11px] font-medium">
                      {u.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </fieldset>

          <MoneyField
            id="transfer-amount"
            label={`Amount (${availableBalance} ${currency} available)`}
            value={transferAmount}
            onChange={setTransferAmount}
            unit={currency}
          />

          <div className="space-y-1.5">
            <Label htmlFor="transfer-note" className="text-xs font-semibold text-foreground">
              Note (optional)
            </Label>
            <Input
              id="transfer-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Split lunch, coffee..."
              className="h-10 rounded-lg text-sm"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-11 w-full rounded-full font-semibold"
            disabled={!recipient}
          >
            {recipient
              ? `Transfer ${transferAmount || '0'} ${currency} to ${recipient.name.split(' ')[0]}`
              : 'Select a recipient'}
          </Button>
        </form>
      )}
    </BottomSheet>
  );
}
