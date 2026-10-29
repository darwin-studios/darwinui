'use client';
import { Fragment, useEffect, useId, useState } from 'react';

export type ExampleSource = { code: string; file: string };
export type SourceLoader = (id: string) => Promise<ExampleSource>;
const tokens = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\/[^\n]*|\b(?:import|from|export|const|let|function|return|type|interface|async|await|if|else|new)\b)/g;
function Highlight({ code }: { code: string }) {
  return <>{code.split(tokens).map((part, i) => {
    const kind = /^(["'`])/.test(part) ? 'string' : part.startsWith('//') ? 'comment' : /^(import|from|export|const|let|function|return|type|interface|async|await|if|else|new)$/.test(part) ? 'keyword' : undefined;
    return kind ? <span className={`dui-syntax-${kind}`} key={i}>{part}</span> : <Fragment key={i}>{part}</Fragment>;
  })}</>;
}
export function PreviewTabs({ title, code, onChange }: { title: string; code: boolean; onChange: (code: boolean) => void }) {
  return <div className='dui-preview-tabs' role='group' aria-label={`${title} display`}>
    <button type='button' aria-pressed={!code} onClick={() => onChange(false)}>Preview</button>
    <button type='button' aria-pressed={code} onClick={() => onChange(true)}>Code</button>
  </div>;
}
export function CodePreview({ source, loadSource, id, theme }: { theme?: 'light' | 'dark'; source?: ExampleSource; loadSource?: SourceLoader; id: string }) {
  const [value, setValue] = useState(source);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelId = useId();
  useEffect(() => {
    let active = true;
    setValue(source); setError(false);
    if (!source && loadSource) loadSource(id).then(value => { if (active) setValue(value); }, () => { if (active) setError(true); });
    return () => { active = false; };
  }, [source, loadSource, id]);
  useEffect(() => { if (copied) { const timer = setTimeout(() => setCopied(false), 2000); return () => clearTimeout(timer); } }, [copied]);
  const copy = async () => { try { await navigator.clipboard.writeText(value?.code ?? ''); setCopied(true); } catch { setError(true); } };
  const long = (value?.code.split('\n').length ?? 0) > 12;
  return <div className='dui-code-panel' data-theme={theme}>
    <div className='dui-code-file'><span>{value?.file ?? 'Source'}</span><button type='button' onClick={copy} disabled={!value}>{copied ? 'Copied' : 'Copy code'}</button></div>
    <div id={panelId} className='dui-code-body' data-collapsed={long && !expanded}>
      <pre tabIndex={0} aria-label='Example source code'><code>{value ? <Highlight code={value.code} /> : error ? 'Source could not be loaded. Reload this example to try again.' : 'Loading source…'}</code></pre>
      {long && !expanded && <div className='dui-code-fade' />}
    </div>
    {long && <button type='button' className='dui-code-expand' aria-expanded={expanded} aria-controls={panelId} onClick={() => setExpanded(!expanded)}>{expanded ? 'Show less' : 'Show more'}</button>}
    <span role='status' className='dui-code-status'>{copied ? 'Code copied' : error && value ? 'Copy failed. Select the code to copy it.' : ''}</span>
  </div>;
}
export function DesignExample({ id, title, children, loadSource }: { id: string; title: string; children: React.ReactNode; loadSource: SourceLoader }) {
  const [code, setCode] = useState(false);
  return <section className='dui-design-example' id={id}>
    <header><h2>{title}</h2><PreviewTabs title={title} code={code} onChange={setCode}/></header>
    <div hidden={code} className='dui-preview'>{children}</div>
    {code && <CodePreview id={id} loadSource={loadSource}/>}
  </section>;
}
