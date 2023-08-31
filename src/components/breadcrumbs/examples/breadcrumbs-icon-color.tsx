import { Component, h } from '@stencil/core';
import { BreadcrumbsItem } from '@limetech/lime-elements';

/**
 * Using colors
 *
 * You can specify colors for single item, by setting `color` on the `icon`.
 *
 * :::note
 * Make sure not to overuse colors!
 * It is perfectly fine that items in the bar use the default color.
 * Colors should be used to add an extra layer of meaning for the actions.
 *
 * An icon can either adopt the color of the default text or receive a color
 * if the `--breadcrumbs-item-text-color` has been set.
 *
 * Nevertheless, if the `color` is explicitly defined,
 * it will take precedence over the default icon's color.
 * :::
 *
 */
@Component({
    tag: 'limel-example-breadcrumbs-icon-color',
    shadow: true,
})
export class BreadcrumbsIconColorExample {
    private items: BreadcrumbsItem[] = [
        {
            text: 'step 1',
            icon: {
                name: 'fish',
                color: 'rgb(var(--color-red-default))',
            },
        },
        {
            text: 'Step 2',
            icon: {
                name: 'cat',
                color: 'rgb(var(--color-orange-default))',
            },
        },
        {
            text: 'Step 3',
            icon: {
                name: 'dog',
                color: 'rgb(var(--color-blue-default))',
            },
        },
    ];

    public render() {
        return <limel-breadcrumbs items={this.items} />;
    }
}
