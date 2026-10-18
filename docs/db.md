# Dormshi Database Schema

Minimal database design derived from `@src` for the `tgcloud` SQLite platform (`sdk/db`).

## Tables

### 1. `users`
| Column | Type | Notes |
|---|---|---|
| `id` | `text` PK | User ID (`u_me`, `u_lena`) |
| `tg_id` | `integer` | Unique, from Telegram `initData` |
| `name` | `text` | Full name |
| `campus` | `text` | University |
| `dorm` | `text` | Dormitory / hall |
| `rating` | `real` | Rating (default `5.0`) |
| `deliveries`| `integer` | Delivery count (default `0`) |

### 2. `wallets`
| Column | Type | Notes |
|---|---|---|
| `user_id` | `text` PK | References `users.id` |
| `available` | `real` | Spendable DC |
| `reserved` | `real` | Escrow DC (active orders) |

### 3. `requests`
| Column | Type | Notes |
|---|---|---|
| `id` | `text` PK | Request ID (`r1`, `r_...`) |
| `requester_id` | `text` | Created by `users.id` |
| `food` | `text` | Items ordered |
| `pickup` | `text` | Restaurant / pickup spot |
| `destination` | `text` | Drop-off dorm / room |
| `instructions` | `text` | Optional delivery notes |
| `image_url` | `text` | Optional image |
| `status` | `text` | `open`, `accepted`, `getting_food`, `picked_up`, `on_the_way`, `delivered`, `completed`, `cancelled`, `disputed` |
| `distance_km` | `real` | Distance for nearby discovery |
| `agreement` | `json` | Locked terms: `{ fulfillerId, foodPrice, deliveryFee, etaMinutes, acceptedAt }` |
| `pending_change` | `json` | Renegotiated terms: `{ proposedBy, foodPrice, deliveryFee, etaMinutes, reason }` |
| `status_history` | `json` | Array of `{ status, at }` |
| `cancel_reason` | `text` | Optional cancellation reason |
| `dispute_reason` | `text` | Optional dispute reason |
| `created_at` | `integer` | Timestamp |

### 4. `offers`
| Column | Type | Notes |
|---|---|---|
| `id` | `text` PK | Offer ID (`o1`, `o_...`) |
| `request_id` | `text` | Related `requests.id` |
| `fulfiller_id` | `text` | Created by `users.id` |
| `food_price` | `real` | Food cost |
| `delivery_fee` | `real` | Delivery fee |
| `eta_minutes` | `integer` | Estimated time in minutes |
| `note` | `text` | Optional note |
| `created_at` | `integer` | Timestamp |

### 5. `transactions`
| Column | Type | Notes |
|---|---|---|
| `id` | `text` PK | Transaction ID (`tx_01`) |
| `reference` | `text` | Unique receipt code (`DMS-XXXXXX`) |
| `user_id` | `text` | Account owner |
| `type` | `text` | `purchase`, `sent`, `received`, `reserved`, `released`, `earned`, `refund`, `cash_out` |
| `direction` | `text` | `in`, `out`, `hold` |
| `amount` | `real` | DC amount |
| `label` | `text` | Display description |
| `counterparty_id` | `text` | Other user ID (optional) |
| `request_id` | `text` | Related request ID (optional) |
| `method` | `text` | Payment method (optional) |
| `created_at` | `integer` | Timestamp |

---

## `tgcloud/schema.js`

```javascript
import { table, integer, text, real, json, index, sql } from 'sdk/db';

export const users = table('users', {
  id: text('id').primaryKey(),
  tgId: integer('tg_id').unique(),
  name: text('name').notNull(),
  campus: text('campus').notNull(),
  dorm: text('dorm').notNull(),
  rating: real('rating').default(5.0),
  deliveries: integer('deliveries').default(0),
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
