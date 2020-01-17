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

    @Element()
    private host: HTMLElement;

    public constructor() {
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        return <div class="root" />;
    }

    protected componentDidLoad() {
        this.reactRender();
        retargetEvents(this.host.shadowRoot);
    }

    protected componentDidUpdate() {
        this.reactRender();
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
                },
                []
            ),
            rootElement
        );
    }

    private handleChange(event: any) {
        this.change.emit(event.formData);
    }
}
