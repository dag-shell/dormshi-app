import { format, formatDistanceToNowStrict } from 'date-fns';

export function roundDC(n: number): number {
  return Math.round(n * 100) / 100;
}

export function formatAmount(n: number): string {
  return n.toFixed(2);
}

export function formatDC(n: number): string {
  return `${n.toFixed(2)} DC`;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return 'just now';
  return formatDistanceToNowStrict(new Date(iso), { addSuffix: true });
}

export function formatClock(iso: string): string {
  return format(new Date(iso), 'h:mm a');
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), 'MMM d, yyyy · h:mm a');
}

export function addMinutes(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();
}

export function firstName(name: string): string {
  return name.split(' ')[0];
}