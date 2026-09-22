import { Component, h, Host, State } from '@stencil/core';
import {
    GoToPageEvent,
    LimelCheckboxCustomEvent,
    LimelPaginationCustomEvent,
} from '@limetech/lime-elements';

/**
 * Loading
 *
 * Set `loading` while you are fetching a page. The buttons stop responding, so
 * nobody can ask for a third page while the second is still on its way.
 *
 * Nothing changes size, so the list below does not jump around while it waits.
 * Screen readers are told the component is busy.
 *
 * In this example, you can try switching loading on and clicking around.
 */
@Component({
    tag: 'limel-example-pagination-loading',
    shadow: true,
})
export class PaginationLoadingExample {
    @State()
    private loading = false;

    @State()
    private page = 3;

    render() {
        return (
            <Host>
                <limel-pagination
                    page={this.page}
                    totalItems={248}
                    loading={this.loading}
                    onGoToPage={this.handleGoToPage}
                />
                <limel-example-value label="Page" value={this.page} />
                <limel-example-controls>
                    <limel-checkbox
                        label="Loading"
                        checked={this.loading}
                        onChange={this.handleLoadingChange}
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

    private readonly handleLoadingChange = (
        event: LimelCheckboxCustomEvent<boolean>
    ) => {
        this.loading = event.detail;
    };
}
