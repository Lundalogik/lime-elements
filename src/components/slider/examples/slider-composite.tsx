import { Component, h, Prop, State } from '@stencil/core';

/**
 * Composite
 *
 * A place to try different combinations of states.
 */
@Component({
    tag: 'limel-example-slider-composite',
    shadow: true,
})
export class SliderCompositeExample {
    @Prop()
    public schema: any;

    @State()
    private props = {
        disabled: false,
        factor: 1,
        label: 'Slider',
        readonly: false,
        unit: '%',
        value: 25,
        valuemin: 0,
        valuemax: 100,
    };

    private eventPrinter: HTMLKompendiumExampleEventPrinterElement;

    public componentWillLoad() {
        this.schema.lime = {
            layout: {
                type: 'grid',
            },
        };
    }

    public render() {
        return [
            <limel-slider {...this.props} onChange={this.handleSliderChange} />,
            this.renderForm(),
            <kompendium-example-event-printer
                ref={(el) => (this.eventPrinter = el)}
            />,
        ];
    }

    private handleSliderChange = (event: CustomEvent<number>) => {
        this.eventPrinter.writeEvent(event);
        this.props = { ...this.props, value: event.detail };
    };

    private renderForm = () => {
        return (
            <kompendium-example-controls
                style={{ '--example-controls-column-layout': 'auto-fit' }}
            >
                <limel-form
                    schema={this.schema}
                    value={this.props}
                    onChange={this.handleFormChange}
                />
            </kompendium-example-controls>
        );
    };

    private handleFormChange = (event: CustomEvent) => {
        this.props = event.detail;
    };
}
