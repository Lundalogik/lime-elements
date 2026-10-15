const CONTROLS = ['button', 'input:not([type="hidden"])', 'select', 'textarea'];

const FOCUSABLE = [
    'a[href]',
    ...CONTROLS.map((selector) => `${selector}:not([disabled])`),
    'summary',
    '[contenteditable]:not([contenteditable="false"])',
    '[tabindex]',
]
    .map((selector) => `${selector}:not([tabindex="-1"])`)
    .join(', ');

const DISABLED = CONTROLS.map(
    (selector) => `${selector}[disabled]:not([tabindex="-1"])`
).join(', ');

interface Search {
    disabled?: HTMLElement;
}

/**
 * Get the element that a screen reader describes for the owner element of a
 * tooltip. That is the owner itself if it can be focused, otherwise the first
 * element that can be focused inside it, also inside shadow roots. A disabled
 * control is only used when there is nothing that can be focused, and if
 * there is no control at all, the owner itself is used.
 *
 * An element that passes the focus on to an element in its shadow root is
 * never used itself, since the screen reader lands on the element inside.
 *
 * @param owner
 */
export async function getFocusTarget(owner: HTMLElement): Promise<HTMLElement> {
    const search: Search = {};

    return (await find(owner, search)) ?? search.disabled ?? owner;
}

async function find(
    element: HTMLElement,
    search: Search
): Promise<HTMLElement | undefined> {
    if (isFocusable(element)) {
        return element;
    }

    rememberDisabled(element, search);

    return findInside(element, search);
}

async function findInside(
    element: HTMLElement,
    search: Search
): Promise<HTMLElement | undefined> {
    if (isStencilComponent(element)) {
        await element.componentOnReady();
    }

    const inShadowRoot = element.shadowRoot
        ? await findAmong(element.shadowRoot.children, search)
        : undefined;

    return inShadowRoot ?? findAmong(element.children, search);
}

async function findAmong(
    elements: HTMLCollection,
    search: Search
): Promise<HTMLElement | undefined> {
    for (const element of elements) {
        if (element.localName === 'limel-tooltip') {
            continue;
        }

        const found = await find(element as HTMLElement, search);
        if (found) {
            return found;
        }
    }

    return undefined;
}

function isFocusable(element: Element): boolean {
    return !element.shadowRoot?.delegatesFocus && element.matches(FOCUSABLE);
}

function rememberDisabled(element: Element, search: Search) {
    if (!search.disabled && element.matches(DISABLED)) {
        search.disabled = element as HTMLElement;
    }
}

function isStencilComponent(
    element: Element
): element is Element & { componentOnReady(): Promise<unknown> } {
    return (
        'componentOnReady' in element &&
        typeof element.componentOnReady === 'function'
    );
}
