import { createContext } from 'react';
import { FormSchema } from '../form.types';

export interface ArrayFieldOptions {
    arraySchema: FormSchema;
    formData: any[];
}

export const ArrayFieldContext = createContext<ArrayFieldOptions | null>(null);
