import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';

import { GenerativeThreadDemo, validateThreadSource } from '../packages/catalog/src/examples/generative-thread';
import { composeDemoThread } from '../packages/catalog/src/fixtures/thread';

afterEach(cleanup);
it('only accepts registered, bounded thread compositions', () => {
  expect(validateThreadSource(composeDemoThread({ name: 'Joanne', location: 'Arkansas' }, false))).toBe(true);
  expect(validateThreadSource('root = ExecuteJavaScript("bad")')).toBe(false);
  expect(validateThreadSource('x'.repeat(32001))).toBe(false);
  expect(validateThreadSource('root = Thread([' + Array(13).fill('Progress()').join(',') + '])')).toBe(false);
  expect(validateThreadSource('root = Thread([Message("a", ' + JSON.stringify('x'.repeat(4001)) + ')])')).toBe(false);
  expect(validateThreadSource('root = Thread([Message("a",')).toBe(false);
});
it('changes composition at runtime from input to recorded result and next operation', async () => {
  render(<GenerativeThreadDemo userId='joanne' />);
  expect(screen.getByText(/Hello Joanne/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Continue', exact: true }));
  await waitFor(() => expect(screen.getByText(/Your 3-day trip/)).toBeTruthy());
  expect(screen.getByRole('heading', { name: 'Make a packing list' })).toBeTruthy();
  expect(screen.queryByLabelText('Days *')).toBeNull();
});
