import { Components } from '@limetech/lime-elements';
import { EventEmitter } from '@stencil/core';

export interface ValidationStatus {
    /**
     * True if the form is valid, false otherwise
     *
     * If the form is invalid, any errors can be found on the `errors` property
     */
    valid: boolean;

    /**
     * List of validation errors
     */
    errors?: FormError[];
}

export interface FormError {
    /**
     * Name of the error
     */
    name: string;

    /**
     * Params of the error
     */
    params?: unknown;

    /**
     * Name of the invalid property
     */
    property: string;

    /**
     * Path to the property within the schema
     */
    schemaPath: string;

    /**
     * String describing the error
     */
    message: string;
}

export type ValidationError = {
    /**
     * Name of the field the error belongs to
     */
    [key: string]: string[] | ValidationError;
};

export interface FormComponent<T = any> {
    /**
     * The value of the current property
     */
    value: T;

    /**
     * Whether or not the current property is required
     */
    required?: boolean;

    /**
     * Whether or not the current property is readonly
     */
    readonly?: boolean;

    /**
     * Whether or not the current property is disabled
     */
    disabled?: boolean;

    /**
     * The label of the current property
     */
    label?: string;

    /**
     * The helper text for the current property
     */
    helperText?: string;

    /**
     * Additional contextual information about the form
     */
    formInfo?: FormInfo;

    /**
     * The event to emit when the value of the current property has changed
     */
    change: EventEmitter<T>;
}

export interface FormInfo {
    /**
     * The schema of the current property
     */
    schema?: object;

    /**
     * The schema of the whole form
     */
    rootSchema?: object;

    /**
     * A tree of errors for this property and its children
     */
    errorSchema?: object;

    /**
     * The value of the whole form
     */
    rootValue?: any;

    /**
     * The name of the current property
     */
    name?: string;

    /**
     * Path to the property within the schema
     */
    schemaPath?: string[];
}

/**
 * Lime elements specific options that can be specified under the `lime` key in
 * a schema, e.g.
 *
 * ```ts
 * const schema = {
 *     type: 'object',
 *     lime: {
 *         collapsible: true,
 *     },
 * };
 * ```
 */
export interface LimeSchemaOptions {
    /**
     * When specified on an object it will render all sub components inside a
     * collapsible section
     */
    collapsible?: boolean;

    /**
     * When `collapsible` is `true`, set this to `false` to make the
     * collapsible section load in the open state.
     * Defaults to `true`.
     */
    collapsed?: boolean;

    /**
     * Will render the field using the specified component. The component
     * should implement the `FormComponent` interface
     */
    component?: FormComponentOptions;

    /**
     * When specified on an object it will render the sub components with the
     * specified layout
     */
    layout?: FormLayoutOptions<any>;

    /**
     * Mark the field as disabled
     */
    disabled?: boolean;

    help?: string | Components.LimelHelp;
}

/**
 * Options for a component to be rendered inside a form
 */
export interface FormComponentOptions {
    /**
     * Name of the component
     */
    name?: string;

    /**
     * Extra properties to give the component in addition to the properties
     * specified on the `FormComponent` interface
     */
    props?: Record<string, any>;
}

export interface FormLayoutOptions<T = FormLayoutType.Default> {
    /**
     * The type of layout to use
     */
    type: T;
}

export interface GridLayoutOptions
    extends FormLayoutOptions<FormLayoutType.Grid> {
    /**
     * When specified on a component within the grid, the component will take
     * up the the specified number of columns in the form
     */
    // eslint-disable-next-line no-magic-numbers
    colSpan?: 1 | 2 | 3 | 4 | 5 | 'all';

    /**
     * When specified on a component within the grid, the component will take
     * up the the specified number of rows in the form
     */
    rowSpan?: number;

    /**
     * Number of columns to use in the layout
     */
    // eslint-disable-next-line no-magic-numbers
    columns?: 1 | 2 | 3 | 4 | 5;

    /**
     * Attempts to fill in holes earlier in the grid, if smaller items come up
     * later. This may cause items to appear out-of-order, when doing so would
     * fill holes left by larger items. Defaults to `true`.
     */
    dense?: boolean;
}

export interface RowLayoutOptions
    extends FormLayoutOptions<FormLayoutType.Row> {
    /**
     * When specified on a field, the chosen icon will be displayed
     * on the left side of the row, beside the title.
     */
    icon?: string;
}

export enum FormLayoutType {
    /**
     * The default layout
     */
    Default = 'default',

    /**
     * Render the form fields using a responsive grid layout
     */
    Grid = 'grid',

    /**
     * Render the form fields in full-width rows.
     * Each row can have a leading `icon`, and a field.
     * `title` and `description` provided by the schema will be placed
     * on the row itself, and not on the field.
     * This layout is good for creating UIs for user settings pages.
     */
    Row = 'row',
}
