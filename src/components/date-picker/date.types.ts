/**
 * @public
 */
export type DateType =
    | 'datetime'
    | 'date'
    | 'time'
    | 'week'
    | 'month'
    | 'quarter'
    | 'year';

/**
 * The languages the components can be translated into.
 *
 * At runtime a full BCP 47 tag, such as `nb-NO`, also resolves: it is matched
 * on its primary subtag. Cast to this type when passing one on.
 *
 * @public
 */
export type Languages =
    | 'da'
    | 'de'
    | 'en'
    | 'fi'
    | 'fr'
    | 'nb'
    | 'no'
    | 'nl'
    | 'sv';
