import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faStar } from '@fortawesome/free-solid-svg-icons';
import { Card, CardHeader, CardContent} from '@/components/ui/card';
import { UserAvatar } from '@common/UserAvatar';

export interface OfferData {
  id?: string;
  name?: string;
  initials?: string;
  rating?: number;
  deliveries?: number;
  dorm?: string;
  foodPrice?: number | string;
  deliveryFee?: number | string;
  etaMinutes?: number | string;
  total?: string;
  note?: string;
  timeAgo?: string;
  highlight?: string;
  fulfillerId?: string;
  createdAt?: string;
}

interface OfferCardProps {
  offer?: OfferData;
  highlight?: string;
  onAccept?: () => void;
}

export function OfferCard({ offer }: OfferCardProps) {
  const data = offer ?? {
    name: 'Lena Park',
    initials: 'LP',
    rating: 4.9,
    deliveries: 84,
    foodPrice: '12.80',
    deliveryFee: '3.00',
    etaMinutes: 12,
    total: '15.80 DC',
    note: 'Already at Union Square, can grab it right now.',
    timeAgo: '3m ago'
  };

  const name = data.name ?? (data.fulfillerId === 'u_jordan' ? 'Jordan Reyes' : data.fulfillerId === 'u_dev' ? 'Dev Mehta' : 'Lena Park');
  const initials = data.initials ?? (data.fulfillerId === 'u_jordan' ? 'JR' : data.fulfillerId === 'u_dev' ? 'DM' : 'LP');
  const rating = data.rating ?? 4.9;
  const deliveries = data.deliveries ?? 84;
  const foodPrice = data.foodPrice ?? '12.80';
  const deliveryFee = data.deliveryFee ?? '3.00';
  const etaMinutes = data.etaMinutes ?? 12;


  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start gap-3">
          <UserAvatar initials={initials} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate font-medium">{name}</p>
              <FontAwesomeIcon icon={faChevronRight} className="size-3.5 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-foreground" />
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <FontAwesomeIcon icon={faStar} className="size-3 text-foreground" aria-label="Rating" />
              <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
              <span>· {deliveries} deliveries</span>
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <dl className="grid grid-cols-3 divide-x rounded-lg border bg-background text-center">
          <Cell label="Item Fee" value={String(foodPrice)} unit="DC" />
          <Cell label="Delivery Fee" value={String(deliveryFee)} unit="DC" />
          <Cell label="Arrives in" value={String(etaMinutes)} unit="min" />
        </dl>

      </CardContent>
    </Card>
  );
}

function Cell({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="px-2 py-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono text-sm font-medium">
        {value} <span className="text-xs text-muted-foreground">{unit}</span>
      </dd>
    </div>
  );
}