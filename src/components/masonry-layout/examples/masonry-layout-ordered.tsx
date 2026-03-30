import { Component, h, Host, State } from '@stencil/core';

/**
 * Ordered layout
 *
 * By default, items are placed in the shortest column to
 * optimize space usage. This means the visual order may not
 * match the DOM order.
 *
 * Setting `ordered` to `true` places items left-to-right in
 * DOM order (round-robin across columns), preserving the reading
 * order. The trade-off is that column heights may become uneven
 * if tall items happen to cluster in the same column.
 *
 * :::tip
 * Use `ordered` when the sequence of items matters,
 * such as numbered lists or timelines.
 * Use the default when visual balance is more important,
 * such as photo galleries or dashboards.
 * :::
 */
@Component({
    tag: 'limel-example-masonry-layout-ordered',
    styleUrl: 'masonry-layout-ordered.scss',
    shadow: true,
})
export class MasonryLayoutOrderedExample {
    @State()
    private ordered = false;

    private readonly items = [
        { label: '1 — Short', height: 6 },
        { label: '2 — Tall', height: 14 },
        { label: '3 — Medium', height: 9 },
        { label: '4 — Short', height: 5 },
        { label: '5 — Tall', height: 12 },
        { label: '6 — Medium', height: 8 },
        { label: '7 — Short', height: 6 },
        { label: '8 — Tall', height: 13 },
        { label: '9 — Medium', height: 10 },
    ];

    public render() {
        return (
            <Host>
                <limel-example-controls>
                    <limel-switch
                        value={this.ordered}
                        label="ordered"
                        onChange={this.setOrdered}
                    />
                </limel-example-controls>
                <section>
                    <limel-masonry-layout ordered={this.ordered}>
                        {this.items.map((item) => (
                            <div
                                class="card"
                                style={{ height: `${item.height}rem` }}
                            >
                                {item.label}
                            </div>
                        ))}
                    </limel-masonry-layout>
                </section>
            </Host>
        );
    }

    private readonly setOrdered = (event: CustomEvent<boolean>) => {
        event.stopImmediatePropagation();
        this.ordered = event.detail;
    };
}
