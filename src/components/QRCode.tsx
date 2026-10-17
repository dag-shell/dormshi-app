import React, { useMemo } from 'react';
import { qrMatrix } from '../utils/qr';

interface QRCodeProps {
  value: string;
  size?: number;
  label?: string;
}

export function QRCode({ value, size = 180, label = 'QR code' }: QRCodeProps) {
  const matrix = useMemo(() => qrMatrix(value), [value]);
  const n = matrix.length;
  return (
    <svg
      role="img"
      aria-label={label}
      width={size}
      height={size}
      viewBox={`-2 -2 ${n + 4} ${n + 4}`}
      shapeRendering="crispEdges"
      className="rounded-lg bg-white">
      
      <rect x={-2} y={-2} width={n + 4} height={n + 4} fill="#ffffff" />
      {matrix.map((row, r) =>
      row.map((on, c) => on ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#1f1b16" /> : null)
      )}
    </svg>);

}