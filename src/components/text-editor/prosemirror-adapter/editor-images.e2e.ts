import { EditorView } from 'prosemirror-view';
import {
    createEditorTestHarness,
    createEditorTestState,
    mountView,
} from './editor-test-harness';
import { imageCache } from './plugins/image/node';

const harness = createEditorTestHarness();
const b = harness.builders as Record<string, any>;
const doc = b.doc;
const p = b.p;

function mountWithImage(state: string) {
    const start = doc(
        p(
            b.image({
                src: 'data:image/png;base64,AAAA',
                alt: 'photo.png',
                fileInfoId: `id-${state}`,
                state: state,
            })
        )
    );

    return mountView(createEditorTestState(harness, start));
}

beforeEach(() => {
    imageCache.clear();
});

describe('image node view', () => {
    let view: EditorView;
    let cleanup: (() => void) | undefined;

    afterEach(() => {
        cleanup?.();
        cleanup = undefined;
    });

    it('renders a success image with resize handles', () => {
        ({ view, cleanup } = mountWithImage('success'));
        const wrapper = view.dom.querySelector('.image-wrapper');

        expect(wrapper.classList.contains('state-success')).toBe(true);
        expect(wrapper.getAttribute('aria-busy')).toBe('false');
        expect(wrapper.querySelector('img')).not.toBeNull();

        const handles = wrapper.querySelectorAll('.resize-handle');
        expect(handles).toHaveLength(2);
        for (const handle of handles) {
            expect(handle.getAttribute('role')).toBe('slider');
            expect(handle.getAttribute('aria-valuemin')).toBe('10');
            expect(handle.getAttribute('aria-valuenow')).not.toBeNull();
            expect(handle.getAttribute('tabindex')).toBe('0');
        }
    });

    it('renders a loading image with a progress indicator', () => {
        ({ view, cleanup } = mountWithImage('loading'));
        const wrapper = view.dom.querySelector('.image-wrapper');

        expect(wrapper.classList.contains('state-loading')).toBe(true);
        expect(wrapper.getAttribute('aria-busy')).toBe('true');
        expect(wrapper.getAttribute('aria-live')).toBe('polite');
        expect(wrapper.querySelector('limel-linear-progress')).not.toBeNull();
        expect(wrapper.querySelectorAll('.resize-handle')).toHaveLength(0);
    });

    it('renders a failed image with an assertive live region', () => {
        ({ view, cleanup } = mountWithImage('failed'));
        const wrapper = view.dom.querySelector('.image-wrapper');

        expect(wrapper.classList.contains('state-failed')).toBe(true);
        expect(wrapper.getAttribute('aria-live')).toBe('assertive');
        expect(wrapper.getAttribute('aria-busy')).toBe('false');
        expect(wrapper.querySelectorAll('.resize-handle')).toHaveLength(0);
    });

    it('transitions its rendered state when the node state changes', () => {
        ({ view, cleanup } = mountWithImage('loading'));

        let imagePos: number;
        view.state.doc.descendants((node, pos) => {
            if (node.type.name === 'image') {
                imagePos = pos;
            }
        });
        const image = view.state.doc.nodeAt(imagePos);
        view.dispatch(
            view.state.tr.setNodeMarkup(imagePos, undefined, {
                ...image.attrs,
                state: 'success',
            })
        );

        const wrapper = view.dom.querySelector('.image-wrapper');
        expect(wrapper.classList.contains('state-success')).toBe(true);
        expect(wrapper.querySelector('limel-linear-progress')).toBeNull();
        expect(wrapper.querySelectorAll('.resize-handle')).toHaveLength(2);
    });
});
