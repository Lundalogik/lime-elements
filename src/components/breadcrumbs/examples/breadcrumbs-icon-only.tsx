import { Component, h } from '@stencil/core';
import { BreadcrumbsItem } from '@limetech/lime-elements';

/**
 * Using icons
 * For an improved accessibility, you are required to
 * provide a `text` for each item in the breadcrumbs.
 * But each item can have an optional icon too.
 *
 * However, in some UIs, the design might require
 * hiding the text and relying on an icon to visualize
 * an item in the path.
 *
 * In this case you can set the `type` to
 * `icon-only` on the desired items.
 *
 * :::note
 * The last item (current step) will always
 * display both an icon and the text, even if you
 * set the `type` to `icon-only`
 * :::
 */
@Component({
    tag: 'limel-example-breadcrumbs-icons',
    shadow: true,
})
export class BreadcrumbsIconsExample {
    private items: BreadcrumbsItem[] = [
        {
            text: 'Home',
            type: 'icon-only',
            icon: { name: 'smart_home' },
        },
        {
            text: 'Products',
            icon: { name: 'shop' },
        },
        {
            text: 'Phones',
            icon: { name: 'iphone_x' },
        },
        {
            text: 'Accessories',
            type: 'icon-only',
            icon: { name: 'headphones' },
        },
    ];

    public render() {
        return <limel-breadcrumbs items={this.items} />;
    }
}
