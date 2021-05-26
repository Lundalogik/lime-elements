import { Component, h, State } from '@stencil/core';
import { FlowItem } from '../progress-flow.types';

/**
 * Using colors
 *
 * By default, each step appreas with a light grey background, and when active, it gets the
 * defined `-lime-primary-color` as background. Also passed steps will get the
 * same background color as active steps by default.
 *
 * However, both of these colors can be customized via code, by specifying color
 * values for `activeColor` and `passedColor`.
 *
 * Eventual icons will get the same color as the text for that step.
 * But color of icons for inactive steps can be specified via code, using
 * the `iconColor` property.
 */
@Component({
    tag: 'limel-example-progress-flow-colors',
    shadow: true,
})
export class ProgressFlowColorsExample {
    @State()
    private flowItems: FlowItem[] = [
        {
            value: 'lime',
            text: 'Magenta step',
            activeColor: 'rgb(var(--color-magenta-default)',
            passedColor: 'rgb(var(--color-green-light))',
            icon: 'roller_brush',
            iconColor: 'rgb(var(--color-magenta-default)',
        },
        {
            value: 'purple',
            text: 'Purple step',
            activeColor: 'rgb(var(--color-purple-default))',
            passedColor: 'rgb(var(--color-green-default))',
            icon: 'brush',
            iconColor: 'rgb(var(--color-purple-default))',
        },
        {
            value: 'organge',
            text: 'Blue step',
            activeColor: 'rgb(var(--color-blue-default))',
            passedColor: 'rgb(var(--color-green-dark))',
            icon: 'paint_brush',
            iconColor: 'rgb(var(--color-blue-default))',
        },
        {
            value: 'red',
            text: 'Green step',
            activeColor: 'rgb(var(--color-green-darker))',
            icon: 'cosmetic_brush',
            iconColor: 'rgb(var(--color-green-darker))',
        },
    ];

    constructor() {
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return (
            <limel-progress-flow
                flowItems={this.flowItems}
                onChange={this.onChange}
            />
        );
    }

    private onChange(event: CustomEvent<FlowItem>) {
        this.flowItems = this.flowItems.map((item) => {
            return {
                ...item,
                selected: item.value === event.detail?.value,
            };
        });
    }
}
