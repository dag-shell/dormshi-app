import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AlertTriangle, ArrowRight, CheckCircle2, Loader2, QrCode, Star, XCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { UserAvatar } from '../components/UserAvatar';
import { QRCode } from '../components/QRCode';
import { StatusTimeline } from '../components/order/StatusTimeline';
import { AgreementCard } from '../components/order/AgreementCard';
import { ChangeProposalSheet } from '../components/order/ChangeProposalSheet';
import { ReasonSheet } from '../components/order/ReasonSheet';
import { useDormshi } from '../contexts/DormshiContext';
import { CURRENT_USER_ID } from '../data/users';
import { addMinutes, firstName, formatClock, formatDC } from '../utils/format';
import { canCancel, canConfirm, canDispute, isInProgress, nextStatus, statusLabels, totalOf } from '../utils/orders';
import type { OrderStatus } from '../types/dormshi';

export function Fulfillment() {
  const { id = '' } = useParams();
  const { requests, getUser, advanceStatus, completeAsFulfiller, cancelOrder, openDispute } = useDormshi();
  const request = requests.find((r) => r.id === id);
  const [proposeOpen, setProposeOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);

  const isFulfiller = request?.agreement?.fulfillerId === CURRENT_USER_ID;

  // Simulates the requester scanning our QR once delivered.
  useEffect(() => {
    if (!request || !isFulfiller || request.status !== 'delivered') return;
    const t = setTimeout(() => {
      completeAsFulfiller(request.id);
      toast.success(`${firstName(getUser(request.requesterId).name)} confirmed delivery`, {
        description: `${formatDC(totalOf(request.agreement!))} added to your wallet.`
      });
    }, 6000);
    return () => clearTimeout(t);
  }, [request?.status, isFulfiller]);

  if (!request) {
    return (
      <div>
        <PageHeader title="Request" backTo="/" />
        <p className="px-5 py-10 text-center text-sm text-muted-foreground">Request not found.</p>
      </div>);

  }
  if (request.status === 'open' || !request.agreement) return <Navigate to={`/requests/${request.id}`} replace />;

  const agreement = request.agreement;
  const isRequester = request.requesterId === CURRENT_USER_ID;
  const counterpart = getUser(isRequester ? agreement.fulfillerId : request.requesterId);
  const total = totalOf(agreement);
  const next = nextStatus(request.status);
  const eta = addMinutes(agreement.acceptedAt, agreement.etaMinutes);

  const handleAdvance = () => {
    if (!next) return;
    advanceStatus(request.id);
    toast(`Status updated: ${statusLabels[next]}`, { description: `${firstName(counterpart.name)} has been notified.` });
  };

  return (
    <div>
      <PageHeader title={`Request #${request.id.toUpperCase().slice(0, 6)}`} subtitle={request.food} backTo="/" />

      <div className="mx-auto grid max-w-6xl gap-4 px-5 py-5 lg:grid-cols-2 lg:items-start lg:gap-8 lg:px-10 lg:py-8">
        <div className="space-y-4">
        <section className="rounded-xl border bg-card p-5" aria-live="polite">
          <StatusBadge status={request.status} />
          <h2 className="mt-3 text-xl font-semibold tracking-tight">{headline(request.status, isRequester, firstName(counterpart.name))}</h2>
          {isInProgress(request.status) && request.status !== 'delivered' &&
            <p className="mt-1 text-sm text-muted-foreground">
              Estimated arrival <span className="font-medium text-foreground">{formatClock(eta)}</span>
            </p>
            }

          <div className="mt-4 flex items-center gap-3 border-t pt-4">
            <UserAvatar user={counterpart} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{counterpart.name}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                {isRequester ? 'Fulfiller' : 'Requester'} · <Star className="size-3 fill-current" aria-hidden="true" /> {counterpart.rating.toFixed(1)} · {counterpart.dorm}
              </p>
            </div>
          </div>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="w-10 shrink-0 text-muted-foreground">From</dt><dd className="truncate">{request.pickup}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-10 shrink-0 text-muted-foreground">To</dt><dd className="truncate">{request.destination}</dd>
            </div>
          </dl>
          {request.instructions && <p className="mt-3 rounded-lg bg-secondary px-3 py-2 text-xs leading-5 text-muted-foreground">{request.instructions}</p>}
        </section>

        {/* Primary action */}
        {isFulfiller && next &&
          <Button size="lg" className="h-12 w-full" onClick={handleAdvance}>
            Mark as {statusLabels[next].toLowerCase()} <ArrowRight aria-hidden="true" />
          </Button>
          }

        {isFulfiller && request.status === 'delivered' &&
          <section className="flex flex-col items-center rounded-xl border bg-card p-5 text-center">
            <p className="font-medium">Show this code to {firstName(counterpart.name)}</p>
            <p className="mt-1 text-sm text-muted-foreground">They scan it to confirm delivery and release {formatDC(total)} to you.</p>
            <div className="mt-4 rounded-lg border p-3"><QRCode value={`dormshi:user:${CURRENT_USER_ID}`} size={176} label="Your personal Dormshi QR code" /></div>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" aria-hidden="true" /> Waiting for {firstName(counterpart.name)} to scan…</p>
          </section>
          }

        {isRequester && canConfirm(request.status) &&
          <Link
            to={`/requests/${request.id}/confirm`}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            
            <QrCode className="size-4" aria-hidden="true" /> Got it? Scan QR to confirm
          </Link>
          }
        {isRequester && ['accepted', 'getting_food', 'picked_up'].includes(request.status) &&
          <p className="rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
            When your food arrives, scan {firstName(counterpart.name)}’s QR code to confirm and release payment.
          </p>
          }

        {request.status === 'completed' &&
          <section className="flex items-center gap-3 rounded-xl border bg-card p-4">
            <CheckCircle2 className="size-6 shrink-0 text-primary" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-medium">{isRequester ? `Paid ${formatDC(total)}` : `Earned ${formatDC(total)}`}</p>
              <p className="text-xs text-muted-foreground">Settled {formatClock(request.statusHistory[request.statusHistory.length - 1].at)}</p>
            </div>
            {isRequester && <Link to={`/requests/${request.id}/confirm`} className="text-sm font-medium text-primary hover:underline">Receipt</Link>}
          </section>
          }

        {request.status === 'cancelled' &&
          <Banner icon={<XCircle className="size-5" />} title="Request cancelled" body={`${request.cancelReason ?? 'Cancelled.'} ${isRequester ? `${formatDC(total)} was refunded to your wallet.` : `${firstName(counterpart.name)} was refunded in full.`}`} />
          }

        {request.status === 'disputed' &&
          <Banner tone="destructive" icon={<AlertTriangle className="size-5" />} title="Dispute open" body={`${request.disputeReason ?? ''}. Dormshi support will reply within 24 hours. ${formatDC(total)} stays held until support refunds or releases it.`} />
          }

        </div>

        <div className="space-y-4">
        <section className="rounded-xl border bg-card p-4" aria-labelledby="progress-title">
          <h2 id="progress-title" className="mb-4 text-sm font-semibold">Progress</h2>
          <StatusTimeline request={request} />
        </section>

        <AgreementCard request={request} canPropose={['accepted', 'getting_food', 'picked_up'].includes(request.status)} onPropose={() => setProposeOpen(true)} />

        {(canCancel(request.status) || canDispute(request.status)) &&
          <div className="flex gap-2 pb-4">
            {canCancel(request.status) &&
            <Button variant="outline" className="flex-1" onClick={() => setCancelOpen(true)}>Cancel request</Button>
            }
            {canDispute(request.status) &&
            <Button variant="outline" className="flex-1" onClick={() => setDisputeOpen(true)}>Report a problem</Button>
            }
          </div>
          }
        </div>
      </div>

      <ChangeProposalSheet request={request} counterpartName={counterpart.name} open={proposeOpen} onClose={() => setProposeOpen(false)} />

      <ReasonSheet
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel this request?"
        description={`${firstName(counterpart.name)} will be notified right away.`}
        reasons={isRequester ? ['Taking too long', 'I no longer need it', 'Posted by mistake', 'Other'] : ['Restaurant is closed', 'Item is unavailable', 'I can’t make it anymore', 'Other']}
        note={isRequester ? `${formatDC(total)} reserved for this request will be refunded to your wallet immediately.` : `${firstName(counterpart.name)} gets a full refund of ${formatDC(total)}. Frequent cancellations affect your rating.`}
        confirmLabel="Cancel request"
        destructive
        onConfirm={(reason) => {
          const result = cancelOrder(request.id, reason);
          setCancelOpen(false);
          if (!result.ok) toast.error(result.error);else
          toast(isRequester ? `Request cancelled · ${formatDC(total)} refunded` : 'Request cancelled');
        }} />
      

      <ReasonSheet
        open={disputeOpen}
        onClose={() => setDisputeOpen(false)}
        title="Report a problem"
        description="We’ll pause payment while support reviews."
        reasons={isRequester ? ['Wrong or missing items', 'Food never arrived', 'Fulfiller asked for more DC', 'Other'] : ['Requester isn’t responding', 'Requester won’t scan my QR', 'Wrong delivery location', 'Other']}
        note={`${formatDC(total)} stays held in escrow. Support may refund the requester or release payment to the fulfiller.`}
        confirmLabel="Open dispute"
        destructive
        onConfirm={(reason) => {
          openDispute(request.id, reason);
          setDisputeOpen(false);
          toast('Dispute opened', { description: 'Support will reach out within 24 hours.' });
        }} />
      
    </div>);

}

