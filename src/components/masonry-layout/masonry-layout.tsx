import { Component, Element, h, Host, Prop, State, Watch } from '@stencil/core';

/**
 * A responsive masonry grid layout component.
 *
 * This component arranges slotted elements into a masonry-style grid,
 * where items are placed in the shortest column, resulting in a
 * Pinterest-like layout with minimal vertical gaps.
 *
 * The component uses JavaScript to calculate positions, providing
 * reliable cross-browser support — unlike CSS-only approaches such as
 * `columns` or `grid-template-rows: masonry`, which have limited
 * browser support or produce poor results.
 *
 * The number of columns is determined automatically based on the
 * available width and the minimum column width.
 *
 * @exampleComponent limel-example-masonry-layout-basic
 * @exampleComponent limel-example-masonry-layout-images
 * @exampleComponent limel-example-masonry-layout-ordered
 * @slot - Items to arrange in the masonry layout
 * @beta
 */
@Component({
    tag: 'limel-masonry-layout',
    styleUrl: 'masonry-layout.scss',
    shadow: true,
})
export class MasonryLayout {
    /**
     * When `true`, items are placed left-to-right in DOM order.
     * When `false` (default), items are placed in the shortest column.
     */
    @Prop({ reflect: true })
    public ordered: boolean = false;

    @Watch('ordered')
    protected onOrderedChange() {
        this.scheduleLayout();
    }

    @Element()
    private host: HTMLElement;

    @State()
    private containerHeight: number = 0;

    private hasRendered = false;
    private resizeObserver: ResizeObserver;
    private mutationObserver: MutationObserver;
    private itemResizeObserver: ResizeObserver;
    private pendingLayoutFrame: number | null = null;

    public componentDidLoad() {
        this.setupObservers();
        this.layoutItems();
        this.hasRendered = true;
    }

    public connectedCallback() {
        if (this.hasRendered) {
            this.setupObservers();
            this.scheduleLayout();
        }
    }

    public disconnectedCallback() {
        this.resizeObserver?.disconnect();
        this.mutationObserver?.disconnect();
        this.itemResizeObserver?.disconnect();
        if (this.pendingLayoutFrame !== null) {
            cancelAnimationFrame(this.pendingLayoutFrame);
        }
    }

    public render() {
        const style = {
            height: `${this.containerHeight}rem`,
        };

        return (
            <Host style={style} class={{ 'is-laid-out': this.hasRendered }}>
                <slot />
            </Host>
        );
    }

    private setupObservers() {
        this.resizeObserver = new ResizeObserver(() => {
            this.scheduleLayout();
        });
        this.resizeObserver.observe(this.host);

        this.itemResizeObserver = new ResizeObserver(() => {
            this.scheduleLayout();
        });

        this.mutationObserver = new MutationObserver(() => {
            this.observeItemSizes();
            this.scheduleLayout();
        });
        this.mutationObserver.observe(this.host, { childList: true });

        this.observeItemSizes();
    }

    private observeItemSizes() {
        this.itemResizeObserver?.disconnect();
        const items = this.getItems();
        for (const item of items) {
            this.itemResizeObserver.observe(item);
        }
    }

    private getItems(): HTMLElement[] {
        return [...this.host.children].filter(
            (child): child is HTMLElement => child instanceof HTMLElement
        );
    }

    private getRootFontSize(): number {
        return Number.parseFloat(
            getComputedStyle(document.documentElement).fontSize
        );
    }

    private pxToRem(px: number, rootFontSize: number): number {
        return px / rootFontSize;
    }

    /**
     * Reads a CSS custom property from the host element and resolves
     * its value to pixels. Falls back to the provided default if the
     * property is not set.
     *
     * @param property - The CSS custom property name to read.
     * @param fallback - The fallback CSS value if the property is not set.
     * @param rootFontSize - The root font size in pixels for rem conversion.
     */
    private getCssPropertyInPx(
        property: string,
        fallback: string,
        rootFontSize: number
    ): number {
        const value =
            getComputedStyle(this.host).getPropertyValue(property).trim() ||
            fallback;

        const number = Number.parseFloat(value);
        if (value.endsWith('px')) {
            return number;
        }

        // Assume rem for any other unit (rem is the project standard)
        return number * rootFontSize;
    }

