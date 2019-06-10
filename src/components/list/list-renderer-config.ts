import { IconSize } from '../icon/icon.types';
import { ListType } from './list.types';

export interface ListRendererConfig {
    isMenu?: boolean;
    isOpen?: boolean;
    badgeIcons?: boolean;
    type?: ListType;
    iconSize?: IconSize;
}
