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
import { render, unmountComponentAtNode } from 'react-dom';
import JSONSchemaForm from '@rjsf/core';
import retargetEvents from 'react-shadow-dom-retarget-events';
import { FormError, ValidationStatus } from './form.types';
import {
    ArrayFieldTemplate,
    FieldTemplate,
    ObjectFieldTemplate,
} from './templates';
import { SchemaField as CustomSchemaField } from './fields/schema-field';
import { ArrayField as CustomArrayField } from './fields/array-field';
import { ObjectField as CustomObjectField } from './fields/object-field';
import { widgets } from './widgets';
import { createRandomString } from '../../util/random-string';
import Ajv from 'ajv';
import { isInteger } from './validators';

/**
 * @exampleComponent limel-example-form
 * @exampleComponent limel-example-nested-form
 * @exampleComponent limel-example-list-form
 * @exampleComponent limel-example-dynamic-form
 * @exampleComponent limel-example-custom-component-form
 * @exampleComponent limel-example-props-factory-form
 * @exampleComponent limel-example-form-layout
 * @exampleComponent limel-example-form-span-fields
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
    public schema: {
        id?: string;
        [key: string]: any;
    } = {};

    /**
     * Value of the form
     */
    @Prop()
    public value: object;

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
    public propsFactory?: (schema: Record<string, any>) => Record<string, any>;

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
    private modifiedSchema: object;
    private validator: Ajv.ValidateFunction;

    public constructor() {
        this.handleChange = this.handleChange.bind(this);
    }

    public connectedCallback() {
        this.initialize();
    }

    public componentWillLoad() {
        this.setSchemaId();
        this.createValidator();
    }

    public componentDidLoad() {
        this.initialize();
    }

    private initialize() {
        if (!this.host.shadowRoot.querySelector('.root')) {
            return;
        }

        this.reactRender();
        retargetEvents(this.host.shadowRoot);
        this.validateForm(this.value);
    }

    public componentDidUpdate() {
        this.reactRender();
        this.validateForm(this.value);
    }

    public disconnectedCallback() {
        const rootElement = this.host.shadowRoot.querySelector('.root');
        if (rootElement) {
            unmountComponentAtNode(rootElement);
        }
    }

    public render() {
        return <div class="root" />;
    }

    private reactRender() {
        const rootElement = this.host.shadowRoot.querySelector('.root');

        render(
            React.createElement(
                JSONSchemaForm,
                {
                    schema: this.modifiedSchema,
                    formData: this.value,
                    onChange: this.handleChange,
                    widgets: widgets,
                    liveValidate: true,
                    showErrorList: false,
                    FieldTemplate: FieldTemplate,
                    ArrayFieldTemplate: ArrayFieldTemplate as any,
                    ObjectFieldTemplate: ObjectFieldTemplate,
                    formContext: {
                        schema: this.modifiedSchema,
                        rootValue: this.value,
                        propsFactory: this.propsFactory,
                    },
                    fields: {
                        SchemaField: CustomSchemaField as any,
                        ArrayField: CustomArrayField as any,
                        ObjectField: CustomObjectField as any,
                    },
                },
                []
            ),
            rootElement
        );
    }

    private handleChange(event: any) {
        this.change.emit(event.formData);
    }

    private validateForm(value: object) {
        const isValid = this.validator(value) === true;
        const errors: FormError[] = this.getValidationErrors();
        const status: ValidationStatus = {
            valid: isValid,
            errors: errors,
        };

        if (this.isValid !== status.valid || !status.valid) {
            this.validate.emit(status);
        }

        this.isValid = status.valid;
    }

    @Watch('schema')
    public setSchema() {
        this.setSchemaId();
        this.createValidator();
    }

    private setSchemaId() {
        // Due to a bug in react-jsonschema-form, validation will stop working if the schema is updated.
        // A workaround at the moment is to always give it a unique ID
        // https://github.com/rjsf-team/react-jsonschema-form/issues/1563
        const id = `${this.schema.$id}-${createRandomString()}`;
        this.modifiedSchema = {
            ...this.schema,
            id: id,
            $id: id,
        };
    }

    private createValidator() {
        const validator = new Ajv({
            unknownFormats: 'ignore',
            allErrors: true,
            multipleOfPrecision: 2,
        }).addFormat('integer', isInteger);
        this.validator = validator.compile(this.schema);
    }

    private getValidationErrors(): FormError[] {
        const errors = this.validator.errors || [];

        return errors.map(
            (error: Ajv.ErrorObject): FormError => {
                return {
                    name: error.keyword,
                    property: error.dataPath,
                    message: error.message,
                    schemaPath: error.schemaPath,
                };
            }
        );
    }
}
