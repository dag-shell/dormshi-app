import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/layout/PageHeader';
import { MultiSelect } from '@common/MultiSelect';
import { SingleSelect } from '@common/SingleSelect';

const foodOptions = [
  'Milk Tea with Boba',
  'Chicken Shawarma Wrap',
  'Garlic Fries',
  'Spicy Miso Ramen',
  'Veggie Poke Bowl',
  'Iced Oat Latte',
  'Blueberry Muffin',
  'Pepperoni Pizza Slice',
  'Burrito Bowl with Chicken',
  'Everything Bagel with Cream Cheese',
  'Mango Smoothie'
];

const restaurantOptions = [
  'Tea Lab, Union Square',
  'Halal Cart, 5th & Main',
  'Kumo Ramen, Campus Ave',
  'Poke Republic, Student Center',
  'Bean Counter Café',
  "Gino's Pizza",
  'Chipotle, Main St',
  'Brick Oven Bagels',
  'Juice Junction'
];

const howItWorks = [
  { title: 'Request', body: 'Post what you want, where from, and where to.' },
  { title: 'Offer', body: 'Nearby students reply with price, fee, and ETA.' },
  { title: 'Agree', body: 'You pick an offer. Terms lock and DC is reserved.' },
  { title: 'Fulfill', body: 'They get your food and update the status.' },
  { title: 'Receive', body: 'Scan their QR code when it arrives.' },
  { title: 'Settle', body: 'DC is released only after verified delivery.' }
];

export function CreateRequest() {
  const navigate = useNavigate();
  const [food, setFood] = useState<string[]>(['Milk Tea with Boba']);
  const [quantities, setQuantities] = useState<Record<string, number>>({ 'Milk Tea with Boba': 2 });
  const [pickup, setPickup] = useState('Tea Lab, Union Square');
  const [destination, setDestination] = useState('Hartley Hall 3B');
  const [instructions, setInstructions] = useState('Less ice on both please. Text me when downstairs.');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderTitle = food.join(', ');
    const items = food.map((name) => ({
      name,
      quantity: quantities[name] || 1,
    }));
    navigate('/requests/r1', {
      state: {
        food: orderTitle,
        items,
        pickup,
        destination,
        instructions,
        status: 'open',
      },
    });
  };

  return (
    <div>
      <PageHeader title="New request" backTo="/" />
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-10 lg:px-10 lg:py-8">
        <form onSubmit={onSubmit} className="space-y-6 lg:rounded-xl lg:border lg:bg-card lg:p-8">
          <div className="space-y-2">
            <Label htmlFor="food">What do you want?</Label>
            <MultiSelect
              id="food"
              options={foodOptions}
              value={food}
              onChange={setFood}
              quantities={quantities}
              onQuantityChange={(item, qty) => setQuantities((q) => ({ ...q, [item]: Math.max(1, qty) }))}
              placeholder="Search and select food items"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup">Restaurant or pickup location</Label>
            <SingleSelect
              id="pickup"
              options={restaurantOptions}
              value={pickup}
              onChange={setPickup}
              placeholder="Search and select a restaurant"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Deliver to</Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Building, room, or meeting spot"
              className="h-10"
            />
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDestination('Hartley Hall 3B')}
                className={`h-8 rounded-md border px-3 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  destination === 'Hartley Hall 3B'
                    ? 'border-primary bg-primary-soft text-primary'
                    : 'bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                My dorm: Hartley Hall 3B
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">
              Additional instructions <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="instructions"
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Allergies, substitutions, how to reach you…"
            />
          </div>

          <Button type="submit" size="lg" className="h-12 w-full text-sm">
            Post request
          </Button>
        </form>

        <aside aria-labelledby="how-title" className="hidden rounded-xl border bg-card p-6 lg:sticky lg:top-24 lg:block">
          <h2 id="how-title" className="text-base font-semibold tracking-tight">How it works</h2>
          <ol className="mt-4 space-y-4">
            {howItWorks.map((s, i) => (
              <li key={s.title} className="flex gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary-soft font-mono text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="text-xs leading-5 text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}