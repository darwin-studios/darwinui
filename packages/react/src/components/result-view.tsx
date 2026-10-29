'use client';

import { safeUrlSchema, type Result } from '@darwinui/core';

export function ResultView({ result }: { result: Result }) {
  if (result.type === 'text') return <p className='dui-text'>{result.text}</p>;
  if (result.type === 'error')
    return (
      <p role='alert' className='dui-error'>
        {result.message}
      </p>
    );
  if (result.type === 'fields')
    return (
      <dl className='dui-facts'>
        {Object.entries(result.fields).map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    );
  if (!safeUrlSchema.safeParse(result.url).success) return <p role='alert'>This attachment has an unsupported URL.</p>;
  if (result.type === 'image')
    return (
      <figure>
        <img className='dui-media' src={result.url} alt={result.name} loading='lazy' referrerPolicy='no-referrer' />
        <figcaption>{result.name}</figcaption>
      </figure>
    );
  if (result.type === 'video')
    return (
      <figure>
        <video className='dui-media' src={result.url} controls preload='metadata' aria-label={result.name} />
        <figcaption>{result.name}</figcaption>
      </figure>
    );
  return (
    <a className='dui-link' href={result.url} target='_blank' rel='noreferrer'>
      {result.name} ↗
    </a>
  );
}
