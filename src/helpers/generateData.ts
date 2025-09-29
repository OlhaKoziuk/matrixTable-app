import type { Cell } from '../context/types';

let countId = 1;

export const generateRandomValue = () => Math.floor(100 + Math.random() * 900);

export const generateMatrix = (M: number, N: number): Cell[][] => {
  countId = 1;
  return new Array(M).fill(0).map(() =>
    new Array(N).fill(0).map(() => ({ id: countId++, amount: generateRandomValue() })),
  );
};

export const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

export const rowSum = (arr: { amount: number }[]) =>
  arr.reduce((s, c) => s + c.amount, 0);

export function percentile60(columnValues: number[]): number {
  const sorted = [...columnValues].sort((a, b) => a - b);
  const n = sorted.length;
  if (!n) return 0;
  if (n === 1) return sorted[0];
  const p = 0.6;
  const idx = p * (n - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return +sorted[lo].toFixed(2);
  const frac = idx - lo;
  const val = sorted[lo] * (1 - frac) + sorted[hi] * frac;
  return +val.toFixed(2);
}

export const nearestX = (
  matrix: { amount: number }[][],
  target: number,
  X: number,
  skip: { row: number; col: number }
): Set<string> => {
  const total = matrix.length * (matrix[0]?.length ?? 0) - 1;
  const highlightCount = Math.min(Math.max(0, X), Math.max(0, total));

  if (highlightCount === 0) return new Set();

  const flat: { key: string; diff: number; row: number; col: number }[] = [];

  for (let r = 0; r < matrix.length; r++) {
    const row = matrix[r];
    for (let c = 0; c < (row?.length ?? 0); c++) {
      if (r === skip.row && c === skip.col) continue;
      flat.push({
        key: `${r}:${c}`,
        diff: Math.abs(matrix[r][c].amount - target),
        row: r,
        col: c,
      });
    }
  }

  flat.sort((a, b) => {
    if (a.diff !== b.diff) return a.diff - b.diff;
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });

  return new Set(flat.slice(0, highlightCount).map(x => x.key));
};






