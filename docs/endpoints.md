# Telegram Serverless Functions Specification — Dormshi

This document defines the serverless functions contract for **Dormshi**, executed on Telegram's serverless isolate platform (`tgcloud`) and called from the Telegram Mini App via `Telegram.WebApp.Serverless.call('<name>', input, cb)`.

---

## 1. Function Architecture & Lifecycle Sequence

### Flat Module Naming: `{resource}.{function}.js`
All serverless functions live directly in the flat `tgcloud/endpoints/` directory and follow the **`{resource}.{function}.js`** convention. They are ordered below in the natural **chronological lifecycle** of a user session: from profile authentication and campus discovery, through order placement, courier bidding, delivery fulfillment, post-order review, and wallet management.

| Lifecycle Phase | Function Module (`tgcloud/endpoints/`) | Telegram Function Name | Client Action |
| :--- | :--- | :--- | :--- |
| **1. Identity & Setup** | `users.me.js` | `'users.me'` | Profile bootstrap, auto-registration & stats |
| | `users.update.js` | `'users.update'` | Update phone number, name, or campus branch |
| **2. Discovery & Vendors** | `campuses.list.js` | `'campuses.list'` | List / search active university campus branches |
| | `vendors.list.js` | `'vendors.list'` | List registered dining spots for user's campus |
| | `foods.categories.js` | `'foods.categories'` | List static categorized food & drink items |
| **3. Orders Placement** | `orders.feed.js` | `'orders.feed'` | List open campus orders |
| | `orders.create.js` | `'orders.create'` | Create a new food delivery order |
| | `orders.my.js` | `'orders.my'` | List caller's placed orders (`WHERE user_id = :userId`) |
| | `orders.get.js` | `'orders.get'` | Get single order details, items & offers |
| | `orders.cancel.js` | `'orders.cancel'` | Cancel an order and release hold |
| **4. Offers & Delivery** | `offers.create.js` | `'offers.create'` | Courier submits a price/ETA quote on an open order |
| | `offers.my.js` | `'offers.my'` | List caller's courier offers & jobs (`WHERE fulfiller_id = :userId`) |
| | `offers.cancel.js` | `'offers.cancel'` | Withdraw a pending offer before acceptance |
| | `offers.accept.js` | `'offers.accept'` | Requester accepts offer & locks escrow |
| | `orders.updateStatus.js` | `'orders.updateStatus'` | Courier updates progress (`picked_up`, `delivered`) |
| | `orders.confirm.js` | `'orders.confirm'` | Requester confirms delivery, releases escrow & rates courier |
| | `orders.dispute.js` | `'orders.dispute'` | Report issue / dispute order |
| **5. Ratings & Feedback** | `reviews.list.js` | `'reviews.list'` | List ratings and reviews received by a courier with pagination |
| **6. Wallet & Ledger** | `wallet.get.js` | `'wallet.get'` | Fetch balances (`main_balance`, `reward_balance`, `escrow_balance`) |
| | `wallet.transactions.js` | `'wallet.transactions'` | Fetch financial audit ledger |
| | `wallet.transfer.js` | `'wallet.transfer'` | Peer-to-peer balance transfer between students |
| | `wallet.deposit.js` | `'wallet.deposit'` | Submit CBE transaction ID to verify & credit wallet |

---

## 2. Platform Conventions & Standards

### 2.1. Authentication (`ctx.initData`)
Every serverless function receives the caller's verified Telegram init data in `ctx.initData`:
- `ctx.initData.user.id`: Verified numeric Telegram User ID.
- `ctx.initData.user.first_name`, `username`: Verified Telegram user data.
- Unauthenticated or forged requests are rejected by the platform with `401 Unauthorized` before reaching your code.

### 2.2. Error Handling (`EndpointError`)
Functions reject invalid operations by throwing `EndpointError` from `'sdk'`:
```javascript
import { EndpointError } from 'sdk';

throw new EndpointError('Insufficient wallet balance to accept this offer.', {
  code: 'INSUFFICIENT_FUNDS',
  required: totalAmount,
  available: user.mainBalance
});
```

### 2.3. Standard Pagination Contract
All multi-item list endpoints follow standard page-based pagination:

