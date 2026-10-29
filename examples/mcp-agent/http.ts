import { serve } from '@hono/node-server';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/server';

import { createDemoServer } from './app.js';

// Loopback-only development transport for testing in the official MCP Apps reference host.
const allowedOrigins = new Set(['http://localhost:8080', 'http://127.0.0.1:8080']);
serve({
  hostname: '127.0.0.1',
  port: 4317,
  fetch: async (request) => {
    const origin = request.headers.get('origin');
    if (origin && !allowedOrigins.has(origin)) return new Response('Origin not allowed', { status: 403 });
    if (new URL(request.url).pathname != '/mcp') return new Response('Not found', { status: 404 });
    const headers = {
      'Access-Control-Allow-Origin': origin ?? 'http://localhost:8080',
      'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, mcp-protocol-version, mcp-session-id',
      'Access-Control-Expose-Headers': 'mcp-session-id',
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    const server = await createDemoServer();
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    await server.connect(transport);
    try {
      const response = await transport.handleRequest(request);
      for (const [key, value] of Object.entries(headers)) response.headers.set(key, value);
      return response;
    } finally {
      await server.close();
    }
  },
});
console.log('Fictional MCP server: http://127.0.0.1:4317/mcp');
