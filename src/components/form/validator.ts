import { customizeValidator } from '@rjsf/validator-ajv8';
import { isInteger } from './validators';

/**
 * Shared RJSF validator configured with custom formats and ajv options.
 * Use this single instance wherever the RJSF v6 API requires a validator.
 */
export const rjsfValidator = customizeValidator({
    customFormats: { integer: isInteger },
    ajvOptionsOverrides: { allErrors: true, multipleOfPrecision: 2 },
});