**Request Query Inputs**:
- `page` (`number`, optional, default: `1`): 1-based page index.
- `limit` (`number`, optional, default: `20`, max: `50`): Number of items per page.
- In DB queries: `offset = (page - 1) * limit`.

**Response Meta Structure**:
```json
{
  "results": [ /* array of records */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasMore": true
  }
}
```

### 2.4. ID Generation (`crypto.randomUUID()`)
To prevent sequential ID guessing and volume enumeration attacks, all resources use UUID v4 strings generated server-side using the Web Crypto API built into the isolate:
```javascript
const id = crypto.randomUUID(); // e.g. "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
```
Sequential auto-increment integer IDs (`1, 2, 3...`) are strictly prohibited to maintain platform privacy and security.

---

## 3. Function Specifications (Chronological Order)

### 3.1. Identity & Campus Discovery (`users.*`, `campuses.*`, `vendors.*`)

#### `users.me.js`
Profile bootstrap called when opening the Mini App. Auto-registers the user if it is their first time.

- **Function Name**: `'users.me'`
- **Caller**: Authenticated user on initial launch.
- **Input**: `{}`
- **Output**:
  ```json
  {
    "result": {
      "id": "01928a34-2e91-7f82-a392-cf90c102a111",
      "tgId": 12345678,
      "name": "Maya Okafor",
      "phone": "+251912345678",
      "campusId": "01928a34-1111-7f82-a392-cf90c102a111",
      "isAmbassador": false,
      "mainBalance": 240.0,
      "rewardBalance": 0.0,
      "escrowBalance": 0.0,
      "rating": 4.9,
      "deliveriesCount": 23,
      "ordersCount": 8
    }
  }
  ```

---

#### `users.update.js`
Update profile details (phone, name, or campus branch).

- **Function Name**: `'users.update'`
- **Caller**: Authenticated user updating settings or completing onboarding.
- **Input**:
  ```json
  {
    "phone": "+251912345678",
    "campusId": "01928a34-1111-7f82-a392-cf90c102a222"
  }
  ```
- **Output**:
  ```json
  {
    "result": {
      "id": "01928a34-2e91-7f82-a392-cf90c102a111",
      "phone": "+251912345678",
      "campusId": "01928a34-1111-7f82-a392-cf90c102a222",
      "updatedAt": 1729491000
    }
  }
  ```

---

#### `campuses.list.js`
List and search active university campus branches for onboarding and campus switching.

- **Function Name**: `'campuses.list'`
- **Caller**: Any student browsing or searching campuses.
- **Input**:
  ```json
  {
    "query": "IoT" // optional case-insensitive search term matching name, title, univCode, or univName
  }
  ```
- **Filter**:
  - If `query` is provided: `WHERE (name LIKE :q OR title LIKE :q OR univ_code LIKE :q OR univ_name LIKE :q) AND is_active = 1`
  - If omitted: returns all active campuses.
- **Output**:
  ```json
  {
    "results": [
      { "id": "01928a34-1111-7f82-a392-cf90c102a111", "name": "Main", "title": "Main Campus", "univCode": "HRU", "univName": "Haramaya University" },
      { "id": "01928a34-1111-7f82-a392-cf90c102a222", "name": "IoT", "title": "Institute of Technology (IoT)", "univCode": "HRU", "univName": "Haramaya University" }
    ],
    "total": 2
  }
  ```

---

#### `vendors.list.js`
List registered campus dining spots and cafes for the student's campus with pagination.

- **Function Name**: `'vendors.list'`
- **Caller**: Student browsing dining spots to order from.
- **Input**:
  ```json
  {
    "campusId": "01928a34-1111-7f82-a392-cf90c102a111",
    "page": 1,
    "limit": 20
  }
  ```
- **Output**:
  ```json
  {
    "results": [
      { "id": "01928a34-3333-7f82-a392-cf90c102a111", "campusId": "01928a34-1111-7f82-a392-cf90c102a111", "name": "Tea Lab", "locationName": "Union Square", "category": "cafe" }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 6,
      "totalPages": 1,
      "hasMore": false
    }
  }
  ```

---

