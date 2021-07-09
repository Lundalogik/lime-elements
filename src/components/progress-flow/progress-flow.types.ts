import { ListItem } from '@limetech/lime-elements';

export interface FlowItem extends ListItem {
    /**
     * determines whether a step should be a part of the flow,
     * or should be an independent step visually located on the side.
     */
    isOffProgress?: boolean;

    /**
     * Background color of active step.
     */
    activeColor?: string;

    /**
     * Background color of the step, when it is passed or done.
     */
    passedColor?: string;

    /**
     * Fill color of the icon on the step, when it is inactive.
     */
    iconColor?: string;
}
