import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-button-group-icons',
    shadow: true,
})
export class ButtonGroupIconsExample {
    @State()
    private disabled: boolean = false;

    constructor() {
        this.onChange = this.onChange.bind(this);
        this.toggleEnabled = this.toggleEnabled.bind(this);
    }

    public render() {
        return [
            <limel-button-group
                disabled={this.disabled}
                onChange={this.onChange}
                value={[
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
                ]}
            />,
            <p>
                <limel-flex-container justify="end">
                    <limel-checkbox
                        label="Disabled"
                        onChange={this.toggleEnabled}
                        checked={this.disabled}
                    />
                </limel-flex-container>
            </p>,
        ];
    }

    private onChange(event) {
        console.log(event.detail);
    }

    private toggleEnabled() {
        this.disabled = !this.disabled;
    }
}
