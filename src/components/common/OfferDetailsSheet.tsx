import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { BottomSheet } from '@common/BottomSheet';
import { UserAvatar } from '@common/UserAvatar';
import { Button } from '@/components/ui/button';

export interface OfferItemDetail {
  name: string;
  quantity: number;
  unitPrice?: number;
  price?: number;
  available?: boolean;
  note?: string;
}

export interface OfferDetailsData {
  id?: string;
  // Deliverer details (order owner view)
  name?: string;
  initials?: string;
  rating?: number;
  deliveries?: number;
  dorm?: string;
  // Requester details (offer owner view)
  requesterName?: string;
  requesterInitials?: string;
  destination?: string;
  pickup?: string;
  status?: string;
  // Common details
  food?: string;
  foodPrice?: number | string;
  deliveryFee?: number | string;
  etaMinutes?: number | string;
  note?: string;
  availableItems?: string;
  itemsAvailability?: OfferItemDetail[];
}

export interface OfferDetailsSheetProps {
  open: boolean;
  onClose: () => void;
  offer: OfferDetailsData | null;
  /**
   * 'order_owner': Viewing an offer received for your order (action: "Accept offer")
   * 'offer_owner': Viewing an offer you sent for someone else's order (actions: "Start delivery & track" / "Withdraw offer")
   */
  viewMode?: 'order_owner' | 'offer_owner';
  fallbackItems?: { name: string; quantity: number; price?: number }[];
  onAccept?: (offer: OfferDetailsData, totalToPay: number, items: OfferItemDetail[]) => void;
  onStartDelivery?: (offer: OfferDetailsData) => void;
  onWithdraw?: (offerId: string) => void;
}

