import { useEffect, useMemo, useRef, useState } from 'react';
import { useMatrix } from '../../context';
import { clamp } from '../../helpers/generateData';

type NumOrEmpty = number | '';

export const InputsPanel = () => {
  const { M, N, X, setParams } = useMatrix();

  const [rows, setRows] = useState<NumOrEmpty>(M ?? 0);
  const [cols, setCols] = useState<NumOrEmpty>(N ?? 0);
  const [nearest, setNearest] = useState<NumOrEmpty>(X ?? 0);

  const [invalidRows, setInvalidRows] = useState(false);
  const [invalidCols, setInvalidCols] = useState(false);
  const [invalidNearest, setInvalidNearest] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const notify = (text: string) => {
    setMessage(text);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setMessage(null), 2000);
  };

  const maxNearest = useMemo(() => {
    const r = typeof rows === 'number' ? rows : 0;
    const c = typeof cols === 'number' ? cols : 0;
    return Math.max(0, r * c - 1);
  }, [rows, cols]);

  useEffect(() => {
    setNearest(prev => {
      if (prev === '') return prev;
      const fixed = Math.min(prev, maxNearest);
      if (fixed !== prev) notify(`X was clamped to ${fixed}`);
      return fixed;
    });
  }, [maxNearest]);

  const parseNumOrEmpty = (v: string): NumOrEmpty => {
    if (v === '') return '';
    const n = Number(v);
    return Number.isFinite(n) ? n : '';
  };

  const guardUpdate = (
    next: NumOrEmpty,
    min: number,
    max: number,
    setVal: (v: NumOrEmpty) => void,
    setInvalid: (b: boolean) => void,
    label: string
  ) => {
    if (next === '') {
      setVal('');
      setInvalid(false);
      return;
    }
    if (next < min || next > max) {
      setInvalid(true);
      notify(`${label} must be between ${min} and ${max}`);
      return;
    }
    setInvalid(false);
    setVal(next);
  };

  const onRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseNumOrEmpty(e.target.value);
    guardUpdate(val, 0, 100, setRows, setInvalidRows, 'Rows');
  };

  const onColsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseNumOrEmpty(e.target.value);
    guardUpdate(val, 0, 100, setCols, setInvalidCols, 'Columns');
  };

  const onNearestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseNumOrEmpty(e.target.value);
    guardUpdate(val, 0, maxNearest, setNearest, setInvalidNearest, 'X');
  };

  const ensureZeroOnBlur = (val: NumOrEmpty, setVal: (v: NumOrEmpty) => void) => {
    if (val === '') setVal(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = typeof rows === 'number' ? rows : 0;
    const c = typeof cols === 'number' ? cols : 0;
    const xMax = Math.max(0, r * c - 1);
    const x = typeof nearest === 'number' ? clamp(nearest, 0, xMax) : 0;

    setParams(clamp(r, 0, 100), clamp(c, 0, 100), x);
  };

  const val = (n: NumOrEmpty) => (n === '' ? '' : String(n));

  return (
    <>
      {message && <div className="mini-toast" role="status" aria-live="polite">{message}</div>}

      <form className="inputs-panel" onSubmit={handleSubmit} noValidate>
        <div className="inputs-panel__group">
          <label className="inputs-panel__label" htmlFor="rows">M — Rows</label>
          <input
            id="rows"
            className={`inputs-panel__input ${invalidRows ? 'is-invalid' : ''}`}
            type="number"
            min={0}
            max={100}
            value={val(rows)}
            onChange={onRowsChange}
            onBlur={() => ensureZeroOnBlur(rows, setRows)}
            placeholder="0–100"
            inputMode="numeric"
            aria-invalid={invalidRows}
          />
        </div>

        <div className="inputs-panel__group">
          <label className="inputs-panel__label" htmlFor="cols">N — Columns</label>
          <input
            id="cols"
            className={`inputs-panel__input ${invalidCols ? 'is-invalid' : ''}`}
            type="number"
            min={0}
            max={100}
            value={val(cols)}
            onChange={onColsChange}
            onBlur={() => ensureZeroOnBlur(cols, setCols)}
            placeholder="0–100"
            inputMode="numeric"
            aria-invalid={invalidCols}
          />
        </div>

        <div className="inputs-panel__group">
          <label className="inputs-panel__label" htmlFor="nearest">X — Nearest</label>
          <input
            id="nearest"
            className={`inputs-panel__input ${invalidNearest ? 'is-invalid' : ''}`}
            type="number"
            min={0}
            max={maxNearest}
            value={val(nearest)}
            onChange={onNearestChange}
            onBlur={() => ensureZeroOnBlur(nearest, setNearest)}
            placeholder={`0–${maxNearest}`}
         
            inputMode="numeric"
            aria-invalid={invalidNearest}
          />
        </div>

        <button type="submit" className="inputs-panel__submit">Create</button>
      </form>
    </>
  );
};
