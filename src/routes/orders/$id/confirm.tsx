import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { QRScanner } from '@/components/common/QRScanner';
import {
  DeliverySummaryStep,
  DeliveryVerifyStep,
  DeliveryReceiptStep
} from '@/components/delivery-confirmation';

type Step = 'summary' | 'scanning' | 'verify' | 'receipt';

export const Route = createFileRoute('/orders/$id/confirm')({
  component: DeliveryConfirmationPage,
});

export function DeliveryConfirmationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('summary');

  return (
    <div>
      <Header
        title={step === 'receipt' ? 'Receipt' : 'Confirm delivery'}
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
            <DeliverySummaryStep
              foodTitle="Chicken shawarma wrap + garlic fries"
              routeLabel="Halal Cart, 5th & Main → Science Library, Room 204"
              foodPrice={11.5}
              deliveryFee={3.0}
              courierName="Sam Whitaker"
              onStartScan={() => setStep('scanning')}
            />
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
            <DeliveryVerifyStep
              courierName="Sam Whitaker"
              courierInitials="SW"
              rating="4.7"
              dorm="Brooks Hall"
              totalAmount="14.50 DC"
              foodPrice={11.5}
              deliveryFee={3.0}
              onConfirmRelease={() => setStep('receipt')}
              onScanAgain={() => setStep('scanning')}
            />
          )}

          {step === 'receipt' && (
            <DeliveryReceiptStep
              paidTo="Sam Whitaker"
              requestTitle="Chicken shawarma wrap + garlic fries"
              date="Oct 18, 2026, 3:18 PM"
              reference="DMS-4HXP2M"
              totalAmount="14.50 DC"
              foodPrice={11.5}
              deliveryFee={3.0}
              onDone={() => navigate({ to: '/' })}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
