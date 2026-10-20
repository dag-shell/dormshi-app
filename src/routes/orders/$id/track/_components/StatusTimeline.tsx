import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const rawTimeline = [
  { status: 'accepted', label: 'Accepted', description: 'Terms locked and DC reserved in escrow', time: '2:38 PM', done: true },
  { status: 'getting_food', label: 'Getting food', description: 'At the restaurant or store', time: '2:40 PM', done: true },
  { status: 'picked_up', label: 'Picked up', description: 'Food in hand, heading your way', time: '2:52 PM', done: true },
  { status: 'on_the_way', label: 'On the way', description: 'Heading to delivery destination', time: '2:59 PM', current: true },
  { status: 'delivered', label: 'Delivered', description: 'Arrived at destination' },
  { status: 'completed', label: 'Completed', description: 'QR verified and payment released' }
];

export function StatusTimeline(_props?: { request?: unknown }) {
  return (
    <ol>
      {rawTimeline.map((step, i) => {
        const isLast = i === rawTimeline.length - 1;
        return (
          <li key={step.status} className="relative flex gap-3 pb-5 last:pb-0" aria-current={step.current ? 'step' : undefined}>
            {!isLast && (
              <span
                className={`absolute left-3 top-6 h-[calc(100%-24px)] w-px ${step.done ? 'bg-primary' : 'bg-border'}`}
                aria-hidden="true"
              />
            )}
            <span
              className={`relative z-10 grid size-6 shrink-0 place-items-center rounded-full border ${
                step.done
                  ? 'border-primary bg-primary text-primary-foreground'
                  : step.current
                  ? 'border-primary bg-card'
                  : 'border-border bg-card'
              }`}
            >
              {step.done && <FontAwesomeIcon icon={faCheck} className="size-2.5" />}
              {step.current && <span className="size-2 rounded-full bg-primary" />}
            </span>
            <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
              <div>
                <p className={`text-sm font-medium leading-6 ${step.done || step.current ? '' : 'text-muted-foreground'}`}>
                  {step.label}
                </p>
                {step.current && <p className="text-xs text-muted-foreground">{step.description}</p>}
              </div>
              {step.time && (
                <span className="shrink-0 font-mono text-xs leading-6 text-muted-foreground">{step.time}</span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}