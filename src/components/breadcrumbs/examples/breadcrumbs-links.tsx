import { Component, h } from '@stencil/core';
import { BreadcrumbsItem } from '@limetech/lime-elements';

/**
 * Items as hyperlinks
 * When the Breadcrumbs are used to navigate between different webpages,
 * for example navigating a website, you will need to provide a `link`
 * for each webpage.
 *
 * This way, the component will automatically generate a list of
 * hyperlinks. This gives the users the possibility of interacting with links
 * in a natural way, for instance they can open any of the previous
 * pages in a new browser tab. This also has other accessibility benefits.
 *
 * :::note
 * Clicking links will open in current window by default,
 * and this reloads the entire webpage.
 * To avoid reloading the whole application (in the context of a single-page apps),
 * you might want to handle the navigation with your application's router,
 * :::
 *
 * Keep in mind that the last item will not be rendered as an HTML link and
 * is not clickable.
 */
@Component({
    tag: 'limel-example-breadcrumbs-links',
    shadow: true,
})
export class BreadcrumbsLinksExample {
    private items: BreadcrumbsItem[] = [
        {
            text: 'Home',
            link: {
                href: '../../../..',
                title: 'Start',
            },
        },
        {
            text: 'Products',
            link: {
                href: '../../../',
                title: 'See all of our products',
            },
        },
        {
            text: 'Phones',
            link: {
                href: '../../',
            },
        },
        {
            text: 'Accessories',
            link: {
                href: '../',
            },
        },
        {
            text: 'Earphones',
        },
    ];

    public render() {
        return <limel-breadcrumbs items={this.items} />;
    }
}
