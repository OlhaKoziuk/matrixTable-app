import { useMemo, useState } from 'react';
import { MatrixCtx } from './MatrixContext';
import type { MatrixContextValue } from './types';
import { clamp, generateMatrix, generateRandomValue } from '../helpers/generateData';

export function MatrixProvider({ children }: { children: React.ReactNode }) {
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [nearestCount, setNearestCount] = useState(0);
  const [hover, setHover] =
  useState<{ type:'cell'; row:number; col:number } | { type:'rowsum'; row:number } | null>(null);
  const [data, setData] = useState(generateMatrix(0, 0));

  const setParameters = (rowsInput: number, colsInput: number, nearestInput: number) => {
    const safeRows = clamp(rowsInput, 0, 100);
    const safeCols = clamp(colsInput, 0, 100);
    const maxNearest = Math.max(0, safeRows * safeCols - 1);
    const safeNearest = clamp(nearestInput, 0, maxNearest);

    setRows(safeRows);
    setCols(safeCols);
    setNearestCount(safeNearest);
    setData(generateMatrix(safeRows, safeCols));
  };

  const regenerateMatrix = (rowsOverride?: number, colsOverride?: number) => {
    const safeRows = clamp(rowsOverride ?? rows, 0, 100);
    const safeCols = clamp(colsOverride ?? cols, 0, 100);
    setData(generateMatrix(safeRows, safeCols));
  };

  const incrementCell = (rowIndex: number, colIndex: number) => {
    setData(prev =>
      prev.map((row, r) =>
        r !== rowIndex
          ? row
          : row.map((cell, c) =>
              c !== colIndex ? cell : { ...cell, amount: cell.amount + 1 }
            )
      )
    );
  };

  const addRow = () => {
    setData(prev => {
      const colsCount = (prev[0]?.length ?? 0) || cols;
      const maxId =
        prev.length === 0
          ? 0
          : prev.reduce((m, row) => Math.max(m, ...row.map(c => c.id)), 0);

      const newRow = Array.from({ length: colsCount }, (_, i) => ({
        id: maxId + 1 + i,
        amount: generateRandomValue(),
      }));

      return [...prev, newRow];
    });
    setRows(r => r + 1);
  };

const removeRow = (rowIndex: number) => {
  setData(prev => prev.filter((_, i) => i !== rowIndex));
  setRows(r => Math.max(0, r - 1));
};

  const value: MatrixContextValue = useMemo(() => ({
    M: rows, N: cols, X: nearestCount, data,
    setParams: setParameters,
    regenerate: regenerateMatrix,
    incrementCell,
    hover,
    setHover,
    addRow,
    removeRow,
  }), [rows, cols, nearestCount, data, hover]);

  return <MatrixCtx.Provider value={value}>{children}</MatrixCtx.Provider>;
}
