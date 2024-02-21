import { ObjectFieldTemplateProps, ArrayFieldTemplateProps } from '@rjsf/core';
import { FormSchema } from '../form.types';
export { FieldTemplateProps, ArrayFieldTemplateProps } from '@rjsf/core';

export type TemplateProps = ObjectFieldTemplateProps | ArrayFieldTemplateProps;

export type ObjectFieldProperty = ObjectFieldTemplateProps['properties'][0];

export type ArrayFieldItem = ArrayFieldTemplateProps['items'][0];

export interface LimeObjectFieldTemplateProps extends ObjectFieldTemplateProps {
    schema: FormSchema;
}

export interface Runnable {
    run: (event: any) => void;
}

export interface RowProps {
    children?: any;
}
