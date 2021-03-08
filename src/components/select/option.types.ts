/**
 * Describes an option for limel-select.
 */
export interface Option<T extends string = string> {
    /**
     * The name of the option as shown to the user.
     */
    text: string;

    /**
     * The unique value of the option. Should always be the same for any given
     * option, regardless of localization. The type `T` defaults to `string`,
     * but can be set to any type that extends `string` (using `Option<type>`),
     * for example an enum of specific strings.
     *
     * Note the value of this property *must* be a string!
     * If the value you wish to use is, for example, numeric, convert it to a
     * string before sending it to limel-select. Using numeric values does work
     * in many desktop browsers, but breaks the select completely on some
     * iOS devices.
     */
    value: T;

    /**
     * Set to `true` to make this option disabled and not possible to select.
     */
    disabled?: boolean;

    /**
     * Displays an icon beside the name of the option.
     */
    icon?: string;

    /**
     * Adds a color to the icon.
     */
    iconColor?: string;
}
