import { JSONSchema7 } from 'json-schema';
import { Help } from '../help/help.types';
import { EventEmitter } from '@stencil/core';

/**
 * EventEmitter from `@stencil/core`.
 *
 * @public
 */
export { EventEmitter } from '@stencil/core';

declare module 'json-schema' {
    interface JSONSchema7 {
        /**
         * Unique identifier for the schema
         * @internal
         */
        id?: string;

        /**
         * Lime elements specific options that can be specified in a schema
         */
        lime?: Omit<LimeSchemaOptions, 'layout'> & {
            layout?: Partial<LimeLayoutOptions>;
        };
    }
}

/**
 * @public
 */
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

/**
 * @public
 */
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

/**
 * @public
 */
export type ValidationError = {
    /**
     * Name of the field the error belongs to
     */
    [key: string]: string[] | ValidationError;
};

/**
 * @public
 */
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

/**
 * @public
 */
export interface FormInfo {
    /**
     * The schema of the current property
     */
    schema?: FormSchema;

    /**
     * The schema of the whole form
     */
    rootSchema?: FormSchema;

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
 *
 * @public
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
    layout?: LimeLayoutOptions;

    /**
     * Mark the field as disabled
     */
    disabled?: boolean;

    help?: string | Partial<Help>;
}

/**
 * Options for a layout to be used in a form
 * @public
 */
export type LimeLayoutOptions = GridLayoutOptions & RowLayoutOptions;

/**
 * Options for a component to be rendered inside a form
 *
 * @public
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

/**
 * @public
 */
export interface FormLayoutOptions<
    T extends FormLayoutType | `${FormLayoutType}` = FormLayoutType.Default,
> {
    /**
     * The type of layout to use
     */
    type?: T;
}

/**
 * Layout options for a grid layout
 * @public
 */
export interface GridLayoutOptions
    extends FormLayoutOptions<FormLayoutType | `${FormLayoutType}`> {
    /**
     * When specified on a component within the grid, the component will take
     * up the the specified number of columns in the form
     */

    colSpan?: 1 | 2 | 3 | 4 | 5 | 'all';

    /**
     * When specified on a component within the grid, the component will take
     * up the the specified number of rows in the form
     */
    rowSpan?: number;

    /**
     * Number of columns to use in the layout
     */

    columns?: 1 | 2 | 3 | 4 | 5;

    /**
     * Attempts to fill in holes earlier in the grid, if smaller items come up
     * later. This may cause items to appear out-of-order, when doing so would
     * fill holes left by larger items. Defaults to `true`.
     */
    dense?: boolean;
}

/**
 * Layout options for a row layout
 * @public
 */
export interface RowLayoutOptions
    extends FormLayoutOptions<FormLayoutType | `${FormLayoutType}`> {
    /**
     * When specified on a field, the chosen icon will be displayed
     * on the left side of the row, beside the title.
     */
    icon?: string;
}

/**
 * Represents the layout types for a form.
 * @public
 */
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

/**
 * Represents the JSON schema with Lime specific options
 * @public
 */
