import { ListItem } from '@limetech/lime-elements';

export interface FlowItem extends ListItem {
    isEndPhase?: boolean;
    activeColor?: string;
    passedColor?: string;
}
