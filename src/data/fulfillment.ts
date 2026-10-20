export interface CourierStatusData {
  courierName: string;
  courierInitials: string;
  rating: string;
  dorm: string;
  etaTime: string;
  pickup: string;
  destination: string;
  note: string;
}

export const sampleCourierStatus: CourierStatusData = {
  courierName: 'Sam Whitaker',
  courierInitials: 'SW',
  rating: '4.7',
  dorm: 'Brooks Hall',
  etaTime: '3:15 PM',
  pickup: 'Halal Cart, 5th & Main',
  destination: 'Science Library, Room 204',
  note: 'Extra white sauce, no hot sauce.'
};

export const sampleTimelineRequest = {
  id: 'r2',
  requesterId: 'u_me',
  food: 'Chicken shawarma wrap + garlic fries',
  pickup: 'Halal Cart, 5th & Main',
  destination: 'Science Library, Room 204',
  paymentMethod: 'dc_wallet',
  status: 'on_the_way' as const,
  offers: [],
  statusHistory: [
    { status: 'open' as const, at: '2:30 PM' },
    { status: 'accepted' as const, at: '2:38 PM' },
    { status: 'getting_food' as const, at: '2:40 PM' },
    { status: 'picked_up' as const, at: '2:52 PM' },
    { status: 'on_the_way' as const, at: '2:59 PM' }
  ],
  createdAt: '2:30 PM',
  distanceKm: 0,
  agreement: {
    foodPrice: 11.5,
    deliveryFee: 3.0,
    etaMinutes: 20
  }
};
