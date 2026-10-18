import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, Check, ScanLine, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '../components/PageHeader';
import { QRScanner } from '../components/QRScanner';
import { TermsBreakdown } from '../components/TermsBreakdown';
import { UserAvatar } from '../components/UserAvatar';

type Step = 'summary' | 'scanning' | 'verify' | 'receipt';

export function DeliveryConfirmation() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('summary');

  return (
    <div>
      <PageHeader
        title={step === 'receipt' ? 'Receipt' : 'Confirm delivery'}
        subtitle="Chicken shawarma wrap + garlic fries"
        backTo="/requests/r2/track"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="mx-auto max-w-lg px-5 py-5 lg:py-10"
        >
          {step === 'summary' && (
            <div className="space-y-4">
              <section className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground">Request summary</p>
                <p className="mt-1 font-medium">Chicken shawarma wrap + garlic fries</p>
                <p className="mt-1 text-sm text-muted-foreground">Halal Cart, 5th & Main → Science Library, Room 204</p>
                <div className="mt-4 border-t pt-4">
                  <TermsBreakdown foodPrice={11.5} deliveryFee={3.0} />
                </div>
              </section>
              <p className="rounded-lg bg-primary-soft px-3 py-2 text-sm leading-6 text-primary">
                Agreed total is held in escrow. Scan Sam Whitaker’s QR code to release it.
              </p>
              <Button size="lg" className="h-12 w-full" onClick={() => setStep('scanning')}>
                <ScanLine aria-hidden="true" /> Scan Sam Whitaker’s QR code
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Only confirm once you have your food in hand.
              </p>
            </div>
          )}

          {step === 'scanning' && (
            <div className="space-y-5 pt-4">
              <QRScanner
                targetValue="dormshi:user:u_sam"
                hint="Point your camera at Sam Whitaker’s Dormshi QR"
                onDetected={() => setStep('verify')}
              />
              <Button variant="outline" className="w-full" onClick={() => setStep('summary')}>
                Cancel
              </Button>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-4">
              <section className="flex flex-col items-center rounded-xl border bg-card p-5 text-center">
                <p className="text-xs text-muted-foreground">Paying</p>
                <div className="mt-3">
                  <UserAvatar initials="SW" size="xl" />
                </div>
                <p className="mt-3 text-lg font-semibold tracking-tight">Sam Whitaker</p>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="size-3.5 fill-current" aria-hidden="true" /> 4.7 · Brooks Hall
                </p>
                <p className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
                  <BadgeCheck className="size-3.5" aria-hidden="true" /> Matches the fulfiller on this request
                </p>
                <p className="mt-5 text-xs text-muted-foreground">Amount</p>
                <p className="font-mono text-3xl font-semibold tracking-tight">14.50 DC</p>
              </section>
              <div className="rounded-xl border bg-card p-4">
                <TermsBreakdown foodPrice={11.5} deliveryFee={3.0} />
              </div>
              <Button size="lg" className="h-12 w-full" onClick={() => setStep('receipt')}>
                I have my food. Release 14.50 DC
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep('scanning')}>
                Scan again
              </Button>
            </div>
          )}

          {step === 'receipt' && (
            <div className="space-y-4">
              <section className="flex flex-col items-center pt-2 text-center">
                <motion.span
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground"
                >
                  <Check className="size-7" strokeWidth={3} aria-hidden="true" />
                </motion.span>
                <h2 className="mt-4 text-xl font-semibold tracking-tight">Delivery confirmed</h2>
                <p className="mt-1 text-sm text-muted-foreground">14.50 DC sent to Sam Whitaker</p>
              </section>
              <section className="rounded-xl border bg-card p-4" aria-label="Transaction receipt">
                <dl className="space-y-2 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="shrink-0 text-muted-foreground">Paid to</dt>
                    <dd className="text-right font-medium">Sam Whitaker</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="shrink-0 text-muted-foreground">Request</dt>
                    <dd className="text-right font-medium">Chicken shawarma wrap + garlic fries</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="shrink-0 text-muted-foreground">Date</dt>
                    <dd className="text-right font-medium">Oct 18, 2026, 3:18 PM</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="shrink-0 text-muted-foreground">Reference</dt>
                    <dd className="text-right font-medium font-mono">DMS-4HXP2M</dd>
                  </div>
                </dl>
                <div className="mt-4 border-t pt-4">
                  <TermsBreakdown foodPrice={11.5} deliveryFee={3.0} />
                </div>
              </section>
              <Button size="lg" className="h-12 w-full" onClick={() => navigate('/')}>
                Done
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}