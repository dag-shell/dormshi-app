import React, { createContext, useContext, useRef, useState } from 'react';
import { initialRequests } from '../data/requests';
import { initialTransactions, initialWallet } from '../data/transactions';
import { CURRENT_USER_ID, users } from '../data/users';
import { formatDC, roundDC } from '../utils/format';
import { canCancel, canConfirm, nextStatus, totalOf } from '../utils/orders';
import { delay, nowIso } from '../utils/time';
import type {
  ActionResult,
  FoodRequest,
  NewOfferInput,
  NewRequestInput,
  OrderStatus,
  TermsInput,
  Transaction,
  User,
  Wallet } from
'../types/dormshi';

interface ConfirmResult extends ActionResult {
  receipt?: Transaction;
}

interface DormshiContextValue {
  currentUser: User;
  users: User[];
  getUser: (id: string) => User;
  requests: FoodRequest[];
  transactions: Transaction[];
  wallet: Wallet;
  deliveryRadiusKm: number;
  setDeliveryRadiusKm: (km: number) => void;
  createRequest: (input: NewRequestInput) => string;
  submitOffer: (requestId: string, input: NewOfferInput) => void;
  acceptOffer: (requestId: string, offerId: string) => ActionResult;
  advanceStatus: (requestId: string) => void;
  confirmDelivery: (requestId: string, scannedUserId: string) => Promise<ConfirmResult>;
  completeAsFulfiller: (requestId: string) => void;
  cancelOrder: (requestId: string, reason: string) => ActionResult;
  openDispute: (requestId: string, reason: string) => void;
  proposeChange: (requestId: string, terms: TermsInput) => void;
  respondToChange: (requestId: string, approve: boolean) => ActionResult;
  withdrawChange: (requestId: string) => void;
  buyDC: (amount: number, method: string) => void;
  sendDC: (recipientId: string, amount: number, note?: string) => ActionResult;
  cashOut: (amount: number) => ActionResult;
}

const DormshiContext = createContext<DormshiContextValue | null>(null);

