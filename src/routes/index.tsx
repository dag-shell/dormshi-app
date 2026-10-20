import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { OrderCard, CampusPickerSheet } from './orders/_components';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/tabs';
import { defaultCampuses, type Campus } from '@/types/campus';
import { adImages, myOrdersData, campusOrdersData } from '@/data';

export const Route = createFileRoute('/')({
  component: OrderPage,
});

export function OrderPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<'deliver' | 'my_orders'>('deliver');
  const [myOrdersFilter, setMyOrdersFilter] = useState<'all' | 'open' | 'on_the_way' | 'completed'>('all');
  const [selectedCampus, setSelectedCampus] = useState<Campus>(() => {
    try {
      const saved = localStorage.getItem('dormshi_selected_campus');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultCampuses[0];
  });
  const [isCampusPickerOpen, setIsCampusPickerOpen] = useState(false);

  const filteredMyOrders = myOrdersFilter === 'all'
    ? myOrdersData
    : myOrdersData.filter((o) => o.status === myOrdersFilter);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % adImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pt-4 pb-36 sm:px-6 lg:px-8 lg:pt-8">
      {/* Header */}
      <header className="min-h-16 flex flex-col flex-1">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Hi, Maya
            </h1>
          </div>

          <div className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={() => setIsCampusPickerOpen(true)}
              className="flex h-10 items-center gap-2 rounded-full border border-border bg-card px-3 shadow-none transition-all hover:bg-secondary active:scale-95"
              title="Select campus location"
            >
              <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FontAwesomeIcon icon={faLocationDot} className="size-3.5" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-semibold text-sm text-foreground">
                  {selectedCampus.name}, {selectedCampus.univCode}
                </span>
              </div>
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground sm:text-sm italic text-left">
          Good food keeps the campus moving.
        </p>
      </header>

      {/* Ads Banner Slider */}
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

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 via-black/35 to-transparent z-10" />

        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-md ring-1 ring-white/15">
          {adImages.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-200 ${
                idx === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/45 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Orders Main Section */}
      <section aria-labelledby="orders-heading">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as 'deliver' | 'my_orders')}
          className="w-full space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2 h-11 rounded-full p-1 bg-card border border-border shadow-none">
            <TabsTrigger
              value="deliver"
              className="rounded-full py-2 text-xs sm:text-sm font-medium transition-all text-muted-foreground hover:text-foreground data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:shadow-none"
            >
              Deliver orders
            </TabsTrigger>
            <TabsTrigger
              value="my_orders"
              className="rounded-full py-2 text-xs sm:text-sm font-medium transition-all text-muted-foreground hover:text-foreground data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:shadow-none"
            >
              My orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deliver" className="space-y-4 focus-visible:outline-none">
            <p className="text-xs text-muted-foreground">
              Campus delivery orders waiting for pickup at {selectedCampus.title || selectedCampus.name}.
            </p>

            <div className="space-y-3">
              {campusOrdersData.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my_orders" className="space-y-4 focus-visible:outline-none">
            <p className="text-xs text-muted-foreground">
              Orders you placed on campus.
            </p>

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

            <div className="space-y-3">
              {filteredMyOrders.length === 0 ? (
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
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <CampusPickerSheet
        open={isCampusPickerOpen}
        onClose={() => setIsCampusPickerOpen(false)}
        selectedCampus={selectedCampus}
        onSelectCampus={(campus) => {
          setSelectedCampus(campus);
          try {
            localStorage.setItem('dormshi_selected_campus', JSON.stringify(campus));
          } catch {
            // ignore
          }
        }}
      />
    </div>
  );
}
