const MIN_CONTRAST_RATIO = 3;
const STRIPPED_COLOR_ATTR = 'data-limel-stripped-color';
const RGBA_PATTERN =
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i;
const FALLBACK_BACKGROUND: RGB = { r: 255, g: 255, b: 255 };

interface RGB {
    r: number;
    g: number;
    b: number;
}

interface RGBA extends RGB {
    a: number;
}

/**
 * Walk the rendered DOM under `root` and remove inline `color` declarations
 * that don't meet a 3:1 contrast ratio against their resolved background.
 * Stripped colors are stashed on a data attribute so the same call can be
 * used to re-evaluate after a theme change without re-rendering.
 * @param root - Element whose descendants should be evaluated.
 */
export function adaptColorContrast(root: Element): void {
    if (!root) {
        return;
    }
    restoreStrippedColors(root);
    const elements = root.querySelectorAll<HTMLElement>('[style*="color"]');
    for (const el of elements) {
        evaluateAndMaybeStrip(el);
    }
}

function restoreStrippedColors(root: Element): void {
    const stashed = root.querySelectorAll<HTMLElement>(
        `[${STRIPPED_COLOR_ATTR}]`
    );
    for (const el of stashed) {
        const original = el.getAttribute(STRIPPED_COLOR_ATTR);
        if (original) {
            el.style.color = original;
        }
        el.removeAttribute(STRIPPED_COLOR_ATTR);
    }
}

function evaluateAndMaybeStrip(el: HTMLElement): void {
    const inlineColor = el.style.color;
    if (!inlineColor || isInheritKeyword(inlineColor)) {
        return;
    }

    const fg = parseColor(getComputedStyle(el).color);
    if (!fg || fg.a === 0) {
        return;
    }

    const bg = resolveBackground(el);
    if (!bg) {
        return;
    }

    const composed = compositeOver(fg, bg);
    const ratio = contrastRatio(
        relativeLuminance(composed),
        relativeLuminance(bg)
    );
    if (ratio >= MIN_CONTRAST_RATIO) {
        return;
    }

    el.setAttribute(STRIPPED_COLOR_ATTR, inlineColor);
    el.style.removeProperty('color');
    if (!el.style.cssText) {
        el.removeAttribute('style');
    }
}

function isInheritKeyword(value: string): boolean {
    const v = value.trim().toLowerCase();

    return v === 'inherit' || v === 'currentcolor' || v === 'unset';
}

type BackgroundReading = RGBA | 'image' | 'transparent';

function resolveBackground(start: Element): RGB | null {
    let current: Element | null = start;
    while (current) {
        const reading = readBackgroundAt(current);
        if (reading === 'image') {
            return null;
        }
        if (reading !== 'transparent') {
            return finalizeBackground(reading, nextAncestor(current));
        }
        current = nextAncestor(current);
    }

    return defaultBodyBackground();
}

function readBackgroundAt(el: Element): BackgroundReading {
    const cs = getComputedStyle(el);
    if (cs.backgroundImage && cs.backgroundImage !== 'none') {
        return 'image';
    }
    const parsed = parseColor(cs.backgroundColor);
    if (!parsed || parsed.a === 0) {
        return 'transparent';
    }

    return parsed;
}

function finalizeBackground(reading: RGBA, parent: Element | null): RGB {
    if (reading.a < 1 && parent) {
        const upper = resolveBackground(parent);
        if (upper) {
            return compositeOver(reading, upper);
        }
    }

    return { r: reading.r, g: reading.g, b: reading.b };
}

function defaultBodyBackground(): RGB {
    if (!document.body) {
        return FALLBACK_BACKGROUND;
    }
    const parsed = parseColor(getComputedStyle(document.body).backgroundColor);
    if (parsed && parsed.a > 0) {
        return { r: parsed.r, g: parsed.g, b: parsed.b };
    }

    return FALLBACK_BACKGROUND;
}

function nextAncestor(node: Element | null): Element | null {
    if (!node) {
        return null;
    }
    if (node.parentElement) {
        return node.parentElement;
    }
    const root = node.getRootNode();
    if (root instanceof ShadowRoot) {
        return root.host;
    }

    return null;
}

/**
 * Parse a CSS color string (as returned by `getComputedStyle`) into RGBA.
 * Supports `rgb(...)`, `rgba(...)`, and the keyword `transparent`. Returns
 * `null` for any other format (named colors, hex, hsl, var(), etc).
 * @param value - The color string to parse.
 */
export function parseColor(value: string): RGBA | null {
    if (!value) {
        return null;
    }
    if (value === 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0 };
    }
    const match = RGBA_PATTERN.exec(value);
    if (!match) {
        return null;
    }
    const a = match[4] === undefined ? 1 : Number.parseFloat(match[4]);

    return {
        r: Number.parseInt(match[1], 10),
        g: Number.parseInt(match[2], 10),
        b: Number.parseInt(match[3], 10),
        a,
    };
}

/**
 * Composite a translucent foreground over an opaque background using the
 * standard "source-over" alpha blend. Returns the resulting opaque color.
 * @param fg - Foreground color with alpha in [0..1].
 * @param bg - Opaque background color.
 */
export function compositeOver(fg: RGBA, bg: RGB): RGB {
    const a = fg.a;

    return {
        r: Math.round(fg.r * a + bg.r * (1 - a)),
        g: Math.round(fg.g * a + bg.g * (1 - a)),
        b: Math.round(fg.b * a + bg.b * (1 - a)),
    };
}

/**
 * WCAG 2.x relative luminance for an sRGB color. Returns a value in [0..1].
 * @param rgb - The color whose luminance to compute.
 */
export function relativeLuminance(rgb: RGB): number {
    const channel = (c: number) => {
        const s = c / 255;

        return s <= 0.039_28 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };

    return (
        0.2126 * channel(rgb.r) +
        0.7152 * channel(rgb.g) +
        0.0722 * channel(rgb.b)
    );
}

/**
 * WCAG contrast ratio between two relative luminances. Returns a value in
 * [1..21]. Inputs may be passed in either order.
 * @param l1 - First luminance.
 * @param l2 - Second luminance.
 */
export function contrastRatio(l1: number, l2: number): number {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
}
