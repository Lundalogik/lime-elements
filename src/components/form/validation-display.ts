import { isEmpty, capitalize } from 'lodash-es';

/**
 * Check whether a form field value is non-empty.
 * Treats `null`, `undefined`, `''`, empty arrays,
 * and empty plain objects as "no value".
 *
 * @param value - the current field value
 * @returns `true` when the field holds meaningful data
 */
export function hasValue(value: unknown): boolean {
    if (value === null || value === undefined || value === '') {
        return false;
    }

    if (Array.isArray(value)) {
        return value.length > 0;
    }

    if (value instanceof Date) {
        return true;
    }

    if (typeof value === 'object') {
        return !isEmpty(value);
    }

    return true;
}

/**
 * Determine whether a field should be displayed as invalid.
 *
 * A field with errors is shown as invalid only when the user has
 * interacted with it, it already contains a value, or it is optional.
 * This avoids showing errors on untouched required fields before the
 * user has had a chance to fill them in.
 *
 * @param field - the current field state
 * @param field.hasErrors - whether the field currently has validation errors
 * @param field.modified - whether the user has interacted with the field
 * @param field.hasValue - whether the field holds a non-empty value
 * @param field.required - whether the field is required
 * @returns `true` when the field should render in an invalid state
 */
export function isFieldInvalid(field: {
    hasErrors: boolean;
    modified: boolean;
    hasValue: boolean;
    required: boolean;
}): boolean {
    return (
        field.hasErrors && (field.modified || field.hasValue || !field.required)
    );
}

/**
 * Check whether a field should be marked as required.
 *
 * A field is required when the schema marks it as `required` or
 * when it specifies a positive `minItems` constraint.
 *
 * @param field - the current field state
 * @param field.required - the `required` flag from the schema/props
 * @param field.minItems - the `minItems` value from the schema (0 if unset)
 * @returns `true` when the field is required
 */
export function isFieldRequired(field: {
    required: boolean;
    minItems: number;
}): boolean {
    return field.required || field.minItems > 0;
}

/**
 * Return the helper text to display beneath a field.
 *
 * When validation errors exist the first error message is returned
 * (capitalized). Otherwise falls back to `fallbackText` if provided,
 * then to `description`.
 *
 * @param errors - array of validation error strings (may be `null`)
 * @param description - the schema description for the field
 * @param fallbackText - optional text that takes priority over `description`
 *   when there are no errors (e.g. a custom `helperText` prop)
 * @returns the string to show as helper text
 */
export function getErrorText(
    errors: string[],
    description: string,
    fallbackText?: string
): string {
    if (errors?.length > 0) {
        return capitalize(errors[0]);
    }

    return fallbackText || description;
}
