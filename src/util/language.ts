/**
 * Reduce a language to the primary subtag that our language maps are keyed by.
 *
 * A `language` prop is typed, but a custom element takes whatever string an
 * attribute carries — commonly a full BCP 47 tag such as `nb-NO`, since a host
 * application often derives the language from `document.documentElement.lang`.
 * Anything that is not a string must resolve rather than throw, so that an
 * unexpected value can never break a component's render.
 *
 * Examples:
 *  - "nb" => "nb"
 *  - "nb-NO" => "nb"
 *  - "SV-SE" => "sv"
 *  - undefined => ""
 *
 * @param language - the language to reduce
 * @returns the lower-cased primary subtag, or an empty string
 */
export function getPrimarySubtag(language: unknown): string {
    if (typeof language !== 'string') {
        return '';
    }

    return language.toLowerCase().split('-', 1)[0];
}

/**
 * The locale that `Intl` writes numbers and dates in for `language`, or
 * `undefined` when it cannot write in that language. `Intl` throws on a
 * tag it cannot read, such as `sv_SE`, and quietly uses the viewer's own
 * locale for one it does not know, such as `zz`. A component that writes in
 * its `language` while it renders checks it here, and falls back to English
 * when this gives `undefined`.
 *
 * Examples:
 *  - "sv" => "sv"
 *  - "SV-se" => "sv-SE"
 *  - "sv_SE" => undefined
 *  - "zz" => undefined
 *  - undefined => undefined
 *
 * @param language - the language to write in
 * @returns the locale, or `undefined`
 */
export function getSupportedLocale(language: unknown): string | undefined {
    if (typeof language !== 'string') {
        return;
    }

    try {
        return Intl.NumberFormat.supportedLocalesOf(language)[0];
    } catch {
        return;
    }
}