#### `foods.categories.js`
Fetch static categorized campus food and drink items for quick order creation (in-memory static catalog, no database table needed).

- **Function Name**: `'foods.categories'`
- **Caller**: Student composing a new food delivery order.
- **Input**: `{}`
- **Output**:
  ```json
  {
    "results": {
      "drinks": [
        "Milk Tea with Boba",
        "Iced Oat Latte",
        "Mango Smoothie",
        "Espresso",
        "Fresh Orange Juice"
      ],
      "meals": [
        "Chicken Shawarma Wrap",
        "Spicy Miso Ramen",
        "Burrito Bowl with Chicken",
        "Veggie Poke Bowl",
        "Pepperoni Pizza Slice"
      ],
      "snacks": [
        "Garlic Fries",
        "Everything Bagel with Cream Cheese",
        "Blueberry Muffin",
        "Samosa",
        "Croissant"
      ]
    }
  }
  ```

---

### 3.2. Order Placement & Requester Feed (`orders.*`)

#### `orders.feed.js`
Fetch open delivery requests posted in the user's active campus with pagination.

- **Function Name**: `'orders.feed'`
- **Caller**: Any student browsing open requests to fulfill.
- **Input**:
  ```json
  {
    "campusId": "01928a34-1111-7f82-a392-cf90c102a111",
    "status": "open",
    "page": 1,
    "limit": 20
  }
  ```
- **Output**:
  ```json
  {
    "results": [
      {
        "id": "01928a34-7001-7f82-a392-cf90c102a111",
        "userId": "01928a34-2e91-7f82-a392-cf90c102a111",
        "campusId": "01928a34-1111-7f82-a392-cf90c102a111",
        "pickupLocation": "Tea Lab, Union Square",
        "destination": "Hartley Hall, 3rd floor",
        "items": [{ "name": "Taro milk tea", "quantity": 2 }],
        "status": "open",
        "createdAt": 1729489200
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasMore": true
    }
  }
  ```

---

#### `orders.create.js`
Post a new delivery request on the campus board.

- **Function Name**: `'orders.create'`
- **Caller**: Authenticated student placing a food delivery request.
- **Input**:
  ```json
  {
    "campusId": "01928a34-1111-7f82-a392-cf90c102a111",
    "vendorId": "01928a34-3333-7f82-a392-cf90c102a111",
    "pickupLocation": "Tea Lab, Union Square",
    "destination": "Hartley Hall, Room 304",
    "instructions": "Call when downstairs",
    "items": [
      { "name": "Taro milk tea", "quantity": 2 }
    ]
  }
  ```
- **Validation**:
  - `items` array must contain at least 1 item.
  - `destination` and `pickupLocation` must not be blank.
- **Output**:
  ```json
  {
    "result": {
      "id": "01928a34-7001-7f82-a392-cf90c102a111",
      "userId": "01928a34-2e91-7f82-a392-cf90c102a111",
      "campusId": "01928a34-1111-7f82-a392-cf90c102a111",
      "vendorId": "01928a34-3333-7f82-a392-cf90c102a111",
      "pickupLocation": "Tea Lab, Union Square",
      "destination": "Hartley Hall, Room 304",
      "instructions": "Call when downstairs",
      "items": [{ "name": "Taro milk tea", "quantity": 2 }],
      "status": "open",
      "createdAt": 1729489200
    }
  }
  ```

---

#### `orders.my.js`
List food delivery requests placed by the caller (`WHERE user_id = :userId`) with pagination.

- **Function Name**: `'orders.my'`
- **Caller**: Authenticated user (ordering student).
- **Input**:
  ```json
  {
    "status": "open", // optional: 'open', 'accepted', 'completed', 'cancelled', or omit for all
    "page": 1,
    "limit": 20
  }
  ```
