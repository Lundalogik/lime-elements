import { Component, h, Prop, State } from '@stencil/core';

/**
 * Composite
 *
 * A place to try different combinations of states.
 */
@Component({
    tag: 'limel-example-button-composite',
    shadow: true,
    styleUrl: 'button-composite.scss',
})
export class ButtonCompositeExample {
    @Prop()
    public schema: any;

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
            <limel-collapsible-section header="Settings">
                <limel-form
                    schema={this.schema}
                    value={this.props}
                    onChange={this.handleChange}
                />
            </limel-collapsible-section>
        );
    }

    private handleChange = (event: CustomEvent) => {
        this.props = event.detail;
    };
}
