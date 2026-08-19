import { EditorView } from 'prosemirror-view';
import {
    createEditorTestHarness,
    createEditorTestState,
    mountView,
    textSelection,
} from './test/editor-test-harness';
import './test/editor-doc-matcher';
import { EditorMenuTypes, editorMenuTypesArray } from './menu/types';

describe('menu state tracking on a mounted view', () => {
    let cleanup: (() => void) | undefined;

    function setUp(startDoc, selection?) {
        const onChange = vi.fn();
        const harness = createEditorTestHarness({
            onActiveItemsChange: onChange,
        });
        const b = harness.builders as Record<string, any>;
        const start = startDoc(b);
        const mounted = mountView(
            createEditorTestState(harness, start, selection?.(start))
        );
        cleanup = mounted.cleanup;

        return {
            view: mounted.view,
            onChange: onChange,
            b: b,
            harness: harness,
        };
    }

    afterEach(() => {
        cleanup?.();
        cleanup = undefined;
    });

    it('reports every menu type on the first state change', () => {
        const { view, onChange } = setUp(
            (builders) => builders.doc(builders.p(builders.strong('ab'))),
            (start) => textSelection(start, 1, 3)
        );

        view.dispatch(view.state.tr);
        expect(onChange).toHaveBeenCalled();

        const [active, allowed] = onChange.mock.calls.at(-1);
        expect(Object.keys(active).sort()).toEqual(
            [...editorMenuTypesArray].sort()
        );
        expect(active[EditorMenuTypes.Bold]).toBe(true);
        for (const type of editorMenuTypesArray) {
            expect(allowed[type]).toBe(true);
        }
    });

    it('suppresses the callback when the state is unchanged', () => {
        const { view, onChange } = setUp(
            (builders) => builders.doc(builders.p('hello')),
            (start) => textSelection(start, 2)
        );

        view.dispatch(view.state.tr);
        const calls = onChange.mock.calls.length;

        view.dispatch(view.state.tr);
        view.dispatch(view.state.tr);

        expect(onChange.mock.calls).toHaveLength(calls);
    });

    it('fires again when the selection moves between formatting contexts', () => {
        const { view, onChange } = setUp(
            (builders) => builders.doc(builders.p(builders.strong('ab'), 'cd')),
            (start) => textSelection(start, 2)
        );

        view.dispatch(view.state.tr);
        const [activeInBold] = onChange.mock.calls.at(-1);
        expect(activeInBold[EditorMenuTypes.Bold]).toBe(true);

        view.dispatch(
            view.state.tr.setSelection(textSelection(view.state.doc, 4) as any)
        );
        const [activeInPlain] = onChange.mock.calls.at(-1);
        expect(activeInPlain[EditorMenuTypes.Bold]).toBe(false);
    });

    it('matches heading levels exactly', () => {
        const { view, onChange } = setUp(
            (builders) => builders.doc(builders.heading({ level: 2 }, 'title')),
            (start) => textSelection(start, 2)
        );

        view.dispatch(view.state.tr);
        const [active] = onChange.mock.calls.at(-1);
        expect(active[EditorMenuTypes.HeaderLevel2]).toBe(true);
        expect(active[EditorMenuTypes.HeaderLevel1]).toBe(false);
    });
});

describe('action bar interaction on a mounted view', () => {
    let view: EditorView;
    let cleanup: (() => void) | undefined;

    afterEach(() => {
        cleanup?.();
        cleanup = undefined;
        vi.restoreAllMocks();
    });

    it('executes the command for a toolbar item click and refocuses the editor', () => {
        const harness = createEditorTestHarness();
        const b = harness.builders as Record<string, any>;
        const start = b.doc(b.p('hello'));
        ({ view, cleanup } = mountView(
            createEditorTestState(harness, start, textSelection(start, 1, 6))
        ));

        view.dom.dispatchEvent(
            new CustomEvent('actionBarItemClick', {
                detail: { value: EditorMenuTypes.Bold },
            })
        );

        expect(view.state.doc).toEqualDoc(b.doc(b.p(b.strong('hello'))));
        expect(document.activeElement).toBe(view.dom);
    });

    it('logs instead of throwing for an unknown toolbar value', () => {
        const harness = createEditorTestHarness();
        const b = harness.builders as Record<string, any>;
        const start = b.doc(b.p('hello'));
        ({ view, cleanup } = mountView(createEditorTestState(harness, start)));
        const errors = vi
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);

        view.dom.dispatchEvent(
            new CustomEvent('actionBarItemClick', {
                detail: { value: 'nonsense' },
            })
        );

        expect(errors).toHaveBeenCalled();
        expect(view.state.doc).toEqualDoc(start);
    });

    it('inserts a link at the cursor when the link menu is saved', () => {
        const harness = createEditorTestHarness();
        const b = harness.builders as Record<string, any>;
        const start = b.doc(b.p());
        ({ view, cleanup } = mountView(
            createEditorTestState(harness, start, textSelection(start, 1))
        ));

        view.dom.dispatchEvent(
            new CustomEvent('saveLinkMenu', {
                detail: {
                    type: EditorMenuTypes.Link,
                    link: { href: 'https://x.example/', text: 'x' },
                },
            })
        );

        expect(view.state.doc.textContent).toBe('x');
        const textNode = view.state.doc.firstChild.firstChild;
        expect(textNode.marks[0].type.name).toBe('link');
    });

    it('replaces the selection when the link menu is saved over a range', () => {
        const harness = createEditorTestHarness();
        const b = harness.builders as Record<string, any>;
        const start = b.doc(b.p('hello'));
        ({ view, cleanup } = mountView(
            createEditorTestState(harness, start, textSelection(start, 1, 6))
        ));

        view.dom.dispatchEvent(
            new CustomEvent('saveLinkMenu', {
                detail: {
                    type: EditorMenuTypes.Link,
                    link: { href: 'https://x.example/', text: '' },
                },
            })
        );

        expect(view.state.doc.textContent).toBe('hello');
        const textNode = view.state.doc.firstChild.firstChild;
        expect(textNode.marks[0].type.name).toBe('link');
    });

    it('ignores a link menu save with a non-link type', () => {
        const harness = createEditorTestHarness();
        const b = harness.builders as Record<string, any>;
        const start = b.doc(b.p('hello'));
        ({ view, cleanup } = mountView(createEditorTestState(harness, start)));

        view.dom.dispatchEvent(
            new CustomEvent('saveLinkMenu', {
                detail: {
                    type: EditorMenuTypes.Bold,
                    link: { href: 'https://x.example/', text: 'x' },
                },
            })
        );

        expect(view.state.doc).toEqualDoc(start);
    });

    it('dispatches a transaction even when the command declines', () => {
        const harness = createEditorTestHarness();
        const b = harness.builders as Record<string, any>;
        const start = b.doc(b.p('aa'), b.p('bb'));
        ({ view, cleanup } = mountView(
            createEditorTestState(harness, start, textSelection(start, 2, 6))
        ));

        let dispatches = 0;
        view.setProps({
            dispatchTransaction: (tr) => {
                dispatches++;
                view.updateState(view.state.apply(tr));
            },
        });

        view.dom.dispatchEvent(
            new CustomEvent('actionBarItemClick', {
                detail: { value: EditorMenuTypes.HeaderLevel1 },
            })
        );

        expect(dispatches).toBeGreaterThan(0);
        expect(view.state.doc).toEqualDoc(start);
    });
});
