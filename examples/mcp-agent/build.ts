import { mkdir, writeFile } from 'node:fs/promises';
import { buildAgentHtml } from '@darwinui/mcp/build';

await mkdir('dist', { recursive: true });
await writeFile('dist/agent.html', await buildAgentHtml(new URL('./view.tsx', import.meta.url).pathname));
