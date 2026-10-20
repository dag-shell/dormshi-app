import React from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { MultiSelect } from '@/ui/custom/MultiSelect';
import { SingleSelect } from '@/ui/custom/SingleSelect';

export interface CreateOrderFormProps {
  food: string[];
  setFood: (food: string[]) => void;
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  pickup: string;
  setPickup: (pickup: string) => void;
  destination: string;
  setDestination: (dest: string) => void;
  instructions: string;
  setInstructions: (inst: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export type CreateRequestFormProps = CreateOrderFormProps;

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

export function CreateOrderForm({
  food,
  setFood,
  quantities,
  setQuantities,
  pickup,
  setPickup,
  destination,
  setDestination,
  instructions,
  setInstructions,
  onSubmit
}: CreateOrderFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 lg:rounded-xl lg:border lg:bg-card lg:p-8">
      <div className="space-y-2">
        <Label htmlFor="food">What do you want?</Label>
        <MultiSelect
          id="food"
          options={foodOptions}
          value={food}
          onChange={setFood}
          quantities={quantities}
          onQuantityChange={(item, qty) =>
            setQuantities((q) => ({ ...q, [item]: Math.max(1, qty) }))
          }
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
        Post order
      </Button>
    </form>
  );
}

export const CreateRequestForm = CreateOrderForm;
