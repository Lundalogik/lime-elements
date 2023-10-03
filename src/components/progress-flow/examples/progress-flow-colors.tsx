import { Component, h, State } from '@stencil/core';
import { FlowItem } from '@limetech/lime-elements';

/**
 * Using colors
 *
 * By default, each step appears with a light grey background, and when
 * selected, it gets the defined `--lime-primary-color` as background. Also,
 * passed steps will get the same background color as selected steps by default.
 *
 * However, both of these colors can be customized by specifying color values
 * for `selectedColor` and `passedColor`.
 *
 * Any icons will get the same color as the text for that step, but the color of
 * icons for steps which are neither selected nor passed can be specified using
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
            selectedColor: 'rgb(var(--color-magenta-default)',
            passedColor: 'rgb(var(--color-green-light))',
            icon: 'roller_brush',
            iconColor: 'rgb(var(--color-magenta-default)',
        },
        {
            value: 'purple',
            text: 'Purple step',
            selectedColor: 'rgb(var(--color-purple-default))',
            passedColor: 'rgb(var(--color-green-default))',
            icon: 'brush',
            iconColor: 'rgb(var(--color-purple-default))',
        },
        {
            value: 'organge',
            text: 'Blue step',
            selectedColor: 'rgb(var(--color-blue-default))',
            passedColor: 'rgb(var(--color-green-dark))',
            icon: 'paint_brush',
            iconColor: 'rgb(var(--color-blue-default))',
        },
        {
            value: 'red',
            text: 'Green step',
            selectedColor: 'rgb(var(--color-green-darker))',
            icon: 'cosmetic_brush',
            iconColor: 'rgb(var(--color-green-darker))',
        },
    ];

    public render() {
        return (
            <limel-progress-flow
                flowItems={this.flowItems}
                onChange={this.handleChange}
            />
        );
    }

    private handleChange = (event: CustomEvent<FlowItem>) => {
        this.flowItems = this.flowItems.map((item) => {
            return {
                ...item,
                selected: item.value === event.detail?.value,
            };
        });
    };
}
