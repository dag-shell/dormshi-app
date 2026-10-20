export interface Transaction {
  id: string;
  type: 'ordered' | 'reward' | 'earned' | 'deposit' | 'cashout' | 'send';
  direction: 'in' | 'out' | 'hold';
  amount: number;
  label: string;
  timeAgo: string;
}

export const rawTransactions: Transaction[] = [
  { id: 'tx_09', type: 'ordered', direction: 'hold', amount: 120.0, label: 'Taro milk tea, Boba · In escrow', timeAgo: '9m ago' },
  { id: 'tx_08', type: 'reward', direction: 'in', amount: 15.0, label: 'Delivery streak reward bonus', timeAgo: '2h ago' },
  { id: 'tx_07', type: 'earned', direction: 'in', amount: 35.0, label: 'Delivery for Dev Mehta · Hartley Hall', timeAgo: '5h ago' },
  { id: 'tx_06', type: 'ordered', direction: 'out', amount: 85.0, label: 'Shawarma wrap + fries · Delivered', timeAgo: 'Yesterday' },
  { id: 'tx_05', type: 'send', direction: 'out', amount: 25.0, label: 'To Jordan Reyes · Split lunch', timeAgo: 'Yesterday' },
  { id: 'tx_04', type: 'deposit', direction: 'in', amount: 150.0, label: 'Deposit · Telebirr', timeAgo: '2 days ago' },
  { id: 'tx_03', type: 'cashout', direction: 'out', amount: 80.0, label: 'Cash out to CBE •• 0921', timeAgo: '3 days ago' },
  { id: 'tx_02', type: 'reward', direction: 'in', amount: 10.0, label: 'Referral welcome reward', timeAgo: '4 days ago' },
  { id: 'tx_01', type: 'deposit', direction: 'in', amount: 100.0, label: 'Deposit · CBE Birr', timeAgo: '5 days ago' }
];

export interface WalletRecipient {
  id: string;
  name: string;
  initials: string;
  dorm: string;
}

export const sampleRecipients: WalletRecipient[] = [
  { id: 'u_jordan', name: 'Jordan Reyes', initials: 'JR', dorm: 'Ellis Hall' },
  { id: 'u_priya', name: 'Priya Nair', initials: 'PN', dorm: 'Larkin House' },
  { id: 'u_sam', name: 'Sam Whitaker', initials: 'SW', dorm: 'Brooks Hall' },
  { id: 'u_lena', name: 'Lena Park', initials: 'LP', dorm: 'Hartley Hall 1A' },
  { id: 'u_dev', name: 'Dev Mehta', initials: 'DM', dorm: 'Okoro Commons' }
];

export const buyPresets = [50, 100, 250, 500];
export const payMethods = ['Telebirr', 'CBE Birr', 'Bank Card'];
