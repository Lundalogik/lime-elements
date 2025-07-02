import { Color } from './color.types';

/**
 * This interface is used to specify which icon to use in many components,
 * along with related properties, like color.
 * @public
 */
export interface Icon {
    /**
     * Name of the icon, refers to the icon's filename in lime-icons8 repository.
     */
    name: string;

    /**
     * Color of the icon.
     */
    color?: Color;

    /**
     * Background color of the icon.
     */
    backgroundColor?: Color;

    /**
     * Used primarily to improve accessibility for users who
     * take advantage of assistive technologies; but also
     * to clarify further what an icon tries to resemble
     * for sighted users.
     *
     * Depending on the component which is using the `Icon` interface,
     * the `title` might be used as a `title` attribute on the
     * rendered icon element, as an `aria-label` attribute, or as a
     * `label` in a tooltip associated with the icon. Documentations
     * about the accessibility of the component should provide more
     * information about how the `title` is used.
     */
    title?: string;
}
