import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import { AgentDemo } from '../packages/catalog/src/examples/agent-demo';
import { initialPresentation } from '../packages/catalog/src/fixtures/service';

afterEach(cleanup);
it('validates then submits once and renders the backend result', async () => {
  const dispatch = vi
    .fn()
    .mockResolvedValue({ ...initialPresentation, results: [{ type: 'text', text: 'A real handler result' }] });
  render(<AgentDemo dispatch={dispatch} />);
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
  expect(dispatch).not.toHaveBeenCalled();
  expect(screen.getByRole('alert').textContent).toContain('required');
  fireEvent.change(screen.getByLabelText('Destination *'), { target: { value: 'Arkansas' } });
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
  fireEvent.click(screen.getByRole('button', { name: 'Working…' }));
  await waitFor(() => expect(screen.getByText('A real handler result')).toBeTruthy());
  expect(dispatch).toHaveBeenCalledTimes(1);
});
it('discard late responses when the user scope changes', async () => {
  let finish!: (v: unknown) => void;
  const dispatch = vi.fn(
    () =>
      new Promise<any>((resolve) => {
        finish = resolve;
      }),
  );
  const { rerender } = render(<AgentDemo userId='joanne' dispatch={dispatch} />);
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
  rerender(<AgentDemo userId='alex' dispatch={dispatch} />);
  finish({ ...initialPresentation, results: [{ type: 'text', text: 'Joanne private result' }] });
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(screen.queryByText('Joanne private result')).toBeNull();
  expect((screen.getByLabelText('Destination *') as HTMLInputElement).value).toBe('Scottish Highlands');
});
it('does not automatically retry failures', async () => {
  const dispatch = vi.fn().mockRejectedValue(new Error('Offline'));
  render(<AgentDemo userId='joanne' dispatch={dispatch} />);
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
  await waitFor(() => expect(screen.getByRole('alert').textContent).toBe('Offline'));
  expect(dispatch).toHaveBeenCalledTimes(1);
});
