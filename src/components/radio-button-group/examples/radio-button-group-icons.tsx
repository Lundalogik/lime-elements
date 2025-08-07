import {
    ListItem,
    LimelRadioButtonGroupCustomEvent,
} from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Items with icons
 */
@Component({ tag: 'limel-example-radio-button-group-icons', shadow: true })
export class RadioButtonIconsExample {
    @State()
    private selectedItem: ListItem<string>;

    private items: Array<ListItem<string>> = [
        {
            text: 'Sunny',
            value: 'weather_sunny',
            icon: { name: 'sun', color: 'rgb(var(--color-orange-default))' },
        },
        {
            text: 'Partly Cloudy',
            value: 'weather_partly_cloudy',
            selected: true,
            icon: {
                name: 'partly_cloudy_day',
                color: 'rgb(var(--color-gray-default))',
            },
        },
        {
            text: 'Rainy',
            value: 'weather_rainy',
            icon: { name: 'rain', color: 'rgb(var(--color-blue-default))' },
        },
        {
            text: 'Snowy',
            value: 'weather_snowy',
            icon: { name: 'snowflake', color: 'rgb(var(--color-cyan-light))' },
        },
    ];

    public componentWillLoad() {
        this.selectedItem = this.items.find((item) => item.selected);
    }

    public render() {
        return [
            <limel-radio-button-group
                items={this.items}
                selectedItem={this.selectedItem}
                badgeIcons={true}
                onChange={this.handleChange}
            />,
            <limel-example-value
                label="Selected weather"
                value={this.selectedItem?.value}
            />,
        ];
    }

    private handleChange = (
        event: LimelRadioButtonGroupCustomEvent<ListItem<string>>
    ) => {
        const item = event.detail;
        this.selectedItem = item.selected === false ? undefined : item;
    };
}
