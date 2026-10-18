import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RequestCard } from '../components/RequestCard';
import { OfferSheet } from '../components/OfferSheet';

export function Home() {
  const [offerOpen, setOfferOpen] = useState(false);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-5 pt-6 lg:px-10 lg:pt-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight lg:text-3xl">Hi, Maya</h1>
        </div>
        <span
          className="grid size-8 place-items-center rounded-lg bg-foreground text-sm font-semibold text-background lg:hidden"
          aria-label="Dormshi"
        >
          d
        </span>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/requests/new"
          className="flex items-center gap-4 rounded-xl bg-primary p-5 text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:order-2 lg:col-span-2 lg:p-6"
        >
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
            <TabsTrigger value="posted">Posted (2)</TabsTrigger>
            <TabsTrigger value="delivering">Delivering (2)</TabsTrigger>
            <TabsTrigger value="nearby">Nearby (3)</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="posted" className="mt-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <RequestCard
                request={{
                  id: 'r1',
                  food: '2 large taro milk teas, 50% sugar, with boba',
                  pickup: 'Tea Lab, Union Square',
                  destination: 'Hartley Hall, 3rd floor lounge',
                  status: 'open',
                  timeAgo: '11m ago',
                  requesterName: 'You',
                  requesterInitials: 'MO',
                  isMine: true,
                  offerCount: 3
                }}
                showRole
              />
              <RequestCard
                request={{
                  id: 'r2',
                  food: 'Chicken shawarma wrap + garlic fries',
                  pickup: 'Halal Cart, 5th & Main',
                  destination: 'Science Library, Room 204',
                  status: 'on_the_way',
                  timeAgo: '34m ago',
                  price: '14.50 DC',
                  requesterName: 'You',
                  requesterInitials: 'MO',
                  isMine: true
                }}
                showRole
              />
            </div>
          </TabsContent>

          <TabsContent value="delivering" className="mt-4 space-y-6">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <RequestCard
                request={{
                  id: 'r3',
                  food: 'Veggie poke bowl, no avocado',
                  pickup: 'Poke Republic, Student Center',
                  destination: 'Larkin House lobby',
                  status: 'getting_food',
                  timeAgo: '20m ago',
                  price: '17.00 DC',
                  requesterName: 'Priya Nair',
                  requesterInitials: 'PN',
                  isFulfilling: true
                }}
                showRole
              />
              <RequestCard
                request={{
                  id: 'r7',
                  food: '2 pepperoni slices + a Coke',
                  pickup: "Gino's Pizza",
                  destination: 'Music Hall, practice room 7',
                  status: 'open',
                  timeAgo: '18m ago',
                  requesterName: 'Dev Mehta',
                  requesterInitials: 'DM',
                  offerCount: 2
                }}
                showRole
              />
            </div>
          </TabsContent>

          <TabsContent value="nearby" className="mt-4">
            <p className="mb-3 text-xs text-muted-foreground">Open requests within 1.5 km, closest first.</p>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <RequestCard
                request={{
                  id: 'r4',
                  food: 'Iced oat latte + blueberry muffin',
                  pickup: 'Bean Counter Café',
                  destination: 'Engineering Building, Lab 1.12',
                  status: 'open',
                  timeAgo: '4m ago',
                  distanceKm: 0.3,
                  requesterName: 'Aisha Bello',
                  requesterInitials: 'AB',
                  offerCount: 1
                }}
                action={
                  <Button size="sm" variant="outline" onClick={() => setOfferOpen(true)}>
                    Make offer
                  </Button>
                }
              />
              <RequestCard
                request={{
                  id: 'r5',
                  food: 'Pad thai, medium spicy, with tofu',
                  pickup: 'Thai Orchid, Campus Ave',
                  destination: 'Ellis Hall, Room 410',
                  status: 'open',
                  timeAgo: '7m ago',
                  distanceKm: 0.6,
                  requesterName: 'Tomás Ruiz',
                  requesterInitials: 'TR',
                  offerCount: 0
                }}
                action={
                  <Button size="sm" variant="outline" onClick={() => setOfferOpen(true)}>
                    Make offer
                  </Button>
                }
              />
              <RequestCard
                request={{
                  id: 'r6',
                  food: '2 Clif bars (chocolate chip) + sparkling water',
                  pickup: 'CVS on College St',
                  destination: 'Rec Center front desk',
                  status: 'open',
                  timeAgo: '13m ago',
                  distanceKm: 0.8,
                  requesterName: 'Lena Park',
                  requesterInitials: 'LP',
                  offerCount: 0
                }}
                action={
                  <Button size="sm" variant="outline" onClick={() => setOfferOpen(true)}>
                    Make offer
                  </Button>
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <RequestCard
                request={{
                  id: 'r8',
                  food: 'Burrito bowl with chicken, mild salsa',
                  pickup: 'Chipotle, Main St',
                  destination: 'Hartley Hall 3B',
                  status: 'completed',
                  timeAgo: 'Yesterday',
                  price: '16.75 DC',
                  requesterName: 'Jordan Reyes',
                  requesterInitials: 'JR',
                  isMine: true
                }}
                showRole
              />
              <RequestCard
                request={{
                  id: 'r9',
                  food: 'Everything bagel with scallion cream cheese ×2',
                  pickup: 'Brick Oven Bagels',
                  destination: 'Okoro Commons, 2nd floor',
                  status: 'completed',
                  timeAgo: '2 days ago',
                  price: '12.00 DC',
                  requesterName: 'Dev Mehta',
                  requesterInitials: 'DM',
                  isFulfilling: true
                }}
                showRole
              />
              <RequestCard
                request={{
                  id: 'r10',
                  food: 'Mango smoothie, large',
                  pickup: 'Juice Junction',
                  destination: 'Hartley Hall 3B',
                  status: 'cancelled',
                  timeAgo: '4 days ago',
                  price: '9.25 DC',
                  requesterName: 'Tomás Ruiz',
                  requesterInitials: 'TR',
                  isMine: true
                }}
                showRole
              />
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <OfferSheet request={offerOpen ? { id: 'r4', food: 'Iced oat latte + blueberry muffin' } : null} onClose={() => setOfferOpen(false)} />
    </div>
  );
}