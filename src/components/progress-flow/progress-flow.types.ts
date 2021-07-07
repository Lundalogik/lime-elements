import { ListItem } from '@limetech/lime-elements';

export interface FlowItem extends ListItem {
    isOffProgress?: boolean;
    activeColor?: string;
    passedColor?: string;
    iconColor?: string;
}
