import { JSONSchema7 } from 'json-schema';
import { LimeSchemaOptions } from '../../interface';

export interface LimeJSONSchema extends JSONSchema7 {
    lime?: LimeSchemaOptions;
}
