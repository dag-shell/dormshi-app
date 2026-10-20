import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Header } from '@/ui/layout/Header';
import { CreateOrderForm, HowItWorksCard } from './_components';

export const Route = createFileRoute('/orders/new/')({
  component: CreateOrderPage,
});

export function CreateOrderPage() {
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
    navigate({
      to: '/orders/$id',
      params: { id: 'r1' },
      state: {
        food: orderTitle,
        items,
        pickup,
        destination,
        instructions,
        status: 'open',
      } as any,
    });
  };

  return (
    <div>
      <Header title="New order" />
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-10 lg:px-10 lg:py-8">
        <CreateOrderForm
          food={food}
          setFood={setFood}
          quantities={quantities}
          setQuantities={setQuantities}
          pickup={pickup}
          setPickup={setPickup}
          destination={destination}
          setDestination={setDestination}
          instructions={instructions}
          setInstructions={setInstructions}
          onSubmit={onSubmit}
        />

        <HowItWorksCard />
      </div>
    </div>
  );
}
