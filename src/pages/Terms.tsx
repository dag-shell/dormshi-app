import React from 'react';
import { LegalDocument } from '@common/LegalDocument';

const termsSections = [
  {
    id: 'accounts',
    title: 'Your account',
    body: [
      'Dormshi is open to enrolled students with a verified campus email. Each person holds one account, used both to post requests and to fulfill them.',
      'You are responsible for activity on your account. Keep your login and personal QR code private, since the QR code is used to confirm deliveries and receive payments.'
    ]
  },
  {
    id: 'requests',
    title: 'Requests and offers',
    body: [
      'A request describes the food, the pickup location, and the delivery destination. Any user may respond with an offer that lists the food cost, delivery fee, and estimated delivery time.',
      'The requester decides which offer to accept. Submitting an offer does not guarantee the job. Once accepted, the food cost, delivery fee, and estimated time are locked and can only change if both parties approve a proposed change in the app.'
    ]
  },
  {
    id: 'payments',
    title: 'Dormshi Coin and escrow',
    body: [
      'Dormshi Coin (DC) is a stored-value balance used on Dormshi. 1 DC can be purchased for 1.00 USD. DC has no value outside the service.',
      'When a requester accepts an offer, the agreed total is reserved from their wallet. Reserved DC is released to the fulfiller only after the requester scans the fulfiller’s QR code and Dormshi verifies the request and payment.',
      'Available DC may be cashed out to a linked bank account. Transfers usually arrive within 1 to 2 business days. Reserved DC cannot be cashed out until its request settles.'
    ]
  },
  {
    id: 'cancellations',
    title: 'Cancellations and refunds',
    body: [
      'Either party may cancel before the food is picked up. If a request is cancelled, the reserved DC is refunded to the requester in full and immediately.',
      'After pickup, requests cannot be cancelled. Use “Report a problem” to open a dispute instead.'
    ]
  },
  {
    id: 'disputes',
    title: 'Disputes',
    body: [
      'Either party can open a dispute once food has been picked up. While a dispute is open, the reserved DC stays held and is not released to anyone.',
      'Dormshi support reviews request history, status updates, and messages, and replies within 24 hours. Support may refund the requester, release payment to the fulfiller, or split the amount.'
    ]
  },
  {
    id: 'conduct',
    title: 'Prohibited use',
    body: [
      'Do not use Dormshi to deliver alcohol, tobacco, prescription medication, or any item restricted by your campus. Do not request payment outside the app or ask for more DC than the agreed total.',
      'Accounts that repeatedly cancel, misreport deliveries, or abuse disputes may be suspended.'
    ]
  },
  {
    id: 'contact',
    title: 'Contact',
    body: ['Questions about these terms can be sent to support@dormshi.app.']
  }
];

export function Terms() {
  return <LegalDocument title="Terms of Service" sections={termsSections} />;
}