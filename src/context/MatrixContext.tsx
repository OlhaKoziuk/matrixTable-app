import { createContext } from 'react';
import type { MatrixContextValue } from './types';

export const MatrixCtx = createContext<MatrixContextValue | null>(null);

