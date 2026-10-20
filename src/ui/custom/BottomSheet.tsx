import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/ui/dialog';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

/** Bottom sheet on small screens, centered dialog on tablet and up. Powered by shadcn Dialog. */
export function BottomSheet({ open, onClose, title, description, children }: BottomSheetProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-hidden p-0 md:max-h-[85vh]">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border md:hidden" aria-hidden="true" />
        <DialogHeader className="px-5 pt-3 md:px-6 md:pt-6">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="overflow-y-auto px-5 pb-6 pt-2 md:px-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
}