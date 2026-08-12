import { EditorView } from 'prosemirror-view';
import {
    createEditorTestHarness,
    createEditorTestState,
    mountView,
    textSelection,
} from './test/editor-test-harness';
import { EditorLink } from '../text-editor.types';

const HREF_A = 'https://a.example/';
const HREF_B = 'https://b.example/';

function mouseInit(
    view: EditorView,
    pos: number,
    extra: MouseEventInit = {}
): MouseEventInit {
    const coords = view.coordsAtPos(pos);

    return {
        clientX: coords.left,
        clientY: coords.top,
        bubbles: true,
        cancelable: true,
        button: 0,
        ...extra,
    };
}

describe('link plugin on a mounted view', () => {
    let view: EditorView;
    let cleanup: (() => void) | undefined;

    afterEach(() => {
        cleanup?.();
        cleanup = undefined;
        vi.restoreAllMocks();
    });

    it('invokes the selection callback on every dispatched transaction', () => {
        const callback = vi.fn();
        const harness = createEditorTestHarness({
            onNewLinkSelection: callback,
        });
        const b = harness.builders as Record<string, any>;
        const start = b.doc(b.p('hello'));
        ({ view, cleanup } = mountView(
            createEditorTestState(harness, start, textSelection(start, 1))
        ));

        const before = callback.mock.calls.length;
        view.dispatch(
            view.state.tr.setSelection(textSelection(view.state.doc, 2) as any)
        );
        const afterFirst = callback.mock.calls.length;
        expect(afterFirst).toBeGreaterThan(before);

        view.dispatch(
            view.state.tr.setSelection(textSelection(view.state.doc, 2) as any)
        );
        expect(callback.mock.calls.length).toBeGreaterThan(afterFirst);
    });

    it('expands a double-click to the full same-href range and opens the link menu', () => {
        const harness = createEditorTestHarness();
        const b = harness.builders as Record<string, any>;
        const start = b.doc(
            b.p(
                'aa ',
                b.link({ href: HREF_A }, 'bbcc'),
                b.link({ href: HREF_B }, 'dd')
            )
        );
        ({ view, cleanup } = mountView(createEditorTestState(harness, start)));

        const events: EditorLink[] = [];
        view.dom.addEventListener('open-editor-link-menu', (event: Event) => {
            events.push((event as CustomEvent<EditorLink>).detail);
        });

        view.dom.dispatchEvent(new MouseEvent('dblclick', mouseInit(view, 5)));

        expect(events).toEqual([{ href: HREF_A, text: 'bbcc' }]);
        expect(view.state.selection.from).toBe(4);
        expect(view.state.selection.to).toBe(8);
    });

    it('ignores a right-button double-click', () => {
        const harness = createEditorTestHarness();
        const b = harness.builders as Record<string, any>;
        const start = b.doc(b.p(b.link({ href: HREF_A }, 'ab')));
        ({ view, cleanup } = mountView(createEditorTestState(harness, start)));

        const events: Event[] = [];
        view.dom.addEventListener('open-editor-link-menu', (event) => {
            events.push(event);
        });

        view.dom.dispatchEvent(
            new MouseEvent('dblclick', mouseInit(view, 2, { button: 2 }))
        );

        expect(events).toEqual([]);
    });

    it('suppresses navigation for clicks on anchors', () => {
        const harness = createEditorTestHarness();
        const b = harness.builders as Record<string, any>;
        const start = b.doc(b.p(b.link({ href: HREF_A }, 'ab')));
        ({ view, cleanup } = mountView(createEditorTestState(harness, start)));

        const anchor = view.dom.querySelector('a');
        const documentClicks = vi.fn();
        document.body.addEventListener('click', documentClicks);

        try {
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                button: 0,
            });
            const notCancelled = anchor.dispatchEvent(event);

            expect(notCancelled).toBe(false);
            expect(documentClicks).not.toHaveBeenCalled();
        } finally {
            document.body.removeEventListener('click', documentClicks);
        }
    });

    it('opens a link in a new window on mod-click', () => {
        const harness = createEditorTestHarness();
        const b = harness.builders as Record<string, any>;
        const start = b.doc(b.p(b.link({ href: HREF_A }, 'ab')));
        ({ view, cleanup } = mountView(createEditorTestState(harness, start)));

        const open = vi.spyOn(window, 'open').mockImplementation(() => null);

        view.dom.dispatchEvent(
            new MouseEvent('mousedown', mouseInit(view, 2, { ctrlKey: true }))
        );

        expect(open).toHaveBeenCalledWith(
            HREF_A,
            '_blank',
            'noopener,noreferrer'
        );
    });
});
