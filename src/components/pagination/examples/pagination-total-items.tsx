import { Component, h, Host, State } from '@stencil/core';
import {
    GoToPageEvent,
    LimelPaginationCustomEvent,
} from '@limetech/lime-elements';

const PAGE_SIZE = 5;
const TOTAL_ITEMS = 23;
const ITEMS_ARRIVE_AFTER = 600;
const COUNT_ARRIVES_AFTER = 1800;

/**
 * Total items
 *
 * `totalItems` is how many items there are in total, across every page. It is
 * the only number the component needs to know how far the set goes.
 *
 * Some apps fetch the items first and the total count a moment later, so that
 * the list appears sooner. If that is you, set `totalItems` to `null` until the
 * count turns up.
 *
 * This example pretends to be such an app. Press the button and watch the order
 * things happen in: the items come back first, and the count a moment later.
 * While the count is missing the component keeps the pages it already knew
 * about, so nothing jumps around and you stay on the page you were on.
 *
 * Going to another page only fetches the items. The count is still good, so the
 * page numbers do not flicker.
 *
 * A small total is worth knowing about: when everything fits on one page, the
 * component still renders, showing `1` with both arrows dead. It stays because
 * disappearing would shove whatever sits underneath it upwards, at the
 * unhelpful moment when a filter has just narrowed someone's results. Whether
 * a pagination is worth showing at all in that case is your call, and you make
 * it by not rendering one.
 */
@Component({
    tag: 'limel-example-pagination-total-items',
    shadow: true,
})
export class PaginationTotalItemsExample {
    @State()
    private page = 1;

    @State()
    private items: string[] = [];

    @State()
    private totalItems: number | null = null;

    @State()
    private loading = false;

    // Two handles rather than a list, because paging must cancel the items
    // request without cancelling the count that a reload has in flight.
    private itemsTimer: ReturnType<typeof setTimeout>;
    private countTimer: ReturnType<typeof setTimeout>;

    public componentWillLoad() {
        this.reload();
    }

    public disconnectedCallback() {
        this.clearTimers();
    }

    public render() {
        return (
            <Host>
                <limel-pagination
                    page={this.page}
                    pageSize={PAGE_SIZE}
                    totalItems={this.totalItems}
                    loading={this.loading}
                    onGoToPage={this.handleGoToPage}
                />
                <ul>
                    {this.loading ? <li>Searching…</li> : this.renderItems()}
                </ul>
                <limel-example-value
                    label="totalItems"
                    value={this.totalItems}
                />
                <limel-example-controls>
                    <limel-button
                        label="Reload results"
                        primary={true}
                        onClick={this.handleReload}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private renderItems() {
        return this.items.map((item) => <li key={item}>{item}</li>);
    }

    /**
     * Fetch everything again, count included. The old count is not trusted
     * while a new one is on its way, so it goes away until that one turns up.
     */
    private reload() {
        this.totalItems = null;
        this.loadItems();

        clearTimeout(this.countTimer);
        this.countTimer = setTimeout(() => {
            this.totalItems = TOTAL_ITEMS;
        }, COUNT_ARRIVES_AFTER);
    }

    /**
     * Going to another page only fetches items. The count is still correct, so
     * it is left alone.
     */
    private loadItems() {
        clearTimeout(this.itemsTimer);
        this.loading = true;
        this.items = [];

        this.itemsTimer = setTimeout(() => {
            const first = (this.page - 1) * PAGE_SIZE;
            const last = Math.min(first + PAGE_SIZE, TOTAL_ITEMS);

            this.items = Array.from(
                { length: last - first },
                (_, index) => `Item ${first + index + 1}`
            );
            this.loading = false;
        }, ITEMS_ARRIVE_AFTER);
    }

    private clearTimers() {
        clearTimeout(this.itemsTimer);
        clearTimeout(this.countTimer);
    }

    private readonly handleReload = () => {
        this.reload();
    };

    private readonly handleGoToPage = (
        event: LimelPaginationCustomEvent<GoToPageEvent>
    ) => {
        this.page = event.detail.page;
        this.loadItems();
    };
}
