# Database





---

## `tgcloud/schema.js`

```javascript
import { table, integer, text, real, json, index, sql } from 'sdk/db';

export const users = table('users', {
  id: text('id').primaryKey(),
  tgId: integer('tg_id').unique(),
  name: text('name').notNull(),
  universityCode: text('university_code').notNull(),
  campusCode: text('campus_code').notNull(),
  rating: real('rating').default(5.0),
  deliveries: integer('deliveries').default(0),
  requests: integer('requests').default(0),
});

export const wallets = table('wallets', {
  userId: text('user_id').primaryKey(),
  available: real('available').default(0.0),
  reserved: real('reserved').default(0.0),
});

export const requests = table('requests', {
  id: text('id').primaryKey(),
  requesterId: text('requester_id').notNull(),
  food: text('food').notNull(),
  pickup: text('pickup').notNull(),
  destination: text('destination').notNull(),
  instructions: text('instructions'),
  imageUrl: text('image_url'),
  status: text('status').default('open'),
  distanceKm: real('distance_km').default(0.0),
  agreement: json('agreement'),
  pendingChange: json('pending_change'),
  statusHistory: json('status_history'),
  cancelReason: text('cancel_reason'),
  disputeReason: text('dispute_reason'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (t) => ({
  statusIdx: index('idx_requests_status').on(t.status),
  requesterIdx: index('idx_requests_requester').on(t.requesterId),
}));

export const offers = table('offers', {
  id: text('id').primaryKey(),
  requestId: text('request_id').notNull(),
  fulfillerId: text('fulfiller_id').notNull(),
  foodPrice: real('food_price').notNull(),
  deliveryFee: real('delivery_fee').notNull(),
  etaMinutes: integer('eta_minutes').notNull(),
  note: text('note'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (t) => ({
  requestIdx: index('idx_offers_request').on(t.requestId),
}));

export const transactions = table('transactions', {
  id: text('id').primaryKey(),
  reference: text('reference').notNull().unique(),
  userId: text('user_id').notNull(),
  type: text('type').notNull(),
  direction: text('direction').notNull(),
  amount: real('amount').notNull(),
  label: text('label').notNull(),
  counterpartyId: text('counterparty_id'),
  requestId: text('request_id'),
  method: text('method'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (t) => ({
  userIdIdx: index('idx_tx_user').on(t.userId),
}));
```
