'use client';

import type { Operation } from '@darwinui/core';

export function CapabilityList({
  operations,
  selectedId,
  onSelect,
}: {
  operations: Operation[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  return (
    <div className='dui-capabilities'>
      {operations.length ? (
        operations.map((op) => (
          <button
            className='dui-card dui-capability'
            key={op.id}
            type='button'
            aria-pressed={selectedId === op.id}
            disabled={!onSelect}
            onClick={() => onSelect?.(op.id)}
          >
            <strong>{op.name}</strong>
            {op.description && <span>{op.description}</span>}
          </button>
        ))
      ) : (
        <p className='dui-muted'>No capabilities are available.</p>
      )}
    </div>
  );
}
