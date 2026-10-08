import { DOMSerializer } from 'prosemirror-model';
import { HTMLConverter } from '../utils/html-converter';
import { createReplaceRegionTransaction } from './plugins/regions/commands';
import {
    createEditorTestHarness,
    createEditorTestState,
    mountView,
    parseHTML,
} from './test/editor-test-harness';

describe('editor regions (real stack)', () => {
    const regions = [
        { name: 'signature', label: 'Signature' },
        { name: 'quote' },
    ];
    const html = createEditorTestHarness({
        contentType: 'html',
        regions: regions,
    });
    const markdown = createEditorTestHarness({
        contentType: 'markdown',
        regions: regions,
    });

    const signature = '<div data-lime-region="signature"><p>Regards</p></div>';

    it('parses a declared region into a region node carrying its name', () => {
        const doc = parseHTML(html.schema, signature);

        expect(doc.firstChild.type.name).toBe('region');
        expect(doc.firstChild.attrs.name).toBe('signature');
    });

    it('ignores a region whose name was not declared', () => {
        const doc = parseHTML(
            html.schema,
            '<div data-lime-region="disclaimer"><p>Regards</p></div>'
        );

        expect(doc.firstChild.type.name).toBe('paragraph');
    });

    it('serializes a region node back to a marked div', () => {
        const doc = parseHTML(html.schema, signature);
        const dom = DOMSerializer.fromSchema(html.schema).serializeNode(
            doc.firstChild
        ) as HTMLElement;

        expect(dom.outerHTML).toBe(signature);
    });

    it('does not recognise regions in markdown mode', () => {
        const doc = parseHTML(markdown.schema, signature);

        expect(markdown.schema.nodes.region).toBeUndefined();
        expect(doc.firstChild.type.name).toBe('paragraph');
    });

    it('keeps the region marker through sanitization', async () => {
        const converter = new HTMLConverter([]);

        const sanitized = await converter.parseAsHTML(signature);
        const doc = parseHTML(html.schema, sanitized);

        expect(doc.firstChild.type.name).toBe('region');
        expect(doc.firstChild.attrs.name).toBe('signature');
    });

    it('serializes the marker back out while the node view is mounted', () => {
        const source = `<p>Hi</p>${signature}`;
        const doc = parseHTML(html.schema, source);
        const { view, cleanup } = mountView(createEditorTestState(html, doc));

        const serialized = new HTMLConverter([]).serialize(view);

        expect(serialized).toBe(source);

        cleanup();
    });

    it('draws the declared label without putting it in the content', () => {
        const doc = parseHTML(html.schema, `<p>Hi</p>${signature}`);
        const { view, cleanup } = mountView(createEditorTestState(html, doc));

        const label = view.dom.querySelector('.region__label');

        expect(label?.textContent).toBe('Signature');
        expect(view.state.doc.child(1).textContent).toBe('Regards');

        cleanup();
    });

    it('draws no label for a region declared without one', () => {
        const doc = parseHTML(
            html.schema,
            '<div data-lime-region="quote"><p>On Monday</p></div>'
        );
        const { view, cleanup } = mountView(createEditorTestState(html, doc));

        expect(view.dom.querySelector('.region__label')).toBeNull();

        cleanup();
    });

    it('keeps region content editable', () => {
        const doc = parseHTML(html.schema, `<p>Hi</p>${signature}`);
        const state = createEditorTestState(html, doc);

        // Just inside the region's paragraph, after "Reg"
        const next = state.apply(state.tr.insertText('ards and reg', 9));

        expect(next.doc.child(1).textContent).toBe('Regards and regards');
    });

    it('replaces a named region and leaves the rest alone', () => {
        const doc = parseHTML(html.schema, `<p>Hi</p>${signature}`);
        const state = createEditorTestState(html, doc);

        const next = state.apply(
            createReplaceRegionTransaction(state, 'signature', '<p>New</p>')
        );

        expect(next.doc.childCount).toBe(2);
        expect(next.doc.child(0).textContent).toBe('Hi');
        expect(next.doc.child(1).attrs.name).toBe('signature');
        expect(next.doc.child(1).textContent).toBe('New');
    });

    it('leaves other regions untouched when replacing one', () => {
        const doc = parseHTML(
            html.schema,
            `${signature}<div data-lime-region="quote"><p>On Monday</p></div>`
        );
        const state = createEditorTestState(html, doc);

        const next = state.apply(
            createReplaceRegionTransaction(state, 'signature', '<p>New</p>')
        );

        expect(next.doc.child(0).textContent).toBe('New');
        expect(next.doc.child(1).attrs.name).toBe('quote');
        expect(next.doc.child(1).textContent).toBe('On Monday');
    });

    it('appends the region when the document has none', () => {
        const doc = parseHTML(html.schema, '<p>Hi</p>');
        const state = createEditorTestState(html, doc);

        const next = state.apply(
            createReplaceRegionTransaction(state, 'signature', '<p>New</p>')
        );

        expect(next.doc.childCount).toBe(2);
        expect(next.doc.child(1).attrs.name).toBe('signature');
        expect(next.doc.child(1).textContent).toBe('New');
    });
});
