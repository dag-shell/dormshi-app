import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/requests/$id/track')({
  component: RedirectToOrderTrack,
});

function RedirectToOrderTrack() {
  const { id } = Route.useParams();
  return <Navigate to="/orders/$id/track" params={{ id }} replace />;
}