export interface FormSchema<T extends Record<string, any> = any>
    extends JSONSchema7 {
    /**
     * The value of "items" MUST be either a valid JSON Schema or an array
     * of valid JSON Schemas.
     *
     * This keyword determines how child instances validate for arrays, and
     * does not directly validate the immediate instance itself.
     *
     * If "items" is a schema, validation succeeds if all elements in the
     * array successfully validate against that schema.
     *
     * If "items" is an array of schemas, validation succeeds if each
     * element of the instance validates against the schema at the same
     * position, if any.
     *
     * Omitting this keyword has the same behavior as an empty schema.
     *
     * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-6.4.1
     */
    items?: FormSchemaArrayItem<T> | Array<FormSchemaArrayItem<T>>;

    /**
     * The value of "items" MUST be either a valid JSON Schema or an array
     * of valid JSON Schemas.
     *
     * This keyword determines how child instances validate for arrays, and
     * does not directly validate the immediate instance itself.
     *
     * If "items" is a schema, validation succeeds if all elements in the
     * array successfully validate against that schema.
     *
     * If "items" is an array of schemas, validation succeeds if each
     * element of the instance validates against the schema at the same
     * position, if any.
     *
     * Omitting this keyword has the same behavior as an empty schema.
     *
     * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-6.4.2
     */
    additionalItems?: FormSchemaArrayItem<T>;

    /**
     * The value of this keyword MUST be a valid JSON Schema.
     *
     * An array instance is valid against "contains" if at least one of its
     * elements is valid against the given schema.
     *
     * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-6.4.6
     */
    contains?: FormSchemaArrayItem<T>;

    /**
     * The value of this keyword MUST be an array.  Elements of this array,
     * if any, MUST be strings, and MUST be unique.
     *
     * An object instance is valid against this keyword if every item in the
     * array is the name of a property in the instance.
     *
     * Omitting this keyword has the same behavior as an empty array.
     *
     * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-6.5.3
     */
    required?: Array<ReplaceObjectType<T, Extract<keyof T, string>, string>>;

    /**
     * The value of "properties" MUST be an object.  Each value of this
     * object MUST be a valid JSON Schema.
     *
     * This keyword determines how child instances validate for objects, and
     * does not directly validate the immediate instance itself.
     *
     * Validation succeeds if, for each name that appears in both the
     * instance and as a name within this keyword's value, the child
     * instance for that name successfully validates against the
     * corresponding schema.
     *
     * Omitting this keyword has the same behavior as an empty object.
     *
     * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-6.5.4
     */
    properties?: ReplaceObjectType<
        T,
        FormSubKeySchema<T>,
        Record<string, FormSchema>
    >;

    /**
     * This keyword's value MUST be a non-empty array.  Each item of the
     * array MUST be a valid JSON Schema.
     *
     * An instance validates successfully against this keyword if it
     * validates successfully against all schemas defined by this keyword's
     * value.
     *
     * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-6.7.1
     */
    allOf?: Array<FormSchemaArrayItem<T>>;

    /**
     * This keyword's value MUST be a non-empty array.  Each item of the
     * array MUST be a valid JSON Schema.
     *
     * An instance validates successfully against this keyword if it
     * validates successfully against at least one schema defined by this
     * keyword's value.
     *
     * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-6.7.2
     */
    anyOf?: Array<FormSchemaArrayItem<T>>;

    /**
     * This keyword's value MUST be a non-empty array.  Each item of the
     * array MUST be a valid JSON Schema.
     *
     * An instance validates successfully against this keyword if it
     * validates successfully against exactly one schema defined by this
     * keyword's value.
     * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-6.7.3
     */
    oneOf?: Array<FormSchemaArrayItem<T>>;

    /**
     * The value of "patternProperties" MUST be an object.  Each property
     * name of this object SHOULD be a valid regular expression, according
     * to the ECMA 262 regular expression dialect.  Each property value of
     * this object MUST be a valid JSON Schema.
     *
     * This keyword determines how child instances validate for objects, and
     * does not directly validate the immediate instance itself.  Validation
     * of the primitive instance type against this keyword always succeeds.
     *
     * Validation succeeds if, for each instance name that matches any
     * regular expressions that appear as a property name in this keyword's
     * value, the child instance for that name successfully validates
     * against each schema that corresponds to a matching regular
     * expression.
     *
     * Omitting this keyword has the same behavior as an empty object.
     *
     * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-6.5.5
     */
    patternProperties?: Record<string, FormSchema>;

    /**
     * The value of "additionalProperties" MUST be a valid JSON Schema.
     *
     * This keyword determines how child instances validate for objects, and
     * does not directly validate the immediate instance itself.
     *
     * Validation with "additionalProperties" applies only to the child
     * values of instance names that do not match any names in "properties",
     * and do not match any regular expression in "patternProperties".
     *
     * For all such properties, validation succeeds if the child instance
     * validates against the "additionalProperties" schema.
     *
     * Omitting this keyword has the same behavior as an empty schema.
     *
     * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-6.5.6
     */
    additionalProperties?: FormSchema | boolean;

    /**
     * This keyword specifies rules that are evaluated if the instance is an
     * object and contains a certain property.
     *
     * This keyword's value MUST be an object.  Each property specifies a
     * dependency.  Each dependency value MUST be an array or a valid JSON
     * Schema.
     *
     * If the dependency value is a subschema, and the dependency key is a
     * property in the instance, the entire instance must validate against
     * the dependency value.
     *
     * If the dependency value is an array, each element in the array, if
     * any, MUST be a string, and MUST be unique.  If the dependency key is
     * a property in the instance, each of the items in the dependency value
     * must be a property that exists in the instance.
     *
     * Omitting this keyword has the same behavior as an empty object.
     *
     * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-6.5.7
     */
    dependencies?: Record<string, FormSchema | string[]>;

    /**
     * The value of "propertyNames" MUST be a valid JSON Schema.
     *
     * If the instance is an object, this keyword validates if every
     * property name in the instance validates against the provided schema.
     * Note the property name that the schema is testing will always be a
     * string.
     *
     * Omitting this keyword has the same behavior as an empty schema.
     *
     * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-6.5.8
     */
    propertyNames?: FormSchema;

    /**
     * This keyword's value MUST be a valid JSON Schema.
     *
     * This validation outcome of this keyword's subschema has no direct
     * effect on the overall validation result.  Rather, it controls which
     * of the "then" or "else" keywords are evaluated.
     *
     * Instances that successfully validate against this keyword's subschema
     * MUST also be valid against the subschema value of the "then" keyword,
     * if present.
     *
     * Instances that fail to validate against this keyword's subschema MUST
     * also be valid against the subschema value of the "else" keyword, if
     * present.
     *
     * If annotations (Section 3.3) are being collected, they are collected
     * from this keyword's subschema in the usual way, including when the
     * keyword is present without either "then" or "else".
     *
     * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-6.6.1
     */
    if?: FormSchema;

    /**
     * This keyword's value MUST be a valid JSON Schema.
     *
     * This validation outcome of this keyword's subschema has no direct
     * effect on the overall validation result.  Rather, it controls which
     * of the "then" or "else" keywords are evaluated.
     *
     * Instances that successfully validate against this keyword's subschema
     * MUST also be valid against the subschema value of the "then" keyword,
     * if present.
     *
     * Instances that fail to validate against this keyword's subschema MUST
     * also be valid against the subschema value of the "else" keyword, if
     * present.
     *
     * If annotations (Section 3.3) are being collected, they are collected
     * from this keyword's subschema in the usual way, including when the
     * keyword is present without either "then" or "else".
     *
     * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-6.6.2
     */
    then?: FormSchema;

    /**
     * This keyword's value MUST be a valid JSON Schema.
     *
     * When "if" is present, and the instance fails to validate against its
     * subschema, then valiation succeeds against this keyword if the
     * instance successfully validates against this keyword's subschema.
     *
     * This keyword has no effect when "if" is absent, or when the instance
     * successfully validates against its subschema.  Implementations MUST
     * NOT evaluate the instance against this keyword, for either validation
     * or annotation collection purposes, in such cases.
     *
     * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-6.6.3
     */
    else?: FormSchema;

    /**
     * This keyword's value MUST be a valid JSON Schema.
     *
     * An instance is valid against this keyword if it fails to validate
     * successfully against the schema defined by this keyword.
     *
     * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-6.7.4
     */
    not?: FormSchema;

    /**
     * The "$defs" keywords provides a standardized location for
     * schema authors to inline re-usable JSON Schemas into a more general
     * schema.  The keyword does not directly affect the validation result.
     *
     * This keyword's value MUST be an object.  Each member value of this
     * object MUST be a valid JSON Schema.
     *
     * As an example, here is a schema describing an array of positive
     * integers, where the positive integer constraint is a subschema in
     * "definitions":
     * ```
     * {
     *     "type": "array",
     *     "items": { "$ref": "#/definitions/positiveInteger" },
     *     "definitions": {
     *         "positiveInteger": {
     *             "type": "integer",
     *             "exclusiveMinimum": 0
     *         }
     *     }
     * }
     * ```
     *
     * $defs is the newer keyword introduced in the JSON Schema Draft 2019-09, while definitions is from the older drafts.
     *
     * The main difference is that definitions is no longer an official keyword in the latest JSON Schema specification (Draft 2019-09 and later),
     * but it is still widely supported for backward compatibility.
     *
     * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-9
     */
    $defs?: Record<string, FormSchema>;

    /**
     * The "definitions" keywords provides a standardized location for
     * schema authors to inline re-usable JSON Schemas into a more general
     * schema.  The keyword does not directly affect the validation result.
     *
     * This keyword's value MUST be an object.  Each member value of this
     * object MUST be a valid JSON Schema.
     *
     * As an example, here is a schema describing an array of positive
     * integers, where the positive integer constraint is a subschema in
     * "definitions":
     * ```
     * {
     *     "type": "array",
     *     "items": { "$ref": "#/definitions/positiveInteger" },
     *     "definitions": {
     *         "positiveInteger": {
     *             "type": "integer",
     *             "exclusiveMinimum": 0
     *         }
     *     }
     * }
     * ```
     *
     * $defs is the newer keyword introduced in the JSON Schema Draft 2019-09, while definitions is from the older drafts.
     *
     * The main difference is that definitions is no longer an official keyword in the latest JSON Schema specification (Draft 2019-09 and later),
     * but it is still widely supported for backward compatibility.
     *
     * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-9
     */
    definitions?: Record<string, FormSchema>;
}

/**
 * Utility type for replacing object types with a specified type
 * @public
 */
export type ReplaceObjectType<T, AllowedType, ElseType> = T extends any[]
    ? ElseType
    : T extends Record<string, any>
      ? AllowedType
      : ElseType;

/**
 * Utility type for supporting nested sub items in arrays
 * @public
 */
export type FormSchemaArrayItem<T> = T extends any[]
    ? FormSchema<T[Extract<keyof T, number>]>
    : FormSchema;

/**
 * Utility type for recursive properties in a schema
 * @public
 */
export type FormSubKeySchema<TObj> = Partial<{
    [Key in Extract<keyof TObj, any>]: FormSchema<TObj[Key]>;
}>;
