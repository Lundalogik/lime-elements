import { Component, h, Prop, State } from '@stencil/core';
import { Button, LimelButtonGroupCustomEvent } from '@limetech/lime-elements';

/**
 * Composite
 *
 * A place to try different combinations of states.
 */
@Component({
    tag: 'limel-example-button-group-composite',
    shadow: true,
})
export class ButtonCompositeExample {
    @Prop()
    public schema: any;

    @State()
    private props = {
        disabled: false,
        value: [
            {
                id: '1',
                title: 'Clear sky',
                icon: 'sun',
            },
            {
                id: '2',
                title: 'Partly cloudy',
                icon: 'partly_cloudy_day',
            },
            {
                id: '3',
                title: 'Rain showers',
                icon: 'rain',
            },
            {
                id: '4',
                title: 'Thunderstorms',
                icon: 'cloudshot',
            },
            {
                id: '5',
                title: 'Snow showers',
                icon: 'snowflake',
            },
        ] as Button[],
    };

    private eventPrinter: HTMLLimelExampleEventPrinterElement;

    public render() {
        return [
            <limel-button-group {...this.props} onChange={this.handleChange} />,
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

    private handleChange = (event: LimelButtonGroupCustomEvent<Button>) => {
        this.eventPrinter.writeEvent(event);
        const changedButton = event.detail;

        this.props = {
            ...this.props,
            value: this.props.value.map((button) => {
                return {
                    ...button,
                    selected: button.id === changedButton.id,
                };
            }),
        };
    };

    private handleFormChange = (event: CustomEvent) => {
        this.props = { ...event.detail };
    };
}
