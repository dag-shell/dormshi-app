import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, backTo, action }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 lg:px-10 lg:py-4">
        <button
          type="button"
          onClick={() => backTo ? navigate(backTo) : navigate(-1)}
          aria-label="Go back"
          className="grid size-9 shrink-0 place-items-center rounded-full border bg-card hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          
          <ArrowLeft className="size-4" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold tracking-tight lg:text-lg">{title}</h1>
          {subtitle && <p className="truncate text-xs text-muted-foreground lg:text-sm">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>);

}