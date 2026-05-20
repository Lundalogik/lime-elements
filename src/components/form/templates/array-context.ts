import { createContext } from 'react';
import { ErrorSchema } from '@rjsf/utils';
import { FormSchema } from '../form.types';

export interface ArrayFieldOptions {
    arraySchema: FormSchema;
    formData: any[];
}

export const ArrayFieldContext = createContext<ArrayFieldOptions | null>(null);

/**
 * The array's validation errors as an RJSF `errorSchema`, keyed by item
 * index (e.g. `{ 1: { phone: { __errors: [...] } } }`).
 *
 * RJSF passes `errorSchema` to the array *field* (`FieldProps`) but, for
 * non-fixed arrays, does not forward it to `ArrayFieldItemTemplate` — so
 * the custom `ArrayField` shares it here for each item to read its own
 * slice (`errorSchema[index]`). This lets a collapsed item flag itself as
 * invalid without rendering (and DOM-walking) its hidden children.
 */
export const ArrayItemErrorsContext = createContext<ErrorSchema | null>(null);
