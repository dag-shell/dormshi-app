import type { Agreement, FoodRequest, Offer, OrderStatus } from '../types/dormshi';
import { roundDC } from './format';

export const fulfillmentSteps: OrderStatus[] = [
'accepted',
'getting_food',
'picked_up',
'on_the_way',
'delivered'];


export const statusLabels: Record<OrderStatus, string> = {
  open: 'Open',
  accepted: 'Offer accepted',
  getting_food: 'Getting food',
  picked_up: 'Food picked up',
  on_the_way: 'On the way',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
  disputed: 'In dispute'
};

export const stepDescriptions: Record<string, string> = {
  accepted: 'Terms locked and DC reserved',
  getting_food: 'Heading to the pickup spot',
  picked_up: 'Food is in hand',
  on_the_way: 'Heading to the drop-off',
  delivered: 'Handed over, awaiting QR confirmation'
};

export function totalOf(terms: Pick<Offer | Agreement, 'foodPrice' | 'deliveryFee'>): number {
  return roundDC(terms.foodPrice + terms.deliveryFee);
}

export function isActiveStatus(status: OrderStatus): boolean {
  return !['completed', 'cancelled'].includes(status);
}

export function isInProgress(status: OrderStatus): boolean {
  return fulfillmentSteps.includes(status);
}

export function nextStatus(status: OrderStatus): OrderStatus | null {
  const index = fulfillmentSteps.indexOf(status);
  if (index === -1 || index === fulfillmentSteps.length - 1) return null;
  return fulfillmentSteps[index + 1];
}

export function canCancel(status: OrderStatus): boolean {
  return ['open', 'accepted', 'getting_food'].includes(status);
}

export function canDispute(status: OrderStatus): boolean {
  return ['picked_up', 'on_the_way', 'delivered'].includes(status);
}

export function canConfirm(status: OrderStatus): boolean {
  return ['on_the_way', 'delivered'].includes(status);
}

export function requestPath(request: FoodRequest): string {
  return request.status === 'open' ? `/requests/${request.id}` : `/requests/${request.id}/track`;
}

export function isInvolved(request: FoodRequest, userId: string): boolean {
  return request.requesterId === userId || request.agreement?.fulfillerId === userId;
}