import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { Button } from '../components/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/Tabs';
import { RequestCard } from '../components/RequestCard';
import { OfferSheet } from '../components/OfferSheet';
import { EmptyState } from '../components/EmptyState';
import { useDormshi } from '../contexts/DormshiContext';
import { CURRENT_USER_ID } from '../data/users';
import { firstName, formatAmount } from '../utils/format';
import { isActiveStatus, isInvolved } from '../utils/orders';
import type { FoodRequest } from '../types/dormshi';

export function Home() {
  const { currentUser, requests, wallet, deliveryRadiusKm } = useDormshi();
  const [offerFor, setOfferFor] = useState<FoodRequest | null>(null);

  const posted = requests.filter((r) => r.requesterId === CURRENT_USER_ID && isActiveStatus(r.status));
  const delivering = requests.filter((r) => r.agreement?.fulfillerId === CURRENT_USER_ID && isActiveStatus(r.status));
  const pendingOffers = requests.filter(
    (r) => r.status === 'open' && r.requesterId !== CURRENT_USER_ID && r.offers.some((o) => o.fulfillerId === CURRENT_USER_ID)
  );
  const nearby = requests.
  filter((r) => r.status === 'open' && r.requesterId !== CURRENT_USER_ID && r.distanceKm <= deliveryRadiusKm).
  sort((a, b) => a.distanceKm - b.distanceKm);
  const history = requests.filter((r) => isInvolved(r, CURRENT_USER_ID) && !isActiveStatus(r.status));

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-5 pt-6 lg:px-10 lg:pt-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight lg:text-3xl">Hi, {firstName(currentUser.name)}</h1>
        </div>
        <span className="grid size-8 place-items-center rounded-lg bg-foreground text-sm font-semibold text-background lg:hidden" aria-label="Dormshi">
          d
        </span>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/requests/new"
          className="flex items-center gap-4 rounded-xl bg-primary p-5 text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:order-2 lg:col-span-2 lg:p-6">
          
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-foreground text-primary">
            <Plus className="size-5" aria-hidden="true" />
          </span>
          <span className="flex-1">
            <span className="block text-base font-semibold lg:text-lg">What are you craving?</span>
            <span className="block text-sm opacity-90">Post a request. Nearby students send offers and you pick one.</span>
          </span>
        </Link>
      </div>

      <section aria-labelledby="requests-title" className="pb-4">
        <h2 id="requests-title" className="mb-3 text-base font-semibold tracking-tight">Requests</h2>
        <Tabs defaultValue="posted">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="posted">Posted ({posted.length})</TabsTrigger>
            <TabsTrigger value="delivering">Delivering ({delivering.length + pendingOffers.length})</TabsTrigger>
            <TabsTrigger value="nearby">Nearby ({nearby.length})</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="posted" className="mt-4">
            <List items={posted} empty={<EmptyState title="No active requests" description="Post what you’re craving and pick the best offer." />} />
          </TabsContent>

          <TabsContent value="delivering" className="mt-4 space-y-6">
            <List items={delivering} empty={<EmptyState title="No deliveries in progress" description="Make an offer on a nearby request to start earning DC." />} />
            {pendingOffers.length > 0 &&
            <section aria-labelledby="pending-title">
                <h3 id="pending-title" className="mb-3 text-sm font-semibold text-muted-foreground">Waiting on requester ({pendingOffers.length})</h3>
                <List items={pendingOffers} />
              </section>
            }
          </TabsContent>

          <TabsContent value="nearby" className="mt-4">
            <p className="mb-3 text-xs text-muted-foreground">Open requests within {deliveryRadiusKm} km, closest first.</p>
            {nearby.length === 0 ?
            <EmptyState title="All quiet nearby" description={`No open requests within ${deliveryRadiusKm} km. Check back soon.`} /> :

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {nearby.map((r) => {
                const offered = r.offers.some((o) => o.fulfillerId === CURRENT_USER_ID);
                return (
                  <RequestCard
                    key={r.id}
                    request={r}
                    action={
                    offered ?
                    <span className="flex items-center gap-1 text-xs font-medium text-primary">
                            <Check className="size-4" aria-hidden="true" /> Offer sent
                          </span> :

                    <Button size="sm" variant="outline" onClick={() => setOfferFor(r)}>
                            Make offer
                          </Button>

                    } />);


              })}
              </div>
            }
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <List items={history} empty={<EmptyState title="No history yet" description="Completed and cancelled requests appear here." />} />
          </TabsContent>
        </Tabs>
      </section>

      <OfferSheet request={offerFor} onClose={() => setOfferFor(null)} />
    </div>);

}

function List({ items, empty }: {items: FoodRequest[];empty?: React.ReactNode;}) {
  if (items.length === 0) return <>{empty ?? null}</>;
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {items.map((r) =>
      <RequestCard key={r.id} request={r} showRole />
      )}
    </div>);

}