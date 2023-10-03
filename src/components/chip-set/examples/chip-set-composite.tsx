import { Component, h, Prop, State } from '@stencil/core';
import { Chip, Languages } from '@limetech/lime-elements';

/**
 * Composite
 *
 * A place to try different combinations of states.
 */
@Component({
    tag: 'limel-example-chip-set-composite',
    shadow: true,
})
export class ChipSetCompositeExample {
    @Prop()
    public schema: any;

    @State()
    private props = {
        language: 'en' as Languages,
        value: [
            {
                id: 'dog',
                text: 'Dog',
                icon: 'dog',
            },
            {
                id: 'cat',
                text: 'Cat',
                icon: 'cat',
            },
        ] as Chip[],
        type: 'choice' as any,
    };

    private eventPrinter: HTMLLimelExampleEventPrinterElement;

    public componentWillLoad() {
        this.schema.lime = {
            layout: {
                type: 'grid',
            },
        };
        this.schema.properties.value.lime = {
            layout: {
                colSpan: 'all',
            },
        };
        this.schema.definitions.Chip.lime = {
            layout: {
                type: 'grid',
            },
        };
    }

    public render() {
        return [
            <limel-chip-set {...this.props} onChange={this.handleChange} />,
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

    private handleChange = (event: CustomEvent<Chip | Chip[]>) => {
        this.eventPrinter.writeEvent(event);
    };

    private handleFormChange = (event: CustomEvent) => {
        this.props = { ...event.detail };
    };
}
