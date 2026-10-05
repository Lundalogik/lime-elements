import { Component, h, Host, Method, Prop, State } from '@stencil/core';

const MIN_PAGE_SHARE = 0.5;
const HIDE_BUTTON_WHEN_CLOSER_TO_EDGE_THAN_PX = 40;
const PAGE_OVERLAP = 0.2;

type Edge = 'start' | 'end';

// A click on an arrow is no reason to take the focus from the item that has it.
const keepFocusWhereItIs = (event: MouseEvent) => event.preventDefault();

// Points towards the end of the horizontal axis. The styles turn it around.
const Arrow = () => (
    <svg class="arrow" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path d="M18 4l20 20-20 20" />
    </svg>
);

/**
 * Makes content that is larger than its container scrollable, along one axis.
 *
 * The native scrollbar is hidden. Instead, an edge that has more to reveal
 * fades out, and an arrow appears on it. Clicking the arrow scrolls almost a
 * page, and leaves the last part of the previous page in view, as a reference
 * for how far the user has scrolled. For people who have asked their system to
 * reduce motion, the scroller jumps instead of gliding.
 *
 * When something inside the scroller receives focus, the scroller reveals the
 * item that holds it, together with a glimpse of whatever is next to it. An
 * item can control how much of its neighbors gets revealed, by setting its
 * `scroll-margin`. An item that becomes selected without receiving focus is up
 * to the consumer to reveal, using the `reveal()` method.
 *
 * :::note Accessibility
 * The arrows are only a shortcut for people who use a mouse or a touch screen.
 * They are not real buttons. Screen readers do not announce them, and the Tab
 * key skips them. Therefore, the content must contain something that can
 * receive focus, such as a button, a link or a tab. Without it, there is no way
 * to scroll with a keyboard. The examples explain the reasoning.
 * :::
 *
 * @slot - The content to scroll. Each child is treated as an item.
 * @exampleComponent limel-example-scroller-horizontal
 * @exampleComponent limel-example-scroller-vertical
 * @private
 */
@Component({
    tag: 'limel-scroller',
    styleUrl: 'scroller.scss',
    shadow: true,
})
export class Scroller {
    /**
     * The axis along which the content scrolls.
     */
    @Prop({ reflect: true })
    public orientation: 'horizontal' | 'vertical' = 'horizontal';

    @State()
    private canScrollToStart = false;

    @State()
    private canScrollToEnd = false;

    private scrollArea?: HTMLElement;
    private scrollContent?: HTMLElement;
    private slotElement?: HTMLSlotElement;
    private readonly fades: Partial<Record<Edge, HTMLElement>> = {};
    private resizeObserver?: ResizeObserver;
    private pendingReveal?: { item: HTMLElement; behavior: ScrollBehavior };

    public connectedCallback() {
        this.observeSize();
    }

    public componentDidLoad() {
        this.observeSize();
    }

    public disconnectedCallback() {
        this.resizeObserver?.disconnect();
    }

    public render() {
        return (
            <Host>
                <div
                    class={{
                        scroller: true,
                        [this.orientation]: true,
                        'can-scroll-to-start': this.canScrollToStart,
                        'can-scroll-to-end': this.canScrollToEnd,
                    }}
                >
                    <div
                        class="scroll-area"
                        ref={(element) => (this.scrollArea = element)}
                        onScroll={this.updateScrollability}
                        onFocusin={this.revealFocusedItem}
                    >
                        <div
                            class="scroll-content"
                            ref={(element) => (this.scrollContent = element)}
                        >
                            <slot
                                ref={(element) => (this.slotElement = element)}
                            />
                        </div>
                    </div>
                    {this.renderEdge('start')}
                    {this.renderEdge('end')}
                </div>
            </Host>
        );
    }

    private renderEdge(edge: Edge) {
        return [
            <div
                key={`fade-${edge}`}
                class={`scroll-fade ${edge}`}
                ref={(element) => (this.fades[edge] = element)}
            />,
            <div
                key={`button-${edge}`}
                class={`scroll-button ${edge}`}
                aria-hidden="true"
            >
                <div // NOSONAR: only for the pointer, on purpose. The keyboard has the items.
                    class="arrow-button"
                    onMouseDown={keepFocusWhereItIs}
                    onClick={() => this.scrollOnePage(edge)}
                >
                    <Arrow />
                </div>
            </div>,
        ];
    }

    private observeSize() {
        if (!this.scrollArea || typeof ResizeObserver === 'undefined') {
            return;
        }

        this.resizeObserver ??= new ResizeObserver(this.handleResize);
        this.resizeObserver.observe(this.scrollArea);
        this.resizeObserver.observe(this.scrollContent);
    }

    private readonly handleResize = () => {
        const pending = this.pendingReveal;
        if (pending) {
            this.revealItem(pending.item, pending.behavior);
        }

        this.updateScrollability();
    };