- **Output**:
  ```json
  {
    "results": [
      {
        "id": "01928a34-7001-7f82-a392-cf90c102a111",
        "userId": "01928a34-2e91-7f82-a392-cf90c102a111",
        "campusId": "01928a34-1111-7f82-a392-cf90c102a111",
        "pickupLocation": "Tea Lab, Union Square",
        "destination": "Hartley Hall, 3rd floor lounge",
        "items": [{ "name": "Taro milk tea", "quantity": 2 }],
        "status": "open",
        "agreedItemsPrice": null,
        "agreedDeliveryFee": null,
        "acceptedOfferId": null,
        "fulfillerId": null,
        "createdAt": 1729489200
      },
      {
        "id": "01928a34-7002-7f82-a392-cf90c102a222",
        "userId": "01928a34-2e91-7f82-a392-cf90c102a111",
        "campusId": "01928a34-1111-7f82-a392-cf90c102a111",
        "pickupLocation": "Chipotle, Main St",
        "destination": "Hartley Hall 3B",
        "items": [{ "name": "Burrito bowl", "quantity": 1 }],
        "status": "completed",
        "agreedItemsPrice": 120.0,
        "agreedDeliveryFee": 30.0,
        "acceptedOfferId": "01928a34-8002-7f82-a392-cf90c102a222",
        "fulfillerId": "01928a34-2e92-7f82-a392-cf90c102a222",
        "createdAt": 1729400000
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 12,
      "totalPages": 1,
      "hasMore": false
    }
  }
  ```

---

#### `orders.get.js`
Retrieve full order details, line items, accepted contract terms, and all received courier offers.

- **Function Name**: `'orders.get'`
- **Input**:
  ```json
  {
    "orderId": "01928a34-7001-7f82-a392-cf90c102a111"
  }
  ```
- **Output**:
  ```json
  {
    "result": {
      "order": {
        "id": "01928a34-7001-7f82-a392-cf90c102a111",
        "userId": "01928a34-2e91-7f82-a392-cf90c102a111",
        "userName": "Maya Okafor",
        "campusId": "01928a34-1111-7f82-a392-cf90c102a111",
        "pickupLocation": "Tea Lab, Union Square",
        "destination": "Hartley Hall, 3rd floor",
        "instructions": "Less ice on both please.",
        "items": [{ "name": "Taro milk tea", "quantity": 2 }],
        "status": "open",
        "agreedItemsPrice": null,
        "agreedDeliveryFee": null,
        "agreedEtaMinutes": null,
        "fulfillerId": null,
        "createdAt": 1729489200
      },
      "offers": [
        {
          "id": "01928a34-8001-7f82-a392-cf90c102a111",
          "orderId": "01928a34-7001-7f82-a392-cf90c102a111",
          "fulfillerId": "01928a34-2e92-7f82-a392-cf90c102a222",
          "fulfillerName": "Sam Courier",
          "itemsPrice": 100.0,
          "deliveryFee": 30.0,
          "totalAmount": 130.0,
          "etaMinutes": 15,
          "note": "Already waiting in line",
          "items": [{ "name": "Taro milk tea", "quantity": 2, "unitPrice": 50, "isAvailable": true }],
          "status": "pending",
          "createdAt": 1729489500
        }
      ]
    }
  }
  ```

---

#### `orders.cancel.js`
Cancel an order. If an agreement was locked and funds held in escrow, the escrow hold is automatically refunded to the customer's `main_balance`.

- **Function Name**: `'orders.cancel'`
- **Caller**: Order owner or fulfiller.
- **Input**:
  ```json
  {
    "orderId": "01928a34-7001-7f82-a392-cf90c102a111",
    "reason": "Found food elsewhere"
  }
  ```
- **DB Mutations**:
  - Sets `orders.status = 'cancelled'`, `orders.cancel_reason = reason`.
  - If `orders.escrow_txn_id` exists:
    - `users.escrow_balance -= totalAmount`
    - `users.main_balance += totalAmount`
    - Insert transaction: `type = 'refund'`, `amount = totalAmount`.
- **Output**:
  ```json
  {
    "result": {
      "id": "01928a34-7001-7f82-a392-cf90c102a111",
      "status": "cancelled",
      "cancelReason": "Found food elsewhere",
      "updatedAt": 1729489800
    }
  }
  ```

---

### 3.3. Offers & Delivery Fulfillment Lifecycle (`offers.*`, `orders.*`)

#### `offers.create.js`
Student courier submits a price and ETA quote on an open order.

