import { Icon } from '../../interface';

/**
 * @public
 */
export interface DialogHeading {
    title: string;
    subtitle?: string;
    supportingText?: string;
    icon: string | Icon;
}

/**
 * @public
 */
export interface ClosingActions {
    escapeKey: boolean;
    scrimClick: boolean;
}
