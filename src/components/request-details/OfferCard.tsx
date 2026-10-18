import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
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

export function OfferCard({ offer, highlight, onAccept }: OfferCardProps) {
  const data = offer ?? {
    name: 'Lena Park',
    initials: 'LP',
    rating: 4.9,
    deliveries: 84,
    dorm: 'Hartley Hall 1A',
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
  const dorm = data.dorm ?? 'Hartley Hall 1A';
  const foodPrice = data.foodPrice ?? '12.80';
  const deliveryFee = data.deliveryFee ?? '3.00';
  const etaMinutes = data.etaMinutes ?? 12;
  const total = data.total ?? '15.80 DC';
  const note = data.note ?? 'Already at Union Square, can grab it right now.';
  const timeAgo = data.timeAgo ?? '3m ago';
  const tag = highlight ?? data.highlight;

  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start gap-3">
          <UserAvatar initials={initials} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate font-medium">{name}</p>
              {tag && (
                <Badge variant="outline" className="border-transparent bg-primary-soft text-primary font-medium">
                  {tag}
                </Badge>
              )}
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="size-3 fill-current text-foreground" aria-label="Rating" />
              <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
              <span>· {deliveries} deliveries · {dorm}</span>
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <dl className="grid grid-cols-3 divide-x rounded-lg border bg-background text-center">
          <Cell label="Food" value={String(foodPrice)} unit="DC" />
          <Cell label="Delivery" value={String(deliveryFee)} unit="DC" />
          <Cell label="Arrives in" value={String(etaMinutes)} unit="min" />
        </dl>

        {note && <p className="mt-3 text-sm text-muted-foreground">“{note}”</p>}
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3 p-4 pt-0">
        <div>
          <p className="text-xs text-muted-foreground">Total · offered {timeAgo}</p>
          <p className="font-mono text-lg font-semibold">{total}</p>
        </div>
        {onAccept && (
          <Button size="lg" onClick={onAccept} className="h-10 px-5">
            Accept offer
          </Button>
        )}
      </CardFooter>
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