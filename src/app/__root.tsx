import { createRootRoute, Link } from '@tanstack/react-router';
import { AppShell } from '@/ui/layout/AppShell';
import { Toaster } from '@/ui/sonner';

export const Route = createRootRoute({
  component: () => (
    <>
      <AppShell />
      <Toaster position="top-center" />
    </>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-xl font-bold">Page not found</h1>
      <Link to="/" className="mt-4 text-primary hover:underline">Go back home</Link>
    </div>
  ),
});