    private readonly updateScrollability = () => {
        const area = this.scrollArea;
        if (!area) {
            return;
        }

        const vertical = this.orientation === 'vertical';
        const scrolled = vertical ? area.scrollTop : area.scrollLeft;
        const overflow = vertical
            ? area.scrollHeight - area.clientHeight
            : area.scrollWidth - area.clientWidth;

        this.canScrollToStart =
            scrolled > HIDE_BUTTON_WHEN_CLOSER_TO_EDGE_THAN_PX;
        this.canScrollToEnd =
            Math.floor(overflow - scrolled) >
            HIDE_BUTTON_WHEN_CLOSER_TO_EDGE_THAN_PX;
    };

    private scrollOnePage(edge: Edge) {
        const area = this.scrollArea;
        const fade = this.fades[edge];
        const vertical = this.orientation === 'vertical';
        const [size, fadeSize] = vertical
            ? [area.clientHeight, fade.offsetHeight]
            : [area.clientWidth, fade.offsetWidth];

        // What is under the arrow, and faded, on one edge must land clear of
        // the fade and the arrow on the other edge.
        const overlap = Math.max(size * PAGE_OVERLAP, fadeSize);
        const distance = Math.max(size - overlap, size * MIN_PAGE_SHARE);
        const delta = edge === 'start' ? -distance : distance;

        const behavior = getScrollBehavior();
        area.scrollBy(
            vertical ? { top: delta, behavior } : { left: delta, behavior }
        );
    }

    // What has focus, or is asked to be revealed, can be deeper inside an item.
    // The item is what gets revealed, since it is what carries the
    // `scroll-margin`.
    private findItem(element: HTMLElement) {
        let node: HTMLElement | null = element;
        while (node && node.assignedSlot !== this.slotElement) {
            node = node.parentElement;
        }

        return node;
    }

    private readonly revealFocusedItem = (event: FocusEvent) => {
        const item = this.findItem(event.target as HTMLElement);
        if (!item) {
            return;
        }

        // The browser scrolls a focused element into view too. Wait for it
        // to be done, so that the position it leaves is what we adjust.
        requestAnimationFrame(() => this.revealItem(item));
    };

    /**
     * Scrolls an item into view, together with a glimpse of its neighbors.
     * Whatever receives focus is revealed without being asked to. This is for
     * an item that becomes selected without receiving focus. If the scroller
     * is hidden, in a dialog that is closed for instance, the item is revealed
     * when the scroller is shown.
     *
     * @param item - one of the items of the scroller, or something inside one
     * @param behavior - `auto` jumps to the item, and `smooth` glides there.
     * Defaults to `smooth`, unless the user has asked to reduce motion.
     */
    @Method()
    public async reveal(
        item: HTMLElement,
        behavior: ScrollBehavior = getScrollBehavior()
    ): Promise<void> {
        this.revealItem(this.findItem(item) ?? item, behavior);
    }

    private revealItem(
        item: HTMLElement,
        behavior: ScrollBehavior = getScrollBehavior()
    ) {
        const area = this.scrollArea;
        this.pendingReveal = undefined;
        if (!area || !item.isConnected) {
            return;
        }

        // There is nothing to measure while the scroller is hidden.
        if (area.getClientRects().length === 0) {
            this.pendingReveal = { item, behavior };

            return;
        }

        const vertical = this.orientation === 'vertical';
        const [before, after] = vertical
            ? (['top', 'bottom'] as const)
            : (['left', 'right'] as const);
        const size = vertical ? 'height' : 'width';
        const areaBox = area.getBoundingClientRect();
        const itemBox = item.getBoundingClientRect();
        const style = getComputedStyle(item);

        // The boxes are measured on the screen, where a scroller that is
        // scaled, as it is in a dialog that is opening, is larger or smaller
        // than the distance it takes to scroll.
        const scale =
            areaBox[size] / Number.parseFloat(getComputedStyle(area)[size]) ||
            1;
        const margin = (side: typeof before | typeof after) =>
            Number.parseFloat(style.getPropertyValue(`scroll-margin-${side}`)) *
            scale;

        const hiddenBefore =
            areaBox[before] - (itemBox[before] - margin(before));
        const hiddenAfter = itemBox[after] + margin(after) - areaBox[after];

        let distance = 0;
        if (hiddenBefore > 0) {
            distance = -hiddenBefore;
        } else if (hiddenAfter > 0) {
            distance = hiddenAfter;
        }

        if (distance === 0) {
            return;
        }

        area.scrollBy(
            vertical
                ? { top: distance / scale, behavior }
                : { left: distance / scale, behavior }
        );
    }
}

function getScrollBehavior(): ScrollBehavior {
    return matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth';
}
