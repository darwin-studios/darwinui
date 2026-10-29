'use client';
export function DecisionRequest({
  title,
  agent,
  description,
  details,
  decision,
  onDecision,
  approveLabel = 'Approve and send',
  declineLabel = 'Keep as draft',
  classes = {},
}: {
  classes?: Partial<
    Record<
      'root' | 'status' | 'title' | 'description' | 'details' | 'label' | 'value' | 'actions' | 'approve' | 'decline',
      string
    >
  >;
  approveLabel?: string;
  declineLabel?: string;
  title: string;
  agent: string;
  description: string;
  details: { label: string; value: string }[];
  decision: 'approved' | 'declined' | null;
  onDecision?: (decision: 'approved' | 'declined') => void;
}) {
  return (
    <section aria-label={title} className={classes.root ?? 'dui-card'}>
      <p className={classes.status ?? 'dui-muted'}>
        {agent} · {decision ? (decision === 'approved' ? 'Approved' : 'Declined') : 'Needs your approval'}
      </p>
      <h3 className={classes.title ?? ''}>{title}</h3>
      <p className={classes.description ?? 'dui-muted'}>{description}</p>
      <dl className={classes.details ?? 'dui-facts'}>
        {details.map((item) => (
          <div key={item.label}>
            <dt className={classes.label ?? ''}>{item.label}</dt>
            <dd className={classes.value ?? ''}>{item.value}</dd>
          </div>
        ))}
      </dl>
      {!decision && onDecision && (
        <div className={classes.actions ?? 'dui-actions'}>
          <button type='button' className={classes.approve ?? 'dui-button'} onClick={() => onDecision('approved')}>
            {approveLabel}
          </button>
          <button
            type='button'
            className={classes.decline ?? 'dui-button dui-secondary'}
            onClick={() => onDecision('declined')}
          >
            {declineLabel}
          </button>
        </div>
      )}
    </section>
  );
}
