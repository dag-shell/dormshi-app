export type OrderStatus =
'open' |
'accepted' |
'getting_food' |
'picked_up' |
'on_the_way' |
'delivered' |
'completed' |
'cancelled' |
'disputed';

export type PaymentMethod = 'dc_wallet';

export interface User {
  id: string;
  name: string;
  initials: string;
  campus: string;
  dorm: string;
  rating: number;
  deliveries: number;
  joined: string;
}

export interface Offer {
  id: string;
  fulfillerId: string;
  foodPrice: number;
  deliveryFee: number;
  etaMinutes: number;
  note?: string;
  createdAt: string;
}

/** Terms locked when the requester accepts an offer. */
export interface Agreement {
  offerId: string;
  fulfillerId: string;
  foodPrice: number;
  deliveryFee: number;
  etaMinutes: number;
  paymentMethod: PaymentMethod;
  acceptedAt: string;
}

export interface ChangeProposal {
  proposedBy: string;
  foodPrice: number;
  deliveryFee: number;
  etaMinutes: number;
  reason: string;
  createdAt: string;
}

export interface StatusEvent {
  status: OrderStatus;
  at: string;
}

export interface FoodRequest {
  id: string;
  requesterId: string;
  food: string;
  pickup: string;
  destination: string;
  instructions?: string;
  imageUrl?: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  offers: Offer[];
  agreement?: Agreement;
  pendingChange?: ChangeProposal;
  statusHistory: StatusEvent[];
  createdAt: string;
  distanceKm: number;
  receiptId?: string;
  cancelReason?: string;
  disputeReason?: string;
}

export type TransactionType =
'purchase' |
'sent' |
'received' |
'reserved' |
'released' |
'earned' |
'refund' |
'cash_out';

export interface Transaction {
  id: string;
  type: TransactionType;
  direction: 'in' | 'out' | 'hold';
  amount: number;
  label: string;
  counterpartyId?: string;
  requestId?: string;
  method?: string;
  reference: string;
  createdAt: string;
}

export interface Wallet {
  available: number;
  reserved: number;
}

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export interface NewRequestInput {
  food: string;
  pickup: string;
  destination: string;
  instructions?: string;
  imageUrl?: string;
  paymentMethod: PaymentMethod;
}

export interface NewOfferInput {
  foodPrice: number;
  deliveryFee: number;
  etaMinutes: number;
  note?: string;
}

export interface TermsInput {
  foodPrice: number;
  deliveryFee: number;
  etaMinutes: number;
  reason: string;
}