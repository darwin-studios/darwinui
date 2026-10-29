import { registerAppResource, RESOURCE_MIME_TYPE } from '@modelcontextprotocol/ext-apps/server';
import type { McpServer } from '@modelcontextprotocol/server';

export { registerAppTool, registerAppResource, RESOURCE_MIME_TYPE } from '@modelcontextprotocol/ext-apps/server';
/** Register self-contained HTML. Interactive tools must be registered explicitly. */
export function registerAgentResource(
  server: Pick<McpServer, 'registerResource'>,
  options: { name: string; uri: string; html: string },
) {
  if (!options.uri.startsWith('ui://')) throw new Error('An MCP UI resource must use ui://');
  return registerAppResource(server, options.name, options.uri, {}, async () => ({
    contents: [
      {
        uri: options.uri,
        mimeType: RESOURCE_MIME_TYPE,
        text: options.html,
        _meta: { ui: { csp: { connectDomains: [], resourceDomains: [] } } },
      },
    ],
  }));
}
