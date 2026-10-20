import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/requests/$id/')({
  component: RedirectToOrder,
});

function RedirectToOrder() {
  const { id } = Route.useParams();
  return <Navigate to="/orders/$id" params={{ id }} replace />;
}