- **Function Name**: `'offers.create'`
- **Caller**: Any student other than the order creator.
- **Input**:
  ```json
  {
    "orderId": "01928a34-7001-7f82-a392-cf90c102a111",
    "itemsPrice": 100.0,
    "deliveryFee": 35.0,
    "etaMinutes": 15,
    "note": "Already near the counter",
    "items": [
      { "name": "Taro milk tea", "quantity": 2, "unitPrice": 50.0 }
    ]
  }
  ```
- **Validation**:
  - Courier cannot bid on their own order (`orders.user_id !== caller.id`).
  - Order must be in `'open'` status.
  - `deliveryFee >= 0` and `itemsPrice > 0`.
- **Output**:
  ```json
  {
    "result": {
      "id": "01928a34-8001-7f82-a392-cf90c102a111",
      "orderId": "01928a34-7001-7f82-a392-cf90c102a111",
      "fulfillerId": "01928a34-2e92-7f82-a392-cf90c102a222",
      "itemsPrice": 100.0,
      "deliveryFee": 35.0,
      "etaMinutes": 15,
      "note": "Already near the counter",
      "items": [{ "name": "Taro milk tea", "quantity": 2, "unitPrice": 50.0 }],
      "status": "pending",
      "createdAt": 1729489500
    }
  }
  ```

---

#### `offers.my.js`
List all courier offers submitted by the caller (`WHERE fulfiller_id = :userId`) with pagination.

- **Function Name**: `'offers.my'`
- **Caller**: Authenticated user (student courier).
- **Input**:
  ```json
  {
    "status": "pending", // optional filter: 'pending', 'accepted', 'rejected', or omit for all
    "page": 1,
    "limit": 20
  }
  ```
- **Output**:
  ```json
  {
    "results": [
      {
        "id": "01928a34-8001-7f82-a392-cf90c102a111",
        "orderId": "01928a34-7001-7f82-a392-cf90c102a111",
        "fulfillerId": "01928a34-2e92-7f82-a392-cf90c102a222",
        "itemsPrice": 100.0,
        "deliveryFee": 35.0,
        "etaMinutes": 15,
        "note": "Waiting in line",
        "items": [{ "name": "Taro milk tea", "quantity": 2, "unitPrice": 50.0 }],
        "status": "pending",
        "createdAt": 1729489500,
        "updatedAt": 1729489500
      },
      {
        "id": "01928a34-8002-7f82-a392-cf90c102a222",
        "orderId": "01928a34-7002-7f82-a392-cf90c102a222",
        "fulfillerId": "01928a34-2e92-7f82-a392-cf90c102a222",
        "itemsPrice": 100.0,
        "deliveryFee": 40.0,
        "etaMinutes": 15,
        "note": null,
        "items": [{ "name": "Chicken shawarma", "quantity": 1, "unitPrice": 100.0 }],
        "status": "accepted",
        "createdAt": 1729488000,
        "updatedAt": 1729488200
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 8,
      "totalPages": 1,
      "hasMore": false
    }
  }
  ```

---

#### `offers.cancel.js`
Courier withdraws a pending bid before it is accepted.

- **Function Name**: `'offers.cancel'`
- **Caller**: Offer owner (`fulfiller_id`).
- **Input**:
  ```json
  {
    "offerId": "01928a34-8001-7f82-a392-cf90c102a111"
  }
  ```
- **Output**:
  ```json
  {
    "result": {
      "id": "01928a34-8001-7f82-a392-cf90c102a111",
      "status": "cancelled",
      "updatedAt": 1729489700
    }
  }
  ```

---

#### `offers.accept.js`
Customer accepts a bid, locking agreement terms and placing an escrow hold.

- **Function Name**: `'offers.accept'`
- **Caller**: Order creator (`orders.user_id`).
- **Input**:
  ```json
  {
    "orderId": "01928a34-7001-7f82-a392-cf90c102a111",
    "offerId": "01928a34-8001-7f82-a392-cf90c102a111"
  }
  ```
