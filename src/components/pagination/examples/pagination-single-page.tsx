import { Component, h, Host, State } from '@stencil/core';
import {
    GoToPageEvent,
    LimelCheckboxCustomEvent,
    LimelPaginationCustomEvent,
} from '@limetech/lime-elements';

const PAGE_SIZE = 20;
const EVERYTHING = 9840;
const NARROWED = 12;

/**
 * When there is only one page
 *
 * The component always renders, even when everything fits on one page and
 * there is nowhere to go. If it hid itself, everything below it would jump up
 * the moment a filter happened to narrow the results, and you could not stop
 * that from happening. Whether to show a pagination at all is your decision,
 * so it is left to you.
 *
 * With many pages, page 1 and the last page are always there, so both ends of
 * the list are one click away. That is why there are no separate first and
 * last buttons: the numbers already do that job, and they tell you where they
 * take you. The pages that do not fit are replaced by a `···`.
 *
 * In this example, you can try narrowing the results and watch the control
 * shrink from 492 pages to one, without moving or disappearing.
 */
@Component({
    tag: 'limel-example-pagination-single-page',
    shadow: true,
})
export class PaginationSinglePageExample {
    @State()
    private page = 1;

    @State()
    private narrowed = false;

    render() {
        return (
            <Host>
                <limel-pagination
                    page={this.page}
                    pageSize={PAGE_SIZE}
                    totalItems={this.narrowed ? NARROWED : EVERYTHING}
                    onGoToPage={this.handleGoToPage}
                />
                <limel-example-value label="Page" value={this.page} />
                <limel-example-controls>
                    <limel-checkbox
                        label="Narrow the results"
                        checked={this.narrowed}
                        onChange={this.handleNarrowedChange}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private readonly handleGoToPage = (
        event: LimelPaginationCustomEvent<GoToPageEvent>
    ) => {
        this.page = event.detail.page;
    };

    private readonly handleNarrowedChange = (
        event: LimelCheckboxCustomEvent<boolean>
    ) => {
        this.narrowed = event.detail;
    };
}
