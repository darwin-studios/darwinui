'use client';

import type { ReactNode } from 'react';

export function ActivityRow({
  name,
  operation,
  status,
  avatar,
  statusIcon,
  children,
  classes = {},
}: {
  name: string;
  operation: string;
  status: string;
  avatar?: ReactNode;
  statusIcon?: ReactNode;
  children?: ReactNode;
  classes?: Partial<Record<'root' | 'summary' | 'name' | 'operation' | 'status' | 'content', string>>;
}) {
  return (
    <details className={classes.root ?? 'dui-message'}>
      <summary className={classes.summary ?? 'dui-activity-summary'}>
        {avatar}
        <span className={classes.name}>{name}</span>
        <span className={classes.operation}>{operation}</span>
        {statusIcon}
        <span className={classes.status}>{status}</span>
      </summary>
      <div className={classes.content}>{children}</div>
    </details>
  );
}
