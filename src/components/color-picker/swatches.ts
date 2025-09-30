export const colors = [
    'red',
    'pink',
    'magenta',
    'purple',
    'violet',
    'indigo',
    'blue',
    'sky',
    'cyan',
    'teal',
    'green',
    'lime',
    'grass',
    'yellow',
    'amber',
    'orange',
    'coral',
    'brown',
    'gray',
    'glaucous',
];

export const brightnesses = ['lighter', 'light', 'default', 'dark', 'darker'];

export interface Swatch {
    name: string;
    value: string;
    disabled?: boolean;
}

/**
 * Returns the CSS variable name holding the RGB triplet for the color & brightness.
 *
 * @param color the base color identifier (e.g. "red", "blue")
 * @param brightness the brightness variant (e.g. "light", "default")
 * @returns CSS variable name in the form --color-{color}-{brightness}
 */
export function getColorName(color: string, brightness: string): string {
    return `--color-${color}-${brightness}`;
}

/**
 * Swatch value: inline CSS color value in the required format: rgb(var(--color-*-*))
 * @param color
 * @param brightness
 */
export function getSwatchValue(color: string, brightness: string): string {
    return `rgb(var(${getColorName(color, brightness)}))`;
}

/**
 * Swatch name: human readable label like "red default"
 * @param color
 * @param brightness
 */
export function getSwatchName(color: string, brightness: string): string {
    return `${color} ${brightness}`;
}

/**
 * Convenience factory returning both name & value.
 * @param color
 * @param brightness
 */
export function createSwatch(color: string, brightness: string): Swatch {
    return {
        name: getSwatchName(color, brightness),
        value: getSwatchValue(color, brightness),
    };
}

/**
 * Returns the CSS color value for the given color and brightness.
 * @param color
 * @param brightness
 */
export function getCssColor(color: string, brightness: string): string {
    return getSwatchValue(color, brightness);
}
