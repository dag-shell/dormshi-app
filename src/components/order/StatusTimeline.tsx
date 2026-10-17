import React from 'react';
import { Check } from 'lucide-react';
import { formatClock } from '../../utils/format';
import { fulfillmentSteps, statusLabels, stepDescriptions } from '../../utils/orders';
import type { FoodRequest } from '../../types/dormshi';

export function StatusTimeline({ request }: {request: FoodRequest;}) {
  const reachedIndex =
  request.status === 'completed' ?
  fulfillmentSteps.length :
  Math.max(
    ...request.statusHistory.map((e) => fulfillmentSteps.indexOf(e.status)),
    fulfillmentSteps.indexOf(request.status)
  );
  const live = !['completed', 'cancelled', 'disputed'].includes(request.status);

  return (
    <ol>
      {fulfillmentSteps.map((step, i) => {
        const done = i < reachedIndex || i === reachedIndex && !live;
        const current = i === reachedIndex && live;
        const event = request.statusHistory.find((e) => e.status === step);
        const isLast = i === fulfillmentSteps.length - 1;
        return (
          <li key={step} className="relative flex gap-3 pb-5 last:pb-0" aria-current={current ? 'step' : undefined}>
            {!isLast &&
            <span className={`absolute left-3 top-6 h-[calc(100%-24px)] w-px ${i < reachedIndex ? 'bg-primary' : 'bg-border'}`} aria-hidden="true" />
            }
            <span
              className={`relative z-10 grid size-6 shrink-0 place-items-center rounded-full border ${
              done ? 'border-primary bg-primary text-primary-foreground' : current ? 'border-primary bg-card' : 'border-border bg-card'}`
              }>
              
              {done && <Check className="size-3" strokeWidth={3} />}
              {current && <span className="size-2 animate-pulse rounded-full bg-primary" />}
            </span>
            <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
              <div>
                <p className={`text-sm font-medium leading-6 ${done || current ? '' : 'text-muted-foreground'}`}>{statusLabels[step]}</p>
                {current && <p className="text-xs text-muted-foreground">{stepDescriptions[step]}</p>}
              </div>
              {event && <span className="shrink-0 font-mono text-xs leading-6 text-muted-foreground">{formatClock(event.at)}</span>}
            </div>
          </li>);

      })}
    </ol>);

}