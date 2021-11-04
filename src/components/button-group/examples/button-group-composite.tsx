import { Component, h, Prop, State } from '@stencil/core';
import { Button } from '../../button/button.types';

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
            <limel-collapsible-section header="Settings">
                <limel-form
                    schema={this.schema}
                    value={this.props}
                    onChange={this.handleChangeForm}
                />
            </limel-collapsible-section>
        );
    }

    private handleChange = (event: CustomEvent<Button>) => {
        this.eventPrinter.writeEvent(event);

        const index = this.props.value.findIndex(
            (button) => button === event.detail
        );
        if (!index) {
            return;
        }

        this.props.value[index] = event.detail;
        this.props.value = [...this.props.value];
        this.props = { ...this.props };
    };

    private handleChangeForm = (event: CustomEvent) => {
        this.props = { ...event.detail };
    };
}
