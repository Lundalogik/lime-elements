import { ListSeparator } from '@limetech/lime-elements';

export type OpenDirection = 'left' | 'right';

export interface MenuItem<T = any> {
    /**
     * The additional supporting text is used for shortcut commands and displayed in the menu item.
     */
    commandText?: string;

    /**
     * Text to display in the menu item.
     */
    text: string;

    /**
     * Additional supporting text to display in the menu item.
     */
    secondaryText?: string;

    /**
     * True if the menu item should be disabled.
     */
    disabled?: boolean;

    /**
     * Name of the icon to use.
     */
    icon?: string;

    /**
     * Background color of the icon. Overrides `--icon-background-color`.
     */
    iconColor?: string;

    /**
     * True if the menu item should be selected.
     */
    selected?: boolean;

    /**
     * Value of the menu item.
     */
    value?: T;

    /**
     * List of actions to display as a menu at the end of the item
     */
    actions?: Array<MenuItem | ListSeparator>;
}