export function OfferDetailsSheet({
  open,
  onClose,
  offer,
  viewMode = 'order_owner',
  fallbackItems = [],
  onAccept,
  onStartDelivery,
  onWithdraw
}: OfferDetailsSheetProps) {
  if (!offer) return null;

  const isOrderOwner = viewMode === 'order_owner';

  const isItemAvailable = (item: OfferItemDetail) => {
    if (item.available !== undefined) return item.available;
    const p = item.price ?? item.unitPrice;
    return typeof p === 'number' && p > 0;
  };

  const offerItems: OfferItemDetail[] =
    offer.itemsAvailability && offer.itemsAvailability.length > 0
      ? offer.itemsAvailability
      : fallbackItems.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          unitPrice: 50,
          price: 50 * i.quantity,
          available: true
        }));

  const availableCount = offerItems.filter(isItemAvailable).length;

  const foodCost =
    offerItems.reduce((sum, item) => {
      if (!isItemAvailable(item)) return sum;
      const cost = item.price ?? (item.unitPrice ? item.unitPrice * item.quantity : 0);
      return sum + cost;
    }, 0) || Number(offer.foodPrice || 0);

  const fee = Number(offer.deliveryFee || 0);
  const grandTotal = foodCost + fee;

  const sheetTitle = 'Offer details';

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={sheetTitle}
    >
      <div className="space-y-4">
        {/* Profile Snippet Card */}
        {isOrderOwner ? (
          /* Deliverer Profile (viewed by order owner) */
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
            <UserAvatar initials={offer.initials || 'MO'} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">{offer.name}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FontAwesomeIcon icon={faStar} className="size-3 text-foreground" />
                <span className="font-medium text-foreground">{offer.rating}</span>
                <span>· {offer.deliveries} deliveries</span>
              </p>
            </div>
          </div>
        ) : (
          /* Requester Profile (viewed by offer owner) */
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
            <UserAvatar initials={offer.requesterInitials || 'ST'} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">{offer.requesterName}</p>
              <p className="text-xs text-muted-foreground truncate">
                Deliver to {offer.destination}
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                offer.status === 'accepted'
                  ? 'bg-primary-soft text-primary'
                  : offer.status === 'completed'
                  ? 'bg-secondary text-muted-foreground'
                  : offer.status === 'withdrawn'
                  ? 'bg-muted text-muted-foreground'
                  : 'border border-border bg-card text-foreground'
              }`}
            >
              {offer.status === 'accepted'
                ? 'Accepted'
                : offer.status === 'completed'
                ? 'Delivered'
                : offer.status === 'withdrawn'
                ? 'Withdrawn'
                : 'Pending'}
            </span>
          </div>
        )}

        {/* Items & Cafe Prices Section */}
        <div className="rounded-lg border border-border bg-card p-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted-foreground">
              Items ({offerItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>
            {availableCount < offerItems.length && (
              <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-[11px] font-medium text-destructive">
                {offerItems.length - availableCount} out of stock
              </span>
            )}
          </div>

          <ul className="mt-2 divide-y divide-border/50 text-xs">
            {offerItems.map((item, idx) => {
              const available = isItemAvailable(item);
              const itemTotal = available
                ? (item.price ?? (item.unitPrice ? item.unitPrice * item.quantity : undefined))
                : undefined;
              const unitPrice = item.unitPrice ?? (item.price && item.quantity ? item.price / item.quantity : undefined);

              return (
                <li key={idx} className="py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">
                        {item.quantity}x {item.name}
                      </p>
                      {available && unitPrice !== undefined && (
                        <p className="text-[11px] text-muted-foreground">
                          ({unitPrice} ETB/item)
                        </p>
                      )}
                    </div>
                    <div>
                      {available ? (
                        <span className="font-mono text-xs font-semibold text-foreground">
                          {itemTotal !== undefined ? `ETB ${itemTotal.toFixed(2)}` : '---'}
                        </span>
                      ) : (
                        <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-[11px] font-medium text-destructive">
                          Out of stock
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Note from deliverer if any */}
        {offer.note && (
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">
              {isOrderOwner ? 'Note from deliverer' : 'Your note to requester'}
            </span>
            <p className="rounded-lg bg-secondary px-3 py-2 text-xs italic text-foreground">
              “{offer.note}”
            </p>
          </div>
        )}

        {/* Itemized Pricing & Delivery Fee */}
        <div className="space-y-2 rounded-lg border border-border bg-card p-3.5 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Food cost (from cafe)</span>
            <span className="font-mono font-medium text-foreground">
              ETB {foodCost.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery fee</span>
            <span className="font-mono font-medium text-foreground">
              ETB {fee.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Estimated arrival</span>
            <span className="font-mono font-medium text-foreground">
              ~{offer.etaMinutes} min
            </span>
          </div>
          <div className="flex justify-between border-t border-border/60 pt-2 text-sm font-semibold text-foreground">
            <span>{isOrderOwner ? 'Total to pay' : 'Total payout'}</span>
            <span className="font-mono font-bold text-primary">
              ETB {grandTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Escrow and Protection Terms */}
        <dl className="divide-y rounded-lg border border-border bg-secondary/30 text-xs">
          <div className="flex gap-3 px-3 py-2.5">
            <dt className="w-16 shrink-0 font-medium text-foreground">Escrow</dt>
            <dd className="text-muted-foreground">
              {isOrderOwner
                ? 'Held safely. Released only after you scan QR code at delivery.'
                : 'Held safely. Released to your balance once the requester scans your QR code at drop-off.'}
            </dd>
          </div>
          <div className="flex gap-3 px-3 py-2.5">
            <dt className="w-16 shrink-0 font-medium text-foreground">
              {isOrderOwner ? 'Refund' : 'Protection'}
            </dt>
            <dd className="text-muted-foreground">
              {isOrderOwner
                ? 'Full instant refund if cancelled before store pickup.'
                : 'Guaranteed payout for verified cafe receipts if the requester is unresponsive at delivery.'}
            </dd>
          </div>
        </dl>

        {/* Action Buttons based on view perspective */}
        {isOrderOwner ? (
          <Button
            size="lg"
            className="h-11 w-full rounded-full text-sm font-semibold"
            onClick={() => onAccept?.(offer, grandTotal, offerItems)}
          >
            Accept offer
          </Button>
        ) : (
          <div className="flex flex-col gap-2 pt-1">
            {offer.status === 'accepted' && (
              <Button
                size="lg"
                className="h-11 w-full rounded-full text-sm font-semibold"
                onClick={() => onStartDelivery?.(offer)}
              >
                Start delivery & track
              </Button>
            )}

            {offer.status === 'pending' && (
              <Button
                size="lg"
                variant="outline"
                className="h-11 w-full rounded-full text-sm font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onWithdraw?.(offer.id || '')}
              >
                Withdraw offer
              </Button>
            )}

            <Button
              variant="ghost"
              className="h-10 w-full rounded-full text-xs text-muted-foreground"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
