import { Component, h, Host, State } from '@stencil/core';
import {
    GoToPageEvent,
    LimelPaginationCustomEvent,
    LimelSelectCustomEvent,
    Option,
} from '@limetech/lime-elements';

/**
 * Page size
 *
 * `pageSize` is how many items fit on one page. Together with `totalItems`,
 * that is everything the component needs to work out how many pages there are.
 *
 * It never changes the value itself. How many items to show is your decision,
 * or a setting you let your users make, so put that control wherever your
 * other settings live rather than inside the pagination.
 *
 * In this example, you can try changing the `pageSize`.
 * The number of pages updates right away, and if the
 * page the user was on no longer exists, the component goes to the last page
 * that does and emits `goToPage`, so you know what to load.
 */
@Component({
    tag: 'limel-example-pagination-page-size',
    shadow: true,
})
export class PaginationPageSizeExample {
    @State()
    private pageSize = 25;

    @State()
    private page = 8;

    private readonly pageSizes: Option[] = [
        { text: '10 per page', value: '10' },
        { text: '25 per page', value: '25' },
        { text: '50 per page', value: '50' },
        { text: '100 per page', value: '100' },
    ];

    render() {
        return (
            <Host>
                <limel-pagination
                    page={this.page}
                    pageSize={this.pageSize}
                    totalItems={248}
                    onGoToPage={this.handleGoToPage}
                />
                <limel-example-value label="Page" value={this.page} />
                <limel-example-controls>
                    <limel-select
                        label="Page size"
                        value={this.pageSizes.find(
                            (option) => option.value === String(this.pageSize)
                        )}
                        options={this.pageSizes}
                        onChange={this.handlePageSizeChange}
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

    private readonly handlePageSizeChange = (
        event: LimelSelectCustomEvent<Option>
    ) => {
        this.pageSize = Number(event.detail.value);
    };
}
