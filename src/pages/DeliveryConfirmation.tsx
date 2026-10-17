import React, { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, BadgeCheck, Check, Loader2, ScanLine, Star } from 'lucide-react';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { QRScanner } from '../components/QRScanner';
import { TermsBreakdown } from '../components/TermsBreakdown';
import { UserAvatar } from '../components/UserAvatar';
import { useDormshi } from '../contexts/DormshiContext';
import { CURRENT_USER_ID } from '../data/users';
import { firstName, formatDateTime, formatDC } from '../utils/format';
import { canConfirm, totalOf } from '../utils/orders';
import type { Transaction } from '../types/dormshi';

type Step = 'summary' | 'scanning' | 'verify' | 'processing' | 'receipt' | 'error';

const checks = ['Verifying request and delivery status', 'Matching QR to accepted fulfiller', 'Releasing reserved DC'];

export function DeliveryConfirmation() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { requests, transactions, getUser, confirmDelivery } = useDormshi();
  const request = requests.find((r) => r.id === id);
  const [step, setStep] = useState<Step>(() => request?.status === 'completed' ? 'receipt' : 'summary');
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<Transaction | null>(null);

  if (!request?.agreement || request.requesterId !== CURRENT_USER_ID) return <Navigate to={`/requests/${id}/track`} replace />;
  if (!canConfirm(request.status) && request.status !== 'completed') return <Navigate to={`/requests/${id}/track`} replace />;

  const agreement = request.agreement;
  const fulfiller = getUser(agreement.fulfillerId);
  const total = totalOf(agreement);
  const scannedUser = scannedId ? getUser(scannedId) : null;
  const matches = scannedId === agreement.fulfillerId;
  const shownReceipt = receipt ?? transactions.find((t) => t.id === request.receiptId) ?? null;

  const onDetected = (value: string) => {
    const userId = value.replace('dormshi:user:', '');
    setScannedId(userId);
    setStep('verify');
  };

  const onConfirm = async () => {
    if (!scannedId) return;
    setStep('processing');
    setProgress(0);
    const timer = setInterval(() => setProgress((p) => Math.min(p + 1, checks.length - 1)), 850);
    const result = await confirmDelivery(request.id, scannedId);
    clearInterval(timer);
    if (!result.ok || !result.receipt) {
      setError(result.error ?? 'Something went wrong. No DC was moved.');
      setStep('error');
      return;
    }
    setProgress(checks.length);
    setReceipt(result.receipt);
    setTimeout(() => setStep('receipt'), 500);
  };

  return (
    <div>
      <PageHeader title={step === 'receipt' ? 'Receipt' : 'Confirm delivery'} subtitle={request.food} backTo={`/requests/${request.id}/track`} />

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="mx-auto max-w-lg px-5 py-5 lg:py-10">
          {step === 'summary' &&
          <div className="space-y-4">
              <section className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground">Request summary</p>
                <p className="mt-1 font-medium">{request.food}</p>
                <p className="mt-1 text-sm text-muted-foreground">{request.pickup} → {request.destination}</p>
                <div className="mt-4 border-t pt-4">
                  <TermsBreakdown foodPrice={agreement.foodPrice} deliveryFee={agreement.deliveryFee} />
                </div>
              </section>
              <p className="rounded-lg bg-primary-soft px-3 py-2 text-sm leading-6 text-primary">
                Agreed total is held in escrow. Scan {firstName(fulfiller.name)}’s QR code to release it.
              </p>
              <Button size="lg" className="h-12 w-full" onClick={() => setStep('scanning')}>
                <ScanLine aria-hidden="true" /> Scan {firstName(fulfiller.name)}’s QR code
              </Button>
              <p className="text-center text-xs text-muted-foreground">Only confirm once you have your food in hand.</p>
            </div>
          }

          {step === 'scanning' &&
          <div className="space-y-5 pt-4">
              <QRScanner targetValue={`dormshi:user:${fulfiller.id}`} hint={`Point your camera at ${firstName(fulfiller.name)}’s Dormshi QR`} onDetected={onDetected} />
              <Button variant="outline" className="w-full" onClick={() => setStep('summary')}>Cancel</Button>
            </div>
          }

          {step === 'verify' && scannedUser &&
          <div className="space-y-4">
              <section className="flex flex-col items-center rounded-xl border bg-card p-5 text-center">
                <p className="text-xs text-muted-foreground">Paying</p>
                <div className="mt-3"><UserAvatar user={scannedUser} size="xl" /></div>
                <p className="mt-3 text-lg font-semibold tracking-tight">{scannedUser.name}</p>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="size-3.5 fill-current" aria-hidden="true" /> {scannedUser.rating.toFixed(1)} · {scannedUser.dorm}
                </p>
                {matches ?
              <p className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
                    <BadgeCheck className="size-3.5" aria-hidden="true" /> Matches the fulfiller on this request
                  </p> :

              <p className="mt-3 inline-flex items-center gap-2 rounded-md bg-destructive-soft px-3 py-1 text-xs font-medium text-destructive" role="alert">
                    <AlertTriangle className="size-3.5" aria-hidden="true" /> Not the fulfiller on this request
                  </p>
              }
                <p className="mt-5 text-xs text-muted-foreground">Amount</p>
                <p className="font-mono text-3xl font-semibold tracking-tight">{formatDC(total)}</p>
              </section>
              <div className="rounded-xl border bg-card p-4">
                <TermsBreakdown foodPrice={agreement.foodPrice} deliveryFee={agreement.deliveryFee} />
              </div>
              <Button size="lg" className="h-12 w-full" onClick={onConfirm} disabled={!matches}>
                I have my food. Release {formatDC(total)}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep('scanning')}>Scan again</Button>
            </div>
          }

          {step === 'processing' &&
          <section className="rounded-xl border bg-card p-5" aria-live="polite" aria-busy="true">
              <p className="font-medium">Securing your payment</p>
              <p className="mt-1 text-sm text-muted-foreground">Dormshi verifies everything before any DC moves.</p>
              <ol className="mt-5 space-y-4">
                {checks.map((c, i) => {
                const done = i < progress;
                const current = i === progress;
                return (
                  <li key={c} className="flex items-center gap-3 text-sm">
                      <span className={`grid size-6 place-items-center rounded-full ${done ? 'bg-primary text-primary-foreground' : 'border bg-background'}`}>
                        {done ? <Check className="size-3.5" strokeWidth={3} /> : current ? <Loader2 className="size-3.5 animate-spin text-primary" /> : null}
                      </span>
                      <span className={done || current ? '' : 'text-muted-foreground'}>{c}</span>
                    </li>);

              })}
              </ol>
            </section>
          }

          {step === 'error' &&
          <section className="flex flex-col items-center rounded-xl border bg-card p-6 text-center" role="alert">
              <span className="grid size-12 place-items-center rounded-full bg-destructive-soft text-destructive"><AlertTriangle className="size-6" aria-hidden="true" /></span>
              <p className="mt-3 font-semibold">Couldn’t confirm delivery</p>
              <p className="mt-1 text-sm text-muted-foreground">{error} Your DC is still safely reserved.</p>
              <Button className="mt-5 w-full" onClick={() => setStep('scanning')}>Try again</Button>
              <Link to={`/requests/${request.id}/track`} className="mt-3 text-sm text-muted-foreground hover:text-foreground">Back to request</Link>
            </section>
          }

          {step === 'receipt' &&
          <div className="space-y-4">
              <section className="flex flex-col items-center pt-2 text-center">
                <motion.span initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }} className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-7" strokeWidth={3} aria-hidden="true" />
                </motion.span>
                <h2 className="mt-4 text-xl font-semibold tracking-tight">Delivery confirmed</h2>
                <p className="mt-1 text-sm text-muted-foreground">{formatDC(total)} sent to {fulfiller.name}</p>
              </section>
              <section className="rounded-xl border bg-card p-4" aria-label="Transaction receipt">
                <dl className="space-y-2 text-sm">
                  <ReceiptRow label="Paid to" value={fulfiller.name} />
                  <ReceiptRow label="Request" value={request.food} />
                  {shownReceipt && <ReceiptRow label="Date" value={formatDateTime(shownReceipt.createdAt)} />}
                  {shownReceipt && <ReceiptRow label="Reference" value={shownReceipt.reference} mono />}
                </dl>
                <div className="mt-4 border-t pt-4">
                  <TermsBreakdown foodPrice={agreement.foodPrice} deliveryFee={agreement.deliveryFee} />
                </div>
              </section>
              <Button size="lg" className="h-12 w-full" onClick={() => navigate('/')}>Done</Button>
            </div>
          }
        </motion.div>
      </AnimatePresence>
    </div>);

}

function ReceiptRow({ label, value, mono = false }: {label: string;value: string;mono?: boolean;}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className={`text-right font-medium ${mono ? 'font-mono' : ''}`}>{value}</dd>
    </div>);

}