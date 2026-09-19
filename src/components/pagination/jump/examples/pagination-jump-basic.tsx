import { Component, h, Host, State } from '@stencil/core';
import {
    LimelCheckboxCustomEvent,
    LimelPaginationJumpCustomEvent,
} from '@limetech/lime-elements';

const PAGE_COUNT = 492;

/**
 * Jumping to a page
 *
 * This is the form that `limel-pagination` puts inside the popover its `···`
 * opens. It is shown on its own here, without the popover around it, so that
 * what it does is easier to see.
 *
 * It starts from the page the user is on, so that moving a few pages is a
 * keystroke or two rather than typing a number from scratch. A page beyond
 * either end of the set is not refused: the set has a first and a last page,
 * both written in the field, and the nearer of them is what someone typing
 * past the end meant. Try `9999` and watch where it asks to go.
 *
 * Asking is all it does. It reports the page it was given and leaves showing
 * it to whatever is listening, the same way the pagination it belongs to
 * leaves moving to its consumer.
 */
@Component({
    tag: 'limel-example-pagination-jump-basic',
    shadow: true,
})
export class PaginationJumpBasicExample {
    @State()
    private page = 50;

    @State()
    private open = true;

    render() {
        return (
            <Host>
                <limel-pagination-jump
                    open={this.open}
                    page={this.page}
                    pageCount={PAGE_COUNT}
                    onJump={this.handleJump}
                />
                <limel-example-value label="Page" value={this.page} />
                <limel-example-controls>
                    <limel-checkbox
                        label="Open"
                        checked={this.open}
                        onChange={this.handleOpenChange}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private readonly handleJump = (
        event: LimelPaginationJumpCustomEvent<number>
    ) => {
        this.page = event.detail;
    };

    private readonly handleOpenChange = (
        event: LimelCheckboxCustomEvent<boolean>
    ) => {
        this.open = event.detail;
    };
}
