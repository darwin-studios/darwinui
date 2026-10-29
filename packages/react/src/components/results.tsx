'use client';

import type { Result } from '@darwinui/core';

import { ResultView } from './result-view.js';

export function Results({ results }: { results: Result[] }) {
  return (
    <section className='dui-results' aria-label='Results' aria-live='polite'>
      {results.map((result, index) => (
        <ResultView key={index} result={result} />
      ))}
    </section>
  );
}
