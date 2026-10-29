'use client';

import type { Thread } from '@darwinui/core';

export function ThreadList({
  threads,
  selectedId,
  onSelect,
}: {
  threads: readonly Thread[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className='dui-thread-list' aria-label='Threads'>
      {threads.length ? (
        threads.map((thread) => (
          <button
            key={thread.id}
            type='button'
            aria-current={selectedId === thread.id ? 'page' : undefined}
            onClick={() => onSelect(thread.id)}
          >
            <strong>{thread.title}</strong>
            <span>{thread.status}</span>
          </button>
        ))
      ) : (
        <p>No saved work yet.</p>
      )}
    </nav>
  );
}
