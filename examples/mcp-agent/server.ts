import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';

import { createDemoServer } from './app.js';

const server = await createDemoServer();
await server.connect(new StdioServerTransport());