- **Atomic Escrow & Lock Flow**:
  1. Check order `status === 'open'`.
  2. `total = offer.items_price + offer.delivery_fee`.
  3. Verify `customer.main_balance >= total`. (If not, throw `INSUFFICIENT_FUNDS`).
  4. Deduct `customer.main_balance -= total`, increment `customer.escrow_balance += total`.
  5. Insert ledger record: `type = 'reserved'`, `amount = total`, `order_id = "01928a34-7001-7f82-a392-cf90c102a111"`.
  6. Lock terms onto `orders`:
     ```javascript
     accepted_offer_id: offer.id,
     fulfiller_id: offer.fulfiller_id,
     agreed_items_price: offer.items_price,
     agreed_delivery_fee: offer.delivery_fee,
     agreed_eta_minutes: offer.eta_minutes,
     escrow_txn_id: txn.id,
     accepted_at: now,
     status: 'accepted'
     ```
  7. Mark accepted offer as `'accepted'`; set other pending offers for this order to `'rejected'`.
- **Output**:
  ```json
  {
    "result": {
      "id": "01928a34-7001-7f82-a392-cf90c102a111",
      "status": "accepted",
      "acceptedOfferId": "01928a34-8001-7f82-a392-cf90c102a111",
      "fulfillerId": "01928a34-2e92-7f82-a392-cf90c102a222",
      "agreedItemsPrice": 100.0,
      "agreedDeliveryFee": 35.0,
      "agreedEtaMinutes": 15,
      "escrowTxnId": "01928a34-6001-7f82-a392-cf90c102a111",
      "acceptedAt": 1729489600
    }
  }
  ```

---

#### `orders.updateStatus.js`
Student courier advances the order delivery progression.

- **Function Name**: `'orders.updateStatus'`
- **Caller**: Only the accepted `fulfiller_id`.
- **Allowed Transitions**:
  - `accepted` → `getting_food`
  - `getting_food` → `picked_up`
  - `picked_up` → `on_the_way`
  - `on_the_way` → `delivered`
- **Input**:
  ```json
  {
    "orderId": "01928a34-7001-7f82-a392-cf90c102a111",
    "status": "picked_up",
    "note": "Food collected, walking to dorm"
  }
  ```
- **Output**:
  ```json
  {
    "result": {
      "id": "01928a34-7001-7f82-a392-cf90c102a111",
      "status": "picked_up",
      "updatedAt": 1729490100
    }
  }
  ```

---

#### `orders.confirm.js`
Requester confirms delivery receipt. In an atomic transaction, releases locked escrow into courier's `main_balance`, records the courier rating/review, and finalizes the order.

- **Function Name**: `'orders.confirm'`
- **Caller**: Requester (`orders.user_id`).
- **Condition**: Order must be in `delivered` or `on_the_way` status.
- **Input**:
  ```json
  {
    "orderId": "01928a34-7001-7f82-a392-cf90c102a111",
    "rating": 5, // integer 1–5 stars (required)
    "comment": "Fast and friendly delivery!" // optional review note
  }
  ```
- **Validation**:
  - `rating >= 1 AND rating <= 5`.
  - Order must belong to caller.
- **Escrow Settlement & Rating Logic**:
  1. `totalAmount = order.agreed_items_price + order.agreed_delivery_fee`
  2. Customer: `escrow_balance -= totalAmount`
  3. Courier: `main_balance += totalAmount`
  4. Insert Customer Txn: `type = 'purchased'`, `amount = totalAmount`.
  5. Insert Courier Txn: `type = 'earned'`, `amount = totalAmount`.
  6. Insert Review into `user_reviews`: `reviewer_id = customer.id`, `reviewee_id = order.fulfiller_id`, `rating`, `comment`.
  7. Update Order: `status = 'completed'`.
  8. Update Cached Stats on `users`:
     - Customer: `orders_count += 1`
     - Courier: `deliveries_count += 1`, recalculate cached `rating`.
- **Output**:
  ```json
  {
    "result": {
      "id": "01928a34-7001-7f82-a392-cf90c102a111",
      "status": "completed",
      "reviewId": "01928a34-9901-7f82-a392-cf90c102a111",
      "rating": 5,
      "updatedAt": 1729490500
    }
  }
  ```

---

#### `orders.dispute.js`
Raise an issue regarding delivery or order terms.

- **Function Name**: `'orders.dispute'`
- **Caller**: Customer (`user_id`) or Courier (`fulfiller_id`).
- **Input**:
  ```json
  {
    "orderId": "01928a34-7001-7f82-a392-cf90c102a111",
    "reason": "Courier never showed up with the food"
  }
  ```
