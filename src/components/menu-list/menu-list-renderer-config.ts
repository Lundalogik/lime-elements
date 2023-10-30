import { IconSize } from '../icon/icon.types';
import { MenuListType } from './menu-list.types';

export interface MenuListRendererConfig {
    isOpen?: boolean;
    badgeIcons?: boolean;
    type?: MenuListType;
    iconSize?: IconSize;
}
