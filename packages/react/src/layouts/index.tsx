'use client';

import type { ReactNode, Ref } from 'react';
import type { Agent } from '@darwinui/core';

import { AgentIdentity } from '../components/index.js';

export function AgentOverview({
  agent,
  avatar,
  composer,
  operations,
  history,
  personalContext,
  headingLevel = 1,
  classes = {},
}: {
  agent: Agent;
  headingLevel?: 1 | 2 | 3;
  avatar?: ReactNode;
  composer?: ReactNode;
  operations: ReactNode;
  history?: ReactNode;
  personalContext?: { savedThreadCount: number };
  classes?: Partial<Record<'identity' | 'composer' | 'section' | 'threads' | 'personal', string>>;
}) {
  return (
    <>
      <AgentIdentity headingLevel={headingLevel} agent={agent} avatar={avatar} className={classes.identity} />
      <div className={classes.composer ?? 'dui-composer'}>{composer}</div>
      {personalContext && personalContext.savedThreadCount > 0 && (
        <p className={classes.personal ?? 'dui-personal'}>
          Your work with {agent.name} · {personalContext.savedThreadCount} saved{' '}
          {personalContext.savedThreadCount === 1 ? 'thread' : 'threads'}
        </p>
      )}
      <section className={classes.section ?? 'dui-section'} aria-label='Work with this agent'>
        {operations}
      </section>
      <section className={classes.threads ?? 'dui-section'} aria-label='Your saved work'>
        {history}
      </section>
    </>
  );
}
export function TaskWorkspace({
  agentName,
  title,
  steps,
  selectedStep,
  onBack,
  onReveal,
  canvasRef,
  children,
  backIcon,
  classes = {},
}: {
  agentName: string;
  title: string;
  steps: readonly { id: string; title: string }[];
  selectedStep: string | null;
  onBack: () => void;
  onReveal: (id: string) => void;
  canvasRef?: Ref<HTMLDivElement>;
  children: ReactNode;
  backIcon?: ReactNode;
  classes?: Partial<Record<'topbar' | 'back' | 'threadTitle' | 'index' | 'canvas', string>>;
}) {
  return (
    <>
      <header className={classes.topbar ?? 'dui-task-header'}>
        <button type='button' className={classes.back ?? 'dui-button dui-secondary'} onClick={onBack}>
          {backIcon ?? <span aria-hidden='true'>←</span>} Back
        </button>
        <span className={classes.threadTitle}>
          {agentName} / {title}
        </span>
      </header>
      <nav className={classes.index ?? 'dui-task-index'} aria-label='Thread steps'>
        <h2>{title}</h2>
        {steps.map((step, index) => (
          <button
            key={step.id}
            type='button'
            aria-current={selectedStep === step.id ? 'step' : undefined}
            onClick={() => onReveal(step.id)}
          >
            {index + 1}. {step.title}
          </button>
        ))}
      </nav>
      <div className={classes.canvas ?? 'dui-task-canvas'} data-thread-canvas ref={canvasRef}>
        {children}
      </div>
    </>
  );
}
