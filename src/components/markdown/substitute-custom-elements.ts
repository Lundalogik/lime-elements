import { SourceElement } from './collect-elements-plugin';

/**
 * Rewrite markdown so that the custom elements in it are replaced by
 * the markdown they stand for.
 *
 * The elements are spliced in written order, whatever order they were
 * recorded in: a footnote definition is written wherever the author
 * put it and rendered at the end. An element written inside another
 * one is left to its parent, whose representation covers its content.
 *
 * @param source - the markdown the elements were recorded from
 * @param elements - where the parser found the elements in the source
 * @param represent - the markdown one element stands for
 * @returns the markdown with the elements replaced
 */
export async function substituteCustomElements(
    source: string,
    elements: SourceElement[],
    represent: (element: SourceElement) => Promise<string>
): Promise<string> {
    const outermost = outermostInWrittenOrder(elements);
    if (outermost.length === 0) {
        return source;
    }

    const markdown = await Promise.all(outermost.map(represent));

    let result = '';
    let cursor = 0;
    for (const [index, element] of outermost.entries()) {
        result += source.slice(cursor, element.start);
        result += markdown[index];
        cursor = element.end;
    }

    return result + source.slice(cursor);
}

function outermostInWrittenOrder(elements: SourceElement[]): SourceElement[] {
    const outermost: SourceElement[] = [];
    let end = 0;
    for (const element of [...elements].sort((a, b) => a.start - b.start)) {
        if (element.start < end) {
            continue;
        }

        outermost.push(element);
        end = element.end;
    }

    return outermost;
}
