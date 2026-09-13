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

    return language.toLowerCase().split('-')[0];
}
