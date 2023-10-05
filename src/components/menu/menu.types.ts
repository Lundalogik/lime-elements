import { ListSeparator } from '../../interface';

export type OpenDirection =
    | 'left-start'
    | 'left'
    | 'left-end'
    | 'right-start'
    | 'right'
    | 'right-end'
    | 'top-start'
    | 'top'
    | 'top-end'
    | 'bottom-start'
    | 'bottom'
    | 'bottom-end';

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
     * If specified, will display a notification badge on the buttons in the dock.
     */
    badge?: number | string;

    /**
     * Value of the menu item.
     */
    value?: T;

    /**
     * What sub items the item contains
     * Don't set if using lazy loading.
     */
    items?: Array<MenuItem<T> | ListSeparator> | SubItemsLoader;

    /**
     * What parent the item has.
     * It's used to render the breadcrumbs history
     * Mostl y handled by the menu itself
     */
    parentItem?: MenuItem<T>;
}

export type MenuSearcher = (query: string) => Promise<MenuItem[]>;

export type SubItemsLoader = (
    item: MenuItem
) => Promise<Array<MenuItem | ListSeparator>>;
