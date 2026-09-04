/**
 * @public
 */
export interface Button {
    /**
     * ID of the button. Must be unique.
     */
    id: string;

    /**
     * Text or label title in the button.
     */
    title: string;

    /**
     * Name of the icon to use
     */
    icon?: string;

    /**
     * True if the button should be selected. only first button will be selected.
     */
    selected?: boolean;

    /**
     * The label displayed in the badge
     */
    badge?: number | string;

    /**
     * True if the button should be disabled.
     *
     * Disabling every button in the group is not the same as disabling the
     * group itself; set `disabled` on `limel-button-group` for that.
     *
     * Combining this with `selected` is not supported. Once the user picks
     * another button, the disabled one can never be selected again.
     */
    disabled?: boolean;
}
