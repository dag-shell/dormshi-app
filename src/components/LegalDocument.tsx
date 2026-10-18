import React from 'react';
import { PageHeader } from './PageHeader';

export interface LegalSection {
  id: string;
  title: string;
  body: string[];
}

interface LegalDocumentProps {
  title: string;
  sections: LegalSection[];
  lastUpdated?: string;
}

export function LegalDocument({ title, sections, lastUpdated = 'October 9, 2026' }: LegalDocumentProps) {
  return (
    <div>
      <PageHeader title={title} subtitle={`Last updated ${lastUpdated}`} />
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:px-10 lg:py-10">
        <nav aria-label="Sections" className="hidden lg:block">
          <ul className="sticky top-24 space-y-2 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-muted-foreground hover:text-foreground">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <article className="max-w-2xl space-y-8">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="text-base font-semibold">{s.title}</h2>
              <div className="mt-2 space-y-3 text-sm leading-6 text-muted-foreground">
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}