const uid = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
const reference = () => `DMS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const withStatus = (request: FoodRequest, status: OrderStatus): FoodRequest => ({
  ...request,
  status,
  statusHistory: [...request.statusHistory, { status, at: nowIso() }]
});

export function DormshiProvider({ children }: {children: React.ReactNode;}) {
  const [requests, setRequests] = useState<FoodRequest[]>(initialRequests);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [wallet, setWallet] = useState<Wallet>(initialWallet);
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState(1.5);
  const latest = useRef({ requests, wallet });
  latest.current = { requests, wallet };

  const getUser = (id: string) => users.find((u) => u.id === id) ?? users[0];
  const currentUser = getUser(CURRENT_USER_ID);
  const findRequest = (id: string) => latest.current.requests.find((r) => r.id === id);
  const updateRequest = (id: string, fn: (r: FoodRequest) => FoodRequest) =>
  setRequests((prev) => prev.map((r) => r.id === id ? fn(r) : r));
  const adjustWallet = (availableDelta: number, reservedDelta: number) =>
  setWallet((w) => ({
    available: roundDC(w.available + availableDelta),
    reserved: roundDC(w.reserved + reservedDelta)
  }));
  const addTx = (tx: Omit<Transaction, 'id' | 'reference' | 'createdAt'>): Transaction => {
    const full: Transaction = { ...tx, id: uid('tx'), reference: reference(), createdAt: nowIso() };
    setTransactions((prev) => [full, ...prev]);
    return full;
  };

  const createRequest = (input: NewRequestInput) => {
    const id = uid('r');
    const createdAt = nowIso();
    setRequests((prev) => [
    { ...input, id, requesterId: CURRENT_USER_ID, status: 'open', offers: [], statusHistory: [{ status: 'open', at: createdAt }], createdAt, distanceKm: 0 },
    ...prev]
    );
    // Simulate nearby students responding with offers.
    const simulated = [
    { after: 4000, fulfillerId: 'u_lena', foodPrice: 12.0, deliveryFee: 2.5, etaMinutes: 15, note: 'Close by, can head over now.' },
    { after: 8000, fulfillerId: 'u_jordan', foodPrice: 12.0, deliveryFee: 2.0, etaMinutes: 25 }];

    simulated.forEach(({ after, ...offer }) =>
    setTimeout(() => {
      updateRequest(id, (r) =>
      r.status === 'open' ? { ...r, offers: [...r.offers, { ...offer, id: uid('o'), createdAt: nowIso() }] } : r
      );
    }, after)
    );
    return id;
  };

  const submitOffer = (requestId: string, input: NewOfferInput) =>
  updateRequest(requestId, (r) => ({
    ...r,
    offers: [...r.offers, { ...input, id: uid('o'), fulfillerId: CURRENT_USER_ID, createdAt: nowIso() }]
  }));

  const acceptOffer = (requestId: string, offerId: string): ActionResult => {
    const request = findRequest(requestId);
    if (!request || request.status !== 'open') return { ok: false, error: 'This request is no longer open.' };
    const offer = request.offers.find((o) => o.id === offerId);
    if (!offer) return { ok: false, error: 'That offer was withdrawn.' };
    const total = totalOf(offer);
    if (latest.current.wallet.available < total) {
      return { ok: false, error: `You need ${formatDC(total)} available. Top up your wallet to accept.` };
    }
    adjustWallet(-total, total);
    addTx({ type: 'reserved', direction: 'hold', amount: total, label: `Reserved · ${request.food}`, counterpartyId: offer.fulfillerId, requestId });
    updateRequest(requestId, (r) =>
    withStatus(
      {
        ...r,
        agreement: {
          offerId,
          fulfillerId: offer.fulfillerId,
          foodPrice: offer.foodPrice,
          deliveryFee: offer.deliveryFee,
          etaMinutes: offer.etaMinutes,
          paymentMethod: r.paymentMethod,
          acceptedAt: nowIso()
        }
      },
      'accepted'
    )
    );
    return { ok: true };
  };

  const advanceStatus = (requestId: string) => {
    const request = findRequest(requestId);
    if (!request || request.agreement?.fulfillerId !== CURRENT_USER_ID) return;
    const next = nextStatus(request.status);
    if (next) updateRequest(requestId, (r) => withStatus(r, next));
  };

  const confirmDelivery = async (requestId: string, scannedUserId: string): Promise<ConfirmResult> => {
    await delay(2600);
    const request = findRequest(requestId);
    if (!request?.agreement || request.requesterId !== CURRENT_USER_ID) {
      return { ok: false, error: 'We could not find this request on your account.' };
    }
    if (!canConfirm(request.status)) return { ok: false, error: 'This request is not ready to be confirmed.' };
    if (scannedUserId !== request.agreement.fulfillerId) {
      return { ok: false, error: "The scanned QR code doesn't belong to the fulfiller on this request." };
    }
    const total = totalOf(request.agreement);
    if (latest.current.wallet.reserved < total) return { ok: false, error: 'Reserved DC could not be verified. Contact support.' };
    const fulfiller = getUser(request.agreement.fulfillerId);
    adjustWallet(0, -total);
    const receipt = addTx({ type: 'released', direction: 'out', amount: total, label: `Paid ${fulfiller.name} · ${request.food}`, counterpartyId: fulfiller.id, requestId });
    updateRequest(requestId, (r) => ({ ...withStatus(r, 'completed'), receiptId: receipt.id, pendingChange: undefined }));
    return { ok: true, receipt };
  };

  const completeAsFulfiller = (requestId: string) => {
    const request = findRequest(requestId);
    if (!request?.agreement || request.agreement.fulfillerId !== CURRENT_USER_ID || request.status !== 'delivered') return;
    const total = totalOf(request.agreement);
    adjustWallet(total, 0);
    const tx = addTx({ type: 'earned', direction: 'in', amount: total, label: `Delivery for ${getUser(request.requesterId).name} · ${request.food}`, counterpartyId: request.requesterId, requestId });
    updateRequest(requestId, (r) => ({ ...withStatus(r, 'completed'), receiptId: tx.id }));
  };

  const cancelOrder = (requestId: string, reason: string): ActionResult => {
    const request = findRequest(requestId);
    if (!request || !canCancel(request.status)) {
      return { ok: false, error: 'Food has already been picked up. Report a problem instead.' };
    }
    if (request.agreement && request.requesterId === CURRENT_USER_ID) {
      const total = totalOf(request.agreement);
      adjustWallet(total, -total);
      addTx({ type: 'refund', direction: 'in', amount: total, label: `Refund · ${request.food}`, counterpartyId: request.agreement.fulfillerId, requestId });
    }
    updateRequest(requestId, (r) => ({ ...withStatus(r, 'cancelled'), cancelReason: reason, pendingChange: undefined }));
    return { ok: true };
  };

  const openDispute = (requestId: string, reason: string) =>
  updateRequest(requestId, (r) => ({ ...withStatus(r, 'disputed'), disputeReason: reason }));

  const proposeChange = (requestId: string, terms: TermsInput) =>
  updateRequest(requestId, (r) => ({ ...r, pendingChange: { ...terms, proposedBy: CURRENT_USER_ID, createdAt: nowIso() } }));

  const withdrawChange = (requestId: string) => updateRequest(requestId, (r) => ({ ...r, pendingChange: undefined }));

  const respondToChange = (requestId: string, approve: boolean): ActionResult => {
    const request = findRequest(requestId);
    if (!request?.agreement || !request.pendingChange) return { ok: false, error: 'No pending change.' };
    if (!approve) {
      withdrawChange(requestId);
      return { ok: true };
    }
    const change = request.pendingChange;
    const diff = roundDC(totalOf(change) - totalOf(request.agreement));
    if (request.requesterId === CURRENT_USER_ID && diff !== 0) {
      if (diff > latest.current.wallet.available) {
        return { ok: false, error: `You need ${formatDC(diff)} more available to approve this change.` };
      }
      adjustWallet(-diff, diff);
      addTx({
        type: diff > 0 ? 'reserved' : 'refund',
        direction: diff > 0 ? 'hold' : 'in',
        amount: Math.abs(diff),
        label: `${diff > 0 ? 'Extra reserve' : 'Partial refund'} · ${request.food}`,
        counterpartyId: request.agreement.fulfillerId,
        requestId
      });
    }
    updateRequest(requestId, (r) => ({
      ...r,
      pendingChange: undefined,
      agreement: r.agreement && { ...r.agreement, foodPrice: change.foodPrice, deliveryFee: change.deliveryFee, etaMinutes: change.etaMinutes }
    }));
    return { ok: true };
  };

  const buyDC = (amount: number, method: string) => {
    adjustWallet(amount, 0);
    addTx({ type: 'purchase', direction: 'in', amount, label: `Bought DC · ${method}`, method });
  };

  const sendDC = (recipientId: string, amount: number, note?: string): ActionResult => {
    if (amount > latest.current.wallet.available) return { ok: false, error: 'Not enough available DC.' };
    adjustWallet(-amount, 0);
    const name = getUser(recipientId).name;
    addTx({ type: 'sent', direction: 'out', amount, label: note ? `To ${name} · "${note}"` : `To ${name}`, counterpartyId: recipientId });
    return { ok: true };
  };

  const cashOut = (amount: number): ActionResult => {
    if (amount > latest.current.wallet.available) return { ok: false, error: 'Not enough available DC.' };
    adjustWallet(-amount, 0);
    addTx({ type: 'cash_out', direction: 'out', amount, label: 'Cash out to Chase •• 0921', method: 'Bank transfer' });
    return { ok: true };
  };

  const value: DormshiContextValue = {
    currentUser,
    users,
    getUser,
    requests,
    transactions,
    wallet,
    deliveryRadiusKm,
    setDeliveryRadiusKm,
    createRequest,
    submitOffer,
    acceptOffer,
    advanceStatus,
    confirmDelivery,
    completeAsFulfiller,
    cancelOrder,
    openDispute,
    proposeChange,
    respondToChange,
    withdrawChange,
    buyDC,
    sendDC,
    cashOut
  };

  return <DormshiContext.Provider value={value}>{children}</DormshiContext.Provider>;
}

export function useDormshi(): DormshiContextValue {
  const ctx = useContext(DormshiContext);
  if (!ctx) throw new Error('useDormshi must be used within DormshiProvider');
  return ctx;
}