import { Option } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
/**
 * Using the "actions" slot
 * The component offers a place for including custom actions, or
 * any other component that you want to include in the header.
 * To include any component in the `actions` area,
 * you can simply use the `slot="actions"` attribute.
 *
 * :::note
 * In small containers when having the default layout, the `actions` area
 * wins the battle of limited space! It means, if you have a very wide
 * component in the actions area, it will never shrink in size, and instead
 * forces the headings to truncate.
 *:::
 */
@Component({
    shadow: true,
    tag: 'limel-example-header-slot-actions',
})
export class HeaderSlotActionsExample {
    @State()
    public value: Option = {
        text: 'select a colleague',
        value: 'colleague',
        disabled: true,
    };

    private options: Option[] = [
        {
            text: 'Luke Skywalker',
            value: 'luke',
            icon: 'businessman',
        },
        {
            text: 'Han Solo',
            value: 'han',
            icon: 'human_head',
        },
        {
            text: 'Leia Organo',
            value: 'leia',
            icon: 'businesswoman',
        },
        {
            text: 'R2',
            value: 'r2',
            icon: 'robot',
        },
    ];

    public render() {
        return (
            <limel-header
                icon="combo_chart"
                heading="Sale performance"
                subheading="Choose a colleague to see their statistics"
            >
                <limel-select
                    slot="actions"
                    value={this.value}
                    options={this.options}
                    onChange={this.handleChange}
                />
            </limel-header>
        );
    }

    private handleChange = (event) => {
        this.value = event.detail;
    };
}