    /**
     * Debounces layout recalculations using `requestAnimationFrame`
     * to coalesce multiple observer callbacks into a single layout
     * pass per frame, avoiding layout thrashing.
     */
    private scheduleLayout() {
        if (this.pendingLayoutFrame !== null) {
            cancelAnimationFrame(this.pendingLayoutFrame);
        }

        this.pendingLayoutFrame = requestAnimationFrame(() => {
            this.pendingLayoutFrame = null;
            this.layoutItems();
        });
    }

    private layoutItems() {
        const items = this.getItems();
        if (items.length === 0) {
            this.containerHeight = 0;

            return;
        }

        const hostWidth = this.host.offsetWidth;
        if (!hostWidth) {
            return;
        }

        const rootFontSize = this.getRootFontSize();
        const gapPx = this.getCssPropertyInPx(
            '--masonry-layout-gap',
            '1rem',
            rootFontSize
        );
        const { columnCount, columnWidth } = this.calculateColumns(
            hostWidth,
            gapPx,
            rootFontSize
        );
        const columnHeights = this.positionItems(
            items,
            columnCount,
            columnWidth,
            gapPx,
            rootFontSize
        );

        const newHeight = this.pxToRem(
            Math.max(...columnHeights) - gapPx,
            rootFontSize
        );
        if (Math.abs(newHeight - this.containerHeight) > 0.1) {
            this.containerHeight = newHeight;
        }
    }

    private calculateColumns(
        hostWidth: number,
        gapPx: number,
        rootFontSize: number
    ): { columnCount: number; columnWidth: number } {
        const minColumnWidthPx = this.getCssPropertyInPx(
            '--masonry-layout-min-column-width',
            '12rem',
            rootFontSize
        );

        const columnCount = Math.max(
            1,
            Math.floor((hostWidth + gapPx) / (minColumnWidthPx + gapPx))
        );
        const columnWidth =
            (hostWidth - (columnCount - 1) * gapPx) / columnCount;

        return { columnCount, columnWidth };
    }

    /**
     * Absolutely positions each item into the grid. In ordered mode,
     * items are placed left-to-right via round-robin. In default mode,
     * each item is placed in the shortest column for balanced heights.
     *
     * @param items - The child elements to position.
     * @param columnCount - The number of columns in the grid.
     * @param columnWidth - The width of each column in pixels.
     * @param gapPx - The gap between items in pixels.
     * @param rootFontSize - The root font size in pixels for rem conversion.
     * @returns The cumulative height of each column in pixels.
     */
    private positionItems(
        items: HTMLElement[],
        columnCount: number,
        columnWidth: number,
        gapPx: number,
        rootFontSize: number
    ): number[] {
        const columnHeights = Array.from({ length: columnCount }, () => 0);

        let index = 0;
        for (const item of items) {
            const column = this.ordered
                ? index % columnCount
                : columnHeights.indexOf(Math.min(...columnHeights));

            const x = column * (columnWidth + gapPx);
            const y = columnHeights[column];

            item.style.position = 'absolute';
            item.style.left = `${this.pxToRem(x, rootFontSize)}rem`;
            item.style.top = `${this.pxToRem(y, rootFontSize)}rem`;
            item.style.width = `${this.pxToRem(columnWidth, rootFontSize)}rem`;

            if (!this.hasRendered) {
                this.staggerFadeIn(item, index);
            }

            columnHeights[column] += item.offsetHeight + gapPx;
            index++;
        }

        return columnHeights;
    }

    /**
     * Applies a staggered fade-in transition to an item.
     * Inline `transition` and `transitionDelay` styles are set
     * temporarily and cleaned up via a `transitionend` listener
     * so they don't interfere with the consumer's own transitions.
     *
     * The listener filters by `event.target` to avoid reacting to
     * bubbled events from descendant elements.
     *
     * Skipped entirely when `prefers-reduced-motion: reduce` is
     * active — items become visible instantly via the CSS
     * `is-laid-out` class instead.
     *
     * @param item - The element to fade in.
     * @param index - The item's position in the list, used to calculate the delay.
     */
    private staggerFadeIn(item: HTMLElement, index: number) {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) {
            return;
        }

        item.style.transition = 'opacity 0.2s cubic-bezier(0.2, 0, 0.2, 1)';
        item.style.transitionDelay = `${index * 20}ms`;

        const cleanup = (event: TransitionEvent) => {
            if (event.target !== item || event.propertyName !== 'opacity') {
                return;
            }

            item.style.transition = '';
            item.style.transitionDelay = '';
            item.removeEventListener('transitionend', cleanup);
        };

        item.addEventListener('transitionend', cleanup);
    }
}
