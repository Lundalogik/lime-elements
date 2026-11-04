import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
    Watch,
} from '@stencil/core';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import JSONSchemaForm, { IChangeEvent } from '@rjsf/core';
import {
    Experimental_DefaultFormStateBehavior,
    FieldPathList,
    getDefaultFormState,
    RJSFValidationError,
} from '@rjsf/utils';
import {
    FormError,
    FormSchema,
    ValidationError,
    ValidationStatus,
} from './form.types';
import { HeadingLevel } from '../../global/shared-types/heading-level.types';
import { isHeadingLevel } from '../../util/heading-level';
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
import { isEqual, mapValues } from 'lodash-es';
import { showField, stopShowingField } from './show-field';
import { withoutFilledDefaults } from './filled-defaults';
import { HeadingLevelContext } from './templates/heading-level';

// `@rjsf/core` v6 treats a `const` inside `oneOf`/`anyOf` as a default and
// auto-selects the first option, so an optional enum can never be left empty
// (clearing it just gets repopulated on the next render). `skipOneOf` keeps this
// off for enums while still applying genuine `default` values, matching the
// pre-v6 behavior.
const FILL_DEFAULTS: Experimental_DefaultFormStateBehavior = {
    constAsDefaults: 'skipOneOf',
    requiredBooleanDefault: 'skip',
};

/**
 * The value the form was given, and what the form made of it
 */
interface GivenValue {
    /** The id of the schema the defaults came from */
    schemaId: string;
    /** The value as the host gave it, without the defaults it left out */
    given: unknown;
    /** `given` with the defaults of the schema filled in */
    filled: unknown;
    /** What the form holds now: `filled` until the user changes something */
    held: unknown;
}

