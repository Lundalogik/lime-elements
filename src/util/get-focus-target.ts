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

type StencilComponent = HTMLElement & { componentOnReady(): Promise<unknown> };

type Walk = Generator<StencilComponent, HTMLElement | undefined>;

interface Search {
    disabled?: HTMLElement;
}

/**
 * Get the element that gets the focus when a user moves to `owner`. That is
 * the owner itself if it can be focused, otherwise the first element that can
 * be focused inside it, also inside shadow roots. A disabled control is only
 * used when there is nothing that can be focused, and if there is no control
 * at all, the owner itself is used.
 *
 * An element that passes the focus on to an element in its shadow root is
 * never used itself, since the focus lands on the element inside.
 *
 * Waits for the components in the way to render, so use this for an owner
 * that may not have rendered yet.
 *
 * @see findFocusTarget for an owner that has already rendered
 * @param owner
 */
export async function getFocusTarget(owner: HTMLElement): Promise<HTMLElement> {
    return runWalk(findTarget(owner));
}

async function runWalk(
    walk: Walk,
    step = walk.next()
): Promise<HTMLElement | undefined> {
    if (step.done) {
        return step.value as HTMLElement | undefined;
    }

    await (step.value as StencilComponent).componentOnReady();

    const found = await runWalk(walk, walk.next());

    return found;
}

/**
 * Same as `getFocusTarget`, for an owner that has already rendered, without
 * waiting for any component.
 *
 * @see getFocusTarget for an owner that may not have rendered yet
 * @param owner
 */
export function findFocusTarget(owner: HTMLElement): HTMLElement {
    const walk = findTarget(owner);

    for (let step = walk.next(); ; step = walk.next()) {
        if (step.done) {
            return step.value;
        }
    }
}

function* findTarget(owner: HTMLElement): Walk {
    const search: Search = {};
    const found = yield* find(owner, search);

    return found ?? search.disabled ?? owner;
}

function* find(element: HTMLElement, search: Search): Walk {
    if (isFocusable(element)) {
        return element;
    }

    rememberDisabled(element, search);

    return yield* findInside(element, search);
}

function* findInside(element: HTMLElement, search: Search): Walk {
    if (isStencilComponent(element)) {
        yield element;
    }

    const inShadowRoot = element.shadowRoot
        ? yield* findAmong(element.shadowRoot.children, search)
        : undefined;

    return inShadowRoot ?? (yield* findAmong(element.children, search));
}

function* findAmong(elements: HTMLCollection, search: Search): Walk {
    for (const element of elements) {
        if (element.localName === 'limel-tooltip') {
            continue;
        }

        const found = yield* find(element as HTMLElement, search);
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

function isStencilComponent(element: Element): element is StencilComponent {
    return (
        'componentOnReady' in element &&
        typeof element.componentOnReady === 'function'
    );
}
