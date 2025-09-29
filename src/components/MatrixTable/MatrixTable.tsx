import { useMemo } from 'react';
import { useMatrix } from '../../context';
import { nearestX, percentile60, rowSum } from '../../helpers/generateData';

export const MatrixTable = () => {
  const { data, X, hover, setHover, incrementCell, addRow, removeRow } = useMatrix();
  const rows = data.length;
  const cols = data[0]?.length ?? 0;

  const sums = useMemo(() => data.map(rowSum), [data]);

  const p60 = useMemo(() => {
    const res: number[] = [];
    for (let c = 0; c < cols; c++) {
      const col = data.map(r => r[c]?.amount).filter(v => v != null) as number[];
      res.push(percentile60(col));
    }
    return res;
  }, [data, cols]);

  const nearestSet = useMemo(() => {
    if (!hover || hover.type !== 'cell') return new Set<string>();
    const target = data[hover.row][hover.col].amount;
    return nearestX(data, target, X, { row: hover.row, col: hover.col });
  }, [data, X, hover]);

  if (!rows || !cols) {
    return (
      <div className="table-wrapper empty">
        <div style={{ marginBottom: 12 }}>
          Fill in M and N and press ‘Create’ to see the table.
        </div>
      </div>
    );
  }

  const dataColMin = 100;
  const rowHeadMin = 180;
  const sumColMin  = 140;
  const tableMinWidth = cols * dataColMin + rowHeadMin + sumColMin;

  return (
    <div className="table-wrapper">
      <div style={{ padding: 12 }}>
        <button type="button" onClick={addRow} className="inputs-panel__submit">
          + Add row
        </button>
      </div>

      <div className="table-scroll" style={{ width: '100%', overflowX: 'auto' }}>
        <table
          className="mtable"
          style={{ minWidth: `${tableMinWidth}px`, borderCollapse: 'separate', borderSpacing: 0 }}
        >
          <thead>
            <tr>
              <th className="th-rowhead" style={{ minWidth: `${rowHeadMin}px` }}></th>
              {Array.from({ length: cols }, (_, i) => (
                <th key={i} className="th-col" style={{ minWidth: `${dataColMin}px`, whiteSpace: 'nowrap' }}>
                  {`Cell val N = ${i + 1}`}
                </th>
              ))}
              <th className="th-sum" style={{ minWidth: `${sumColMin}px` }}>Sum values</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, r) => {
              const sum = sums[r];
              const maxInRow = Math.max(...row.map(c => c.amount));
              const percentMode = hover?.type === 'rowsum' && hover.row === r;

              return (
                <tr key={r}>
                  <th
                    scope="row"
                    className="th-row"
                    style={{ minWidth: `${rowHeadMin}px`, position: 'relative', zIndex: 1 }}
                  >
                    <span style={{ flex: '1 1 auto', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {`Cell val M = ${r + 1}`}
                    </span>

                    <button
                      type="button"
                      className="row-remove"
                      onClick={(e) => { e.stopPropagation(); removeRow(r); }}  // ⟵ важное
                      aria-label={`Remove row ${r + 1}`}
                      title="Remove row"
                      style={{ flex: '0 0 24px' }}
                    >
                      ×
                    </button>
                  </th>

                  {row.map((cell, c) => {
                    const key = `${r}:${c}`;
                    const cls = `td td-click ${nearestSet.has(key) && !percentMode ? 'nearest' : ''}`;

                    const percentOfTotal = sum === 0 ? 0 : Math.round((cell.amount / sum) * 100);
                    const heatWidth = maxInRow === 0 ? 0 : Math.round((cell.amount / maxInRow) * 100);

                    return (
                      <td
                        key={cell.id}
                        className={`${cls} td-col`}
                        style={{ minWidth: `${dataColMin}px`, whiteSpace: 'nowrap' }}
                        onMouseEnter={() => setHover({ type: 'cell', row: r, col: c })}
                        onMouseLeave={() => setHover(null)}
                        onClick={() => incrementCell(r, c)}
                        title="Hover: nearest highlight • Click: +1"
                      >
                        {percentMode && <div className="heat" style={{ width: `${heatWidth}%` }} />}
                        <span>{percentMode ? `${percentOfTotal}%` : cell.amount}</span>
                      </td>
                    );
                  })}

                  <td
                    className="td-sum"
                    style={{ minWidth: `${sumColMin}px` }}
                    onMouseEnter={() => setHover({ type: 'rowsum', row: r })}
                    onMouseLeave={() => setHover(null)}
                    title="Hover: show row as % and heatmap"
                  >
                    {sum}
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr>
              <th className="th-row" style={{ minWidth: `${rowHeadMin}px` }}>60th percentile</th>
              {p60.map((v, i) => (
                <td key={i} className="td-col" style={{ minWidth: `${dataColMin}px`, whiteSpace: 'nowrap' }}>
                  {Number.isFinite(v) ? v.toFixed(1) : 0}
                </td>
              ))}
              <td className="td-empty" style={{ minWidth: `${sumColMin}px` }} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};







