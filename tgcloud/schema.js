import {
  table,
  integer,
  text,
  real,
  boolean,
  json,
  index,
  uniqueIndex,
  check,
  sql
} from 'sdk/db';

// 1. Campuses
export const campuses = table('campuses', {
  id: text('id').primaryKey(), // Generated via crypto.randomUUID()
  name: text('name').notNull(),
  title: text('title').notNull(),
  univCode: text('univ_code').notNull(),
  univName: text('univ_name').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (t) => ({
  univCodeIdx: index('idx_campuses_univ_code').on(t.univCode),
}));

// 2. Users (Student profiles & merged wallet balances)
export const users = table('users', {
  id: text('id').primaryKey(), // Generated via crypto.randomUUID()
  tgId: integer('tg_id').notNull(),
  name: text('name').notNull(),
  phone: text('phone'),
  campusId: text('campus_id').notNull(),
  isAmbassador: boolean('is_ambassador').default(false),
  mainBalance: real('main_balance').notNull().default(0.0),
  rewardBalance: real('reward_balance').notNull().default(0.0),
  escrowBalance: real('escrow_balance').notNull().default(0.0),
  rating: real('rating').notNull().default(5.0),
  deliveriesCount: integer('deliveries_count').notNull().default(0),
  ordersCount: integer('orders_count').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (t) => ({
  tgIdUidx: uniqueIndex('uidx_users_tg_id').on(t.tgId),
  campusIdx: index('idx_users_campus_id').on(t.campusId),
  campusAmbassadorIdx: index('idx_users_campus_ambassador').on(t.campusId, t.isAmbassador),
  walletNonNegChk: check('chk_user_wallet_non_negative', sql`${t.mainBalance} >= 0.0 AND ${t.rewardBalance} >= 0.0 AND ${t.escrowBalance} >= 0.0`),
}));

// 3. Vendors (Campus dining spots with geofence coverage perimeter)
export const vendors = table('vendors', {
  id: text('id').primaryKey(), // Generated via crypto.randomUUID()
  campusId: text('campus_id').notNull(),
  name: text('name').notNull(),
  phone: text('phone'),
  locationName: text('location_name').notNull(),
  category: text('category').notNull().default('restaurant'),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  radiusMeters: integer('radius_meters').notNull().default(500),
  isActive: boolean('is_active').default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (t) => ({
  campusActiveIdx: index('idx_vendors_campus_active').on(t.campusId, t.isActive),
}));

// 4. Orders (Embedded items JSON, optional vendor link, inlined agreement terms)
export const orders = table('orders', {
  id: text('id').primaryKey(), // Generated via crypto.randomUUID()
  userId: text('user_id').notNull(),
  campusId: text('campus_id').notNull(),
  vendorId: text('vendor_id'),
  pickupLocation: text('pickup_location').notNull(),
  destination: text('destination').notNull(),
  instructions: text('instructions'),
  items: json('items').notNull(), // Array of requested items [{ name, quantity }]
  status: text('status').notNull().default('open'),
  cancelReason: text('cancel_reason'),
  disputeReason: text('dispute_reason'),
  // Agreement fields (populated upon offer acceptance)
  acceptedOfferId: text('accepted_offer_id'),
  fulfillerId: text('fulfiller_id'),
  agreedItemsPrice: real('agreed_items_price'),
  agreedDeliveryFee: real('agreed_delivery_fee'),
  agreedEtaMinutes: integer('agreed_eta_minutes'),
  escrowTxnId: text('escrow_txn_id'),
  acceptedAt: integer('accepted_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (t) => ({
  campusFeedIdx: index('idx_orders_campus_status').on(t.campusId, t.status, t.createdAt),
  userOrderIdx: index('idx_orders_user_status').on(t.userId, t.status),
  fulfillerIdx: index('idx_orders_fulfiller_status').on(t.fulfillerId, t.status),
  vendorIdx: index('idx_orders_vendor').on(t.vendorId),
}));

// 5. Offers (Embedded item quotes & availability)
export const offers = table('offers', {
  id: text('id').primaryKey(), // Generated via crypto.randomUUID()
  orderId: text('order_id').notNull(),
  fulfillerId: text('fulfiller_id').notNull(),
  itemsPrice: real('items_price').notNull(),
  deliveryFee: real('delivery_fee').notNull(),
  etaMinutes: integer('eta_minutes').notNull(),
  note: text('note'),
  items: json('items').notNull(), // Array of [{ name, quantity, unitPrice }]
  status: text('status').notNull().default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (t) => ({
  orderOffersIdx: index('idx_offers_order_status').on(t.orderId, t.status),
  fulfillerOffersIdx: index('idx_offers_fulfiller_status').on(t.fulfillerId, t.status),
}));

// 6. Order Status History (Append-only timeline audit events)
export const orderStatusHistory = table('order_status_history', {
  id: text('id').primaryKey(), // Generated via crypto.randomUUID()
  orderId: text('order_id').notNull(),
  status: text('status').notNull(),
  actorId: text('actor_id'),
  note: text('note'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (t) => ({
  timelineIdx: index('idx_status_history_order').on(t.orderId, t.createdAt),
}));

// 7. Transactions (Immutable wallet & escrow financial audit ledger)
export const transactions = table('transactions', {
  id: text('id').primaryKey(), // Generated via crypto.randomUUID()
  userId: text('user_id').notNull(),
  counterpartyId: text('counterparty_id'),
  orderId: text('order_id'),
  type: text('type').notNull(),
  amount: real('amount').notNull(),
  reference: text('reference'),
  status: text('status').notNull().default('completed'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (t) => ({
  userHistoryIdx: index('idx_txns_user_created').on(t.userId, t.createdAt),
  referenceUidx: uniqueIndex('uidx_txns_reference').on(t.reference),
  orderTxnIdx: index('idx_txns_order_id').on(t.orderId),
}));

// 8. User Reviews (Courier ratings and feedback)
export const userReviews = table('user_reviews', {
  id: text('id').primaryKey(), // Generated via crypto.randomUUID()
  orderId: text('order_id').notNull(),
  reviewerId: text('reviewer_id').notNull(),
  revieweeId: text('reviewee_id').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (t) => ({
  revieweeIdx: index('idx_reviews_reviewee').on(t.revieweeId),
  ratingChk: check('chk_review_rating', sql`${t.rating} >= 1 AND ${t.rating} <= 5`),
}));
