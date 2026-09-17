import { Component, h, Host, State } from '@stencil/core';
import {
    GoToPageEvent,
    LimelPaginationCustomEvent,
} from '@limetech/lime-elements';

/**
 * Basic example
 *
 * This component does not load anything on its own, and it does not move on
 * its own either. You give it a page and a total. When someone picks a page it
 * emits `goToPage` — with the `offset` and `limit` that page needs — and waits.
 * Set `page` to the number it gave you and the control follows.
 *
 * :::note
 * - The event fires, but the numbers do not move until you set `page`. That is
 * on purpose: if the load fails, or you want to confirm something first, leave
 * `page` alone and the control is still showing the page the user is looking
 * at, with nothing to put back.
 * :::
 *
 * There is no property for the number of pages, because it does not need one:
 * `totalItems` divided by `pageSize` already gives the answer, and a third
 * number would only be something else to keep in sync.
 */
@Component({
    tag: 'limel-example-pagination-basic',
    shadow: true,
})
export class PaginationBasicExample {
    @State()
    private page = 1;

    render() {
        return (
            <Host>
                <limel-pagination
                    page={this.page}
                    totalItems={248}
                    onGoToPage={this.handleGoToPage}
                />
                <limel-example-value label="Page" value={this.page} />
            </Host>
        );
    }

    private readonly handleGoToPage = (
        event: LimelPaginationCustomEvent<GoToPageEvent>
    ) => {
        this.page = event.detail.page;
    };
}
