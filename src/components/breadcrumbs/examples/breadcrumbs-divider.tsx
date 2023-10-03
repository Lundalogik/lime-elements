import { Component, h } from '@stencil/core';
import { BreadcrumbsItem } from '@limetech/lime-elements';

/**
 * Changing the divider
 * By default a **›** character is used to visually divide the
 * items from each other. This visual divider indicates the
 * order and depths of steps which are taken to reach the current
 * step.
 *
 * However, in certain contexts, other characters could be
 * more suitable to visualize this hierarchy,
 * such as a **·**, **-** or similar.
 *
 * :::warning
 * Avoid using ellipsis motifs like **···**, **…** or **⋮**,
 * since they look like universally prevalent icons which
 * communicate other meanings.
 */
@Component({
    tag: 'limel-example-breadcrumbs-divider',
    shadow: true,
})
export class BreadcrumbsDividerExample {
    private items: BreadcrumbsItem[] = [
        {
            text: 'root',
        },
        {
            text: 'src',
        },
        {
            text: 'components',
        },
        {
            text: 'my-component',
        },
    ];

    public render() {
        return <limel-breadcrumbs items={this.items} divider="/" />;
    }
}
