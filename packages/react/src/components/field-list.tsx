'use client';

export function FieldList({
  fields,
  className = 'dui-facts',
}: {
  fields: readonly { label: string; value: string }[];
  className?: string;
}) {
  return (
    <dl className={className}>
      {fields.map((field, index) => (
        <div key={index}>
          <dt>{field.label}</dt>
          <dd>{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}
