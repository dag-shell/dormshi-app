import { Link } from '@tanstack/react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronRight,
  faHeadset,
  faPaperPlane,
  faFileLines,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';

interface BaseLinkItem {
  id: string;
  label: string;
  description?: string;
  icon: IconDefinition;
}

interface ExternalLinkItem extends BaseLinkItem {
  href: string;
  to?: never;
}

interface InternalLinkItem extends BaseLinkItem {
  to: string;
  href?: never;
}

const communityAndSupportLinks: ExternalLinkItem[] = [
  {
    id: 'channel',
    label: 'Join our channel',
    description: 'News, announcements and promo codes',
    icon: faPaperPlane,
    href: 'https://t.me/dormshi',
  },
  {
    id: 'support',
    label: 'Contact support',
    description: '24/7 help with orders and deliveries',
    icon: faHeadset,
    href: 'https://t.me/dormshisupport',
  },
];

const legalLinks: InternalLinkItem[] = [
  {
    id: 'terms',
    label: 'Terms of Service',
    description: 'Rules and terms for using Dormshi',
    icon: faFileLines,
    to: '/terms',
  },
  {
    id: 'privacy',
    label: 'Privacy Policy',
    description: 'How we protect and use your data',
    icon: faShieldHalved,
    to: '/privacy',
  },
];

export function ProfileLinksSection() {
  const handleOpenLink = (href: string) => {
    const webApp = typeof window !== 'undefined'
      ? (window as unknown as { Telegram?: { WebApp?: { openTelegramLink?: (url: string) => void; openLink?: (url: string) => void } } }).Telegram?.WebApp
      : undefined;

    if (webApp?.openTelegramLink && href.startsWith('https://t.me/')) {
      webApp.openTelegramLink(href);
    } else if (webApp?.openLink) {
      webApp.openLink(href);
    } else {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-4">
      {/* Community & Support */}
      <div className="space-y-1">
        <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Community & Support
        </h2>
        <div className="overflow-hidden rounded-lg border border-border bg-card divide-y divide-border">
          {communityAndSupportLinks.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => item.href && handleOpenLink(item.href)}
              className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-secondary/50 active:bg-secondary"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
                  <FontAwesomeIcon icon={item.icon} className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {item.label}
                  </p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
              <FontAwesomeIcon
                icon={faChevronRight}
                className="size-3 text-muted-foreground shrink-0"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Legal & About */}
      <div className="space-y-1">
        <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          About & Legal
        </h2>
        <div className="overflow-hidden rounded-lg border border-border bg-card divide-y divide-border">
          {legalLinks.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-secondary/50 active:bg-secondary"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
                  <FontAwesomeIcon icon={item.icon} className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {item.label}
                  </p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
              <FontAwesomeIcon
                icon={faChevronRight}
                className="size-3 text-muted-foreground shrink-0"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* App Version & Footer */}
      <div className="pt-2 text-center text-xs text-muted-foreground">
        <p className="font-medium">Dormshi v1.0.0</p>
        <p className="text-[11px] text-muted-foreground/80">© 2026 Dormshi. All rights reserved.</p>
      </div>
    </div>
  );
}
