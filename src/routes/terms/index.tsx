import { Header } from '@/ui/layout/Header';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/terms/')({
  component: TermsPage,
});

export function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Header title="Terms of Service" />
      

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero banner */}
        <div className="mb-10 border-b border-border pb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Legal Agreement
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Effective: October 9, 2026 · Haramaya University & Campus Communities
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
          {/* Desktop Table of Contents */}
          <aside className="hidden lg:block">
            <nav aria-label="Table of contents" className="sticky top-20 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                On this page
              </p>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <a href="#accounts" className="block text-muted-foreground hover:text-foreground">
                    1. Student accounts
                  </a>
                </li>
                <li>
                  <a href="#orders" className="block text-muted-foreground hover:text-foreground">
                    2. Orders and offers
                  </a>
                </li>
                <li>
                  <a href="#payments" className="block text-muted-foreground hover:text-foreground">
                    3. DC and escrow
                  </a>
                </li>
                <li>
                  <a href="#cancellations" className="block text-muted-foreground hover:text-foreground">
                    4. Cancellations
                  </a>
                </li>
                <li>
                  <a href="#disputes" className="block text-muted-foreground hover:text-foreground">
                    5. Problem resolution
                  </a>
                </li>
                <li>
                  <a href="#conduct" className="block text-muted-foreground hover:text-foreground">
                    6. Prohibited conduct
                  </a>
                </li>
                <li>
                  <a href="#contact" className="block text-muted-foreground hover:text-foreground">
                    7. Contact support
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Legal Text */}
          <article className="space-y-10 text-sm leading-relaxed text-foreground/90">
            <section id="accounts" className="scroll-mt-20 space-y-3">
              <h2 className="text-base font-semibold text-foreground">
                1. Student accounts & eligibility
              </h2>
              <p className="text-muted-foreground">
                Dormshi is open exclusively to enrolled students with an active campus email. Each
                registered student holds one personal account, which is used both to request food deliveries
                and to deliver food to peers.
              </p>
              <p className="text-muted-foreground">
                You are solely responsible for all activity conducted through your account. Your login credentials
                and unique verification QR code must remain confidential at all times, as the QR code is used to
                cryptographically confirm handoffs and trigger payment releases.
              </p>
            </section>

            <section id="orders" className="scroll-mt-20 space-y-3">
              <h2 className="text-base font-semibold text-foreground">
                2. Orders, matching, and offers
              </h2>
              <p className="text-muted-foreground">
                When you post an order, you provide the food items, estimated price, merchant or pickup spot, and
                delivery destination. Any verified student on campus may submit an offer specifying their proposed
                food cost, delivery tip, and estimated arrival window.
              </p>
              <p className="text-muted-foreground">
                The order creator retains sole discretion over which offer to accept. Once an offer is accepted by
                the ordering student, the delivery agreement is created. Terms cannot be modified unilaterally and
                require explicit mutual confirmation through an in-app proposal.
              </p>
            </section>

            <section id="payments" className="scroll-mt-20 space-y-3">
              <h2 className="text-base font-semibold text-foreground">
                3. Dormshi Coin (DC) & escrow guarantee
              </h2>
              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <p className="font-medium text-foreground">Escrow Protection</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Funds are never paid upfront to couriers. Accepted amounts are securely locked in smart escrow
                  until physical QR handoff.
                </p>
              </div>
              <p className="text-muted-foreground">
                Dormshi Coin (DC) is our internal unit of account pegged 1:1 with national currency equivalents (e.g., ETB).
                When an offer is accepted, the total amount is automatically reserved from your available balance.
              </p>
              <p className="text-muted-foreground">
                Reserved DC is released to the deliverer only when the buyer scans the courier’s verified QR code upon
                receiving the items. Available DC may be cashed out to linked mobile wallets (Telebirr, CBE Birr) or
                bank accounts at any time.
              </p>
            </section>

            <section id="cancellations" className="scroll-mt-20 space-y-3">
              <h2 className="text-base font-semibold text-foreground">
                4. Cancellations & automated refunds
              </h2>
              <p className="text-muted-foreground">
                Either party may cancel an order before the deliverer purchases the food. In such events, 100% of the
                reserved escrow funds are refunded immediately to the buyer’s wallet with zero penalty.
              </p>
              <p className="text-muted-foreground">
                Once items are purchased at the merchant, orders cannot be casually cancelled. If a party cannot fulfill
                their commitment, the problem reporting flow must be utilized.
              </p>
            </section>

            <section id="disputes" className="scroll-mt-20 space-y-3">
              <h2 className="text-base font-semibold text-foreground">
                5. Problem reporting & disputes
              </h2>
              <p className="text-muted-foreground">
                If food never arrives, is incorrect, or an unauthorized surcharge is requested, either participant may
                tap “Report a problem”. Escrow funds remain frozen during review.
              </p>
              <p className="text-muted-foreground">
                Dormshi campus support reviews timestamped activity, chat messages, and verification logs, issuing resolution
                within 24 hours. Decisions may include full buyer refund, release to deliverer, or split settlement.
              </p>
            </section>

            <section id="conduct" className="scroll-mt-20 space-y-3">
              <h2 className="text-base font-semibold text-foreground">
                6. Prohibited items & community rules
              </h2>
              <p className="text-muted-foreground">
                Dormshi strictly prohibits ordering or delivering alcohol, tobacco or vaping products, illicit substances,
                prescription medications, or any items restricted by campus housing policies.
              </p>
              <p className="text-muted-foreground">
                Off-platform cash settlements, harassment, QR falsification, or repeated cancellations will result in
                immediate suspension and campus administrator reporting.
              </p>
            </section>

            <section id="contact" className="scroll-mt-20 space-y-3 border-t border-border pt-6">
              <h2 className="text-base font-semibold text-foreground">
                7. Questions & support
              </h2>
              <p className="text-muted-foreground">
                For questions about these terms or assistance with an order, please reach out to our campus operations team at{' '}
                <a href="mailto:support@dormshi.app" className="font-medium text-[#D91400] underline underline-offset-4">
                  support@dormshi.app
                </a>.
              </p>
              <div className="pt-2">
                <Link
                  to="/privacy"
                  className="inline-flex items-center text-xs font-semibold text-[#D91400] hover:underline"
                >
                  View Privacy Policy →
                </Link>
              </div>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
}
