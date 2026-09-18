import { Component, h, Host, State } from '@stencil/core';
import {
    GoToPageEvent,
    LimelPaginationCustomEvent,
} from '@limetech/lime-elements';

/**
 * Reading the event
 *
 * When someone picks a page, the component emits `goToPage` and waits.
 * Alongside the page number it hands you `offset` and `limit`, which is what
 * most APIs ask for when you fetch a page, so you do not have to work them out
 * yourself.
 *
 * Send the page back by setting `page`, and the control moves there. Until you
 * do, it carries on showing the page the user is looking at — so if the fetch
 * fails, there is nothing to put back. Setting `page` is also how you restore
 * the page a user was last on, from a URL.
 *
 * In this example, you can see the whole event as it is emitted.
 */
@Component({
    tag: 'limel-example-pagination-page',
    shadow: true,
})
export class PaginationPageExample {
    @State()
    private event: GoToPageEvent;

    render() {
        return (
            <Host>
                <limel-pagination
                    page={this.event?.page}
                    pageSize={20}
                    totalItems={248}
                    onGoToPage={this.handleGoToPage}
                />
                <limel-example-value label="goToPage" value={this.event} />
            </Host>
        );
    }

    private readonly handleGoToPage = (
        event: LimelPaginationCustomEvent<GoToPageEvent>
    ) => {
        this.event = event.detail;
    };
}
