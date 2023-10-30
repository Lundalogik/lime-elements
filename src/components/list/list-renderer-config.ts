import { IconSize } from '../icon/icon.types';
import { ListType } from '../list/list.types';

export interface ListRendererConfig {
    isOpen?: boolean;
    badgeIcons?: boolean;
    type?: ListType;
    iconSize?: IconSize;
}
