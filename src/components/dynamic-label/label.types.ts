import { Icon } from '../../interface';

export type LabelValue = string | number | boolean | null | undefined;

/**
 * Represents a label that can be displayed in the `limel-dynamic-label` component.
 * Each label has a value that is used to match with the current value of the component.
 *
 * @public
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