function headline(status: OrderStatus, isRequester: boolean, name: string): string {
  const requester: Partial<Record<OrderStatus, string>> = {
    accepted: `${name} is taking your request`,
    getting_food: `${name} is getting your food`,
    picked_up: `${name} has your food`,
    on_the_way: 'Your food is on the way',
    delivered: `${name} marked it delivered`,
    completed: 'Delivered and paid',
    cancelled: 'This request was cancelled',
    disputed: 'Payment is on hold'
  };
  const fulfiller: Partial<Record<OrderStatus, string>> = {
    accepted: `Head to pickup for ${name}`,
    getting_food: 'Grab the food',
    picked_up: `Bring it to ${name}`,
    on_the_way: `Heading to ${name}`,
    delivered: 'Almost done',
    completed: 'Delivery complete',
    cancelled: 'This request was cancelled',
    disputed: 'Payment is on hold'
  };
  return (isRequester ? requester : fulfiller)[status] ?? statusLabels[status];
}

function Banner({ icon, title, body, tone = 'muted' }: {icon: React.ReactNode;title: string;body: string;tone?: 'muted' | 'destructive';}) {
  return (
    <section role="status" className={`flex gap-3 rounded-xl p-4 ${tone === 'destructive' ? 'bg-destructive-soft text-destructive' : 'border bg-card'}`}>
      <span className="shrink-0" aria-hidden="true">{icon}</span>
      <div>
        <p className="font-medium">{title}</p>
        <p className={`mt-1 text-sm ${tone === 'destructive' ? '' : 'text-muted-foreground'}`}>{body}</p>
      </div>
    </section>);

}