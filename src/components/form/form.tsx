import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
} from '@stencil/core';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import JSONSchemaForm, { IChangeEvent } from '@rjsf/core';
import { RJSFValidationError } from '@rjsf/utils';
import {
    FormError,
    FormSchema,
    ValidationError,
    ValidationStatus,
} from './form.types';
import {
    ArrayFieldTemplate,
    ArrayFieldItemTemplate,
    FieldTemplate,
    ObjectFieldTemplate,
} from './templates';
import { SchemaField as CustomSchemaField } from './fields/schema-field';
import { ArrayField as CustomArrayField } from './fields/array-field';
import { ObjectField as CustomObjectField } from './fields/object-field';
import { widgets } from './widgets';
import { rjsfValidator } from './validator';
import { mapValues } from 'lodash-es';

/**
 * @exampleComponent limel-example-form
 * @exampleComponent limel-example-nested-form
 * @exampleComponent limel-example-list-form
 * @exampleComponent limel-example-dynamic-form
 * @exampleComponent limel-example-custom-component-form
 * @exampleComponent limel-example-props-factory-form
 * @exampleComponent limel-example-form-layout
 * @exampleComponent limel-example-form-span-fields
 * @exampleComponent limel-example-custom-error-message
 * @exampleComponent limel-example-server-errors
 * @exampleComponent limel-example-form-array-item-controls
 * @exampleComponent limel-example-form-with-help
 * @exampleComponent limel-example-form-row-layout
 * @exampleComponent limel-example-builtin-field-types-form
 * @exampleComponent limel-example-code-editor-form
 */
@Component({
    tag: 'limel-form',
    shadow: true,
    styleUrl: 'form.scss',
})
export class Form {
    /**
     * The schema used to render the form
     */
    @Prop()
    public schema: FormSchema = {};

    /**
     * Value of the form
     */
    @Prop()
    public value: object;

    /**
     * Set to `true` to disable the whole form.
     */
    @Prop()
    public disabled = false;

    /**
     * Factory for creating properties for custom form components
     *
     * When using custom components in the form some properties might have to be
     * set dynamically. If this factory is set, it will be called with the
     * current schema for the field for each custom component in the form. The
     * factory must return an object where each key is the name of the property
     * that should be set, along with its value.
     */
    @Prop()
    public propsFactory?: (schema: FormSchema) => Record<string, any>;

    /**
     * Custom function to customize the default error messages
     */
    @Prop()
    public transformErrors?: (errors: FormError[]) => FormError[];

    /**
     * Extra errors to display in the form. Typical use case is asynchronous
     * errors generated server side.
     */
    @Prop()
    public errors: ValidationError;

    /**
     * Emitted when a change is made within the form
     */
    @Event()
    public change: EventEmitter<object>;

    /**
     * Emitted when the validity of the form changes, or when
     * a change is made to an invalid form
     */
    @Event()
    public validate: EventEmitter<ValidationStatus>;

    @Element()
    private host: HTMLLimelFormElement;

    private isValid = true;
    private root: Root;
    private initialized = false;

    public constructor() {
        this.handleChange = this.handleChange.bind(this);
        this.getCustomErrorMessages = this.getCustomErrorMessages.bind(this);
    }

    public connectedCallback() {
        this.initialize();
    }

    public componentDidLoad() {
        this.initialize();
    }

    private initialize() {
        if (this.initialized) {
            return;
        }

        if (!this.host.shadowRoot.querySelector('.root')) {
            return;
        }

        this.initialized = true;
        this.reactRender();
        this.validateFormData();
    }

    public componentDidUpdate() {
        this.reactRender();
        this.validateFormData();
    }

    public disconnectedCallback() {
        if (this.root) {
            this.root.unmount();
            this.root = undefined;
        }

        this.initialized = false;
    }

    public render() {
        return <div class="root" />;
    }

