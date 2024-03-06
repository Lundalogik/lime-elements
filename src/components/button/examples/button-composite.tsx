import { FormSchema } from '@limetech/lime-elements';
import { Component, h, Prop, State } from '@stencil/core';

/**
 * Composite
 *
 * A place to try different combinations of states.
 */
@Component({
    tag: 'limel-example-button-composite',
    shadow: true,
})
export class ButtonCompositeExample {
    @Prop()
    public schema: FormSchema;

    @State()
    private props = {
        label: 'My button',
        primary: true,
        outlined: false,
        icon: 'dog',
        disabled: false,
        loading: false,
    };

    private eventPrinter: HTMLLimelExampleEventPrinterElement;

    public componentWillLoad() {
        this.schema = {
            ...this.schema,
            lime: {
                layout: {
                    type: 'grid',
                },
            },
        };
    }

    public render() {
        return [
            <limel-button {...this.props} onClick={this.handleEvent} />,
            this.renderForm(),
            <limel-example-event-printer
                ref={(el) => (this.eventPrinter = el)}
            />,
        ];
    }

    private handleEvent = (event: Event) => {
        this.eventPrinter.writeEvent(event);
    };

    private renderForm() {
        return (
            <limel-example-controls
                style={{ '--example-controls-column-layout': 'auto-fit' }}
            >
                <limel-form
                    schema={this.schema}
                    value={this.props}
                    onChange={this.handleChange}
                />
            </limel-example-controls>
        );
    }

    private handleChange = (event: CustomEvent) => {
        this.props = event.detail;
    };
}
