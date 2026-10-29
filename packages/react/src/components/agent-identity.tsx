'use client';

import type { ReactNode } from 'react';
import type { Agent } from '@darwinui/core';

import { AgentAvatar } from './agent-avatar.js';

export function AgentIdentity({
  agent,
  avatar,
  className = '',
  headingLevel = 1,
}: {
  agent: Agent;
  avatar?: ReactNode;
  className?: string;
  headingLevel?: 1 | 2 | 3;
}) {
  const Heading = `h${headingLevel}` as 'h1' | 'h2' | 'h3';
  return (
    <header className={`dui-identity ${className}`}>
      {avatar ?? <AgentAvatar agent={agent} />}
      <Heading>{agent.name}</Heading>
      {agent.description && <p>{agent.description}</p>}
    </header>
  );
}
