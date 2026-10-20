import { Header } from '@/ui/layout';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/privacy/')({
  component: PrivacyPage,
});

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Header title="Privacy Policy" />

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero banner */}
        <div className="mb-10 border-b border-border pb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Data & Security
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Last updated: October 9, 2026 · Built with zero ad tracking
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
                  <a href="#collection" className="block text-muted-foreground hover:text-foreground">
                    1. Information collected
                  </a>
                </li>
                <li>
                  <a href="#location" className="block text-muted-foreground hover:text-foreground">
                    2. Location handling
                  </a>
                </li>
                <li>
                  <a href="#usage" className="block text-muted-foreground hover:text-foreground">
                    3. How data is used
                  </a>
                </li>
                <li>
                  <a href="#visibility" className="block text-muted-foreground hover:text-foreground">
                    4. Peer visibility
                  </a>
                </li>
                <li>
                  <a href="#security" className="block text-muted-foreground hover:text-foreground">
                    5. Security & Escrow
                  </a>
                </li>
                <li>
                  <a href="#retention" className="block text-muted-foreground hover:text-foreground">
                    6. Retention & rights
                  </a>
                </li>
                <li>
                  <a href="#contact" className="block text-muted-foreground hover:text-foreground">
                    7. Inquiries
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Legal Text */}
          <article className="space-y-10 text-sm leading-relaxed text-foreground/90">
            <section id="collection" className="scroll-mt-20 space-y-3">
              <h2 className="text-base font-semibold text-foreground">
                1. Information we collect
              </h2>
              <p className="text-muted-foreground">
                We only collect information necessary to connect students and coordinate deliveries:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Account profile:</strong> Name, verified university email, campus residence or dorm, and Telegram identity.
                </li>
                <li>
                  <strong className="text-foreground">Order activity:</strong> Orders requested, courier offers submitted, handoff confirmation timestamps, and delivery notes.
                </li>
                <li>
                  <strong className="text-foreground">Transaction records:</strong> DC token balances, escrow allocations, and linked payout details (Telebirr/CBE account identifiers). Full payment instrument credentials are never stored on Dormshi servers.
                </li>
              </ul>
            </section>

            <section id="location" className="scroll-mt-20 space-y-3">
              <h2 className="text-base font-semibold text-foreground">
                2. Location handling & privacy
              </h2>
              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <p className="font-medium text-foreground">No Continuous Tracking</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Dormshi does not track your background GPS position. Campus distance estimates are computed
                  only when active orders are queried.
                </p>
              </div>
              <p className="text-muted-foreground">
                Precise coordinates are never displayed to other students. Only general campus landmarks, dorm names,
                and pickup checkpoints specified in an order are shared with the matched delivery partner.
              </p>
            </section>

            <section id="usage" className="scroll-mt-20 space-y-3">
              <h2 className="text-base font-semibold text-foreground">
                3. How we use your information
              </h2>
              <p className="text-muted-foreground">
                Your data is exclusively utilized to operate the campus service:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Matching nearby student requests with available peer couriers.</li>
                <li>Securing escrow and verifying physical handoffs via encrypted QR scan.</li>
                <li>Mitigating fraud, abuse, and community conduct violations.</li>
                <li>Providing customer support for disputed delivery orders.</li>
              </ul>
              <p className="font-medium text-foreground">
                We do not sell personal data, display third-party advertisements, or share profile details with external marketers.
              </p>
            </section>

            <section id="visibility" className="scroll-mt-20 space-y-3">
              <h2 className="text-base font-semibold text-foreground">
                4. What peer students see
              </h2>
              <p className="text-muted-foreground">
                To build safety and trust on campus, registered peers on the platform can view:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Your first name and initial (e.g., “Maya O.”).</li>
                <li>Your campus residence hall or affiliated faculty.</li>
                <li>Your completed delivery count and average peer star rating.</li>
              </ul>
              <p className="text-muted-foreground">
                Your phone number and specific room numbers are revealed only to the matched courier or requester
                for the active duration of that delivery.
              </p>
            </section>

            <section id="security" className="scroll-mt-20 space-y-3">
              <h2 className="text-base font-semibold text-foreground">
                5. Data security & encryption
              </h2>
              <p className="text-muted-foreground">
                All communications between Telegram Mini App isolate containers and backend APIs use Transport Layer
                Security (TLS 1.3). QR codes generated for verification expire after usage to eliminate replay attacks.
              </p>
            </section>

            <section id="retention" className="scroll-mt-20 space-y-3">
              <h2 className="text-base font-semibold text-foreground">
                6. Data retention and student rights
              </h2>
              <p className="text-muted-foreground">
                Financial transaction logs are preserved in accordance with regulatory banking obligations. Inactive
                accounts may request complete deletion of identity details at any time by messaging privacy support.
              </p>
            </section>

            <section id="contact" className="scroll-mt-20 space-y-3 border-t border-border pt-6">
              <h2 className="text-base font-semibold text-foreground">
                7. Contact our data officer
              </h2>
              <p className="text-muted-foreground">
                Have questions or need a copy of your campus delivery data? Write to our team at{' '}
                <a href="mailto:privacy@dormshi.app" className="font-medium text-[#D91400] underline underline-offset-4">
                  privacy@dormshi.app
                </a>.
              </p>
              <div className="pt-2">
                <Link
                  to="/terms"
                  className="inline-flex items-center text-xs font-semibold text-[#D91400] hover:underline"
                >
                  View Terms of Service →
                </Link>
              </div>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
}
