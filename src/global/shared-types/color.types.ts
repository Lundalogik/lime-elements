/**
 * Defined colors and any color that can be used.
 *
 * Will auto-complete to any defined color from Lime Elements, while still
 * allowing any valid CSS color value to be used.
 *
 * @public
 */
export type Color =
    | `rgb(var(${_Internal.HueColor | _Internal.BlackColor | _Internal.WhiteColor | _Internal.ContrastColor | _Internal.BrandColor}))`
    | (string & {});

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace _Internal {
    /**
     * @internal
     */
    export type Hue =
        | 'red'
        | 'pink'
        | 'magenta'
        | 'purple'
        | 'violet'
        | 'indigo'
        | 'blue'
        | 'cyan'
        | 'teal'
        | 'green'
        | 'lime'
        | 'yellow'
        | 'amber'
        | 'orange'
        | 'coral'
        | 'brown'
        | 'grey'
        | 'glaucous';

    /**
     * @internal
     */
    export type Brightness =
        | 'lighter'
        | 'light'
        | 'default'
        | 'dark'
        | 'darker';

    /**
     * @internal
     */
    export type HueColor = `--color-${Hue}-${Brightness}`;

    /**
     * @internal
     */
    export type BlackColor = '--color-black';

    /**
     * @internal
     */
    export type WhiteColor = '--color-white';

    /**
     * @internal
     */
    export type ContrastValue =
        | 100
        | 200
        | 300
        | 400
        | 500
        | 600
        | 700
        | 800
        | 900
        | 1000
        | 1100
        | 1200
        | 1300
        | 1400
        | 1500
        | 1600
        | 1700;

    /**
     * @internal
     */
    export type ContrastColor = `--contrast-${ContrastValue}`;

    /**
     * @internal
     */
    export type BrandHue =
        | 'lime-green'
        | 'ocean-teal'
        | 'aqua'
        | 'bubblegum'
        | 'sunny-orange'
        | 'cool-grey';

    /**
     * @internal
     */
    export type BrandColor = `--lime-brand-color-${BrandHue}`;
}
