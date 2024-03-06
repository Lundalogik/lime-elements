import { FormSchema } from '@limetech/lime-elements';
import { Component, h, Prop, State } from '@stencil/core';

/**
 * Composite
 *
 * A place to try different combinations of states.
 */
@Component({
    tag: 'limel-example-date-picker-composite',
    shadow: true,
})
export class DatePickerCompositeExample {
    @Prop()
    public schema: FormSchema;

    @State()
    private props: any = {
        helperText: 'Please add a date',
        label: 'Date',
        language: 'en',
        type: 'date',
        value: new Date(),
    };

    private key = 0;
    private eventPrinter: HTMLLimelExampleEventPrinterElement;

    public componentWillLoad() {
        const properties = { ...this.schema.properties };
        delete properties.formatter;

        this.schema = {
            ...this.schema,
            properties: properties,
            lime: {
                layout: {
                    type: 'grid',
                },
            },
        };
    }

    public render() {
        return [
            <limel-date-picker
                key={`updateOnFormChange-${this.key}`}
                {...this.props}
                onChange={this.handlePickerChange}
            />,
            this.renderForm(),
            <limel-example-event-printer
                ref={(el) => (this.eventPrinter = el)}
            />,
        ];
    }

    private renderForm() {
        return (
            <limel-example-controls
                style={{ '--example-controls-column-layout': 'auto-fit' }}
            >
                <limel-form
                    schema={this.schema}
                    value={this.props}
                    onChange={this.handleFormChange}
                />
            </limel-example-controls>
        );
    }

    private handleFormChange = (event: CustomEvent) => {
        const value = this.props.value;
        this.props = { ...event.detail, value: value };
        this.key += 1;
    };

    private handlePickerChange = (event: CustomEvent<Date>) => {
        this.handleEvent(event);
        this.props = { ...this.props, value: event.detail };
    };

    private handleEvent = (event: Event) => {
        this.eventPrinter.writeEvent(event);
    };
}
