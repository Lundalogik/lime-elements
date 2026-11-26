/**
 * What kind of name `limel-initials` reads, which decides how it works out
 * the letters to show.
 *
 * - `default`: the first letter of the first, the second and the last word,
 * so `Anna Maria Svensson` becomes `AMS`. This suits most names, whether they
 * belong to a person, a pet, a product or a project.
 * - `company`: the first letter of each of the first two words. Legal forms
 * such as `AB`, `Oy` or `GmbH` are skipped, and a short first word written in
 * capitals, such as `TNK`, is kept whole.
 * - `initials`: the name already is the initials. They are shown in
 * uppercase, without spaces or punctuation, and at most three of them.
 * @public
 */
export type InitialsNameType = 'default' | 'company' | 'initials';

/**
 * A name to show the initials of, and how `limel-initials` should read it.
 * @public
 */
export interface InitialsName {
    /**
     * The name to show the initials of.
     */
    name: string;

    /**
     * How to read `name`. Defaults to `default`.
     */
    nameType?: InitialsNameType;
}
