import { createRootRoute } from '@tanstack/react-router';
import { AppShell } from '@/components/layout/AppShell';
import { Toaster } from '@/components/ui/sonner';

export const Route = createRootRoute({
  component: () => (
    <>
      <AppShell />
      <Toaster position="top-center" />
    </>
  ),
});
