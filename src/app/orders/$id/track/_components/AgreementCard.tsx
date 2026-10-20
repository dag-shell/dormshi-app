import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import { TermsBreakdown } from '@/ui/custom/TermsBreakdown';

interface AgreementCardProps {
  request?: {
    id?: string;
    food?: string;
    status?: string;
    agreement?: {
      foodPrice?: number;
      deliveryFee?: number;
      etaMinutes?: number;
      acceptedAt?: string;
    };
    pendingChange?: {
      proposedBy?: string;
      reason?: string;
      foodPrice?: number;
      deliveryFee?: number;
      etaMinutes?: number;
    };
  };
  canPropose?: boolean;
  onPropose?: () => void;
}

export function AgreementCard({ request, canPropose = true, onPropose }: AgreementCardProps) {
  const agreement = request?.agreement ?? {
    foodPrice: 12.8,
    deliveryFee: 3.0,
    etaMinutes: 12,
    acceptedAt: '2:45 PM'
  };

  const change = request?.pendingChange;

  return (
    <Card aria-labelledby="terms-title">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-3">
        <CardTitle id="terms-title" className="flex items-center gap-2 text-sm font-semibold">
          <FontAwesomeIcon icon={faLock} className="size-3.5" aria-hidden="true" /> Agreed terms
        </CardTitle>
        <span className="text-xs text-muted-foreground">Locked at 2:45 PM</span>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <TermsBreakdown
          foodPrice={agreement.foodPrice ?? 12.8}
          deliveryFee={agreement.deliveryFee ?? 3.0}
          etaLabel={`${agreement.etaMinutes ?? 12} min`}
        />

        <p className="mt-3 rounded-lg bg-primary-soft px-3 py-2 text-xs leading-5 text-primary">
          15.80 ETB is held in escrow. It is released only after QR-verified delivery.
        </p>

        {change && (
          <div className="mt-3 rounded-lg border border-primary p-3" role="status">
            <p className="text-sm font-medium">Jordan Reyes proposed new terms</p>
            <p className="mt-1 text-xs text-muted-foreground">“{change.reason ?? 'Store was out of medium size, grabbed large instead.'}”</p>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <Diff label="Food" from={agreement.foodPrice ?? 12.8} to={change.foodPrice ?? 14.5} />
              <Diff label="Fee" from={agreement.deliveryFee ?? 3.0} to={change.deliveryFee ?? 3.0} />
              <Diff label="Minutes" from={agreement.etaMinutes ?? 12} to={change.etaMinutes ?? 18} whole />
            </dl>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="outline">Decline</Button>
              <Button>Approve</Button>
            </div>
          </div>
        )}

        {canPropose && !change && onPropose && (
          <Button variant="ghost" size="sm" className="mt-2 w-full text-muted-foreground" onClick={onPropose}>
            Propose a change to these terms
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function Diff({ label, from, to, whole = false }: { label: string; from: number; to: number; whole?: boolean }) {
  const fmt = (n: number) => (whole ? String(n) : n.toFixed(2));
  return (
    <div className="rounded-md bg-secondary px-2 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono">
        {from !== to ? (
          <>
            <span className="text-muted-foreground line-through">{fmt(from)}</span>{' '}
            <span className="font-medium">{fmt(to)}</span>
          </>
        ) : (
          fmt(to)
        )}
      </dd>
    </div>
  );
}