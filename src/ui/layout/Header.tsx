import React from 'react';
import { BackButton } from '@/ui/telegram';

export interface HeaderProps {
  title?: React.ReactNode;
  position?: 'left' | 'center' | 'right';
  children?: React.ReactNode;
  className?: string;
  showBackButton?: boolean;
}

export function Header({
  title,
  position = 'center',
  children,
  className = '',
  showBackButton = true
}: HeaderProps) {
  const contentPaddingClasses = {
    left: 'pl-20',
    center: 'px-4 text-center mx-auto',
    right: 'pr-20'
  }[position];

  return (
    <header className={`w-full ${className}`}>
      {showBackButton && (<BackButton />)}
      <div className="relative h-12 w-full bg-secondary overflow-visible flex items-center px-4 sm:px-6 border-b border-border/50">
        {/* Subtle decorative trail line matching the sketch doodle */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-10 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 400 100"
          preserveAspectRatio="none"
        >
          <path
            d="M-20,55 C40,25 90,75 150,45 C210,15 250,70 310,40 C350,20 375,60 420,40"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="text-foreground"
          />
        </svg>

        {/* Content */}
        <div className={`relative z-10 min-w-0 ${contentPaddingClasses}`}>
          {title && (
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
              {title}
            </h1>
          )}
          {children}
        </div>
      </div>
    </header>
  );
}
