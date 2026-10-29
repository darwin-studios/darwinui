import { useEffect, useState } from 'react';
import { AgentDemo, initialPresentation } from '@darwinui/catalog';
import { createAgentApp } from '@darwinui/mcp/client';
import { DarwinUIProvider } from '@darwinui/react';
import { createRoot } from 'react-dom/client';

import '@darwinui/react/styles.css';

function View() {
  const [presentation, setPresentation] = useState(initialPresentation);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [bridge] = useState(() =>
    createAgentApp({
      name: 'Trail Guide',
      onResult: setPresentation,
      onTheme: setTheme,
      onError: (e) => setError(e.message),
    }),
  );
  useEffect(() => {
    let active = true;
    bridge
      .connect()
      .then(() => {
        if (active) setReady(true);
      })
      .catch((e) => {
        if (active) setError(String(e));
      });
    return () => {
      active = false;
      void bridge.close();
    };
  }, [bridge]);
  return (
    <DarwinUIProvider context={{ theme }}>
      <div className='dui-catalog'>
        {error && <p role='alert'>{error}</p>}
        {ready ? (
          <AgentDemo presentation={presentation} dispatch={(action) => bridge.dispatch('trail_action', action)} />
        ) : (
          <p role='status'>Connecting to MCP host…</p>
        )}
      </div>
    </DarwinUIProvider>
  );
}
createRoot(document.getElementById('root')!).render(<View />);
