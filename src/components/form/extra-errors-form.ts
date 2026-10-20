import JSONSchemaForm, { FormState } from '@rjsf/core';
import {
    ErrorSchema,
    FormContextType,
    mergeObjects,
    RJSFSchema,
    StrictRJSFSchema,
} from '@rjsf/utils';

/**
 * The RJSF form, keeping the `extraErrors` when it is handed new `formData`.
 */
export class ExtraErrorsForm<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any,
> extends JSONSchemaForm<T, S, F> {
    // RJSF live validates `formData` handed in from outside without the
    // `extraErrors`, and only merges them again when the prop itself changes.
    public getStateFromProps(
        ...args: Parameters<JSONSchemaForm<T, S, F>['getStateFromProps']>
    ): FormState<T, S, F> {
        const state = super.getStateFromProps(...args);
        const [props] = args;
        if (!props.extraErrors) {
            return state;
        }

        const errorSchema = mergeObjects(
            state.errorSchema ?? {},
            props.extraErrors,
            'preventDuplicates'
        ) as ErrorSchema<T>;

        return { ...state, errorSchema: errorSchema };
    }
}
