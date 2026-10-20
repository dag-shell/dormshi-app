import type { SentOfferData } from '@/app/_tabs/orders/_components';

export const initialOffers: SentOfferData[] = [
  {
    id: 'off_sent_1',
    requestId: 'r4',
    food: 'Iced oat latte, Blueberry muffin',
    pickup: 'Bean Counter Café',
    destination: 'Engineering Building, Lab 1.12',
    requesterName: 'Aisha Bello',
    requesterInitials: 'AB',
    status: 'pending',
    availableItems: '2 of 2 in stock',
    foodPrice: 110.0,
    deliveryFee: 20.0,
    etaMinutes: 15,
    timeAgo: '5m ago',
    note: 'Already at the counter, can deliver right away.',
    itemsAvailability: [
      { name: 'Iced oat latte', quantity: 1, unitPrice: 70, price: 70, available: true },
      { name: 'Blueberry muffin', quantity: 1, unitPrice: 40, price: 40, available: true }
    ]
  },
  {
    id: 'off_sent_2',
    requestId: 'r5',
    food: 'Pad thai, Tofu',
    pickup: 'Thai Orchid, Campus Ave',
    destination: 'Ellis Hall, Room 410',
    requesterName: 'Tomás Ruiz',
    requesterInitials: 'TR',
    status: 'accepted',
    availableItems: 'All in stock',
    foodPrice: 135.0,
    deliveryFee: 25.0,
    etaMinutes: 12,
    timeAgo: '18m ago',
    note: 'Order confirmed with counter. Walking over now.',
    itemsAvailability: [
      { name: 'Pad thai', quantity: 1, unitPrice: 95, price: 95, available: true },
      { name: 'Tofu', quantity: 1, unitPrice: 40, price: 40, available: true }
    ]
  },
  {
    id: 'off_sent_3',
    requestId: 'r7',
    food: 'Pepperoni pizza, Coke',
    pickup: "Gino's Pizza",
    destination: 'Music Hall, practice room 7',
    requesterName: 'Dev Mehta',
    requesterInitials: 'DM',
    status: 'pending',
    availableItems: '1 of 2 in stock',
    foodPrice: 40.0,
    deliveryFee: 15.0,
    etaMinutes: 20,
    timeAgo: '35m ago',
    note: 'Coke ready, pizza will be fresh out of the oven.',
    itemsAvailability: [
      { name: 'Pepperoni pizza', quantity: 1, unitPrice: 90, price: 90, available: false },
      { name: 'Coke', quantity: 2, unitPrice: 20, price: 40, available: true }
    ]
  },
  {
    id: 'off_sent_4',
    requestId: 'r6',
    food: 'Clif bar, Sparkling water',
    pickup: 'CVS on College St',
    destination: 'Rec Center front desk',
    requesterName: 'Lena Park',
    requesterInitials: 'LP',
    status: 'completed',
    availableItems: 'All (2)',
    foodPrice: 70.0,
    deliveryFee: 20.0,
    etaMinutes: 10,
    timeAgo: 'Yesterday',
    itemsAvailability: [
      { name: 'Clif bar', quantity: 2, unitPrice: 20, price: 40, available: true },
      { name: 'Sparkling water', quantity: 1, unitPrice: 30, price: 30, available: true }
    ]
  }
];
