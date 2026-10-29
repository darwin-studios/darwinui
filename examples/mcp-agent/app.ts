import { readFile } from 'node:fs/promises';
import { executeDemo, initialPresentation } from '@darwinui/catalog/fixtures';
import { actionSchema } from '@darwinui/core';
import { registerAgentResource, registerAppTool } from '@darwinui/mcp/server';
import { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';

export async function createDemoServer() {
  const server = new McpServer({ name: 'darwinui-example', version: '0.1.0' });
  const uri = 'ui://trail-guide/agent.html';
  registerAgentResource(server, {
    name: 'Trail Guide',
    uri,
    html: await readFile(new URL('./dist/agent.html', import.meta.url), 'utf8'),
  });
  registerAppTool(
    server,
    'trail_guide',
    {
      description: 'Open the fictional travel planner',
      inputSchema: z.object({}),
      _meta: { ui: { resourceUri: uri } },
    },
    async () => ({
      content: [{ type: 'text', text: 'Plan a fictional trip. No bookings or charges.' }],
      structuredContent: initialPresentation,
    }),
  );
  registerAppTool(
    server,
    'trail_action',
    {
      description: 'Prepare a fictional trip or packing list',
      inputSchema: actionSchema,
      _meta: { ui: { resourceUri: uri, visibility: ['app', 'model'] } },
    },
    async (action) => {
      try {
        const result = await executeDemo(action);
        return {
          content: [
            {
              type: 'text',
              text: result.results
                .filter((r) => r.type === 'text')
                .map((r) => r.text)
                .join('\n'),
            },
          ],
          structuredContent: result,
        };
      } catch (error) {
        return {
          isError: true,
          content: [{ type: 'text', text: error instanceof Error ? error.message : 'Invalid action' }],
        };
      }
    },
  );
  return server;
}
