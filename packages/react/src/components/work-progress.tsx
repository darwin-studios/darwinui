'use client';

import type { WorkStep } from '@darwinui/core';

export function WorkProgress({ steps }: { steps: WorkStep[] }) {
  return (
    <ol className='dui-progress' aria-label='Work progress' aria-live='polite'>
      {steps.map((step) => (
        <li key={step.id} data-status={step.status}>
          <span aria-hidden='true'>{step.status === 'completed' ? '✓' : step.status === 'failed' ? '!' : '○'}</span>
          <span>{step.title}</span>
          <small>{step.status}</small>
        </li>
      ))}
    </ol>
  );
}
