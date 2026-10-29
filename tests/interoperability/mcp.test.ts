// @vitest-environment node
import { resolve } from 'node:path';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { expect, it } from 'vitest';

it('initializes a real stdio MCP server, reads its app, and executes the shared operation', async () => {
  const client = new Client({ name: 'darwinui-test', version: '0.1.0' });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [resolve('node_modules/tsx/dist/cli.mjs'), resolve('examples/mcp-agent/server.ts')],
    stderr: 'pipe',
  });
  try {
    await client.connect(transport);
    const tools = await client.listTools();
    expect(tools.tools.map((t) => t.name)).toContain('trail_action');
    const resource = await client.readResource({ uri: 'ui://trail-guide/agent.html' });
    expect(resource.contents[0]).toMatchObject({ mimeType: 'text/html;profile=mcp-app' });
    const result = await client.callTool({
      name: 'trail_action',
      arguments: { id: 'roundtrip', operationId: 'plan-trip', input: { destination: 'Arkansas', days: 3 } },
    });
    expect(result.structuredContent).toMatchObject({
      results: [{ type: 'text', text: expect.stringContaining('Arkansas') }, { type: 'fields' }],
    });
    const invalid = await client.callTool({
      name: 'trail_action',
      arguments: { id: 'invalid', operationId: 'plan-trip', input: { days: 0 } },
    });
    expect(invalid.isError).toBe(true);
  } finally {
    await client.close();
  }
}, 15000);
