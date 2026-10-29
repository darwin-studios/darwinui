import { build } from 'vite';

/** Build a self-contained iframe document, including React. No runtime CDN. */
export async function buildAgentHtml(entry: string): Promise<string> {
  const result = await build({
    configFile: false,
    logLevel: 'warn',
    esbuild: { jsx: 'automatic' },
    build: {
      write: false,
      minify: true,
      lib: { entry, name: 'DarwinAgentUI', formats: ['iife'] },
      rollupOptions: { output: { inlineDynamicImports: true } },
    },
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  });
  const outputs = Array.isArray(result) ? result.flatMap((r) => r.output) : 'output' in result ? result.output : [];
  const js = outputs
    .filter((o) => o.type === 'chunk')
    .map((o) => o.code)
    .join('\n')
    .replace(/<\/script/gi, '<\\/script');
  const css = outputs
    .filter((o) => o.type === 'asset' && o.fileName.endsWith('.css'))
    .map((o) => (o.type === 'asset' ? String(o.source) : ''))
    .join('\n')
    .replace(/<\/style/gi, '<\\/style');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Agent interface</title><style>${css}</style></head><body style="margin:0"><div id="root"></div><script>${js}</script></body></html>`;
}
