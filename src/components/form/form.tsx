import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
} from '@stencil/core';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import JSONSchemaForm from 'react-jsonschema-form';
import retargetEvents from 'react-shadow-dom-retarget-events';
import { FormError, ValidationStatus } from './form.types';
import {
    ArrayFieldTemplate,
    FieldTemplate,
    ObjectFieldTemplate,
} from './templates';
import { widgets } from './widgets';

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
    public schema: object;

    /**
     * Value of the form
     */
    @Prop()
    public value: object;

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
    private host: HTMLElement;

    private form: any;
    private isValid = true;

    public constructor() {
        this.handleChange = this.handleChange.bind(this);
        this.setForm = this.setForm.bind(this);
    }

    public render() {
        return <div class="root" />;
    }

    protected componentDidLoad() {
        this.reactRender();
        retargetEvents(this.host.shadowRoot);
        this.validateForm(this.value);
    }

    protected componentDidUpdate() {
        this.reactRender();
        this.validateForm(this.value);
    }

    protected componentDidUnload() {
        const rootElement = this.host.shadowRoot.querySelector('.root');
        unmountComponentAtNode(rootElement);
    }

    private reactRender() {
        const rootElement = this.host.shadowRoot.querySelector('.root');

        render(
            React.createElement(
                JSONSchemaForm,
                {
                    schema: this.schema,
                    formData: this.value,
                    onChange: this.handleChange,
                    widgets: widgets,
                    FieldTemplate: FieldTemplate,
                    ArrayFieldTemplate: ArrayFieldTemplate,
                    ObjectFieldTemplate: ObjectFieldTemplate,
                    ref: this.setForm,
                },
                []
            ),
            rootElement
        );
    }

    private setForm(form: any) {
        this.form = form;
    }

    private handleChange(event: any) {
        this.change.emit(event.formData);
    }

    private validateForm(value: object) {
        const errors: FormError[] = this.form.validate(value).errors;
        const status: ValidationStatus = {
            valid: errors.length === 0,
            errors: errors,
        };

        if (this.isValid !== status.valid || !status.valid) {
            this.validate.emit(status);
        }

        this.isValid = status.valid;
    }
}