    private reactRender() {
        if (!this.root) {
            const rootElement = this.host.shadowRoot.querySelector('.root');
            this.root = createRoot(rootElement);
        }

        this.root.render(
            React.createElement(
                JSONSchemaForm,
                {
                    schema: this.prepareSchema(this.schema),
                    formData: this.value,
                    onChange: this.handleChange,
                    widgets: widgets,
                    validator: rjsfValidator,
                    liveValidate: 'onChange',
                    // `@rjsf/core` v6 treats a `const` inside `oneOf`/`anyOf`
                    // as a default and auto-selects the first option, so an
                    // optional enum can never be left empty (clearing it just
                    // gets repopulated on the next render). `skipOneOf` keeps
                    // this off for enums while still applying genuine
                    // `default` values, matching the pre-v6 behavior.
                    experimental_defaultFormStateBehavior: {
                        constAsDefaults: 'skipOneOf',
                    },
                    showErrorList: false,
                    extraErrors: this.getExtraErrors(this.errors),
                    templates: {
                        FieldTemplate: FieldTemplate,
                        ArrayFieldTemplate: ArrayFieldTemplate,
                        ArrayFieldItemTemplate: ArrayFieldItemTemplate,
                        ObjectFieldTemplate: ObjectFieldTemplate,
                    },
                    disabled: this.disabled,
                    transformErrors: this.getCustomErrorMessages,
                    formContext: {
                        schema: this.schema,
                        rootValue: this.value,
                        propsFactory: this.propsFactory,
                    },
                    fields: {
                        SchemaField: CustomSchemaField,
                        ArrayField: CustomArrayField,
                        ObjectField: CustomObjectField,
                    },
                },
                []
            )
        );
    }

    private handleChange(event: IChangeEvent) {
        this.change.emit(event.formData);
    }

    private validateFormData() {
        const { errors } = rjsfValidator.validateFormData(
            this.value ?? {},
            this.prepareSchema(this.schema)
        );
        this.emitValidationStatus(errors);
    }

    /**
     * Returns a copy of the schema with `$id` replaced by a content-based
     * value, so the validator never confuses two schemas that share the
     * same `$id` but differ in content — e.g. a server schema reused with
     * a different subset of properties at runtime.
     *
     * The new `$id` is built from a short numeric fingerprint of the
     * stringified content. A fingerprint (rather than the content itself)
     * keeps the value short and URI-safe — `$id` is parsed as a URI by
     * the validator and must not contain JSON-shaped characters.
     *
     * @param schema - the schema to prepare
     */
    private prepareSchema(schema: FormSchema): FormSchema {
        const { $id, ...rest } = schema;
        const json = JSON.stringify(rest);

        let fingerprint = 5381;
        for (let i = 0; i < json.length; i++) {
            fingerprint =
                ((fingerprint << 5) + fingerprint + json.codePointAt(i)) &
                0xff_ff_ff_ff;
        }
        const contentId = (fingerprint >>> 0).toString(36);

        return {
            ...schema,
            $id: $id ? `${$id}-${contentId}` : contentId,
        };
    }

    private hasExtraErrors(): boolean {
        return !!this.errors && Object.keys(this.errors).length > 0;
    }

    private emitValidationStatus(errors: RJSFValidationError[]) {
        const valid =
            (!errors || errors.length === 0) && !this.hasExtraErrors();
        const formErrors = this.mapErrors(errors ?? []);
        const status: ValidationStatus = { valid: valid, errors: formErrors };

        if (this.isValid !== valid || !valid) {
            this.validate.emit(status);
        }

        this.isValid = valid;
    }

    private mapErrors(errors: RJSFValidationError[]): FormError[] {
        return errors.map(
            (error): FormError => ({
                name: error.name,
                property: error.property,
                message: error.message,
                schemaPath: error.schemaPath,
                params: error.params,
            })
        );
    }

    private getExtraErrors(errors: ValidationError): ExtraError | undefined {
        if (!errors) {
            return;
        }

        return mapValues(errors, (error) => {
            if (Array.isArray(error)) {
                return { __errors: error };
            }

            return this.getExtraErrors(error);
        });
    }

    private getCustomErrorMessages(
        originalErrors: RJSFValidationError[]
    ): RJSFValidationError[] {
        if (!this.transformErrors) {
            return originalErrors;
        }

        const errors: FormError[] = this.mapErrors(originalErrors);

        // Use `.call({}, …)` to prevent the consumer's `transformErrors`
        // from getting access to our component's internals. /Ads
        return this.transformErrors
            .call({}, errors)
            .map((transformedError: FormError) => {
                const originalError = originalErrors.find(
                    (error: RJSFValidationError) => {
                        return transformedError.property === error.property;
                    }
                );

                return {
                    ...originalError,
                    message: transformedError.message,
                };
            });
    }
}

interface ExtraError {
    [key: string]:
        | ExtraError
        | {
              __errors: string[];
          };
}