- **Output**:
  ```json
  {
    "result": {
      "id": "01928a34-7001-7f82-a392-cf90c102a111",
      "status": "disputed",
      "disputeReason": "Courier never showed up with the food",
      "updatedAt": 1729490600
    }
  }
  ```

---

### 3.4. Order Feedback & Ratings (`reviews.*`)

#### `reviews.list.js`
List feedback reviews and ratings received by a student courier with pagination.

- **Function Name**: `'reviews.list'`
- **Caller**: Any student viewing courier ratings or profile.
- **Input**:
  ```json
  {
    "userId": "01928a34-2e92-7f82-a392-cf90c102a222",
    "page": 1,
    "limit": 20
  }
  ```
- **Output**:
  ```json
  {
    "results": [
      {
        "id": "01928a34-9901-7f82-a392-cf90c102a111",
        "orderId": "01928a34-7001-7f82-a392-cf90c102a111",
        "reviewerId": "01928a34-2e91-7f82-a392-cf90c102a111",
        "reviewerName": "Maya Okafor",
        "rating": 5,
        "comment": "Fast and friendly delivery!",
        "createdAt": 1729491200
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 14,
      "totalPages": 1,
      "hasMore": false
    }
  }
  ```

---

### 3.5. Wallet & Financial Ledger (`wallet.*`)

#### `wallet.get.js`
Retrieve caller's wallet balances.

- **Function Name**: `'wallet.get'`
- **Caller**: Authenticated user.
- **Input**: `{}`
- **Output**:
  ```json
  {
    "mainBalance": 240.0,
    "rewardBalance": 15.0,
    "escrowBalance": 135.0
  }
  ```

---

#### `wallet.transactions.js`
List immutable financial audit transactions for the calling user with pagination.

- **Function Name**: `'wallet.transactions'`
- **Caller**: Authenticated user.
- **Input**:
  ```json
  {
    "type": "deposit", // optional filter: 'deposit', 'withdrawal', 'purchased', 'earned', 'refund', 'transfer', or omit for all
    "page": 1,
    "limit": 20
  }
  ```
- **Output**:
  ```json
  {
    "results": [
      {
        "id": "01928a34-6012-7f82-a392-cf90c102a111",
        "userId": "01928a34-2e91-7f82-a392-cf90c102a111",
        "type": "purchased",
        "amount": 135.0,
        "orderId": "01928a34-7001-7f82-a392-cf90c102a111",
        "reference": null,
        "status": "completed",
        "createdAt": 1729489600
      },
      {
        "id": "01928a34-6013-7f82-a392-cf90c102a222",
        "userId": "01928a34-2e91-7f82-a392-cf90c102a111",
        "type": "deposit",
        "amount": 500.0,
        "orderId": null,
        "reference": "FT2429402941",
        "status": "completed",
        "createdAt": 1729400000
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 38,
      "totalPages": 2,
      "hasMore": true
    }
  }
  ```

---

#### `wallet.transfer.js`
Direct peer-to-peer balance transfer to another student using their Telegram ID or username.

- **Function Name**: `'wallet.transfer'`
- **Caller**: Authenticated user with positive balance.
- **Input**:
  ```json
  {
    "recipientTgId": 987654321,
    "amount": 50.0
  }
  ```
- **Validation**:
  - `amount > 0`
  - Sender has `main_balance >= amount`.
  - Recipient exists.
- **Execution**:
  - Sender: `main_balance -= amount`.
  - Recipient: `main_balance += amount`.
  - Create transaction records (`type = 'transfer'`).

---

#### `wallet.deposit.js`
Submit a Commercial Bank of Ethiopia (CBE) transaction reference ID to deposit funds. The serverless function verifies the transaction with CBE to resolve and extract the exact deposited amount; the client **never** passes the amount.

- **Function Name**: `'wallet.deposit'`
- **Caller**: Authenticated user funding their wallet.
- **Input**:
  ```json
  {
    "txnId": "FT2429402941"
  }
  ```
