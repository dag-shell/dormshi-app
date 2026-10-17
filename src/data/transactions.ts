import type { Transaction, Wallet } from '../types/dormshi';
import { minutesAgo } from '../utils/time';

export const initialWallet: Wallet = {
  available: 42.75,
  reserved: 32.0
};

export const initialTransactions: Transaction[] = [
{ id: 'tx_09', type: 'reserved', direction: 'hold', amount: 17.5, label: 'Reserved · Spicy miso ramen', counterpartyId: 'u_dev', requestId: 'r11', reference: 'DMS-7Q2K9A', createdAt: minutesAgo(9) },
{ id: 'tx_08', type: 'reserved', direction: 'hold', amount: 14.5, label: 'Reserved · Shawarma wrap + fries', counterpartyId: 'u_sam', requestId: 'r2', reference: 'DMS-4HXP2M', createdAt: minutesAgo(26) },
{ id: 'tx_07', type: 'received', direction: 'in', amount: 5.0, label: 'From Jordan Reyes · "for the coffee"', counterpartyId: 'u_jordan', reference: 'DMS-K82LQ1', createdAt: minutesAgo(60 * 5) },
{ id: 'tx_06', type: 'earned', direction: 'in', amount: 12.0, label: 'Delivery for Dev Mehta · Bagel request', counterpartyId: 'u_dev', requestId: 'r9', reference: 'DMS-PL03ZZ', createdAt: minutesAgo(60 * 22) },
{ id: 'tx_05', type: 'released', direction: 'out', amount: 16.75, label: 'Paid Jordan Reyes · Burrito bowl', counterpartyId: 'u_jordan', requestId: 'r8', reference: 'DMS-9MM1RT', createdAt: minutesAgo(60 * 30) },
{ id: 'tx_04', type: 'sent', direction: 'out', amount: 4.0, label: 'To Priya Nair · split snacks', counterpartyId: 'u_priya', reference: 'DMS-2BNC7E', createdAt: minutesAgo(60 * 48) },
{ id: 'tx_03', type: 'cash_out', direction: 'out', amount: 20.0, label: 'Cash out to Chase •• 0921', method: 'Bank transfer', reference: 'DMS-H71VWS', createdAt: minutesAgo(60 * 72) },
{ id: 'tx_02', type: 'refund', direction: 'in', amount: 9.25, label: 'Refund · Cancelled smoothie request', requestId: 'r10', reference: 'DMS-X0R5TB', createdAt: minutesAgo(60 * 96) },
{ id: 'tx_01', type: 'purchase', direction: 'in', amount: 100.0, label: 'Bought DC · Visa •• 4242', method: 'Visa •• 4242', reference: 'DMS-A11FJD', createdAt: minutesAgo(60 * 120) }];