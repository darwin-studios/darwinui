import { afterEach, expect, it, vi } from 'vitest';

import { initialPresentation } from '../../packages/catalog/src/fixtures/service';
import { App, createAgentApp } from '../../packages/mcp/src/client/index';

afterEach(() => vi.restoreAllMocks());
it('delivers validated results and host appearance', async () => {
  vi.spyOn(App.prototype, 'connect').mockResolvedValue();
  vi.spyOn(App.prototype, 'getHostContext').mockReturnValue({ theme: 'dark' } as any);
  const onResult = vi.fn(),
    onTheme = vi.fn(),
    onError = vi.fn();
  const bridge = createAgentApp({ name: 'test', onResult, onTheme, onError });
  await bridge.connect();
  expect(onTheme).toHaveBeenCalledWith('dark');
  bridge.app.ontoolresult?.({ structuredContent: initialPresentation } as any);
  expect(onResult).toHaveBeenCalledWith(initialPresentation);
  bridge.app.ontoolresult?.({ structuredContent: { bad: true } } as any);
  expect(onError).toHaveBeenCalled();
  bridge.app.onhostcontextchanged?.({ theme: 'light' });
  expect(onTheme).toHaveBeenLastCalledWith('light');
});
it('rejects unsupported calls and does not retry errors', async () => {
  const capability = vi.spyOn(App.prototype, 'getHostCapabilities').mockReturnValue({});
  const call = vi.spyOn(App.prototype, 'callServerTool').mockResolvedValue({ isError: true, content: [] });
  const bridge = createAgentApp({ name: 'test', onResult: vi.fn() });
  const action = { id: 'x', operationId: 'plan-trip', input: {} };
  await expect(bridge.dispatch('plan', action)).rejects.toThrow('does not support');
  expect(call).not.toHaveBeenCalled();
  capability.mockReturnValue({ serverTools: {} });
  await expect(bridge.dispatch('plan', action)).rejects.toThrow('failed');
  expect(call).toHaveBeenCalledTimes(1);
});
