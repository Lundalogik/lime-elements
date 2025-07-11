import { Color } from '../../global/shared-types/color.types';
import { ListItem } from '../list/list-item.types';

/**
 * A step in a progress flow.
 * @public
 */
export interface FlowItem extends ListItem {
    /**
     * Determines whether a step should be a part of the flow,
     * or should be an independent step visually located on the side.
     */
    isOffProgress?: boolean;

    /**
     * Background color of selected step.
     */
    selectedColor?: Color;

    /**
     * Background color of the step, when it is passed.
     */
    passedColor?: Color;

    /**
     * Fill color of the icon on the step,
     * when it is neither selected nor passed.
     *
     * @deprecated This property is deprecated and will be removed soon!
     *
     * Use the new `Icon` interface instead and write:
     * ```
     * icon {
     *    name: string,
     *    color: string,
     * },
     * ```
     */
    iconColor?: Color;
}
