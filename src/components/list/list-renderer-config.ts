import { IconSize, ListType } from '@limetech/lime-elements';

export interface ListRendererConfig {
    isMenu?: boolean;
    isOpen?: boolean;
    badgeIcons?: boolean;
    type?: ListType;
    iconSize?: IconSize;
}
