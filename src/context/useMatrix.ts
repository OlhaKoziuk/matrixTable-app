import { useContext } from 'react';
import { MatrixCtx } from './MatrixContext';

export const useMatrix = () => {
  const ctx = useContext(MatrixCtx);
  if (!ctx) throw new Error('useMatrix must be used within MatrixProvider');
  return ctx;
};
