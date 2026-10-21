import { flushSync } from 'react-dom';
import { toSchemaPath } from './templates/object-field';
import { getFocusTarget } from '../../util/get-focus-target';

const HIGHLIGHT_CLASS = 'limel-form-field--highlighted';
const STABLE_FRAMES = 3;
const MAX_SETTLE_MS = 2000;
const MAX_RENDER_FRAMES = 30;

/**
 * Open what is closed above a field, scroll it into view, focus it and
 * highlight it.
 *
 * @param root - the element the form is rendered in
 * @param path - the path of the field in the value of the form
 */
export async function showField(
    root: HTMLElement,
    path: Array<string | number>
): Promise<void> {
    if (!(await waitUntilRendered(root, path))) {
        return;
    }

    let target: HTMLElement | undefined;

    for (let depth = 1; depth <= path.length; depth++) {
        const element = findByPath(root, path.slice(0, depth));
        if (!element) {
            break;
        }

        target = element;
        openSectionsAround(root, element);
    }

    if (!target) {
        return;
    }

    // The components inside the field have to be drawn, and the sections
    // around it opened, before the field is where it will stay.
    const focusTarget = await getFocusTarget(target);
    await waitForLayoutToSettle(target);

    target.scrollIntoView({
        block: 'center',
        behavior: prefersReducedMotion() ? 'instant' : 'smooth',
    });
    focusTarget?.focus({ preventScroll: true });

    await waitForLayoutToSettle(target);
    highlight(target);
}

function findByPath(
    root: HTMLElement,
    path: Array<string | number>
): HTMLElement | null {
    const schemaPath = toSchemaPath(path.map(String));

    return root.querySelector<HTMLElement>(
        `[data-schema-path="${CSS.escape(schemaPath)}"]`
    );
}

// The form is drawn a moment after its value or schema is set, so give it a few
// frames to show the start of the path.
async function waitUntilRendered(
    root: HTMLElement,
    path: Array<string | number>
): Promise<boolean> {
    for (let frame = 0; frame < MAX_RENDER_FRAMES; frame++) {
        if (findByPath(root, path.slice(0, 1))) {
            return true;
        }

        await nextFrame();
    }

    return false;
}

function openSectionsAround(root: HTMLElement, element: HTMLElement) {
    for (
        let node: HTMLElement | null = element;
        node && node !== root;
        node = node.parentElement
    ) {
        if (isClosedSection(node)) {
            open(node);
        }
    }
}

function isClosedSection(
    element: HTMLElement
): element is HTMLLimelCollapsibleSectionElement {
    return (
        element.tagName === 'LIMEL-COLLAPSIBLE-SECTION' &&
        !(element as HTMLLimelCollapsibleSectionElement).isOpen
    );
}

// A collapsed list item renders its fields only once its section says it has
// been opened, and they have to be in place before the next step is looked up.
function open(section: HTMLLimelCollapsibleSectionElement) {
    section.isOpen = true;
    flushSync(() => {
        section.dispatchEvent(new CustomEvent('open'));
    });
}

// Wait until the field has a size and has stayed in place for a few frames, so
// it is not scrolled to while the form still grows, nor flashed while scrolling.
async function waitForLayoutToSettle(element: HTMLElement) {
    let previous = '';
    let stableFrames = 0;
    const deadline = performance.now() + MAX_SETTLE_MS;
    while (performance.now() < deadline) {
        await nextFrame();
        const { top, height } = element.getBoundingClientRect();
        const current = `${top}:${height}`;
        const isStill = height > 0 && current === previous;
        stableFrames = isStill ? stableFrames + 1 : 0;
        if (stableFrames === STABLE_FRAMES) {
            return;
        }

        previous = current;
    }
}

function highlight(element: HTMLElement) {
    // Removed for a frame first, so showing the same field again restarts it.
    element.classList.remove(HIGHLIGHT_CLASS);
    const removeHighlight = (event: AnimationEvent) => {
        // Animations of what the field holds end here too.
        if (event.animationName !== 'highlight-field-shadow') {
            return;
        }

        element.classList.remove(HIGHLIGHT_CLASS);
        element.removeEventListener('animationend', removeHighlight);
    };
    requestAnimationFrame(() => {
        element.classList.add(HIGHLIGHT_CLASS);
        element.addEventListener('animationend', removeHighlight);
    });
}

function prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function nextFrame(): Promise<void> {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}
