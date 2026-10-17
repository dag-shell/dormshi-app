import type { FoodRequest } from '../types/dormshi';
import { minutesAgo } from '../utils/time';

export const initialRequests: FoodRequest[] = [
{
  id: 'r1',
  requesterId: 'u_me',
  food: '2 large taro milk teas, 50% sugar, with boba',
  pickup: 'Tea Lab, Union Square',
  destination: 'Hartley Hall, 3rd floor lounge',
  instructions: 'Less ice on both please. Text me when you are downstairs and I will come down.',
  imageUrl: "/007177f6-8043-4f64-8f61-c59a69941bd3.jpg",
  paymentMethod: 'dc_wallet',
  status: 'open',
  offers: [
  { id: 'o1', fulfillerId: 'u_lena', foodPrice: 12.8, deliveryFee: 3.0, etaMinutes: 12, note: 'Already at Union Square, can grab it right now.', createdAt: minutesAgo(3) },
  { id: 'o2', fulfillerId: 'u_jordan', foodPrice: 13.0, deliveryFee: 2.5, etaMinutes: 15, note: 'Heading back to Hartley anyway.', createdAt: minutesAgo(6) },
  { id: 'o3', fulfillerId: 'u_dev', foodPrice: 13.0, deliveryFee: 1.75, etaMinutes: 25, createdAt: minutesAgo(8) }],

  statusHistory: [{ status: 'open', at: minutesAgo(11) }],
  createdAt: minutesAgo(11),
  distanceKm: 0
},
{
  id: 'r2',
  requesterId: 'u_me',
  food: 'Chicken shawarma wrap + garlic fries',
  pickup: 'Halal Cart, 5th & Main',
  destination: 'Science Library, Room 204',
  instructions: 'Extra white sauce, no hot sauce.',
  paymentMethod: 'dc_wallet',
  status: 'on_the_way',
  offers: [
  { id: 'o4', fulfillerId: 'u_sam', foodPrice: 11.5, deliveryFee: 3.0, etaMinutes: 20, createdAt: minutesAgo(30) }],

  agreement: { offerId: 'o4', fulfillerId: 'u_sam', foodPrice: 11.5, deliveryFee: 3.0, etaMinutes: 20, paymentMethod: 'dc_wallet', acceptedAt: minutesAgo(26) },
  statusHistory: [
  { status: 'open', at: minutesAgo(34) },
  { status: 'accepted', at: minutesAgo(26) },
  { status: 'getting_food', at: minutesAgo(24) },
  { status: 'picked_up', at: minutesAgo(12) },
  { status: 'on_the_way', at: minutesAgo(5) }],

  createdAt: minutesAgo(34),
  distanceKm: 0
},
{
  id: 'r11',
  requesterId: 'u_me',
  food: 'Spicy miso ramen, extra egg',
  pickup: 'Kumo Ramen, Campus Ave',
  destination: 'Hartley Hall 3B',
  paymentMethod: 'dc_wallet',
  status: 'getting_food',
  offers: [
  { id: 'o9', fulfillerId: 'u_dev', foodPrice: 14.5, deliveryFee: 3.0, etaMinutes: 22, createdAt: minutesAgo(12) }],

  agreement: { offerId: 'o9', fulfillerId: 'u_dev', foodPrice: 14.5, deliveryFee: 3.0, etaMinutes: 22, paymentMethod: 'dc_wallet', acceptedAt: minutesAgo(9) },
  pendingChange: { proposedBy: 'u_dev', foodPrice: 16.0, deliveryFee: 3.0, etaMinutes: 25, reason: 'Kumo raised the spicy miso to 16.00 this week. The menu photo was outdated.', createdAt: minutesAgo(2) },
  statusHistory: [
  { status: 'open', at: minutesAgo(15) },
  { status: 'accepted', at: minutesAgo(9) },
  { status: 'getting_food', at: minutesAgo(7) }],

  createdAt: minutesAgo(15),
  distanceKm: 0
},
{
  id: 'r3',
  requesterId: 'u_priya',
  food: 'Veggie poke bowl, no avocado',
  pickup: 'Poke Republic, Student Center',
  destination: 'Larkin House lobby',
  instructions: 'Brown rice base. Ponzu on the side.',
  paymentMethod: 'dc_wallet',
  status: 'getting_food',
  offers: [
  { id: 'o5', fulfillerId: 'u_me', foodPrice: 14.25, deliveryFee: 2.75, etaMinutes: 18, createdAt: minutesAgo(16) }],

  agreement: { offerId: 'o5', fulfillerId: 'u_me', foodPrice: 14.25, deliveryFee: 2.75, etaMinutes: 18, paymentMethod: 'dc_wallet', acceptedAt: minutesAgo(14) },
  statusHistory: [
  { status: 'open', at: minutesAgo(20) },
  { status: 'accepted', at: minutesAgo(14) },
  { status: 'getting_food', at: minutesAgo(10) }],

  createdAt: minutesAgo(20),
  distanceKm: 0.4
},
{
  id: 'r4',
  requesterId: 'u_aisha',
  food: 'Iced oat latte + blueberry muffin',
  pickup: 'Bean Counter Café',
  destination: 'Engineering Building, Lab 1.12',
  instructions: 'Lab door is badge-only, call me when you arrive.',
  paymentMethod: 'dc_wallet',
  status: 'open',
  offers: [
  { id: 'o6', fulfillerId: 'u_tomas', foodPrice: 9.5, deliveryFee: 2.0, etaMinutes: 15, createdAt: minutesAgo(1) }],

  statusHistory: [{ status: 'open', at: minutesAgo(4) }],
  createdAt: minutesAgo(4),
  distanceKm: 0.3
},
{
  id: 'r5',
  requesterId: 'u_tomas',
  food: 'Pad thai, medium spicy, with tofu',
  pickup: 'Thai Orchid, Campus Ave',
  destination: 'Ellis Hall, Room 410',
  paymentMethod: 'dc_wallet',
  status: 'open',
  offers: [],
  statusHistory: [{ status: 'open', at: minutesAgo(7) }],
  createdAt: minutesAgo(7),
  distanceKm: 0.6
},
{
  id: 'r6',
  requesterId: 'u_lena',
  food: '2 Clif bars (chocolate chip) + sparkling water',
  pickup: 'CVS on College St',
  destination: 'Rec Center front desk',
  instructions: 'Any flavor of sparkling water works.',
  paymentMethod: 'dc_wallet',
  status: 'open',
  offers: [],
  statusHistory: [{ status: 'open', at: minutesAgo(13) }],
  createdAt: minutesAgo(13),
  distanceKm: 0.8
},
{
  id: 'r7',
  requesterId: 'u_dev',
  food: '2 pepperoni slices + a Coke',
  pickup: "Gino's Pizza",
  destination: 'Music Hall, practice room 7',
  paymentMethod: 'dc_wallet',
  status: 'open',
  offers: [
  { id: 'o7', fulfillerId: 'u_jordan', foodPrice: 8.0, deliveryFee: 2.5, etaMinutes: 20, createdAt: minutesAgo(5) },
  { id: 'o8', fulfillerId: 'u_sam', foodPrice: 8.0, deliveryFee: 2.0, etaMinutes: 28, createdAt: minutesAgo(3) }],

  statusHistory: [{ status: 'open', at: minutesAgo(18) }],
  createdAt: minutesAgo(18),
  distanceKm: 1.1
},
{
  id: 'r8',
  requesterId: 'u_me',
  food: 'Burrito bowl with chicken, mild salsa',
  pickup: 'Chipotle, Main St',
  destination: 'Hartley Hall 3B',
  paymentMethod: 'dc_wallet',
  status: 'completed',
  offers: [{ id: 'o10', fulfillerId: 'u_jordan', foodPrice: 13.75, deliveryFee: 3.0, etaMinutes: 20, createdAt: minutesAgo(60 * 31) }],
  agreement: { offerId: 'o10', fulfillerId: 'u_jordan', foodPrice: 13.75, deliveryFee: 3.0, etaMinutes: 20, paymentMethod: 'dc_wallet', acceptedAt: minutesAgo(60 * 31) },
  statusHistory: [
  { status: 'open', at: minutesAgo(60 * 31 + 8) },
  { status: 'accepted', at: minutesAgo(60 * 31) },
  { status: 'completed', at: minutesAgo(60 * 30) }],

  receiptId: 'tx_05',
  createdAt: minutesAgo(60 * 31 + 8),
  distanceKm: 0
},
{
  id: 'r9',
  requesterId: 'u_dev',
  food: 'Everything bagel with scallion cream cheese ×2',
  pickup: 'Brick Oven Bagels',
  destination: 'Okoro Commons, 2nd floor',
  paymentMethod: 'dc_wallet',
  status: 'completed',
  offers: [{ id: 'o11', fulfillerId: 'u_me', foodPrice: 9.5, deliveryFee: 2.5, etaMinutes: 15, createdAt: minutesAgo(60 * 23) }],
  agreement: { offerId: 'o11', fulfillerId: 'u_me', foodPrice: 9.5, deliveryFee: 2.5, etaMinutes: 15, paymentMethod: 'dc_wallet', acceptedAt: minutesAgo(60 * 23) },
  statusHistory: [
  { status: 'open', at: minutesAgo(60 * 23 + 5) },
  { status: 'accepted', at: minutesAgo(60 * 23) },
  { status: 'completed', at: minutesAgo(60 * 22) }],

  receiptId: 'tx_06',
  createdAt: minutesAgo(60 * 23 + 5),
  distanceKm: 0.5
},
{
  id: 'r10',
  requesterId: 'u_me',
  food: 'Mango smoothie, large',
  pickup: 'Juice Junction',
  destination: 'Hartley Hall 3B',
  paymentMethod: 'dc_wallet',
  status: 'cancelled',
  offers: [{ id: 'o12', fulfillerId: 'u_tomas', foodPrice: 7.25, deliveryFee: 2.0, etaMinutes: 15, createdAt: minutesAgo(60 * 97) }],
  agreement: { offerId: 'o12', fulfillerId: 'u_tomas', foodPrice: 7.25, deliveryFee: 2.0, etaMinutes: 15, paymentMethod: 'dc_wallet', acceptedAt: minutesAgo(60 * 97) },
  cancelReason: 'Juice Junction was closed.',
  statusHistory: [
  { status: 'open', at: minutesAgo(60 * 97 + 6) },
  { status: 'accepted', at: minutesAgo(60 * 97) },
  { status: 'cancelled', at: minutesAgo(60 * 96) }],

  createdAt: minutesAgo(60 * 97 + 6),
  distanceKm: 0
}];