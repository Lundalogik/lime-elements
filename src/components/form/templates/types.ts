import { ObjectFieldTemplateProps, ArrayFieldTemplateProps } from '@rjsf/core';
export {
    FieldTemplateProps,
    ObjectFieldTemplateProps,
    // eslint-disable-next-line comma-dangle
    ArrayFieldTemplateProps,
} from '@rjsf/core';

export type TemplateProps = ObjectFieldTemplateProps | ArrayFieldTemplateProps;

export type ObjectFieldProperty = ObjectFieldTemplateProps['properties'][0];

export type ArrayFieldItem = ArrayFieldTemplateProps['items'][0];

export interface Runnable {
    run: (event: any) => void;
}
