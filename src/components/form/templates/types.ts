import { ObjectFieldTemplateProps, ArrayFieldTemplateProps } from '@rjsf/core';
import { LimeJSONSchema } from '../internal.types';
export {
    FieldTemplateProps,
    ObjectFieldTemplateProps,
    ArrayFieldTemplateProps,
} from '@rjsf/core';

export type TemplateProps = ObjectFieldTemplateProps | ArrayFieldTemplateProps;

export type ObjectFieldProperty = ObjectFieldTemplateProps['properties'][0];

export type ArrayFieldItem = ArrayFieldTemplateProps['items'][0];

export interface LimeObjectFieldTemplateProps extends ObjectFieldTemplateProps {
    schema: LimeJSONSchema;
}

export interface Runnable {
    run: (event: any) => void;
}
