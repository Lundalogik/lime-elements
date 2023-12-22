import { Component, h, State } from '@stencil/core';
import {
    BreadcrumbsItem,
    LimelBreadcrumbsCustomEvent,
} from '@limetech/lime-elements';

/**
 * Items as buttons
 * The Breadcrumbs can also be used to navigate between different
 * steps of a process, such as steps of a form or survey, or
 * moving through steps of a wizard.
 *
 * In this case, you will not provide any `link`s and instead will
 * handle the clicks. When no links are provided, the component
 * will automatically generate a list of `button`s.
 *
 * Keep in mind that the last item will not be rendered as an
 * HTML button and and therefore won't be clickable.
 */
@Component({
    tag: 'limel-example-breadcrumbs-buttons',
    shadow: true,
})
export class BreadcrumbsButtonsExample {
    private items: BreadcrumbsItem[] = [
        {
            text: 'Account info',
        },
        {
            text: 'Personal info',
        },
        {
            text: 'Payment info',
        },
        {
            text: 'Confirm your details',
        },
    ];

    @State()
    private selectedItem: BreadcrumbsItem;

    constructor() {
        this.selectedItem = this.items[0];
    }

    public render() {
        return [
            <limel-breadcrumbs
                items={this.items}
                onSelect={this.handleSelect}
            />,
            <limel-example-value
                label={'Last clicked item'}
                value={this.selectedItem.text}
            />,
        ];
    }

    private handleSelect = (
        event: LimelBreadcrumbsCustomEvent<BreadcrumbsItem>
    ) => {
        this.selectedItem = event.detail;
    };
}