/**
 * @exampleComponent limel-example-form
 * @exampleComponent limel-example-nested-form
 * @exampleComponent limel-example-list-form
 * @exampleComponent limel-example-dynamic-form
 * @exampleComponent limel-example-custom-component-form
 * @exampleComponent limel-example-custom-component-header-form
 * @exampleComponent limel-example-props-factory-form
 * @exampleComponent limel-example-form-layout
 * @exampleComponent limel-example-form-span-fields
 * @exampleComponent limel-example-form-invalid-section
 * @exampleComponent limel-example-custom-error-message
 * @exampleComponent limel-example-server-errors
 * @exampleComponent limel-example-form-array-item-controls
 * @exampleComponent limel-example-form-with-help
 * @exampleComponent limel-example-form-row-layout
 * @exampleComponent limel-example-builtin-field-types-form
 * @exampleComponent limel-example-code-editor-form
 * @exampleComponent limel-example-form-highlighted-field
 * @exampleComponent limel-example-form-heading-level
 * @exampleComponent limel-example-form-include-defaults
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
     * The level, from `1` to `6`, of the topmost headings in the form.
     * The headings of the sections inside them get one level more for each
     * level of nesting, down to `6`. A collapsible section, and each item
     * of a list that is shown as one, counts as a level too.
     *
     * Set it so that the headings of the form fit below the headings of
     * the page around it. For example, when the form is in a section with
     * an `h2` heading, set it to `3`.
     */
    @Prop()
    public headingLevel: HeadingLevel = 1;

    /**
     * Set to `true` to render every field with a validation error as
     * invalid, even untouched ones, and to reflect that on each
     * containing collapsible section's header. Defaults to `false`,
     * which keeps untouched required-empty fields silent.
     */
    @Prop()
    public revealErrors: boolean = false;

    /**
     * Set to `false` to leave the defaults of the schema out of the value,
     * so that it stays as it was given until the user changes something. The
     * form still shows the defaults. A default the user changes is in the
     * value from then on, and so are the defaults that a change brings in,
     * such as those of a new list item or of fields that depend on the
     * changed one. Pass the value the form emits back in as `value`.
     * The form validates what it shows, defaults included. When the user
     * changes everything back, the value is what the form was given, also
     * when that is `null` or `undefined`.
     */
    @Prop()
    public includeDefaults: boolean = true;

    /**
     * The path in the value of a field to take the user to, such as
     * `['heroes', 2, 'name']`. When it changes, the form opens the sections
     * and list items the field is in, scrolls it into view, focuses it and
     * briefly highlights it.
     *
     * If the path goes further than the form can show, such as into a custom
     * component, the closest field above the end of the path is shown. To show
     * the same field again, set it to `undefined` first.
     * @beta
     */
    @Prop()
    public highlightedField?: Array<string | number>;

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
    private currentValue: object;
    private givenValue?: GivenValue;
    private root: Root;

    // Their value is still the last valid one, so the schema can't tell.
    private readonly invalidInputErrors = new Map<string, FormError>();
    private initialized = false;

    public constructor() {
        this.handleChange = this.handleChange.bind(this);
        this.getCustomErrorMessages = this.getCustomErrorMessages.bind(this);
        this.setInvalidInput = this.setInvalidInput.bind(this);
    }

    public connectedCallback() {
        this.initialize();
    }

    public componentWillLoad() {
        this.currentValue = this.value;
        this.warnIfHeadingLevelIsInvalid();
    }

    @Watch('value')
    protected handleValueChange() {
        // The host usually hands back the value the form emitted, as a new
        // object, which is not a new value to leave the defaults out of
        if (!isEqual(this.value, this.currentValue)) {
            this.givenValue = undefined;
        }

        this.currentValue = this.value;
    }

    public componentDidLoad() {
        this.initialize();
        this.showHighlightedField();
    }

    @Watch('headingLevel')
    protected handleHeadingLevelChange() {
        this.warnIfHeadingLevelIsInvalid();
    }

    private warnIfHeadingLevelIsInvalid() {
        if (!isHeadingLevel(this.headingLevel)) {
            console.warn(
                `limel-form: headingLevel must be a number from 1 to 6, but it is ${this.headingLevel}. The headings start at level 1 instead.`
            );
        }
    }

    @Watch('highlightedField')
    protected handleHighlightedFieldChange(
        newPath?: Array<string | number>,
        oldPath?: Array<string | number>
    ) {
        // A host that renders again passes an equal path in a new array.
        if (isEqual(newPath, oldPath)) {
            return;
        }

        stopShowingField(this.rootElement);
        this.showHighlightedField();
    }

    private initialize() {
        if (this.initialized || !this.host.shadowRoot.querySelector('.root')) {
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
        stopShowingField(this.rootElement);
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
                HeadingLevelContext.Provider,
                {
                    value: isHeadingLevel(this.headingLevel)
                        ? this.headingLevel
                        : 1,
                },
                React.createElement(
                    JSONSchemaForm,
                    {
                        schema: this.prepareSchema(this.schema),
                        formData: this.currentValue,
                        onChange: this.handleChange,
                        widgets: widgets,
                        validator: rjsfValidator,
                        liveValidate: 'onChange',
                        experimental_defaultFormStateBehavior: FILL_DEFAULTS,
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
                            revealErrors: this.revealErrors,
                            setInvalidInput: this.setInvalidInput,
                        },
                        fields: {
                            SchemaField: CustomSchemaField,
                            ArrayField: CustomArrayField,
                            ObjectField: CustomObjectField,
                        },
                    },
                    []
                )
            )
        );
    }

    private showHighlightedField() {
        if (!this.highlightedField) {
            return;
        }

        void showField(this.rootElement, this.highlightedField);
    }

    private get rootElement() {
        return this.host.shadowRoot.querySelector<HTMLElement>('.root');
    }

    private handleChange(event: IChangeEvent) {
        if (this.includeDefaults) {
            this.currentValue = event.formData;
            this.change.emit(event.formData);

            return;
        }

        const { given, filled } = this.getGivenValue();
        this.givenValue.held = event.formData;
        const value = withoutFilledDefaults(event.formData, filled, given);
        if (isEqual(value, this.currentValue)) {
            // What the form holds changed, even though the value did not
            this.emitValidationStatus(event.errors);

            return;
        }

        this.currentValue = value as object;
        this.change.emit(this.currentValue);
    }

    private getGivenValue(): GivenValue {
        const schema = this.prepareSchema(this.schema);
        if (this.givenValue?.schemaId !== schema.$id) {
            const filled = getDefaultFormState(
                rjsfValidator,
                schema,
                this.currentValue,
                schema,
                false,
                FILL_DEFAULTS
            );
            this.givenValue = {
                schemaId: schema.$id,
                given: this.currentValue,
                filled,
                held: filled,
            };
        }

        return this.givenValue;
    }

    private validateFormData() {
        // With the defaults left out of the value, the form holds more than it
        const value = this.includeDefaults
            ? this.value
            : this.getGivenValue().held;
        const { errors } = rjsfValidator.validateFormData(
            value ?? {},
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

    private setInvalidInput(path: FieldPathList, message: string | null) {
        const property = `.${path.join('.')}`;
        const current = this.invalidInputErrors.get(property);
        if ((current?.message ?? null) === message) {
            return;
        }

        if (message === null) {
            this.invalidInputErrors.delete(property);
        } else {
            this.invalidInputErrors.set(property, {
                name: 'invalidInput',
                property: property,
                message: message,
                schemaPath: '',
            });
        }

        this.validateFormData();
    }

    private hasExtraErrors(): boolean {
        return !!this.errors && Object.keys(this.errors).length > 0;
    }

    private emitValidationStatus(errors: RJSFValidationError[]) {
        const formErrors = [
            ...this.mapErrors(errors ?? []),
            ...this.invalidInputErrors.values(),
        ];
        const valid = formErrors.length === 0 && !this.hasExtraErrors();
        const status: ValidationStatus = { valid: valid, errors: formErrors };

        if (this.isValid !== valid || !valid) {
            this.validate.emit(status);
        }

        this.isValid = valid;
    }

    private mapErrors(errors: RJSFValidationError[]): FormError[] {
        return errors.map((error): FormError => ({
            name: error.name,
            property: error.property,
            message: error.message,
            schemaPath: error.schemaPath,
            params: error.params,
        }));
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
