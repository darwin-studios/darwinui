'use client';

import type { Approval } from '@darwinui/core';

import { DecisionRequest } from './decision-request.js';

export function ApprovalCard({
  approval,
  onDecision,
}: {
  approval: Approval;
  onDecision?: (decision: 'accepted' | 'rejected') => void;
}) {
  return (
    <DecisionRequest
      title={approval.title}
      agent='Review'
      description={approval.description ?? ''}
      details={Object.entries(approval.details ?? {}).map(([label, value]) => ({ label, value }))}
      decision={approval.status === 'pending' ? null : approval.status === 'accepted' ? 'approved' : 'declined'}
      approveLabel='Approve'
      declineLabel='Decline'
      onDecision={onDecision ? (decision) => onDecision(decision === 'approved' ? 'accepted' : 'rejected') : undefined}
    />
  );
}
