'use client';

import { useState } from 'react';
import type { ActionDispatcher, Presentation } from '@darwinui/core';
import { AgentOverview, CapabilityList, OperationForm, Results, useAction, WorkProgress } from '@darwinui/react';

import { executeDemo, initialPresentation, profiles } from '../fixtures/service.js';

export function AgentDemo({
  userId = 'default',
  dispatch = executeDemo,
  presentation = initialPresentation,
}: {
  userId?: string;
  dispatch?: ActionDispatcher;
  presentation?: Presentation;
}) {
  const [selected, setSelected] = useState(presentation.operations[0]?.id);
  const operation = presentation.operations.find((op) => op.id === selected);
  const state = useAction(dispatch, userId);
  const profile = profiles.find((p) => p.id === userId) ?? profiles[0];
  return (
    <AgentOverview
      headingLevel={3}
      agent={presentation.agent}
      operations={
        <>
          <CapabilityList operations={presentation.operations} selectedId={selected} onSelect={setSelected} />
          {operation && (
            <OperationForm
              key={`${userId}:${operation.id}`}
              operation={operation}
              initialValues={{ destination: profile.destination, days: 3 }}
              pending={state.pending}
              onSubmit={state.run}
            />
          )}
          <WorkProgress
            steps={
              state.pending
                ? [{ id: 'work', title: 'Preparing your plan', status: 'running' }]
                : (state.value?.steps ?? presentation.steps)
            }
          />
          {state.error && <p role='alert'>{state.error}</p>}
          <Results results={state.value?.results ?? presentation.results} />
        </>
      }
    />
  );
}
