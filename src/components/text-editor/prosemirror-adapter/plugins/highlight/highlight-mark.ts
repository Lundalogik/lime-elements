import { MarkSpec, DOMOutputSpec } from 'prosemirror-model';
import parseCSSColor from 'parse-css-color';

interface HighlightMarkAttrs {
    color: string;
}

/**
 * The palette's `--color-yellow-light` as a concrete hex value, so that
 * serialized content stays portable outside contexts where the CSS
 * variable is defined.
 */
export const DEFAULT_HIGHLIGHT_COLOR = '#fff176';

const toHexPair = (channel: number): string =>
    channel.toString(16).padStart(2, '0');

/**
 * Normalizes a CSS color to a canonical string, so that colors read back
 * from the DOM (which CSSOM reports as `rgb(…)`) compare equal to the same
 * color written as hex by the color picker.
 *
 * @param value - a CSS color string in any notation
 * @returns lowercase `#rrggbb` (or `rgba(…)`/`hsl(…)` when not expressible
 * as opaque rgb), or `null` when the value is not a visible color
 * (unparseable, `transparent`, or fully transparent alpha)
 */
export const canonicalizeColor = (value: string): string | null => {
    if (!value) {
        return null;
    }

    const parsed = parseCSSColor(value);
    if (!parsed || parsed.alpha === 0) {
        return null;
    }

    const [first, second, third] = parsed.values;
    if (parsed.type === 'rgb') {
        if (parsed.alpha === 1) {
            return `#${toHexPair(first)}${toHexPair(second)}${toHexPair(third)}`;
        }

        return `rgba(${first}, ${second}, ${third}, ${parsed.alpha})`;
    }

    if (parsed.alpha === 1) {
        return `hsl(${first}, ${second}%, ${third}%)`;
    }

    return `hsla(${first}, ${second}%, ${third}%, ${parsed.alpha})`;
};

const getColorFromStyle = (dom: HTMLElement): HighlightMarkAttrs => {
    return {
        color:
            canonicalizeColor(dom.style.backgroundColor) ??
            DEFAULT_HIGHLIGHT_COLOR,
    };
};

/**
 * A `<mark>` without a usable color legitimately means "default highlight",
 * but a span whose background is missing, `transparent`, or unparseable is
 * ordinary text and must not be turned into a highlight.
 *
 * @param dom - the span element being parsed
 * @returns the mark attrs, or `false` to reject the match
 */
const getColorFromSpanStyle = (
    dom: HTMLElement
): HighlightMarkAttrs | false => {
    const color = canonicalizeColor(dom.style.backgroundColor);
    if (color === null) {
        return false;
    }

    return { color: color };
};

export const highlightMarkSpec: MarkSpec = {
    attrs: {
        color: { default: DEFAULT_HIGHLIGHT_COLOR },
    },
    parseDOM: [
        {
            tag: 'mark',
            getAttrs: getColorFromStyle,
        },
        // Word processors emit highlights as background-colored spans;
        // this rule preserves them when such content is pasted.
        {
            tag: 'span[style*="background-color"]',
            getAttrs: getColorFromSpanStyle,
        },
    ],
    toDOM: (mark): DOMOutputSpec => {
        return [
            'mark',
            {
                class: 'lime-text-highlight',
                style: `background-color: ${mark.attrs.color}`,
            },
            0,
        ];
    },
};
