/**
 * Represents a single custom color swatch that can be supplied to the color picker.
 * @public
 */
export interface CustomColorSwatch {
    /**
     * Human readable name used for tooltip / accessibility. If omitted, `value` is shown.
     */
    name?: string;
    /**
     * Any valid CSS color (hex, rgb[a], hsl[a], lab, lch, color-mix(), named, etc.).
     */
    value: string;
    /**
     * Disables the swatch when true.
     */
    disabled?: boolean;
}

/**
 * A custom palette: each entry is either a color string or a structured swatch object.
 * @public
 */
export type CustomPalette = Array<string | CustomColorSwatch>;

/**
 * Controls when manually typed input emits the `change` event.
 * - `'change'`: every change to the typed value emits, as it is typed.
 * - `'enter'`: typed input only updates the displayed value; `change` is
 * emitted when the user presses Enter in the input field.
 *
 * Clicking a swatch always emits `change` immediately, regardless of mode.
 * @public
 */
export type ManualInputCommit = 'change' | 'enter';
