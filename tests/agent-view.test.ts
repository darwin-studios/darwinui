import { expect, it } from 'vitest';

import { initialPresentation } from '../packages/catalog/src/fixtures/service';
import { presentationForAgent, renderAgentView } from '../packages/core/src/index';

it('renders both sides from the same identity, fields, progress, approvals and results', () => {
  const p = {
    ...initialPresentation,
    steps: [{ id: 's', title: 'Working', status: 'running' as const }],
    approval: { id: 'a', title: 'Confirm', description: 'Review exact terms', status: 'pending' as const },
    results: [{ type: 'fields' as const, fields: { price: '$12.30' } }],
  };
  const view = presentationForAgent(p, { id: 't', title: 'Trip', status: 'waiting', messages: [] });
  expect(view.components.map((c) => c.kind)).toEqual([
    'identity',
    'operation',
    'operation',
    'thread',
    'progress',
    'approval',
    'result.fields',
  ]);
  expect(view.components.find((c) => c.kind === 'operation')?.data).toEqual(p.operations[0]);
  expect(JSON.parse(renderAgentView(view))).toEqual(view);
  expect(view.components.find((c) => c.kind === 'approval')?.actions).toEqual([]);
  expect(view.components.find((c) => c.kind === 'operation')?.actions[0].available).toBe(false);
});
it('retains every supported result type without executing markup', () => {
  const results = [
    { type: 'text', text: '<script>bad()</script>' },
    { type: 'fields', fields: { a: 'b' } },
    ...['image', 'video', 'file'].map((type) => ({ type, name: 'Artifact', url: 'https://example.com/a' })),
    { type: 'error', message: 'Unavailable' },
  ];
  const view = presentationForAgent({ ...initialPresentation, results } as never);
  expect(view.components.filter((c) => c.kind.startsWith('result.')).map((c) => c.data)).toEqual(results);
});
