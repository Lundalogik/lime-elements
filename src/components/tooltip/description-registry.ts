interface Entry {
    original: string | null;
    texts: Map<object, string>;
}

const entries = new WeakMap<Element, Entry>();

/**
 * Set the `aria-description` of an element on behalf of an owner. The
 * description that the element had before is kept, for when the last owner
 * stops describing it.
 *
 * @param element
 * @param owner
 * @param text
 */
export function setDescription(element: Element, owner: object, text: string) {
    let entry = entries.get(element);
    if (!entry) {
        entry = {
            original: element.getAttribute('aria-description'),
            texts: new Map(),
        };
        entries.set(element, entry);
    }

    entry.texts.delete(owner);
    entry.texts.set(owner, text);
    element.setAttribute('aria-description', text);
}

/**
 * Stop describing an element on behalf of an owner. The text of the owner
 * that described it most recently stays, and when none is left, the
 * description that the element had before is put back. Nothing is changed
 * if the attribute has been changed by someone else.
 *
 * @param element
 * @param owner
 */
export function clearDescription(element: Element, owner: object) {
    const entry = entries.get(element);
    const text = entry?.texts.get(owner);
    if (!entry || text === undefined) {
        return;
    }

    entry.texts.delete(owner);
    const isCurrent = element.getAttribute('aria-description') === text;
    const remaining = [...entry.texts.values()].at(-1);
    if (remaining !== undefined) {
        if (isCurrent) {
            element.setAttribute('aria-description', remaining);
        }

        return;
    }

    entries.delete(element);
    if (!isCurrent) {
        return;
    }

    if (entry.original === null) {
        element.removeAttribute('aria-description');

        return;
    }

    element.setAttribute('aria-description', entry.original);
}
