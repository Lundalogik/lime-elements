import { Component, h, State } from '@stencil/core';
import { FlowItem } from '../progress-flow.types';

/**
 * Using colors
 *
 * By default, each step appreas as a light grey, and when active, it gets the
 * defined `-lime-primary-color` as background. Also passed steps will get the
 * same background color as active steps by default.
 *
 * However, both of these colors can be customized via code, by specifying color
 * values for `activeColor` and `passedColor`.
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
            passedColor: 'rgb(var(--color-green-lighter))',
            selected: true,
        },
        {
            value: 'purple',
            text: 'Purple step',
            activeColor: 'rgb(var(--color-purple-default))',
            passedColor: 'rgb(var(--color-green-light))',
        },
        {
            value: 'organge',
            text: 'Blue step',
            activeColor: 'rgb(var(--color-blue-default))',
            passedColor: 'rgb(var(--color-green-default))',
        },
        {
            value: 'red',
            text: 'Green step',
            activeColor: 'rgb(var(--color-green-dark)',
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
        console.log('Item clicked', event.detail);
        this.flowItems = this.flowItems.map((item) => {
            return {
                ...item,
                selected: item.value === event.detail?.value,
            };
        });
    }
}
