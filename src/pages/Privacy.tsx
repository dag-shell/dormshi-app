import React from 'react';
import { LegalDocument } from '@common/LegalDocument';

const privacySections = [
  {
    id: 'collect',
    title: 'What we collect',
    body: [
      'Account details: your name, campus email, campus, residence, and profile photo if you add one.',
      'Request details: requests, offers, status updates, reference images you upload, and delivery confirmations.',
      'Wallet details: DC balance, transactions, and the last four digits of linked cards or bank accounts. Full card numbers are handled by our payment processor and never stored by Dormshi.'
    ]
  },
  {
    id: 'location',
    title: 'Location',
    body: [
      'We use your approximate location to show requests within your chosen delivery radius. We do not track your location in the background, and we never share precise location with other users.'
    ]
  },
  {
    id: 'use',
    title: 'How we use it',
    body: [
      'To match requests with nearby fulfillers, hold and release DC, verify QR confirmations, resolve disputes, and prevent fraud.',
      'We do not sell your personal information or use it for third-party advertising.'
    ]
  },
  {
    id: 'sharing',
    title: 'What other users see',
    body: [
      'Other users see your first and last name, initials, residence hall, rating, and delivery count. Requesters and fulfillers on the same request see each other’s pickup and drop-off details for that request only.'
    ]
  },
  {
    id: 'retention',
    title: 'Retention and your choices',
    body: [
      'Transaction records are kept for 7 years to meet financial record-keeping rules. Other data is deleted within 30 days of closing your account.',
      'You can download or delete your data at any time by emailing privacy@dormshi.app.'
    ]
  }
];

export function Privacy() {
  return <LegalDocument title="Privacy Policy" sections={privacySections} />;
}