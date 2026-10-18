import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { QRCode } from './QRCode';

interface QRScannerProps {
  /** Value encoded in the code being pointed at (simulated camera feed). */
  targetValue: string;
  hint: string;
  onDetected: (value: string) => void;
  detectAfterMs?: number;
}

export function QRScanner({ targetValue, hint, onDetected, detectAfterMs = 2200 }: QRScannerProps) {
  useEffect(() => {
    const t = setTimeout(() => onDetected(targetValue), detectAfterMs);
    return () => clearTimeout(t);
  }, [targetValue, detectAfterMs]);

  return (
    <div>
      <div
        className="relative mx-auto aspect-square w-full max-w-72 overflow-hidden rounded-xl bg-neutral-900"
        role="img"
        aria-label="Camera viewfinder scanning for a QR code">
        
        <div className="absolute inset-0 grid place-items-center opacity-40 blur-[1px]">
          <QRCode value={targetValue} size={150} label="" />
        </div>
        {(['left-5 top-5 border-l-4 border-t-4 rounded-tl-lg', 'right-5 top-5 border-r-4 border-t-4 rounded-tr-lg', 'bottom-5 left-5 border-b-4 border-l-4 rounded-bl-lg', 'bottom-5 right-5 border-b-4 border-r-4 rounded-br-lg'] as const).map((pos) =>
        <span key={pos} className={`absolute size-10 border-white ${pos}`} />
        )}
        <motion.span
          className="absolute inset-x-8 h-0.5 rounded-full bg-primary"
          initial={{ top: '18%' }}
          animate={{ top: ['18%', '82%', '18%'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} />
        
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground" aria-live="polite">
        {hint}
      </p>
    </div>);

}