import React from 'react';

const Table = ({ columns, data, onRowClick, emptyMessage = 'No data available' }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
      <table className="w-full border-collapse text-left text-body-md">
        <thead>
          <tr className="border-b border-outline-variant bg-surface-container-low/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-4 font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold"
                style={{ width: col.width || 'auto' }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant bg-white">
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick && onRowClick(row, rowIndex)}
                className={`transition-colors hover:bg-surface-container-low/30 ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-on-surface whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row, rowIndex) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-outline">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
