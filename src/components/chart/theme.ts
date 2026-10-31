/**
 * The colors, sizes and font a chart is drawn with. ECharts cannot read CSS
 * custom properties, so they are resolved from the chart's styles into plain
 * values.
 */
export interface ChartTheme {
    itemColor: string;
    /** The line, and the area under it, of `line` and `area` charts. */
    lineColor: string;
    axisLineColor: string;
    textColor: string;
    backgroundColor: string;
    dividerColor: string;
    surfaceColor: string;
    /** In pixels. */
    itemBorderRadius: number;
    /** In pixels. */
    scatterItemSize: number;
    fontFamily: string;
    npsColors: [string, string, string, string];
    animate: boolean;
}

/**
 * Reads colors and lengths as the chart's own styles resolve them.
 */
export interface ThemeReader {
    /**
     * The color as `rgb()` or `rgba()`, or `undefined` when the value is not
     * a color.
     * @param value - any CSS color, which may use custom properties
     */
    color(value: string): string | undefined;

    theme(): ChartTheme;

    dispose(): void;
}

const PROBE_PROPERTY = '--limel-chart-probe';

const PUBLIC_COLORS = {
    '--limel-chart-item-color': '--chart-item-color',
    '--limel-chart-axis-line-color': '--chart-axis-line-color',
    '--limel-chart-background-color': '--chart-background-color',
    '--limel-chart-item-divider-color': '--chart-item-divider-color',
};

/**
 * Creates a reader that resolves values in the given shadow root, where the
 * chart's private custom properties are defined.
 * @param root - the chart's shadow root
 */
export function createThemeReader(root: ShadowRoot): ThemeReader {
    const probe = document.createElement('span');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.pointerEvents = 'none';
    root.append(probe);

    let canvasContext: CanvasRenderingContext2D | null | undefined;
    const toRgba = (color: string): string => {
        if (color.startsWith('rgb')) {
            return color;
        }

        canvasContext ??= document
            .createElement('canvas')
            .getContext('2d', { willReadFrequently: true });

        return canvasContext ? paintToRgba(canvasContext, color) : color;
    };

    const resolveColor = (value: string): string | undefined => {
        probe.style.color = '';
        probe.style.color = value;
        if (!probe.style.color) {
            return undefined;
        }

        return toRgba(getComputedStyle(probe).color);
    };

    // A value with `var()` is accepted by any property, and only turns out
    // not to be a color once its variables are filled in, when `color` falls
    // back to the color of the chart. A custom property keeps the filled-in
    // value, so it can be checked. See
    // https://www.w3.org/TR/css-variables-1/#invalid-at-computed-value-time
    const fillIn = (value: string): string => {
        probe.style.setProperty(PROBE_PROPERTY, value);
        const filledIn =
            getComputedStyle(probe).getPropertyValue(PROBE_PROPERTY);
        probe.style.removeProperty(PROBE_PROPERTY);

        return filledIn.trim();
    };

    const isColor = (value: string) => CSS.supports('color', fillIn(value));

    const warned = new Set<string>();
    const resolvePublicColor = (property: keyof typeof PUBLIC_COLORS) => {
        const value = fillIn(`var(${property})`);
        const warning = `${property}:${value}`;
        if (value && !CSS.supports('color', value) && !warned.has(warning)) {
            warned.add(warning);
            console.warn(
                `limel-chart: \`${PUBLIC_COLORS[property]}\` must be a CSS color, but was \`${value}\`. Using the color of the text instead.`
            );
        }

        return resolveColor(`var(${property})`);
    };

    const resolveLength = (value: string): number => {
        probe.style.width = value;
        const pixels = Number.parseFloat(getComputedStyle(probe).width);
        probe.style.width = '';

        return Number.isFinite(pixels) ? pixels : 0;
    };

    return {
        color: (value) => (isColor(value) ? resolveColor(value) : undefined),
        theme: () => ({
            itemColor: resolvePublicColor('--limel-chart-item-color'),
            lineColor: resolveColor('var(--limel-chart-line-color)'),
            axisLineColor: resolvePublicColor('--limel-chart-axis-line-color'),
            textColor: resolveColor('var(--limel-chart-text-color)'),
            backgroundColor: resolvePublicColor(
                '--limel-chart-background-color'
            ),
            dividerColor: resolvePublicColor(
                '--limel-chart-item-divider-color'
            ),
            surfaceColor: resolveColor('var(--limel-chart-surface-color)'),
            itemBorderRadius: resolveLength(
                'var(--limel-chart-item-border-radius)'
            ),
            scatterItemSize: resolveLength(
                'var(--limel-chart-scatter-item-size)'
            ),
            fontFamily: getComputedStyle(root.host).fontFamily,
            npsColors: [
                resolveColor('var(--limel-chart-nps-detractors-color)'),
                resolveColor('var(--limel-chart-nps-passives-color)'),
                resolveColor('var(--limel-chart-nps-good-color)'),
                resolveColor('var(--limel-chart-nps-excellent-color)'),
            ],
            animate: !matchMedia('(prefers-reduced-motion: reduce)').matches,
        }),
        dispose: () => probe.remove(),
    };
}

/**
 * Calls back when the theme of the page may have changed: when the color
 * scheme or the reduced motion preference of the system changes, or the
 * `data-theme` attribute of the page does.
 * @param onChange - called on every change
 * @returns a function that stops watching
 */
export function watchTheme(onChange: () => void): () => void {
    const queries = [
        matchMedia('(prefers-color-scheme: dark)'),
        matchMedia('(prefers-reduced-motion: reduce)'),
    ];
    for (const query of queries) {
        query.addEventListener('change', onChange);
    }

    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
    });

    return () => {
        for (const query of queries) {
            query.removeEventListener('change', onChange);
        }

        observer.disconnect();
    };
}

// Browsers report colors outside sRGB, and those from `color-mix()`, in
// notations such as `color(srgb …)` or `oklch(…)` that ECharts cannot parse.
// Painting a pixel converts any color to sRGB.
function paintToRgba(context: CanvasRenderingContext2D, color: string): string {
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
    const MAX_CHANNEL = 255;

    return `rgba(${red}, ${green}, ${blue}, ${alpha / MAX_CHANNEL})`;
}
