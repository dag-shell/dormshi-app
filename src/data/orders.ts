import type { OrderStatus } from '@/types/dormshi';

export interface AdImage {
  id: number;
  url: string;
  alt: string;
}

export const adImages: AdImage[] = [
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

export interface FeedOrder {
  id: string;
  food: string;
  pickup: string;
  destination: string;
  status: OrderStatus;
  timeAgo: string;
  requesterName: string;
  requesterInitials: string;
  isMine?: boolean;
  offerCount?: number;
  price: string;
  distanceKm?: number;
}

export const myOrdersData: FeedOrder[] = [
  {
    id: 'r1',
    food: 'Taro milk tea, Boba',
    pickup: 'Tea Lab, Union Square',
    destination: 'Hartley Hall, 3rd floor lounge',
    status: 'open',
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
    status: 'on_the_way',
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
    status: 'completed',
    timeAgo: 'Yesterday',
    price: 'ETB 150',
    requesterName: 'You',
    requesterInitials: 'MO',
    isMine: true
  }
];

export const campusOrdersData: FeedOrder[] = [
  {
    id: 'r4',
    food: 'Iced oat latte, Blueberry muffin',
    pickup: 'Bean Counter Café',
    destination: 'Engineering Building, Lab 1.12',
    status: 'open',
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
    status: 'open',
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
    status: 'open',
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
    status: 'open',
    timeAgo: '18m ago',
    requesterName: 'Dev Mehta',
    requesterInitials: 'DM',
    offerCount: 2,
    price: 'ETB 130'
  }
];

export interface MockOrderDetail {
  food: string;
  items: { name: string; quantity: number; price?: number }[];
  pickup: string;
  destination: string;
  instructions?: string;
  requesterName: string;
  requesterInitials: string;
  isMine: boolean;
  timeAgo: string;
  status: OrderStatus;
}

export const mockOrders: Record<string, MockOrderDetail> = {
  r1: {
    food: 'Taro milk tea, Boba',
    items: [
      { name: 'Taro milk tea', quantity: 2, price: 50 },
      { name: 'Boba topping', quantity: 2, price: 10 }
    ],
    pickup: 'Tea Lab, Union Square',
    destination: 'Hartley Hall, 3rd floor lounge',
    instructions: 'Less ice on both please. Text me when downstairs.',
    requesterName: 'Maya Okafor',
    requesterInitials: 'MO',
    isMine: true,
    timeAgo: '11m ago',
    status: 'open'
  },
  r2: {
    food: 'Chicken shawarma wrap, Garlic fries',
    items: [
      { name: 'Chicken shawarma wrap', quantity: 1, price: 100 },
      { name: 'Garlic fries', quantity: 1, price: 40 }
    ],
    pickup: 'Halal Cart, 5th & Main',
    destination: 'Science Library, Room 204',
    instructions: 'Extra white sauce, please.',
    requesterName: 'Maya Okafor',
    requesterInitials: 'MO',
    isMine: true,
    timeAgo: '34m ago',
    status: 'on_the_way'
  },
  r4: {
    food: 'Iced oat latte, Blueberry muffin',
    items: [
      { name: 'Iced oat latte', quantity: 1 },
      { name: 'Blueberry muffin', quantity: 1 }
    ],
    pickup: 'Bean Counter Café',
    destination: 'Engineering Building, Lab 1.12',
    instructions: 'Please call when arriving at the lab door.',
    requesterName: 'Aisha Bello',
    requesterInitials: 'AB',
    isMine: false,
    timeAgo: '4m ago',
    status: 'open'
  },
  r5: {
    food: 'Pad thai, Tofu',
    items: [
      { name: 'Pad thai', quantity: 1 },
      { name: 'Tofu', quantity: 1 }
    ],
    pickup: 'Thai Orchid, Campus Ave',
    destination: 'Ellis Hall, Room 410',
    instructions: 'Medium spice. Leave at door if room locked.',
    requesterName: 'Tomás Ruiz',
    requesterInitials: 'TR',
    isMine: false,
    timeAgo: '7m ago',
    status: 'open'
  },
  r6: {
    food: 'Clif bar, Sparkling water',
    items: [
      { name: 'Clif bar', quantity: 2 },
      { name: 'Sparkling water', quantity: 1 }
    ],
    pickup: 'CVS on College St',
    destination: 'Rec Center front desk',
    instructions: 'Any flavor Clif bar is fine.',
    requesterName: 'Lena Park',
    requesterInitials: 'LP',
    isMine: false,
    timeAgo: '13m ago',
    status: 'open'
  },
  r7: {
    food: 'Pepperoni pizza, Coke',
    items: [
      { name: 'Pepperoni pizza', quantity: 1 },
      { name: 'Coke', quantity: 2 }
    ],
    pickup: "Gino's Pizza",
    destination: 'Music Hall, practice room 7',
    instructions: 'Practice room is down the hall on the left.',
    requesterName: 'Dev Mehta',
    requesterInitials: 'DM',
    isMine: false,
    timeAgo: '18m ago',
    status: 'open'
  },
  r8: {
    food: 'Burrito bowl, Chicken',
    items: [
      { name: 'Burrito bowl', quantity: 1, price: 150 }
    ],
    pickup: 'Chipotle, Main St',
    destination: 'Hartley Hall 3B',
    requesterName: 'Maya Okafor',
    requesterInitials: 'MO',
    isMine: true,
    timeAgo: 'Yesterday',
    status: 'completed'
  }
};
