'use client';

import React, { useId } from 'react';

/** Scalar input presentation only. The host validates the reviewed schema again before dispatch. */
export type ScalarField = {
  name: string;
  description?: string | null;
  required: boolean;
  valueType: string;
  allowedValues: readonly (string | number | boolean)[];
  minimum?: number | null;
  maximum?: number | null;
  minLength?: number | null;
  maxLength?: number | null;
  format?: string | null;
};
export function ScalarFields({
  fields,
  values,
  onChange,
  disabled = false,
  className = 'dui-scalar-fields',
}: {
  fields: readonly ScalarField[];
  values: Readonly<Record<string, string>>;
  onChange: (name: string, value: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const prefix = useId();
  return (
    <div className={className}>
      {fields.map((field) => {
        const id = `${prefix}-${field.name}`;
        if (!['string', 'number', 'integer', 'boolean'].includes(field.valueType))
          return (
            <p key={field.name} role='status'>
              {field.name}: use the provider interface for this input type.
            </p>
          );
        const options = field.allowedValues.length
          ? field.allowedValues
          : field.valueType === 'boolean'
            ? [true, false]
            : null;
        return (
          <label key={field.name} htmlFor={id}>
            <span>
              {field.name.replaceAll(/[_.-]/g, ' ')}
              {field.required ? ' *' : ''}
            </span>
            {field.description ? <small>{field.description}</small> : null}
            {options ? (
              <select
                id={id}
                value={values[field.name] || ''}
                required={field.required}
                disabled={disabled}
                onChange={(event) => onChange(field.name, event.target.value)}
              >
                <option value=''>Select a value</option>
                {options.map((option) => (
                  <option key={String(option)} value={String(option)}>
                    {String(option)}
                  </option>
                ))}
              </select>
            ) : field.format === 'multiline' ? (
              <textarea
                id={id}
                rows={4}
                value={values[field.name] || ''}
                required={field.required}
                disabled={disabled}
                minLength={field.minLength ?? undefined}
                maxLength={Math.min(field.maxLength ?? 8000, 8000)}
                onChange={(event) => onChange(field.name, event.target.value)}
              />
            ) : (
              <input
                id={id}
                type={field.valueType === 'string' ? 'text' : 'number'}
                inputMode={
                  field.valueType === 'string' ? 'text' : field.valueType === 'integer' ? 'numeric' : 'decimal'
                }
                step={field.valueType === 'integer' ? 1 : 'any'}
                min={field.minimum ?? undefined}
                max={field.maximum ?? undefined}
                minLength={field.minLength ?? undefined}
                maxLength={Math.min(field.maxLength ?? 8000, 8000)}
                value={values[field.name] || ''}
                required={field.required}
                disabled={disabled}
                onChange={(event) => onChange(field.name, event.target.value)}
              />
            )}
          </label>
        );
      })}
    </div>
  );
}
