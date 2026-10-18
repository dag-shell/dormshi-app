import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faListOl,
  faPlus,
  faTruck,
  faWallet
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserAvatar } from '@common/UserAvatar';
import { RequestCard } from '@/components/home/RequestCard';
import { OfferSheet } from '@/components/home/OfferSheet';

const adImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80',
    alt: 'Campus food delivery promo banner'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80',
    alt: 'Dining deals and student deliveries'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1400&q=80',
    alt: 'Coffee and afternoon campus snacks'
  }
];

export function Home() {
  const [offerOpen, setOfferOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState<{ id?: string; food?: string } | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<'my-requests' | 'delivery'>('my-requests');

  // Auto-advance ad banner image every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % adImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleMakeOffer = (req: { id: string; food: string }) => {
    setActiveRequest(req);
    setOfferOpen(true);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pt-4 pb-28 sm:px-6 lg:px-8 lg:pt-8">
      {/* =========================================================================
          TOP BAR: Clean Telegram Mini App Header (64px per layout spec)
         ========================================================================= */}
      <header className="min-h-16 flex flex-col flex-1">
        <div className="flex items-center justify-between w-full">
          {/* Left Side: Greeting */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Hi, Maya
            </h1>
          </div>

          {/* Right Side: Wallet Balance pill and User Avatar */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Wallet Balance Pill */}
            <Link
              to="/wallet"
              className="flex h-10 items-center gap-2 rounded-full border border-border bg-card px-3 shadow-none transition-all hover:bg-secondary active:scale-95"
              title="Wallet Balance"
            >
              <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FontAwesomeIcon icon={faWallet} className="size-3.5" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-semibold text-sm text-foreground">152.50</span>
                <span className="text-[11px] font-semibold text-muted-foreground">ETB</span>
              </div>
            </Link>

            {/* User Avatar */}
            <Link
              to="/profile"
              className="flex shrink-0 rounded-full transition-transform active:scale-95"
              title="Profile"
            >
              <UserAvatar initials="MO" isMe size="md" />
            </Link>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground sm:text-sm italic text-left">
          Good food keeps the campus moving.
        </p>

      </header>

      {/* =========================================================================
          ADS IMAGE SLIDER: Pure sliding image banner with no other components in it
         ========================================================================= */}
      <section
        aria-label="Promotional banner slider"
        className="relative h-44 w-full overflow-hidden rounded-lg bg-secondary/50 sm:h-56 md:h-64"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={adImages[currentSlide].id}
            src={adImages[currentSlide].url}
            alt={adImages[currentSlide].alt}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 0.88, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.4, 0.4, 0, 1] }}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>

        {/* Dark bottom gradient overlay to give high contrast for the bullets */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 via-black/35 to-transparent z-10" />

        {/* Slide Indicator Dots with clear contrast */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-md ring-1 ring-white/15">
          {adImages.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-200 ${idx === currentSlide
                  ? 'w-6 bg-white'
                  : 'w-2 bg-white/45 hover:bg-white/80'
                }`}
            />
          ))}
        </div>
      </section>

      {/* =========================================================================
          TABS: Single Toggle between Delivery Requests & My Requests
         ========================================================================= */}
      <section aria-labelledby="requests-title" className="space-y-4">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as 'my-requests' | 'delivery')}
          className="w-full"
        >
          {/* Floating Pill Dock: Collapses inactive tab to icon only with smooth animation */}
          <TabsList className="fixed bottom-6 left-1/2 z-30 inline-flex h-11 -translate-x-1/2 items-center gap-1 rounded-full border border-border/80 bg-card/95 p-1 shadow-[0_8px_30px_rgba(0,0,0,0.14)] backdrop-blur-md dark:border-border dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            <TabsTrigger
              value="my-requests"
              aria-label="My requests"
              className="relative flex h-9 items-center justify-center rounded-full px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:bg-secondary data-[state=active]:font-semibold data-[state=active]:text-foreground sm:text-sm"
            >
              <FontAwesomeIcon icon={faListOl} className="size-3.5 shrink-0" />
              <AnimatePresence initial={false}>
                {activeTab === 'my-requests' && (
                  <motion.span
                    initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                    animate={{ width: 'auto', opacity: 1, marginLeft: 8 }}
                    exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0.4, 0, 1] }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    My requests
                  </motion.span>
                )}
              </AnimatePresence>
            </TabsTrigger>
            <TabsTrigger
              value="delivery"
              aria-label="Delivery requests"
              className="relative flex h-9 items-center justify-center rounded-full px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:bg-secondary data-[state=active]:font-semibold data-[state=active]:text-foreground sm:text-sm"
            >
              <FontAwesomeIcon icon={faTruck} className="size-3.5 shrink-0" />
              <AnimatePresence initial={false}>
                {activeTab === 'delivery' && (
                  <motion.span
                    initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                    animate={{ width: 'auto', opacity: 1, marginLeft: 8 }}
                    exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0.4, 0, 1] }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    Delivery requests
                  </motion.span>
                )}
              </AnimatePresence>
            </TabsTrigger>
          </TabsList>

          {/* 1. MY REQUESTS: Requests sent by the user */}
          <TabsContent value="my-requests" className="mt-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">My Requests</h3>
                <p className="text-xs text-muted-foreground">Orders you placed.</p>
              </div>
              <Link
                to="/requests/new"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-none transition-all hover:bg-primary/90 active:scale-95 sm:text-sm"
              >
                <FontAwesomeIcon icon={faPlus} className="size-3.5" />
                <span>New request</span>
              </Link>
            </div>

            <div className="space-y-3">
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
                  offerCount: 2,
                  price: 'ETB 120'
                }}
              />
              <RequestCard
                request={{
                  id: 'r2',
                  food: 'Chicken shawarma wrap + garlic fries',
                  pickup: 'Halal Cart, 5th & Main',
                  destination: 'Science Library, Room 204',
                  status: 'on_the_way',
                  timeAgo: '34m ago',
                  price: 'ETB 140',
                  requesterName: 'You',
                  requesterInitials: 'MO',
                  isMine: true,
                  offerCount: 1
                }}
              />
              <RequestCard
                request={{
                  id: 'r8',
                  food: 'Burrito bowl with chicken, mild salsa',
                  pickup: 'Chipotle, Main St',
                  destination: 'Hartley Hall 3B',
                  status: 'completed',
                  timeAgo: 'Yesterday',
                  price: 'ETB 150',
                  requesterName: 'You',
                  requesterInitials: 'MO',
                  isMine: true
                }}
              />
            </div>
          </TabsContent>

          {/* 2. DELIVERY REQUESTS: Other students' requests where you can make offers */}
          <TabsContent value="delivery" className="mt-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">Delivery Requests</h3>
                <p className="text-xs text-muted-foreground">
                  Requests waiting for delivery. Send an offer to earn.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <RequestCard
                request={{
                  id: 'r4',
                  food: 'Iced oat latte, blueberry muffin',
                  pickup: 'Bean Counter Café',
                  destination: 'Engineering Building, Lab 1.12',
                  status: 'open',
                  timeAgo: '4m ago',
                  distanceKm: 0.3,
                  requesterName: 'Aisha Bello',
                  requesterInitials: 'AB',
                  offerCount: 1,
                  price: 'ETB 110'
                }}
                action={
                  <Button
                    size="sm"
                    onClick={() => handleMakeOffer({ id: 'r4', food: 'Iced oat latte, blueberry muffin' })}
                    className="rounded-full px-4 font-semibold"
                  >
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
                  offerCount: 0,
                  price: 'ETB 160'
                }}
                action={
                  <Button
                    size="sm"
                    onClick={() => handleMakeOffer({ id: 'r5', food: 'Pad thai, medium spicy, with tofu' })}
                    className="rounded-full px-4 font-semibold"
                  >
                    Make offer
                  </Button>
                }
              />
              <RequestCard
                request={{
                  id: 'r6',
                  food: '2 Clif bars, sparkling water',
                  pickup: 'CVS on College St',
                  destination: 'Rec Center front desk',
                  status: 'open',
                  timeAgo: '13m ago',
                  distanceKm: 0.8,
                  requesterName: 'Lena Park',
                  requesterInitials: 'LP',
                  offerCount: 0,
                  price: 'ETB 90'
                }}
                action={
                  <Button
                    size="sm"
                    onClick={() => handleMakeOffer({ id: 'r6', food: '2 Clif bars, sparkling water' })}
                    className="rounded-full px-4 font-semibold"
                  >
                    Make offer
                  </Button>
                }
              />
              <RequestCard
                request={{
                  id: 'r7',
                  food: '2 pepperoni slices, Coke',
                  pickup: "Gino's Pizza",
                  destination: 'Music Hall, practice room 7',
                  status: 'open',
                  timeAgo: '18m ago',
                  requesterName: 'Dev Mehta',
                  requesterInitials: 'DM',
                  offerCount: 2,
                  price: 'ETB 130'
                }}
                action={
                  <Button
                    size="sm"
                    onClick={() => handleMakeOffer({ id: 'r7', food: '2 pepperoni slices, Coke' })}
                    className="rounded-full px-4 font-semibold"
                  >
                    Make offer
                  </Button>
                }
              />
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Offer Sheet Modal */}
      <OfferSheet
        request={offerOpen ? activeRequest : null}
        onClose={() => {
          setOfferOpen(false);
          setActiveRequest(null);
        }}
      />
    </div>
  );
}