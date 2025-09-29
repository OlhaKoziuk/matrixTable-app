export type Cell = { id: number; amount: number };

export type MatrixState = {
  M: number;
  N: number;
  X: number;
  data: Cell[][];
};

export type Hover =
  | { type: 'cell'; row: number; col: number }
  | { type: 'rowsum'; row: number }
  | null;

export type MatrixContextValue = {
  M: number; N: number; X: number;
  data: { id: number; amount: number }[][];
  setParams: (M: number, N: number, X: number) => void;
  regenerate: (M?: number, N?: number) => void;
  incrementCell: (r: number, c: number) => void;

  hover: Hover;
  setHover: (v: Hover) => void;

  addRow: () => void;
  removeRow: (rowIndex: number) => void;
};



