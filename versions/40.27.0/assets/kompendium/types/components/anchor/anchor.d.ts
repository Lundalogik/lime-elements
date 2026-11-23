/**
 * Inline paragraph-link (¶) placed next to a heading. Picks up the parent
 * heading's font-size, stays hidden until the heading is hovered, and
 * highlights persistently when its slug matches the current URL anchor.
 * @private
 */
export declare class Anchor {
    /**
     * Slug used as the URL anchor fragment and scroll target.
     */
    slug: string;
    /**
     * Human-readable label for the target, used for the aria-label.
     */
    label: string;
    private active;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): HTMLElement;
    private handleClick;
    private handleHashChange;
    private updateActive;
}
