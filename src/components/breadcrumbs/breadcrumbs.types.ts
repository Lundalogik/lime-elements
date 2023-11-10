import { Icon } from '../../global/shared-types/icon.types';
import { Link } from '../../global/shared-types/link.types';

/**
 * Breadcrumbs component props.
 * @public
 */
export interface BreadcrumbsItem {
    /**
     * label displayed on the step.
     */
    text: string;

    /**
     * Icon of the step.
     */
    icon?: string | Omit<Icon, 'backgroundColor'>;

    /**
     * If set to `icon-only`, the `text` will be rendered as a tooltip
     * and the item will only display the defined `icon`.
     */
    type?: 'icon-only';

    /**
     * If supplied, the breadcrumbs steps will be a clickable links.
     */
    link?: Omit<Link, 'target' | 'text'>;
}
