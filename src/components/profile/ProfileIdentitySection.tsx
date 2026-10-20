import React from 'react';
import { Link } from '@tanstack/react-router';
import { QRCode } from '@/components/common/QRCode';

export interface ProfileIdentitySectionProps {
  value?: string;
  userId?: string;
}

export function ProfileIdentitySection({
  value = 'dormshi:user:u_me',
  userId = '#DRM-8291'
}: ProfileIdentitySectionProps) {
  return (
    <div className="space-y-6">
      {/* QR Code & ID Card */}
      <section
        aria-label="Delivery QR code"
        className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-6 text-center"
      >
        <div className="rounded-lg border border-border bg-white p-3">
          <QRCode value={value} size={160} label="Personal QR code" />
        </div>
        <p className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          ID: {userId}
        </p>
      </section>

      {/* Legal Footer Links */}
      <p className="flex justify-center gap-4 pb-4 text-xs text-muted-foreground">
        <Link to="/terms" className="hover:text-foreground">Terms</Link>
        <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
        <span>© 2026 Dormshi</span>
      </p>
    </div>
  );
}
