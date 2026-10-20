import { useState } from 'react';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck, faLandmark } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/textarea';
import { Label } from '@/ui/label';
import { BottomSheet } from '@/ui/custom/BottomSheet';
import { MoneyField } from '@/ui/custom/MoneyField';
import { UserAvatar } from '@/ui/custom/UserAvatar';
import { sampleRecipients } from '@/data';

export type WalletAction = 'deposit' | 'transfer';

interface WalletActionSheetProps {
  action: WalletAction | null;
  onChange: (action: WalletAction | null) => void;
  availableBalance?: string;
  currency?: string;
}

const CBE_ACCOUNT = {
  bank: 'Commercial Bank of Ethiopia (CBE)',
  name: 'Dormshi Delivery Services',
  number: '1000492817263',
};

const titles: Record<WalletAction, { title: string; description: string }> = {
  deposit: {
    title: 'Deposit via CBE',
    description: 'Transfer any amount to our CBE account and enter your transaction reference.',
  },
  transfer: {
    title: 'Transfer Funds',
    description: 'Send funds instantly to another student.',
  },
};

export function WalletActionSheet({
  action,
  onChange,
  availableBalance = '42.75',
  currency = 'ETB'
}: WalletActionSheetProps) {
  const [txnId, setTxnId] = useState('');
  const [copied, setCopied] = useState(false);

  const [recipientPhone, setRecipientPhone] = useState('0911223344');
  const [transferAmount, setTransferAmount] = useState('25');
  const [note, setNote] = useState('');

  const close = () => onChange(null);

  const normalizeDigits = (val: string) => val.replace(/\D/g, '');
  const digits = normalizeDigits(recipientPhone);

  const matchedRecipient = digits.length >= 4
    ? sampleRecipients.find((r) => {
        const rDigits = normalizeDigits(r.phone);
        return rDigits.endsWith(digits) || digits.endsWith(rDigits);
      }) ?? (digits.length >= 9
        ? {
            id: 'u_phone',
            name: 'Campus Student',
            phone: recipientPhone,
            initials: 'CS',
            dorm: 'Verified User',
          }
        : null)
    : null;

  const handleCopyAccount = () => {
    try {
      navigator.clipboard.writeText(CBE_ACCOUNT.number);
      setCopied(true);
      toast.success('CBE account number copied.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy account number.');
    }
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTxn = txnId.trim();
    if (!cleanTxn) {
      toast.error('Please enter the CBE transaction reference (Txn ID).');
      return;
    }
    close();
    toast.success(
      `Deposit reference submitted (${cleanTxn}). Your balance will be credited once verified.`
    );
    setTxnId('');
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedRecipient) {
      toast.error('Please enter a valid recipient phone number.');
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
    toast.success(`Transferred ${transferAmount} ${currency} to ${matchedRecipient.name}.`);
  };

  return (
    <BottomSheet
      open={!!action}
      onClose={close}
      title={action ? titles[action].title : ''}
      description={action ? titles[action].description : undefined}
    >
      {/* 1. Deposit Action */}
      {action === 'deposit' && (
        <form onSubmit={handleDepositSubmit} className="space-y-4 pt-1">
          {/* CBE Account Details Card */}
          <div className="rounded-lg border border-border bg-secondary/50 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <FontAwesomeIcon icon={faLandmark} className="size-3.5 text-primary" />
                {CBE_ACCOUNT.bank}
              </span>
              <span className="rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground uppercase border border-border">
                Official
              </span>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <div className="min-w-0 pr-2">
                <p className="text-[11px] text-muted-foreground">Account Name</p>
                <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                  {CBE_ACCOUNT.name}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-[11px] text-muted-foreground">Account Number</p>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-foreground">
                    {CBE_ACCOUNT.number}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="flex size-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-95 transition-all"
                    title="Copy account number"
                    aria-label="Copy account number"
                  >
                    <FontAwesomeIcon
                      icon={copied ? faCheck : faCopy}
                      className={`size-3 ${copied ? 'text-primary font-bold' : ''}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">How it works:</p>
            <ol className="list-decimal pl-4 space-y-0.5 text-[11px]">
              <li>Transfer whatever amount you want to deposit to our CBE account.</li>
              <li>Enter your transaction ID below. The exact transferred amount will be verified and credited automatically.</li>
            </ol>
          </div>

          {/* Transaction Reference (Txn ID) */}
          <div className="space-y-1.5">
            <Label htmlFor="deposit-txn" className="text-xs font-semibold text-foreground">
              CBE Transaction ID / Txn Ref <span className="text-primary">*</span>
            </Label>
            <Input
              id="deposit-txn"
              type="text"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              placeholder="e.g. FT240901234 or TXN ref"
              className="h-10 rounded-lg text-sm font-mono uppercase"
              required
            />
          </div>

          <Button type="submit" size="lg" className="h-11 w-full rounded-full font-semibold">
            Confirm Deposit
          </Button>
        </form>
      )}

      {/* 2. Transfer Action */}
      {action === 'transfer' && (
        <form onSubmit={handleTransferSubmit} className="space-y-4 pt-1">
          {/* Recipient Phone Input */}
          <div className="space-y-1.5">
            <Label htmlFor="recipient-phone" className="text-xs font-semibold text-foreground">
              Recipient Phone Number <span className="text-primary">*</span>
            </Label>
            <Input
              id="recipient-phone"
              type="tel"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              placeholder="e.g. 0911223344 or +251 9..."
              className="h-10 rounded-lg text-sm font-mono"
              required
            />
          </div>

          {/* Recipient Identity Display */}
          {matchedRecipient ? (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3">
              <UserAvatar initials={matchedRecipient.initials} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{matchedRecipient.name}</p>
                <p className="text-xs text-muted-foreground truncate">{matchedRecipient.dorm} · Verified recipient</p>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              Type the recipient's phone number to verify their name.
            </p>
          )}

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
            <Textarea
              id="transfer-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Split lunch, coffee..."
              rows={2}
              className="min-h-[64px] rounded-lg text-sm resize-none"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-11 w-full rounded-full font-semibold"
            disabled={!matchedRecipient}
          >
            {matchedRecipient
              ? `Transfer ${transferAmount || '0'} ${currency} to ${matchedRecipient.name}`
              : 'Enter phone number'}
          </Button>
        </form>
      )}
    </BottomSheet>
  );
}
