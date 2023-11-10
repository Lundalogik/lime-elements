/**
 * Interface for a link.
 * @public
 */
export interface Link {
    /**
     * The url the link should point to.
     */
    href: string;

    /**
     * The text value to use for the link.
     * Note that this might not be used by all components that use the
     * Link interface.
     */
    text?: string;

    /**
     * Title for the link. Read by assistive tech and shown when the
     * link is hovered. Can be used to provide additional information
     * about the link. It improves accessibility both for sighted users
     * and users of assistive technologies.
     */
    title?: string;

    /**
     * Target for the link. See
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target
     * for more info.
     */
    target?: string;
}
