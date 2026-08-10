import {
    DOMParser,
    DOMSerializer,
    Fragment,
    Node,
    Slice,
} from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
    createEditorTestHarness,
    createEditorTestState,
    textSelection,
} from './editor-test-harness';
import {
    imageInserterFactory,
    pluginKey as imageInserterPluginKey,
} from './plugins/image/inserter';
import { imageCache } from './plugins/image/node';
import { FileInfo } from '../../../global/shared-types/file.types';

const harness = createEditorTestHarness();
const b = harness.builders as Record<string, any>;
const doc = b.doc;
const p = b.p;

const imagePlugin = harness.plugins.find(
    (plugin) => plugin.spec.key === imageInserterPluginKey
);
if (!imagePlugin) {
    throw new Error(
        'image inserter plugin is missing from the production plugin list'
    );
}

const fileInfo: FileInfo = {
    id: 'file-id-1',
    filename: 'photo.png',
} as FileInfo;

class StubFileReader {
    public result: string | null = null;
    public onloadend: (() => void) | null = null;

    public readAsDataURL(): void {
        this.result = 'data:image/png;base64,AAAA';
        queueMicrotask(() => this.onloadend?.());
    }
}

function createFakeView(initial: EditorState): {
    view: EditorView;
    current: () => EditorState;
    dom: HTMLElement;
} {
    let state = initial;
    const dom = document.createElement('div');
    const view = {
        get state() {
            return state;
        },
        dispatch: (tr) => {
            state = state.apply(tr);
        },
        dom: dom,
    } as unknown as EditorView;

    return { view: view, current: () => state, dom: dom };
}

function createPasteEvent(files: File[], html: string = ''): ClipboardEvent {
    return {
        clipboardData: {
            files: files,
            getData: (type: string) => (type === 'text/html' ? html : ''),
        },
        preventDefault: () => undefined,
    } as unknown as ClipboardEvent;
}

function findImage(node: Node): { node: Node; pos: number } | undefined {
    let found: { node: Node; pos: number } | undefined;
    node.descendants((child, pos) => {
        if (child.type.name === 'image') {
            found = { node: child, pos: pos };
        }
    });

    return found;
}

function parseHTML(html: string): Node {
    const container = document.createElement('div');
    container.innerHTML = html;

    return DOMParser.fromSchema(harness.schema).parse(container);
}

