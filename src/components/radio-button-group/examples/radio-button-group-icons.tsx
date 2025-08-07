import { ListItem } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Items with icons
 */
@Component({
    tag: 'limel-example-radio-button-group-icons',
    shadow: true,
})
export class RadioButtonIconsExample {
    @State()
    private value: any = 'weather_sunny';

    private options: ListItem[] = [
        {
            text: 'Sunny',
            value: 'weather_sunny',
            icon: {
                name: 'sun',
                color: 'rgb(var(--color-orange-default))',
            },
        },
        {
            text: 'Partly Cloudy',
            value: 'weather_partly_cloudy',
            icon: {
                name: 'partly_cloudy_day',
                color: 'rgb(var(--color-gray-default))',
            },
        },
        {
            text: 'Rainy',
            value: 'weather_rainy',
            icon: {
                name: 'rain',
                color: 'rgb(var(--color-blue-default))',
            },
        },
        {
            text: 'Snowy',
            value: 'weather_snowy',
            icon: {
                name: 'snowflake',
                color: 'rgb(var(--color-cyan-light))',
            },
        },
    ];

    public render() {
        return [
            <limel-radio-button-group
                options={this.options}
                value={this.value}
                badgeIcons={true}
                onChange={this.handleChange}
            />,
            <limel-example-value label="Selected weather" value={this.value} />,
        ];
    }

    private handleChange = (event: CustomEvent<any>) => {
        this.value = event.detail;
    };
}