- **Verification & Settlement Flow**:
  1. Validates that `txnId` is non-empty and matches the expected CBE reference format.
  2. Checks `transactions` table to ensure `txnId` (`reference`) has not already been credited (enforced by `uidx_txns_reference`).
  3. Verifies `txnId` via the CBE verification service / statement lookup to retrieve the exact verified transfer amount. If invalid or not credited, throws `INVALID_TRANSACTION`.
  4. Atomically credits the user: `users.main_balance += verifiedAmount`.
  5. Inserts an immutable transaction record into `transactions`:
     - `userId = caller.id`
     - `type = 'deposit'`
     - `amount = verifiedAmount`
     - `reference = txnId`
     - `status = 'completed'`
- **Output**:
  ```json
  {
    "result": {
      "transactionId": "01928a34-6014-7f82-a392-cf90c102a333",
      "txnId": "FT2429402941",
      "amount": 250.0,
      "mainBalance": 490.0,
      "status": "completed",
      "createdAt": 1729491500
    }
  }
  ```

---

## 4. Frontend Client Wrapper (`src/lib/api.ts`)

In the Mini App frontend, call functions directly using the official Telegram Serverless SDK:

```typescript
// src/lib/api.ts
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        Serverless?: {
          call: (
            functionName: string,
            input: any,
            callback: (err: any, result: any) => void
          ) => void;
        };
      };
    };
  }
}

export async function callFunction<T = any>(functionName: string, input: Record<string, any> = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    const serverless = window.Telegram?.WebApp?.Serverless;
    if (!serverless) {
      reject(new Error('Telegram Serverless SDK not available'));
      return;
    }

    serverless.call(functionName, input, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result as T);
      }
    });
  });
}
```

### Usage Examples (Chronological User Journey):
```typescript
// 1. App Launch: Bootstrap user profile & active campus
const { result: currentUser } = await callFunction('users.me');

// 2. Discovery: Get dining vendors for current campus
const { results: vendors } = await callFunction('vendors.list', {
  campusId: currentUser.campusId,
  page: 1,
  limit: 20
});

// 2b. Food Catalog: Fetch categorized food and drink choices for order composition
const { results: foodCatalog } = await callFunction('foods.categories');
// Returns { drinks: [...], meals: [...], snacks: [...] }

// 3. Browse Open Delivery Feed:
const { results: openOrders, pagination } = await callFunction('orders.feed', {
  campusId: currentUser.campusId,
  page: 1,
  limit: 20
});

// 4. Place a Food Delivery Order:
const { result: newOrder } = await callFunction('orders.create', {
  campusId: currentUser.campusId,
  vendorId: vendors[0].id,
  pickupLocation: 'Tea Lab',
  destination: 'Hartley Hall 304',
  items: [{ name: 'Taro milk tea', quantity: 2 }]
});

// 5. Courier Submits an Offer on an Order:
const { result: newOffer } = await callFunction('offers.create', {
  orderId: newOrder.id,
  itemsPrice: 100.0,
  deliveryFee: 35.0,
  etaMinutes: 15,
  items: [{ name: 'Taro milk tea', quantity: 2, unitPrice: 50.0 }]
});

// 6. Requester Accepts the Offer (Locks Escrow):
await callFunction('offers.accept', {
  orderId: newOrder.id,
  offerId: newOffer.id
});

// 7. Courier Advances Delivery Progression:
await callFunction('orders.updateStatus', {
  orderId: newOrder.id,
  status: 'picked_up',
  note: 'Food collected, walking to dorm'
});

// 8. Requester Confirms Receipt & Rates Courier (Releases Escrow):
await callFunction('orders.confirm', {
  orderId: newOrder.id,
  rating: 5,
  comment: 'Super fast delivery!'
});

// 9. List Courier's Received Reviews:
const { results: reviews, pagination } = await callFunction('reviews.list', {
  userId: newOffer.fulfillerId,
  page: 1,
  limit: 20
});

// 10. Deposit Funds via CBE:
const { result: depositResult } = await callFunction('wallet.deposit', {
  txnId: 'FT2429402941'
});
// Amount is extracted by backend from CBE using txnId:
console.log('Credited balance:', depositResult.amount, depositResult.mainBalance);
```
