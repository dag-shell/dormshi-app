// tgcloud/endpoints/orders_create.js
// Post a new delivery request on the campus board.
// Call as: Telegram.WebApp.Serverless.call('orders_create', ...)
import { db, EndpointError } from 'sdk';
import { eq } from 'sdk/db';
import { orders, campuses, vendors } from '../schema.js';
import { requireUser } from '../lib/auth.js';
import { serializeCreatedOrder } from '../lib/orders.js';

function requireNonEmptyString(value, field) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new EndpointError(`${field} is required and must be a non-empty string.`, {
      code: 'INVALID_INPUT',
      field,
    });
  }
  return value.trim();
}

export default async function (input = {}, ctx) {
  const user = await requireUser(ctx);

  const campusId = requireNonEmptyString(input.campusId, 'campusId');
  const pickupLocation = requireNonEmptyString(input.pickupLocation, 'pickupLocation');
  const destination = requireNonEmptyString(input.destination, 'destination');

  if (!Array.isArray(input.items) || input.items.length < 1) {
    throw new EndpointError('items must be a non-empty array.', {
      code: 'INVALID_ITEMS',
    });
  }

  const items = input.items.map((item, index) => {
    if (!item || typeof item.name !== 'string' || !item.name.trim()) {
      throw new EndpointError(`items[${index}].name is required.`, {
        code: 'INVALID_ITEMS',
        index,
      });
    }
    const quantity = Number(item.quantity);
    if (!Number.isFinite(quantity) || quantity < 1) {
      throw new EndpointError(`items[${index}].quantity must be >= 1.`, {
        code: 'INVALID_ITEMS',
        index,
      });
    }
    return { name: item.name.trim(), quantity: Math.floor(quantity) };
  });

  const campus = await db.select().from(campuses).where(eq(campuses.id, campusId)).get();
  if (!campus || !campus.isActive) {
    throw new EndpointError('Campus not found or inactive.', {
      code: 'CAMPUS_NOT_FOUND',
      campusId,
    });
  }

  let vendorId = null;
  if (input.vendorId !== undefined && input.vendorId !== null && input.vendorId !== '') {
    if (typeof input.vendorId !== 'string') {
      throw new EndpointError('vendorId must be a string.', { code: 'INVALID_VENDOR_ID' });
    }
    vendorId = input.vendorId.trim();
    const vendor = await db.select().from(vendors).where(eq(vendors.id, vendorId)).get();
    if (!vendor || !vendor.isActive) {
      throw new EndpointError('Vendor not found or inactive.', {
        code: 'VENDOR_NOT_FOUND',
        vendorId,
      });
    }
    if (vendor.campusId !== campusId) {
      throw new EndpointError('Vendor does not belong to the given campus.', {
        code: 'VENDOR_CAMPUS_MISMATCH',
        vendorId,
        campusId,
      });
    }
  }

  const instructions =
    typeof input.instructions === 'string' && input.instructions.trim()
      ? input.instructions.trim()
      : null;

  const id = crypto.randomUUID();
  const [created] = await db
    .insert(orders)
    .values({
      id,
      userId: user.id,
      campusId,
      vendorId,
      pickupLocation,
      destination,
      instructions,
      items,
      status: 'open',
    })
    .returning();

  return { result: serializeCreatedOrder(created) };
}
