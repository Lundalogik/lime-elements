import { CustomElementDefinition } from '../../global/shared-types/custom-element.types';
import { MarkdownRepresentable } from '../../global/shared-types/markdown-representable.types';

/**
 * Rewrite markdown so that the whitelisted custom elements in it are
 * replaced by the markdown their rendered instances stand for.
 *
 * Each occurrence in the source is paired with a rendered element by
 * tag name and order. When the two counts differ for a tag — the
 * sanitizer dropped an occurrence, say — every occurrence of that tag
 * is removed instead: a representation attached to the wrong element
 * is worse than a missing one.
 *
 * An element that does not implement `MarkdownRepresentable` contributes
 * its light-DOM text when the source wrote it with a closing tag, and
 * nothing otherwise. Without a closing tag the HTML parser nests what
 * follows inside the element, so that text is still in the source.
 *
 * @param source - the markdown the elements were rendered from
 * @param root - the element the markdown was rendered into
 * @param whitelist - the custom elements that were allowed to render
 * @returns the markdown with the elements replaced
 */
export async function substituteCustomElements(
    source: string,
    root: ParentNode | null | undefined,
    whitelist: CustomElementDefinition[]
): Promise<string> {
    if (!root || whitelist.length === 0) {
        return source;
    }

    const occurrences = findOccurrences(source, whitelist);
    if (occurrences.length === 0) {
        return source;
    }

    const elements = pairElements(occurrences, root);
    const representations = await Promise.all(
        occurrences.map((occurrence, index) =>
            represent(occurrence, elements[index])
        )
    );

    let result = '';
    let cursor = 0;
    for (const [index, occurrence] of occurrences.entries()) {
        result += source.slice(cursor, occurrence.index);
        result += representations[index];
        cursor = occurrence.index + occurrence.length;
    }

    return result + source.slice(cursor);
}

interface Occurrence {
    /** Lower-cased tag name. */
    tag: string;
    index: number;
    length: number;
    /** Written with a closing tag, so the match includes its content. */
    paired: boolean;
    /** Position among the occurrences of the same tag. */
    ordinal: number;
}

function findOccurrences(
    source: string,
    whitelist: CustomElementDefinition[]
): Occurrence[] {
    const seen = new Map<string, number>();
    const occurrences: Occurrence[] = [];

    for (const match of source.matchAll(tagPattern(whitelist))) {
        const tag = (match[1] ?? match[2] ?? match[3]).toLowerCase();
        const ordinal = seen.get(tag) ?? 0;
        seen.set(tag, ordinal + 1);

        occurrences.push({
            tag: tag,
            index: match.index,
            length: match[0].length,
            paired: match[2] !== undefined,
            ordinal: ordinal,
        });
    }

    return occurrences;
}

/**
 * Match one whitelisted element in the three forms it can be written
 * in, tried in order: self-closing as written, an open tag through its
 * closing tag, and an open tag alone. The lookahead after the name
 * keeps `limel-chip` from matching `limel-chip-extra`.
 * @param whitelist
 */
function tagPattern(whitelist: CustomElementDefinition[]): RegExp {
    const names = whitelist
        .map((definition) => escapeRegExp(definition.tagName))
        .join('|');
    const rest = String.raw`(?=[\s/>])[^>]*`;

    return new RegExp(
        `<(${names})${rest}/>` +
            `|<(${names})${rest}>[\\s\\S]*?</\\2\\s*>` +
            `|<(${names})${rest}>`,
        'gi'
    );
}

function escapeRegExp(text: string): string {
    return text.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

/**
 * The rendered element for each occurrence, or `null` for every
 * occurrence of a tag whose rendered count differs from its written one.
 * @param occurrences
 * @param root
 */
function pairElements(
    occurrences: Occurrence[],
    root: ParentNode
): Array<Element | null> {
    const written = new Map<string, number>();
    for (const occurrence of occurrences) {
        written.set(occurrence.tag, (written.get(occurrence.tag) ?? 0) + 1);
    }

    const rendered = new Map<string, Element[] | null>();
    for (const [tag, count] of written) {
        const elements = [...root.querySelectorAll(tag)];
        rendered.set(tag, elements.length === count ? elements : null);
    }

    return occurrences.map(
        (occurrence) =>
            rendered.get(occurrence.tag)?.[occurrence.ordinal] ?? null
    );
}

function represent(
    occurrence: Occurrence,
    element: Element | null
): Promise<string> {
    if (!element) {
        return Promise.resolve('');
    }

    const representable = element as Element & Partial<MarkdownRepresentable>;
    if (typeof representable.toMarkdown === 'function') {
        return representable.toMarkdown();
    }

    return Promise.resolve(
        occurrence.paired ? (element.textContent ?? '') : ''
    );
}
