import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/requests/new')({
  component: () => <Navigate to="/orders/new" replace />,
});
