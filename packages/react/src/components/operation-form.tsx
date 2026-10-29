'use client';

import { useId, useState, type ChangeEvent } from 'react';
import { validateInput, type ActionIntent, type Operation } from '@darwinui/core';

import { Button } from './button.js';

export function OperationForm({
  operation,
  onSubmit,
  pending = false,
  initialValues = {},
}: {
  operation: Operation;
  onSubmit: (intent: ActionIntent) => void;
  pending?: boolean;
  initialValues?: Record<string, string | number>;
}) {
  const prefix = useId();
  const [input, setInput] = useState<Record<string, string | number>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <form
      className='dui-form'
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (pending) return;
        const next = validateInput(operation, input);
        setErrors(next);
        if (!Object.keys(next).length) onSubmit({ id: crypto.randomUUID(), operationId: operation.id, input });
      }}
    >
      <h3>{operation.name}</h3>
      {operation.description && <p className='dui-muted'>{operation.description}</p>}
      {operation.fields.map((field) => {
        const id = `${prefix}-${field.name}`;
        const props = {
          id,
          name: field.name,
          required: field.required,
          disabled: pending,
          'aria-invalid': !!errors[field.name],
          'aria-describedby': errors[field.name] ? id + '-error' : undefined,
          value: input[field.name] ?? '',
          onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            setInput((prev) => ({
              ...prev,
              [field.name]: field.type === 'number' && e.target.value !== '' ? Number(e.target.value) : e.target.value,
            })),
        };
        return (
          <div className='dui-field' key={field.name}>
            <label htmlFor={id}>
              {field.label}
              {field.required ? ' *' : ''}
            </label>
            {field.type === 'select' ? (
              <select {...props}>
                <option value=''>Select…</option>
                {field.options?.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input {...props} type={field.type} min={field.minimum} max={field.maximum} />
            )}
            {errors[field.name] && (
              <span id={id + '-error'} role='alert' className='dui-error'>
                {errors[field.name]}
              </span>
            )}
          </div>
        );
      })}
      <Button type='submit' disabled={pending}>
        {pending ? 'Working…' : 'Continue'}
      </Button>
    </form>
  );
}
