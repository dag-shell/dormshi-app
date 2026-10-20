import { createRootRoute } from '@tanstack/react-router';
import { AppShell } from '@/ui/layout/AppShell';
import { Toaster } from '@/ui/sonner';

export const Route = createRootRoute({
  component: () => (
    <>
      <AppShell />
      <Toaster position="top-center" />
    </>
  ),
});
