import { describe, expect, it } from 'vitest';

import { executeDemo, initialPresentation } from '../packages/catalog/src/fixtures/service';
import { actionJsonSchema, chooseInterface, presentationSchema, validateInput } from '../packages/core/src/index';

describe('portable contracts', () => {
  it('rejects malformed results and executable URLs', () => {
    expect(
      presentationSchema.safeParse({ ...initialPresentation, results: [{ type: 'script', text: 'alert(1)' }] }).success,
    ).toBe(false);
    expect(
      presentationSchema.safeParse({
        ...initialPresentation,
        agent: { id: 'a', name: 'A', avatarUrl: 'javascript:alert(1)' },
      }).success,
    ).toBe(false);
  });
  it('validates required and bounded inputs', () => {
    expect(validateInput(initialPresentation.operations[0], { days: 0 })).toHaveProperty('destination');
    expect(validateInput(initialPresentation.operations[0], { destination: 'Arkansas', days: 15 })).toHaveProperty(
      'days',
    );
  });
  it('exports a cross-language action schema', () => {
    expect(actionJsonSchema).toHaveProperty('properties.operationId');
  });
  it('uses one operation for the web and MCP example', async () => {
    const r = await executeDemo({ id: 'test', operationId: 'plan-trip', input: { destination: 'Arkansas', days: 3 } });
    expect(r.results[0]).toMatchObject({ type: 'text', text: expect.stringContaining('Arkansas') });
    await expect(executeDemo({ id: 'x', operationId: 'delete', input: {} })).rejects.toThrow('Unknown operation');
  });
  it('uses only negotiated creator UIs and honest fallback', () => {
    expect(
      chooseInterface({
        offer: { kind: 'mcp-app', resourceUri: 'ui://agent/view' },
        supportsMcpApps: true,
        hasPresentation: true,
      }).kind,
    ).toBe('creator');
    expect(chooseInterface({ supportsMcpApps: false, hasPresentation: true }).kind).toBe('standard');
    expect(chooseInterface({ supportsMcpApps: true, hasPresentation: false }).kind).toBe('unavailable');
  });
});
