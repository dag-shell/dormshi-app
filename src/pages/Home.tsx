import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { UserAvatar } from '@common/UserAvatar';
import { RequestCard } from '@/components/home/RequestCard';

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

const myOrdersData = [
  {
    id: 'r1',
    food: 'Taro milk tea, Boba',
    pickup: 'Tea Lab, Union Square',
    destination: 'Hartley Hall, 3rd floor lounge',
    status: 'open' as const,
    timeAgo: '11m ago',
    requesterName: 'You',
    requesterInitials: 'MO',
    isMine: true,
    offerCount: 2,
    price: 'ETB 120'
  },
  {
    id: 'r2',
    food: 'Chicken shawarma wrap, Garlic fries',
    pickup: 'Halal Cart, 5th & Main',
    destination: 'Science Library, Room 204',
    status: 'on_the_way' as const,
    timeAgo: '34m ago',
    price: 'ETB 140',
    requesterName: 'You',
    requesterInitials: 'MO',
    isMine: true,
    offerCount: 1
  },
  {
    id: 'r8',
    food: 'Burrito bowl, Chicken',
    pickup: 'Chipotle, Main St',
    destination: 'Hartley Hall 3B',
    status: 'completed' as const,
    timeAgo: 'Yesterday',
    price: 'ETB 150',
    requesterName: 'You',
    requesterInitials: 'MO',
    isMine: true
  }
];

const campusOrdersData = [
  {
    id: 'r4',
    food: 'Iced oat latte, Blueberry muffin',
    pickup: 'Bean Counter Café',
    destination: 'Engineering Building, Lab 1.12',
    status: 'open' as const,
    timeAgo: '4m ago',
    distanceKm: 0.3,
    requesterName: 'Aisha Bello',
    requesterInitials: 'AB',
    offerCount: 1,
    price: 'ETB 110'
  },
  {
    id: 'r5',
    food: 'Pad thai, Tofu',
    pickup: 'Thai Orchid, Campus Ave',
    destination: 'Ellis Hall, Room 410',
    status: 'open' as const,
    timeAgo: '7m ago',
    distanceKm: 0.6,
    requesterName: 'Tomás Ruiz',
    requesterInitials: 'TR',
    offerCount: 0,
    price: 'ETB 160'
  },
  {
    id: 'r6',
    food: 'Clif bar, Sparkling water',
    pickup: 'CVS on College St',
    destination: 'Rec Center front desk',
    status: 'open' as const,
    timeAgo: '13m ago',
    distanceKm: 0.8,
    requesterName: 'Lena Park',
    requesterInitials: 'LP',
    offerCount: 0,
    price: 'ETB 90'
  },
  {
    id: 'r7',
    food: 'Pepperoni pizza, Coke',
    pickup: "Gino's Pizza",
    destination: 'Music Hall, practice room 7',
    status: 'open' as const,
    timeAgo: '18m ago',
    requesterName: 'Dev Mehta',
    requesterInitials: 'DM',
    offerCount: 2,
    price: 'ETB 130'
  }
];

export function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [myOrdersFilter, setMyOrdersFilter] = useState<'all' | 'open' | 'on_the_way' | 'completed'>('all');

  const filteredMyOrders = myOrdersFilter === 'all'
    ? myOrdersData
    : myOrdersData.filter((o) => o.status === myOrdersFilter);

  // Auto-advance ad banner image every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % adImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pt-4 pb-36 sm:px-6 lg:px-8 lg:pt-8">
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
          ORDERS MAIN SECTION: Header with Switcher to toggle own orders on/off
         ========================================================================= */}
      <section aria-labelledby="orders-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 id="orders-heading" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Orders
          </h2>

          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 shadow-none">
            <Label
              htmlFor="my-orders-switch"
              className="cursor-pointer text-xs font-medium text-foreground select-none"
            >
              My orders
            </Label>
            <Switch
              id="my-orders-switch"
              checked={showMyOrders}
              onCheckedChange={setShowMyOrders}
              aria-label="Turn on and off my orders"
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {showMyOrders
            ? 'Orders you placed on campus.'
            : 'Campus delivery orders waiting for pickup.'}
        </p>

        {/* Status filters for My Orders (horizontally scrollable) */}
        {showMyOrders && (
          <div
            className="flex items-center gap-2 overflow-x-auto py-1 -mx-4 px-4 sm:mx-0 sm:px-0 flex-nowrap scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
          >
            {(['all', 'open', 'on_the_way', 'completed'] as const).map((tab) => {
              const label = tab === 'all'
                ? 'All'
                : tab === 'open'
                ? 'Open'
                : tab === 'on_the_way'
                ? 'On the way'
                : 'Completed';

              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={myOrdersFilter === tab}
                  onClick={() => setMyOrdersFilter(tab)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    myOrdersFilter === tab
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Orders list */}
        <div className="space-y-3">
          {showMyOrders ? (
            filteredMyOrders.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-sm font-semibold text-foreground">
                  No {myOrdersFilter === 'on_the_way' ? 'orders on the way' : `${myOrdersFilter} orders`}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Orders you place will appear here as they progress.
                </p>
              </div>
            ) : (
              filteredMyOrders.map((order) => (
                <RequestCard key={order.id} request={order} />
              ))
            )
          ) : (
            campusOrdersData.map((order) => (
              <RequestCard key={order.id} request={order} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}