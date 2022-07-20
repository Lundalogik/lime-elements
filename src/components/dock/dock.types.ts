/**
 * @private
 */
export interface DockItem<T = any> {
    /**
     * Text to display for the item.
     * To allow having custom components as Dock items,
     * labels are optional. However,
     * they must be provided for normal Dock items,
     * as it will affect the accessibility
     * for visually impared users.
     */
    label?: string;

    /**
     * xxxx
     */
    helperLabel?: string;

    /**
     * True if the list item should be selected.
     */
    selected?: boolean;

    /**
     * Text color of selected Dock item.
     */
    selectedTextColor?: string;

    /**
     * Background color of selected Dock item.
     */
    selectedBackgroundColor?: string;

    /**
     * Value of the Dock item.
     */
    value?: T;

    /**
     * Name of the icon to use.
     * To allow having custom components as Dock items,
     * icons are optional. However,
     * they must be provided for normal Dock items.
     */
    icon?: string;

    /**
     * Fill color of the icon on the button,
     * when Dock item not selected.
     */
    iconColor?: string;

    /**
     * Should be used only on one item.
     * It will act as a separator,
     * pushing the item and its preceding items to the bottom
     * of the Dock (not in mobile layout).
     */
    isFooterStart?: boolean;

    /**
     * By default, all items in the Dock are rendered as buttons.
     * When user clicks on them, they will run an specified action.
     * However, for some use cases you can open a more complex
     * component such as a list of items in a popover, when the
     * dock item is clicked. To do so, specify:
     * ````tsx
     * component: { name: 'your-component-tag' }
     * ````
     *
     * However, if your specify `props` for your `component`, then
     * the entire Dock item will be replaced with your component.
     * This is why `label` and `icon` or not kept mandatory!
     */
    component?: {
        name: string;
        props?: T;
    };
}
