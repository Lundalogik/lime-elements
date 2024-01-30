import { Icon } from '../../interface';

export type LabelValue = string | number | boolean | null | undefined;

/**
 * @beta
 */
export interface Label<T = LabelValue> {
    /**
     * The value of the label
     */
    value: T;

    /**
     * Text to display when the label is active
     */
    text?: string;

    /**
     * Icon to display when the label is active
     */
    icon?: string | Icon;
}
