'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { presentationForAgent, renderAgentView, type ActionIntent, type Presentation } from '@darwinui/core';
import { ConversationMessage, OperationForm, Results, useAction, WorkProgress } from '@darwinui/react';
import { createLibrary, createParser, defineComponent, Renderer } from '@openuidev/react-lang';
import { z } from 'zod';

import { executeDemo, initialPresentation, profiles } from '../fixtures/service.js';
import { composeDemoThread } from '../fixtures/thread.js';

type Binding = {
  presentation: Presentation;
  pending: boolean;
  destination: string;
  run: (action: ActionIntent) => void;
};
const Bindings = createContext<Binding | null>(null);
function useBindings() {
  const value = useContext(Bindings);
  if (!value) throw new Error('Missing thread bindings');
  return value;
}
const Message = defineComponent({
  name: 'Message',
  description: 'A plain text message, never HTML',
  props: z.object({ author: z.string().max(80), text: z.string().max(4000) }),
  component: ({ props }) => <ConversationMessage author={props.author}>{props.text}</ConversationMessage>,
});
const Input = defineComponent({
  name: 'OperationInput',
  description: 'Present a declared operation by ID. The host supplies its validated fields and dispatch function.',
  props: z.object({ operationId: z.string().max(200) }),
  component: ({ props }) => {
    const b = useBindings();
    const op = b.presentation.operations.find((op) => op.id === props.operationId);
    return op ? (
      <OperationForm
        key={op.id}
        operation={op}
        pending={b.pending}
        initialValues={{ destination: b.destination, days: 3 }}
        onSubmit={b.run}
      />
    ) : (
      <p role='status'>This operation is unavailable.</p>
    );
  },
});
const Progress = defineComponent({
  name: 'Progress',
  description: 'Show recorded execution steps from the current thread',
  props: z.object({}),
  component: () => {
    const b = useBindings();
    return (
      <WorkProgress
        steps={b.pending ? [{ id: 'work', title: 'Preparing your plan', status: 'running' }] : b.presentation.steps}
      />
    );
  },
});
const Output = defineComponent({
  name: 'Output',
  description: 'Show recorded backend results. Generated prose cannot fabricate a completed operation.',
  props: z.object({}),
  component: () => {
    const b = useBindings();
    return <Results results={b.presentation.results} />;
  },
});
const Thread = defineComponent({
  name: 'Thread',
  description: 'A bounded composition of registered thread components',
  props: z.object({ sections: z.array(z.union([Message.ref, Input.ref, Progress.ref, Output.ref])).max(12) }),
  component: ({ props, renderNode }) => <div className='dui-generated-thread'>{renderNode(props.sections)}</div>,
});
export const threadLibrary = createLibrary({ root: 'Thread', components: [Thread, Message, Input, Progress, Output] });
// Parser schemas describe a catalog; validate the resolved tree before rendering it.
const elementMetadata = { type: z.literal('element'), partial: z.literal(false), hasDynamicProps: z.literal(false) };
const resolvedSection = z.discriminatedUnion('typeName', [
  z.object({
    ...elementMetadata,
    typeName: z.literal('Message'),
    props: z.object({ author: z.string().max(80), text: z.string().max(4000) }).strict(),
  }),
  z.object({
    ...elementMetadata,
    typeName: z.literal('OperationInput'),
    props: z.object({ operationId: z.string().max(200) }).strict(),
  }),
  z.object({ ...elementMetadata, typeName: z.literal('Progress'), props: z.object({}).strict() }),
  z.object({ ...elementMetadata, typeName: z.literal('Output'), props: z.object({}).strict() }),
]);
const resolvedThread = z.object({
  ...elementMetadata,
  typeName: z.literal('Thread'),
  props: z.object({ sections: z.array(resolvedSection).max(12) }).strict(),
});
export function validateThreadSource(source: string) {
  if (source.length > 32000) return false;
  try {
    const parsed = createParser(threadLibrary.toJSONSchema()).parse(source);
    return (
      !parsed.meta.incomplete &&
      !parsed.meta.errors.length &&
      !parsed.meta.unresolved.length &&
      !Object.keys(parsed.stateDeclarations).length &&
      !parsed.queryStatements.length &&
      !parsed.mutationStatements.length &&
      resolvedThread.safeParse(parsed.root).success
    );
  } catch {
    return false;
  }
}
/** Optional OpenUI integration. The public React package has no parser dependency. */
export function GenerativeThreadDemo({
  userId = 'default',
  mode = 'human',
}: {
  userId?: string;
  mode?: 'human' | 'agent';
}) {
  const profile = profiles.find((p) => p.id === userId) ?? profiles[0];
  const action = useAction(executeDemo, userId);
  const presentation = action.value ?? initialPresentation;
  const source = useMemo(() => composeDemoThread(profile, !!action.value), [profile, action.value]);
  const [inspect, setInspect] = useState(false);
  const valid = useMemo(() => validateThreadSource(source), [source]);
  if (mode === 'agent')
    return (
      <pre className='dui-code' tabIndex={0}>
        {renderAgentView(presentationForAgent(presentation))}
      </pre>
    );
  return (
    <>
      <p className='dui-muted'>
        Runtime composition using a constrained OpenUI catalog. This deterministic example does not call an LLM.
      </p>
      <button
        type='button'
        className='dui-button dui-secondary'
        aria-pressed={inspect}
        onClick={() => setInspect(!inspect)}
      >
        {inspect ? 'Show interface' : 'Inspect generated composition'}
      </button>
      {inspect ? (
        <pre className='dui-code'>{source}</pre>
      ) : valid ? (
        <Bindings.Provider
          value={{ presentation, pending: action.pending, destination: profile.destination, run: action.run }}
        >
          <Renderer response={source} library={threadLibrary} />
        </Bindings.Provider>
      ) : (
        <p role='alert'>The generated interface is unsupported. Use the structured operation instead.</p>
      )}
      {action.error && <p role='alert'>{action.error}</p>}
    </>
  );
}
