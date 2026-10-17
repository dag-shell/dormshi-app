/**
 * Produces a deterministic QR-style module matrix for a value.
 * Visual representation only — the payload is verified server-side.
 */
export function qrMatrix(value: string, size = 25): boolean[][] {
  let seed = 2166136261;
  for (let i = 0; i < value.length; i++) {
    seed ^= value.charCodeAt(i);
    seed = Math.imul(seed, 16777619);
  }
  const random = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return (seed >>> 0) % 1000 / 1000;
  };

  const matrix: boolean[][] = Array.from({ length: size }, () =>
  Array.from({ length: size }, () => random() > 0.52)
  );

  const placeFinder = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = row + r;
        const cc = col + c;
        if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
        const inside = r >= 0 && r <= 6 && c >= 0 && c <= 6;
        if (!inside) {
          matrix[rr][cc] = false;
          continue;
        }
        const edge = r === 0 || r === 6 || c === 0 || c === 6;
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[rr][cc] = edge || core;
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);
  return matrix;
}