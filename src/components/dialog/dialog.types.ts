import { Icon } from '../../interface';
export interface DialogHeading {
    title: string;
    subtitle?: string;
    supportingText?: string;
    icon: string | Icon;
}

export interface ClosingActions {
    escapeKey: boolean;
    scrimClick: boolean;
}
