import React from 'react';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';
import { Button } from '../Button';
import { TermsBreakdown } from '../TermsBreakdown';
import { useDormshi } from '../../contexts/DormshiContext';
import { CURRENT_USER_ID } from '../../data/users';
import { addMinutes, firstName, formatAmount, formatClock, formatDC, roundDC } from '../../utils/format';
import { totalOf } from '../../utils/orders';
import type { FoodRequest } from '../../types/dormshi';

interface AgreementCardProps {
  request: FoodRequest;
  canPropose: boolean;
  onPropose: () => void;
}

export function AgreementCard({ request, canPropose, onPropose }: AgreementCardProps) {
  const { getUser, respondToChange, withdrawChange } = useDormshi();
  const agreement = request.agreement;
  if (!agreement) return null;
  const change = request.pendingChange;
  const isRequester = request.requesterId === CURRENT_USER_ID;
  const held = ['accepted', 'getting_food', 'picked_up', 'on_the_way', 'delivered', 'disputed'].includes(request.status);

  const respond = (approve: boolean) => {
    const result = respondToChange(request.id, approve);
    if (!result.ok) toast.error(result.error);else
    toast.success(approve ? 'New terms locked' : 'Change declined. The original terms still apply.');
  };

  return (
    <section aria-labelledby="terms-title" className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="terms-title" className="flex items-center gap-2 text-sm font-semibold">
          <Lock className="size-4" aria-hidden="true" /> Agreed terms
        </h2>
        <span className="text-xs text-muted-foreground">Locked at {formatClock(agreement.acceptedAt)}</span>
      </div>

      <TermsBreakdown
        foodPrice={agreement.foodPrice}
        deliveryFee={agreement.deliveryFee}
        etaLabel={`${agreement.etaMinutes} min, by ${formatClock(addMinutes(agreement.acceptedAt, agreement.etaMinutes))}`} />
      

      {held &&
      <p className="mt-3 rounded-lg bg-primary-soft px-3 py-2 text-xs leading-5 text-primary">
          {formatDC(totalOf(agreement))} is held in escrow. It is released only after QR-verified delivery.
        </p>
      }

      {change &&
      <div className="mt-3 rounded-lg border border-primary p-3" role="status">
          <p className="text-sm font-medium">
            {change.proposedBy === CURRENT_USER_ID ? 'You proposed new terms' : `${firstName(getUser(change.proposedBy).name)} proposed new terms`}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">“{change.reason}”</p>
          <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <Diff label="Food" from={agreement.foodPrice} to={change.foodPrice} />
            <Diff label="Fee" from={agreement.deliveryFee} to={change.deliveryFee} />
            <Diff label="Minutes" from={agreement.etaMinutes} to={change.etaMinutes} whole />
          </dl>
          <p className="mt-2 text-xs text-muted-foreground">
            New total {formatDC(totalOf(change))}
            {isRequester && totalOf(change) > totalOf(agreement) && `. ${formatDC(roundDC(totalOf(change) - totalOf(agreement)))} more will be reserved.`}
          </p>
          {change.proposedBy === CURRENT_USER_ID ?
        <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => withdrawChange(request.id)}>
              Withdraw proposal
            </Button> :

        <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => respond(false)}>Decline</Button>
              <Button onClick={() => respond(true)}>Approve</Button>
            </div>
        }
        </div>
      }

      {canPropose && !change &&
      <Button variant="ghost" size="sm" className="mt-2 w-full text-muted-foreground" onClick={onPropose}>
          Propose a change to these terms
        </Button>
      }
    </section>);

}

function Diff({ label, from, to, whole = false }: {label: string;from: number;to: number;whole?: boolean;}) {
  const fmt = (n: number) => whole ? String(n) : formatAmount(n);
  return (
    <div className="rounded-md bg-secondary px-2 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono">
        {from !== to ?
        <>
            <span className="text-muted-foreground line-through">{fmt(from)}</span> <span className="font-medium">{fmt(to)}</span>
          </> :

        fmt(to)
        }
      </dd>
    </div>);

}