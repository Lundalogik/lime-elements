import { Color } from './color.types';

/**
 * An empty interface intended for module augmentation by consuming packages.
 *
 * Packages can extend this interface to register their own icon names,
 * enabling type-safe autocompletion for custom icon sets.
 *
 * @example
 * ```ts
 * declare module '@limetech/lime-elements' {
 *     interface IconNameRegistry {
 *         'my-custom-icon': string;
 *         'another-icon': string;
 *     }
 * }
 * ```
 *
 * @public
 */
// biome-ignore lint/suspicious/noEmptyInterface: Intentionally empty for module augmentation
export interface IconNameRegistry {}

/**
 * Represents a valid icon name.
 *
 * When `IconNameRegistry` is augmented, this type provides autocompletion
 * for registered icon names while still accepting any string value.
 *
 * @public
 */
export type IconName = keyof IconNameRegistry extends never
    ? string
    : keyof IconNameRegistry | (string & {});

/**
 * This interface is used to specify which icon to use in many components,
 * along with related properties, like color.
 * @public
 */
export interface Icon {
    /**
     * Name of the icon, refers to the icon's filename in lime-icons8 repository.
     */
    name: IconName;

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
