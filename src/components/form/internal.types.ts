import { JSONSchema7 } from 'json-schema';
import { LimeSchemaOptions } from './form.types';

export interface LimeJSONSchema extends JSONSchema7 {
    lime?: LimeSchemaOptions;
}
