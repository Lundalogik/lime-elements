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
