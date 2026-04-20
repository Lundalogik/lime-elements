import { ObjectFieldTemplateProps } from '@rjsf/utils';
import { JSONSchema7 } from 'json-schema';

export { ArrayFieldTemplateProps } from '@rjsf/utils';

export type ObjectFieldProperty = ObjectFieldTemplateProps['properties'][0];

export interface LimeObjectFieldTemplateProps extends ObjectFieldTemplateProps {
    schema: JSONSchema7;
}

export interface Runnable {
    run: (event: any) => void;
}

export interface RowProps {
    children?: any;
}
