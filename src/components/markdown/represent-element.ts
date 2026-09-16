import { CustomElementDefinition } from '../../global/shared-types/custom-element.types';
import { MarkdownRepresentable } from '../../global/shared-types/markdown-representable.types';
import { SourceElement } from './collect-elements-plugin';
import { hydrateCustomElements } from './hydrate-custom-elements';

/**
 * The markdown one recorded element stands for, asked of a fresh copy
 * of it.
 *
 * The copy is made from the HTML the render serialized for the element,
 * so it carries the same attributes and content as the one on screen,
 * hydrated the same way, and it is attached under `host` so it finds
 * the platform the way the rendered one did. Only a whitelisted tag is
 * ever created: the record comes from the parser's whitelisted
 * elements, and the whitelist is checked again here before anything is
 * instantiated.
 *
 * A copy without `toMarkdown` contributes its text: its content when
 * the element was written with a closing tag, and nothing otherwise.
 *
 * @param element - the element as the parser recorded it
 * @param host - where the copy lives while it is asked
 * @param whitelist - the elements that may be created
 * @returns the markdown
 */
export async function representElement(
    element: SourceElement,
    host: ParentNode,
    whitelist: CustomElementDefinition[]
): Promise<string> {
    const allowed = whitelist.some(
        (definition) => definition.tagName.toLowerCase() === element.tagName
    );
    if (!allowed) {
        return '';
    }

    const container = document.createElement('div');
    container.hidden = true;
    container.innerHTML = element.html;
    const copy = container.firstElementChild as
        | (Element & Partial<MarkdownRepresentable>)
        | null;
    if (!copy) {
        return '';
    }

    hydrateCustomElements(container, whitelist);
    host.append(container);
    try {
        if (typeof copy.toMarkdown === 'function') {
            return await copy.toMarkdown();
        }

        return element.closed ? (copy.textContent ?? '') : '';
    } finally {
        container.remove();
    }
}
