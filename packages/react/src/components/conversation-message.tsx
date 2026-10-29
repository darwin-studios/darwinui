'use client';

import type { ReactNode } from 'react';

export function ConversationMessage({ author, children }: { author: string; children: ReactNode }) {
  return (
    <article className='dui-message'>
      <strong>{author}</strong>
      <div>{children}</div>
    </article>
  );
}
