import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Label } from '../components/Label';
import { Textarea } from '../components/Textarea';
import { PageHeader } from '../components/PageHeader';
import { MultiSelect } from '../components/MultiSelect';
import { SingleSelect } from '../components/SingleSelect';
import { foodOptions } from '../data/foodMenu';
import { restaurantOptions } from '../data/restaurants';
import { useDormshi } from '../contexts/DormshiContext';
import { formatDC } from '../utils/format';
import { delay } from '../utils/time';

const howItWorks = [
{ title: 'Request', body: 'Post what you want, where from, and where to.' },
{ title: 'Offer', body: 'Nearby students reply with price, fee, and ETA.' },
{ title: 'Agree', body: 'You pick an offer. Terms lock and DC is reserved.' },
{ title: 'Fulfill', body: 'They get your food and update the status.' },
{ title: 'Receive', body: 'Scan their QR code when it arrives.' },
{ title: 'Settle', body: 'DC is released only after verified delivery.' }];


export function CreateRequest() {
  const navigate = useNavigate();
  const { createRequest, currentUser, wallet } = useDormshi();
  const fileRef = useRef<HTMLInputElement>(null);
  const [food, setFood] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image must be under 8 MB.');
      return;
    }
    setImageUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (food.length === 0) next.food = 'Pick at least one item';
    if (!pickup) next.pickup = 'Pick a restaurant';
    if (!destination.trim()) next.destination = 'Where should it be delivered?';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitting(true);
    await delay(700);
    const id = createRequest({
      food: food.map((item) => (quantities[item] ?? 1) > 1 ? `${quantities[item]}× ${item}` : item).join(', '),
      pickup: pickup.trim(),
      destination: destination.trim(),
      instructions: instructions.trim() || undefined,
      imageUrl,
      paymentMethod: 'dc_wallet'
    });
    toast.success('Request posted', { description: 'Nearby students can now send you offers.' });
    navigate(`/requests/${id}`, { replace: true });
  };

  return (
    <div>
      <PageHeader title="New request" backTo="/" />
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-10 lg:px-10 lg:py-8">
        <form onSubmit={onSubmit} noValidate className="space-y-6 lg:rounded-xl lg:border lg:bg-card lg:p-8">
          <Field id="food" label="What do you want?" error={errors.food}>
            <MultiSelect
              id="food"
              options={foodOptions}
              value={food}
              onChange={(v) => {
                setFood(v);
                setQuantities((q) => Object.fromEntries(Object.entries(q).filter(([item]) => v.includes(item))));
                if (errors.food) setErrors((e) => ({ ...e, food: '' }));
              }}
              quantities={quantities}
              onQuantityChange={(item, qty) => setQuantities((q) => ({ ...q, [item]: Math.max(1, qty) }))}
              placeholder="Search and select food items"
              invalid={!!errors.food}
              describedBy={errors.food ? 'food-err' : undefined} />
            
          </Field>

          <Field id="pickup" label="Restaurant or pickup location" error={errors.pickup}>
            <SingleSelect
              id="pickup"
              options={restaurantOptions}
              value={pickup}
              onChange={(v) => {
                setPickup(v);
                if (errors.pickup) setErrors((e) => ({ ...e, pickup: '' }));
              }}
              placeholder="Search and select a restaurant"
              invalid={!!errors.pickup}
              describedBy={errors.pickup ? 'pickup-err' : undefined} />
            
          </Field>

          <Field id="destination" label="Deliver to" error={errors.destination}>
            <Input id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Building, room, or meeting spot" className="h-10" aria-invalid={!!errors.destination} aria-describedby={errors.destination ? 'destination-err' : undefined} />
            <div className="flex flex-wrap gap-2 pt-1">
              <Chip label={`My dorm: ${currentUser.dorm}`} active={destination === currentUser.dorm} onClick={() => setDestination(currentUser.dorm)} />
            </div>
          </Field>



          <div className="space-y-2">
            <Label htmlFor="instructions">
              Additional instructions <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Textarea id="instructions" rows={3} value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Allergies, substitutions, how to reach you…" />
          </div>



          <Button type="submit" size="lg" className="h-12 w-full text-sm" disabled={submitting}>
            {submitting ? <><Loader2 className="animate-spin" aria-hidden="true" /> Posting</> : 'Post request'}
          </Button>
        </form>

        <aside aria-labelledby="how-title" className="hidden rounded-xl border bg-card p-6 lg:sticky lg:top-24 lg:block">
          <h2 id="how-title" className="text-base font-semibold tracking-tight">How it works</h2>
          <ol className="mt-4 space-y-4">
            {howItWorks.map((s, i) =>
            <li key={s.title} className="flex gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary-soft font-mono text-xs font-semibold text-primary">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="text-xs leading-5 text-muted-foreground">{s.body}</p>
                </div>
              </li>
            )}
          </ol>
        </aside>
      </div>
    </div>);

}

function Field({ id, label, error, children }: {id: string;label: string;error?: string;children: React.ReactNode;}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p id={`${id}-err`} className="text-xs text-destructive">{error}</p>}
    </div>);

}

function Chip({ label, active, onClick }: {label: string;active: boolean;onClick: () => void;}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-8 rounded-md border px-3 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
      active ? 'border-primary bg-primary-soft text-primary' : 'bg-card text-muted-foreground hover:text-foreground'}`
      }>
      
      {label}
    </button>);

}