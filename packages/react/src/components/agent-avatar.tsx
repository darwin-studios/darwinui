'use client';

import { useState } from 'react';
import { safeUrlSchema, type Agent } from '@darwinui/core';

export function AgentAvatar({ agent, className = '' }: { agent: Agent; className?: string }) {
  const [failed, setFailed] = useState<string>();
  return agent.avatarUrl && failed !== agent.avatarUrl && safeUrlSchema.safeParse(agent.avatarUrl).success ? (
    <img
      className={`dui-avatar ${className}`}
      src={agent.avatarUrl}
      alt=''
      loading='lazy'
      referrerPolicy='no-referrer'
      onError={() => setFailed(agent.avatarUrl)}
    />
  ) : (
    <span className={`dui-avatar dui-monogram ${className}`} aria-hidden='true'>
      {agent.name.trim().slice(0, 2).toUpperCase()}
    </span>
  );
}
