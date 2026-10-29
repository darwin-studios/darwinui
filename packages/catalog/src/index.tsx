'use client';

import { lazy, Suspense, useState } from 'react';
import {
  ApprovalCard,
  ConversationMessage,
  DarwinUIProvider,
  ResultView,
  TaskWorkspace,
  ThreadList,
} from '@darwinui/react';

import { AgentDemo } from './examples/agent-demo.js';
import { initialPresentation, profiles } from './fixtures/service.js';

export { AgentDemo } from './examples/agent-demo.js';
export { executeDemo, initialPresentation, profiles } from './fixtures/service.js';
const GenerativeThreadDemo = lazy(() =>
  import('./examples/generative-thread.js').then((module) => ({ default: module.GenerativeThreadDemo })),
);
export function DarwinUICatalog() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [userId, setUserId] = useState('default');
  const [mode, setMode] = useState('human');
  const [showGenerative, setShowGenerative] = useState(false);
  const [selectedThread, setSelectedThread] = useState('weekend');
  return (
    <DarwinUIProvider context={{ theme, user: { id: userId } }}>
      <main className='dui-catalog'>
        <header>
          <p className='dui-muted'>DarwinUI · Developer preview</p>
          <h1>Rich interfaces for agents.</h1>
          <p>Build with React. Bring your backend. Reuse the same components in your app and compatible MCP hosts.</p>
        </header>
        <nav aria-label='DarwinUI examples'>
          <a href='#agent-overview'>Agent overview</a>
          <a href='#approval'>Approval</a>
          <a href='#results'>Results</a>
          <a
            href='https://github.com/darwin-studios/darwinui/tree/main/packages/react/src'
            target='_blank'
            rel='noreferrer'
          >
            Component source ↗
          </a>
        </nav>
        <div className='dui-toolbar'>
          <label>
            Appearance{' '}
            <select value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}>
              <option value='light'>Light</option>
              <option value='dark'>Dark</option>
            </select>
          </label>
          <label>
            Example user{' '}
            <select value={userId} onChange={(e) => setUserId(e.target.value)}>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                  {p.location ? ` · ${p.location}` : ''}
                </option>
              ))}
            </select>
          </label>
          <label>
            View{' '}
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value='human'>Human</option>
              <option value='agent'>Agent</option>
            </select>
          </label>
        </div>
        <section className='dui-preview' id='agent-overview'>
          <h2>Agent overview</h2>
          <p className='dui-muted'>
            Fictional data. Personalization changes the destination default; it does not load an account.
          </p>
          {mode === 'human' ? (
            <AgentDemo key={userId} userId={userId} />
          ) : (
            <pre className='dui-code'>
              {JSON.stringify(
                {
                  presentation: initialPresentation,
                  availableActions: initialPresentation.operations.map((o) => ({
                    operationId: o.id,
                    inputFields: o.fields,
                  })),
                  context: profiles.find((p) => p.id === userId),
                },
                null,
                2,
              )}
            </pre>
          )}
        </section>
        <section className='dui-preview' id='approval'>
          <h2>Approval</h2>
          <ApprovalCard
            approval={{
              id: 'example-review',
              title: 'Review itinerary',
              description: 'Read-only approval state. The backend owns authorization.',
              status: 'pending',
              details: { Destination: 'Ozark Mountains' },
            }}
          />
        </section>
        <section className='dui-preview' id='results'>
          <h2>Results and errors</h2>
          <ResultView result={{ type: 'fields', fields: { Destination: 'Ozark Mountains', Duration: '3 days' } }} />
          <ResultView
            result={{ type: 'error', message: 'Example error: the provider is unavailable. No automatic retry.' }}
          />
        </section>
        <section className='dui-preview' id='threads'>
          <h2>Thread workspace</h2>
          <ThreadList
            threads={[
              { id: 'weekend', title: 'Weekend escape', status: 'completed', messages: [] },
              { id: 'packing', title: 'Packing for a hike', status: 'waiting', messages: [] },
            ]}
            selectedId={selectedThread}
            onSelect={setSelectedThread}
          />
          <TaskWorkspace
            agentName='Trail Guide'
            title={selectedThread === 'weekend' ? 'Weekend escape' : 'Packing for a hike'}
            steps={[]}
            selectedStep={null}
            onBack={() => setSelectedThread('weekend')}
            onReveal={() => {}}
          >
            <ConversationMessage author='You'>
              {selectedThread === 'weekend' ? 'Plan a short trip.' : 'What should I bring?'}
            </ConversationMessage>
            <ConversationMessage author='Trail Guide'>
              {selectedThread === 'weekend' ? 'Your sample itinerary is ready.' : 'Where are you heading?'}
            </ConversationMessage>
          </TaskWorkspace>
        </section>
        <section className='dui-preview' id='generative-thread'>
          <h2>Generative thread</h2>
          <button type='button' className='dui-button dui-secondary' onClick={() => setShowGenerative(!showGenerative)}>
            {showGenerative ? 'Close generative example' : 'Open generative example'}
          </button>
          {showGenerative && (
            <Suspense fallback={<p role='status'>Loading runtime composition…</p>}>
              <GenerativeThreadDemo key={userId} userId={userId} />
            </Suspense>
          )}
        </section>
        <footer>
          <p>TypeScript + React · No account required · No telemetry</p>
          <p>
            MCP delivery requires a compatible MCP Apps host. A2A and native renderers are not supported in this
            preview.
          </p>
        </footer>
      </main>
    </DarwinUIProvider>
  );
}
