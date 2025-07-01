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

/**
 *
 * @param color
 * @param brightness
 */
export function getColorName(color: string, brightness: string): string {
    return `--color-${color}-${brightness}`;
}

/**
 *
 * @param color
 * @param brightness
 */
export function getCssColor(color: string, brightness: string): string {
    return `rgb(var(${getColorName(color, brightness)}))`;
}
