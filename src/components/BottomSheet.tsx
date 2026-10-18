import React, { useEffect, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

/** Bottom sheet on small screens, centered dialog on tablet and up. */
export function BottomSheet({ open, onClose, title, description, children }: BottomSheetProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const ease = [0.32, 0.72, 0, 1] as const;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6">
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex max-h-[92vh] w-full max-w-md flex-col rounded-t-xl border border-b-0 bg-background md:max-h-[85vh] md:max-w-lg md:rounded-xl md:border-b md:shadow-[0_1px_2px_rgba(31,27,22,0.06),0_16px_40px_rgba(31,27,22,0.12)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease }}
          >
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border md:hidden" aria-hidden="true" />
            <div className="flex items-start justify-between gap-4 px-5 pb-2 pt-3 md:px-6 md:pt-6">
              <div>
                <h2 id={titleId} className="text-lg font-semibold tracking-tight">
                  {title}
                </h2>
                {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 pb-6 pt-2 md:px-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}