beforeEach(() => {
    imageCache.clear();
    vi.stubGlobal('FileReader', StubFileReader);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('image node spec', () => {
    it('parses dimensions from inline style and forces success state', () => {
        const parsed = parseHTML(
            '<p><img src="s" alt="a" style="width: 10px; height: 20px"></p>'
        );
        const image = findImage(parsed).node;

        expect(image.attrs.src).toBe('s');
        expect(image.attrs.alt).toBe('a');
        expect(image.attrs.width).toBe('10px');
        expect(image.attrs.height).toBe('20px');
        expect(image.attrs.state).toBe('success');
        expect(image.attrs.maxWidth).toBe('100%');
        expect(image.attrs.fileInfoId).not.toBe('');
    });

    it('defaults a missing alt to "file"', () => {
        const parsed = parseHTML('<p><img src="s"></p>');

        expect(findImage(parsed).node.attrs.alt).toBe('file');
    });

    it('mints a fresh fileInfoId on every parse', () => {
        const first = findImage(parseHTML('<p><img src="s"></p>')).node;
        const second = findImage(parseHTML('<p><img src="s"></p>')).node;

        expect(first.attrs.fileInfoId).not.toBe(second.attrs.fileInfoId);
    });

    it('serializes a success image to a cached, reused element', () => {
        const image = harness.schema.nodes.image.create({
            src: 's',
            alt: 'first',
            fileInfoId: 'cache-key',
            state: 'success',
        });
        const serializer = DOMSerializer.fromSchema(harness.schema);
        const first = serializer.serializeNode(image) as HTMLElement;

        expect(first.tagName.toLowerCase()).toBe('img');
        expect(imageCache.get('cache-key')).toBe(first);

        const updated = harness.schema.nodes.image.create({
            src: 's',
            alt: 'second',
            fileInfoId: 'cache-key',
            state: 'success',
        });
        const second = serializer.serializeNode(updated) as HTMLImageElement;

        expect(second).toBe(first);
        expect(second.alt).toBe('second');
    });

    it.each(['loading', 'failed'])(
        'serializes a %s image to a status span naming the file',
        (state) => {
            const image = harness.schema.nodes.image.create({
                src: 's',
                alt: 'photo.png',
                fileInfoId: 'x',
                state: state,
            });
            const dom = DOMSerializer.fromSchema(harness.schema).serializeNode(
                image
            ) as HTMLElement;

            expect(dom.tagName.toLowerCase()).toBe('span');
            expect(dom.textContent).toContain('photo.png');
        }
    );

    it('returns undefined from toDOM for an unrecognized state', () => {
        const image = harness.schema.nodes.image.create({
            src: 's',
            fileInfoId: 'x',
            state: 'bogus' as never,
        });

        expect((image.type.spec.toDOM as any)(image)).toBeUndefined();
    });
});

describe('image paste detection', () => {
    it('claims a paste carrying an image file and emits imagePasted', async () => {
        const start = doc(p());
        const holder = createFakeView(
            createEditorTestState(harness, start, textSelection(start, 1))
        );
        const received = [];
        holder.dom.addEventListener('imagePasted', (event: Event) => {
            received.push((event as CustomEvent).detail);
        });

        const file = new File([''], 'photo.png', { type: 'image/png' });
        const handled = (imagePlugin.props.handlePaste as any)(
            holder.view,
            createPasteEvent([file]),
            Slice.empty
        );

        expect(handled).toBe(true);
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(received).toHaveLength(1);
        expect(received[0].fileInfo.filename).toBe('photo.png');
        expect(typeof received[0].insertThumbnail).toBe('function');
        expect(typeof received[0].insertImage).toBe('function');
        expect(typeof received[0].insertFailedThumbnail).toBe('function');
    });

    it('treats an image accompanied by table html as a table paste', () => {
        const start = doc(p());
        const holder = createFakeView(
            createEditorTestState(harness, start, textSelection(start, 1))
        );
        const file = new File([''], 'photo.png', { type: 'image/png' });
        const handled = (imagePlugin.props.handlePaste as any)(
            holder.view,
            createPasteEvent([file], '<table><tr><td>x</td></tr></table>'),
            Slice.empty
        );

        expect(handled).toBe(false);
    });

    it('treats an image accompanied by Excel html as a table paste', () => {
        const start = doc(p());
        const holder = createFakeView(
            createEditorTestState(harness, start, textSelection(start, 1))
        );
        const file = new File([''], 'photo.png', { type: 'image/png' });
        const handled = (imagePlugin.props.handlePaste as any)(
            holder.view,
            createPasteEvent(
                [file],
                '<meta name=generator content="microsoft excel">'
            ),
            Slice.empty
        );

        expect(handled).toBe(false);
    });

    it('declines a non-image file', () => {
        const start = doc(p());
        const holder = createFakeView(
            createEditorTestState(harness, start, textSelection(start, 1))
        );
        const file = new File([''], 'doc.pdf', { type: 'application/pdf' });
        const handled = (imagePlugin.props.handlePaste as any)(
            holder.view,
            createPasteEvent([file]),
            Slice.empty
        );

        expect(handled).toBe(false);
    });

    it('drops any pasted block that contains an html image', () => {
        const start = doc(p());
        const holder = createFakeView(
            createEditorTestState(harness, start, textSelection(start, 1))
        );
        const image = harness.schema.nodes.image.create({
            src: 's',
            fileInfoId: 'x',
        });
        const pastedContent = Fragment.from([
            p('keep'),
            harness.schema.nodes.paragraph.create(
                null,
                Fragment.from([harness.schema.text('x '), image])
            ),
        ]);
        const handled = (imagePlugin.props.handlePaste as any)(
            holder.view,
            createPasteEvent([]),
            new Slice(pastedContent, 0, 0)
        );

        expect(handled).toBe(true);
        const next = holder.current().doc;
        expect(next.textContent).toBe('keep');
        expect(findImage(next)).toBeUndefined();
    });

    it('registers no drop handler anywhere in the plugin stack', () => {
        expect(
            harness.plugins.every((plugin) => !plugin.props.handleDrop)
        ).toBe(true);
    });
});

describe('ImageInserter methods', () => {
    function setUp() {
        const start = doc(p());
        const holder = createFakeView(
            createEditorTestState(harness, start, textSelection(start, 1))
        );
        const inserter = imageInserterFactory(
            holder.view,
            'data:image/png;base64,AAAA',
            fileInfo
        );

        return { holder: holder, inserter: inserter };
    }

    it('insertThumbnail places a loading image with the base64 source', () => {
        const { holder, inserter } = setUp();
        inserter.insertThumbnail();

        const image = findImage(holder.current().doc).node;
        expect(image.attrs.state).toBe('loading');
        expect(image.attrs.src).toBe('data:image/png;base64,AAAA');
        expect(image.attrs.fileInfoId).toBe('file-id-1');
        expect(image.attrs.alt).toBe('photo.png');
    });

    it('insertImage replaces the thumbnail with a success image at the given source', () => {
        const { holder, inserter } = setUp();
        inserter.insertThumbnail();
        inserter.insertImage('https://cdn.example/photo.png');

        const image = findImage(holder.current().doc).node;
        expect(image.attrs.state).toBe('success');
        expect(image.attrs.src).toBe('https://cdn.example/photo.png');
    });

    it('insertImage keeps the base64 source when called without one', () => {
        const { holder, inserter } = setUp();
        inserter.insertThumbnail();
        inserter.insertImage();

        const image = findImage(holder.current().doc).node;
        expect(image.attrs.state).toBe('success');
        expect(image.attrs.src).toBe('data:image/png;base64,AAAA');
    });

    it('insertFailedThumbnail marks the image failed and keeps its source', () => {
        const { holder, inserter } = setUp();
        inserter.insertThumbnail();
        inserter.insertFailedThumbnail();

        const image = findImage(holder.current().doc).node;
        expect(image.attrs.state).toBe('failed');
        expect(image.attrs.src).toBe('data:image/png;base64,AAAA');
    });

    it('insertImage leaves the document unchanged when the thumbnail is gone', () => {
        const { holder, inserter } = setUp();
        inserter.insertThumbnail();

        const cleared = holder
            .current()
            .tr.delete(0, holder.current().doc.content.size);
        holder.view.dispatch(cleared);
        const before = holder.current().doc;

        inserter.insertImage('https://cdn.example/photo.png');

        expect(holder.current().doc.eq(before)).toBe(true);
    });

    it('insertImage resets dimension attributes to their defaults', () => {
        const { holder, inserter } = setUp();
        inserter.insertThumbnail();

        const { pos } = findImage(holder.current().doc);
        const withDims = holder.current().tr.setNodeMarkup(pos, undefined, {
            ...findImage(holder.current().doc).node.attrs,
            width: '120px',
        });
        holder.view.dispatch(withDims);

        inserter.insertImage('https://cdn.example/photo.png');

        expect(findImage(holder.current().doc).node.attrs.width).toBe('');
    });
});
