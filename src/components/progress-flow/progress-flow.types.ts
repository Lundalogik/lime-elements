import { ListItem } from '../list/list-item.types';

export interface FlowItem extends ListItem {
    /**
     * Determines whether a step should be a part of the flow,
     * or should be an independent step visually located on the side.
     */
    isOffProgress?: boolean;

    /**
     * Background color of selected step.
     */
    selectedColor?: string;

    /**
     * Background color of the step, when it is passed.
     */
    passedColor?: string;

    /**
     * Fill color of the icon on the step,
     * when it is neither selected nor passed.
     */
    iconColor?: string;
}
