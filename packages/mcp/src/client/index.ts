import { actionSchema, presentationSchema, type ActionIntent, type Presentation } from '@darwinui/core';
import { App } from '@modelcontextprotocol/ext-apps';

export { App };
/** Thin bridge: the caller explicitly selects the backend tool. No automatic retries. */
export function createAgentApp(options: {
  name: string;
  onResult: (value: Presentation) => void;
  onTheme?: (theme: 'light' | 'dark') => void;
  onError?: (error: Error) => void;
}) {
  const app = new App({ name: options.name, version: '0.1.0' }, {}, { autoResize: true });
  const accept = (value: unknown) => {
    const parsed = presentationSchema.safeParse(value);
    if (parsed.success) options.onResult(parsed.data);
    else options.onError?.(new Error('Unsupported presentation data'));
  };
  app.ontoolresult = (result) => {
    if (result.isError) options.onError?.(new Error('The tool returned an error'));
    else accept(result.structuredContent);
  };
  app.onhostcontextchanged = (ctx) => {
    if (ctx.theme) options.onTheme?.(ctx.theme);
  };
  return {
    app,
    async connect() {
      await app.connect();
      const theme = app.getHostContext()?.theme;
      if (theme) options.onTheme?.(theme);
    },
    async dispatch(tool: string, action: ActionIntent) {
      if (!app.getHostCapabilities()?.serverTools) throw new Error('This host does not support interactive tool calls');
      const result = await app.callServerTool({ name: tool, arguments: actionSchema.parse(action) });
      if (result.isError) throw new Error('The operation failed');
      return presentationSchema.parse(result.structuredContent);
    },
    close: () => app.close(),
  };
}
