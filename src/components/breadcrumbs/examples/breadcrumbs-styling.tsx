import { Component, h } from '@stencil/core';
import { BreadcrumbsItem } from '@limetech/lime-elements';

/**
 * Styling
 *
 * Using provided custom CSS properties,
 * it is possible to style the breadcrumbs.
 *
 */
@Component({
    tag: 'limel-example-breadcrumbs-styling',
    shadow: true,
    styleUrl: 'breadcrumbs-styling.scss',
})
export class BreadcrumbsStylingExample {
    private items: BreadcrumbsItem[] = [
        {
            text: 'Home',
            icon: {
                name: 'smart_home',
                color: 'rgb(var(--color-cyan-light))',
            },
        },
        {
            text: 'Products',
            icon: { name: 'menu' },
        },
        {
            text: 'Phones',
            icon: { name: 'iphone_x' },
        },
        {
            text: 'Accessories',
        },
    ];

    public render() {
        return <limel-breadcrumbs items={this.items} />;
    }
}
