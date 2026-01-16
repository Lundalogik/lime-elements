import { Icon, IconName } from '../../global/shared-types/icon.types';

/**
 * @public
 */
export interface DialogHeading {
    title: string;
    subtitle?: string;
    supportingText?: string;
    icon?: IconName | Icon;
}

/**
 * @public
 */
export interface ClosingActions {
    escapeKey: boolean;
    scrimClick: boolean;
}
