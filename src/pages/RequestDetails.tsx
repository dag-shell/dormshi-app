import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { OfferCard } from '../components/OfferCard';
import { OfferSheet } from '../components/OfferSheet';
import { BottomSheet } from '../components/BottomSheet';
import { TermsBreakdown } from '../components/TermsBreakdown';
import { UserAvatar } from '../components/UserAvatar';
import { ReasonSheet } from '../components/order/ReasonSheet';
import { useDormshi } from '../contexts/DormshiContext';
import { CURRENT_USER_ID } from '../data/users';
import { firstName, formatDC, timeAgo } from '../utils/format';
import { isInvolved, totalOf } from '../utils/orders';
import type { Offer } from '../types/dormshi';

type SortKey = 'total' | 'eta';

export function RequestDetails() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { requests, getUser, wallet, acceptOffer, cancelOrder } = useDormshi();
  const request = requests.find((r) => r.id === id);
  const [sort, setSort] = useState<SortKey>('total');
  const [pending, setPending] = useState<Offer | null>(null);
  const [offerOpen, setOfferOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const offerCount = request?.offers.length ?? 0;
  const [seenCount, setSeenCount] = useState(offerCount);

  useEffect(() => {
    if (request?.requesterId === CURRENT_USER_ID && offerCount > seenCount) {
      const latest = request.offers[request.offers.length - 1];
      toast(`New offer from ${firstName(getUser(latest.fulfillerId).name)}`, { description: `${formatDC(totalOf(latest))} · ${latest.etaMinutes} min` });
    }
    setSeenCount(offerCount);
  }, [offerCount]);

  if (!request) {
    return (
      <div>
        <PageHeader title="Request" backTo="/" />
        <p className="px-5 py-10 text-center text-sm text-muted-foreground">This request no longer exists.</p>
      </div>);

  }
  if (request.status !== 'open' && isInvolved(request, CURRENT_USER_ID)) return <Navigate to={`/requests/${request.id}/track`} replace />;

  const isMine = request.requesterId === CURRENT_USER_ID;
  const requester = getUser(request.requesterId);
  const myOffer = request.offers.find((o) => o.fulfillerId === CURRENT_USER_ID);
  const sorted = [...request.offers].sort((a, b) => sort === 'total' ? totalOf(a) - totalOf(b) : a.etaMinutes - b.etaMinutes);
  const cheapestId = [...request.offers].sort((a, b) => totalOf(a) - totalOf(b))[0]?.id;
  const fastestId = [...request.offers].sort((a, b) => a.etaMinutes - b.etaMinutes)[0]?.id;

  const confirmAccept = () => {
    if (!pending) return;
    const result = acceptOffer(request.id, pending.id);
    if (!result.ok) {
      toast.error('Couldn’t accept offer', { description: result.error });
      return;
    }
    toast.success(`${firstName(getUser(pending.fulfillerId).name)} is on it`, { description: `${formatDC(totalOf(pending))} reserved from your wallet.` });
    setPending(null);
    navigate(`/requests/${request.id}/track`);
  };

  return (
    <div>
      <PageHeader title={isMine ? 'Your request' : 'Request'} subtitle={`Posted ${timeAgo(request.createdAt)}`} />

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-8 lg:px-10 lg:py-8">
        <section className="overflow-hidden rounded-xl border bg-card lg:sticky lg:top-24">
          {request.imageUrl && <img src={request.imageUrl} alt="Reference provided by requester" className="aspect-[16/9] w-full object-cover" />}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <StatusBadge status={request.status} />
              {!isMine &&
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <UserAvatar user={requester} size="sm" /> {requester.name}
                </span>
              }
            </div>
            <h2 className="mt-3 text-lg font-semibold leading-snug tracking-tight">{request.food}</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Place label="Pickup" value={request.pickup} />
              <Place label="Deliver to" value={request.destination} />
            </dl>
            {request.instructions &&
            <p className="mt-4 rounded-lg bg-secondary px-3 py-2 text-sm leading-6 text-muted-foreground">{request.instructions}</p>
            }
            <p className="mt-3 text-xs text-muted-foreground">Payment method: DC wallet</p>
          </div>
        </section>

        {isMine ?
        <section aria-labelledby="offers-title">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="offers-title" className="text-base font-semibold tracking-tight">
                Offers <span className="text-muted-foreground">({request.offers.length})</span>
              </h2>
              {request.offers.length > 1 &&
            <div className="flex rounded-lg border bg-card p-1 text-xs" role="group" aria-label="Sort offers">
                  {(['total', 'eta'] as const).map((k) =>
              <button key={k} type="button" onClick={() => setSort(k)} aria-pressed={sort === k} className={`rounded-md px-3 py-1 font-medium ${sort === k ? 'bg-secondary text-foreground' : 'text-muted-foreground'}`}>
                      {k === 'total' ? 'Lowest total' : 'Fastest'}
                    </button>
              )}
                </div>
            }
            </div>

            {request.offers.length === 0 ?
          <div className="flex flex-col items-center rounded-xl border border-dashed bg-card px-6 py-10 text-center" aria-live="polite">
                <span className="relative flex size-3">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex size-3 rounded-full bg-primary" />
                </span>
                <p className="mt-4 font-medium">Waiting for offers</p>
                <p className="mt-1 max-w-64 text-sm text-muted-foreground">We’ve notified students nearby. Offers usually arrive within a few minutes.</p>
              </div> :

          <motion.div layout className="space-y-3">
                <AnimatePresence initial={false}>
                  {sorted.map((o) =>
              <motion.div key={o.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <OfferCard
                  offer={o}
                  highlight={request.offers.length > 1 ? o.id === cheapestId ? 'Best price' : o.id === fastestId ? 'Fastest' : undefined : undefined}
                  onAccept={() => setPending(o)} />
                
                    </motion.div>
              )}
                </AnimatePresence>
              </motion.div>
          }

            <p className="mt-4 text-xs text-muted-foreground">You choose who delivers. Accepting locks the price, fee, and time.</p>
            <Button variant="ghost" className="mt-4 w-full text-destructive" onClick={() => setCancelOpen(true)}>
              Cancel request
            </Button>
          </section> :
        request.status === 'open' ?
        <section className="rounded-xl border bg-card p-4">
            {myOffer ?
          <>
                <p className="flex items-center gap-2 text-sm font-medium text-primary"><Check className="size-4" aria-hidden="true" /> Your offer is in</p>
                <div className="mt-3"><TermsBreakdown foodPrice={myOffer.foodPrice} deliveryFee={myOffer.deliveryFee} etaLabel={`${myOffer.etaMinutes} min`} showPaymentMethod={false} /></div>
                <p className="mt-3 text-xs text-muted-foreground">{firstName(requester.name)} is reviewing {request.offers.length} offer{request.offers.length > 1 ? 's' : ''}. You’ll be notified if yours is chosen.</p>
              </> :

          <>
                <p className="text-sm text-muted-foreground">{request.offers.length} other offer{request.offers.length === 1 ? '' : 's'} so far · {request.distanceKm} km from you</p>
                <Button size="lg" className="mt-3 h-11 w-full" onClick={() => setOfferOpen(true)}>Make an offer</Button>
              </>
          }
          </section> :

        <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">This request has been taken by another student.</p>
        }
      </div>

      <BottomSheet open={!!pending} onClose={() => setPending(null)} title="Accept this offer?" description={pending ? `${getUser(pending.fulfillerId).name} will get your food.` : undefined}>
        {pending &&
        <div className="space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <TermsBreakdown foodPrice={pending.foodPrice} deliveryFee={pending.deliveryFee} etaLabel={`${pending.etaMinutes} min`} />
            </div>
            <dl className="divide-y rounded-lg border bg-card text-sm">
              <PaymentStep label="Now" value={`${formatDC(totalOf(pending))} is reserved from your wallet.`} />
              <PaymentStep label="At delivery" value={`Released after you scan ${firstName(getUser(pending.fulfillerId).name)}’s QR code.`} />
              <PaymentStep label="If cancelled" value="Full refund any time before pickup." />
            </dl>
            {wallet.available < totalOf(pending) &&
          <p className="rounded-lg bg-destructive-soft px-3 py-2 text-sm text-destructive" role="alert">
                You have {formatDC(wallet.available)} available. <Link to="/wallet" className="font-medium underline">Buy DC</Link> to accept.
              </p>
          }
            <Button size="lg" className="h-11 w-full" onClick={confirmAccept} disabled={wallet.available < totalOf(pending)}>
              Accept & reserve {formatDC(totalOf(pending))}
            </Button>
          </div>
        }
      </BottomSheet>

      <OfferSheet request={offerOpen ? request : null} onClose={() => setOfferOpen(false)} />

      <ReasonSheet
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel request?"
        description="Fulfillers who offered will be notified."
        reasons={['I don’t need it anymore', 'Offers are too expensive', 'I posted the wrong details', 'Other']}
        note="No DC has been reserved yet, so nothing needs to be refunded."
        confirmLabel="Cancel request"
        destructive
        onConfirm={(reason) => {
          cancelOrder(request.id, reason);
          toast('Request cancelled');
          navigate('/');
        }} />
      
    </div>);

}

function Place({ label, value }: {label: string;value: string;}) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>);

}

function PaymentStep({ label, value }: {label: string;value: string;}) {
  return (
    <div className="flex gap-4 px-4 py-3">
      <dt className="w-24 shrink-0 font-medium">{label}</dt>
      <dd className="text-muted-foreground">{value}</dd>
    </div>);

}