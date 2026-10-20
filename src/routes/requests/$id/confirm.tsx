import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/requests/$id/confirm')({
  component: RedirectToOrderConfirm,
});

function RedirectToOrderConfirm() {
  const { id } = Route.useParams();
  return <Navigate to="/orders/$id/confirm" params={{ id }} replace />;
}
