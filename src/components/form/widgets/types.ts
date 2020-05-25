import { WidgetProps as RjsfWidgetProps } from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';
import { LimeSchemaOptions } from '../form.types';

export interface WidgetProps extends RjsfWidgetProps {
    schema: LimeJSONSchema;
}

interface LimeJSONSchema extends JSONSchema7 {
    lime?: LimeSchemaOptions;
}
