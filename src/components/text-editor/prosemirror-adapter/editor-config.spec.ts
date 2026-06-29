import { EditorState, TextSelection } from 'prosemirror-state';
import { Slice } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import {
    builders,
    eq,
    NodeBuilder,
    MarkBuilder,
} from 'prosemirror-test-builder';
import {
    buildEditorSchema,
    buildEditorPlugins,
    EditorPluginsOptions,
} from './editor-config';
import { MenuCommandFactory } from './menu/menu-commands';
import { EditorMenuTypes } from './menu/types';
import { ContentTypeConverter } from '../utils/content-type-converter';
import { pluginKey as imageInserterPluginKey } from './plugins/image/inserter';
import { linkPluginKey } from './plugins/link/link-plugin';

/**
 * Integration proof for the text editor's real stack.
 *
 * It builds the production schema and the production *ordered* plugin list via
 * the exported `buildEditorSchema` / `buildEditorPlugins`, and exercises them
 * with the official `prosemirror-test-builder` only. It imports nothing from
 * any bespoke test-setup helpers — the point is to show the real editor brain
 * is testable as-is.
 *
 * Transactions are applied at the state level (`state.apply`) rather than
 * through an `EditorView`: state application runs every plugin's
 * `filterTransaction`/`appendTransaction` (the cross-plugin integrity path)
 * without needing a real DOM selection, which the spec environment lacks.
 * View-driven behaviour (real key/paste events, scrolling, focus) is the
 * domain of the e2e tests.
 *
 * Coverage maps to the editor's regression risks:
 *  - commands produce the expected transaction (A, B);
 *  - shared-event (paste) handlers and their resolution order are observable (C);
 *  - a sequence of transactions keeps the document valid (D).
 */
describe('editor-config (real-stack integration)', () => {
    const schema = buildEditorSchema({
        customElements: [],
        contentType: 'html',
        language: 'en',
    });
    const factory = new MenuCommandFactory(schema);

    // The trigger plugin takes a content converter but only invokes it on
    // trigger events, which these tests never fire — a no-op keeps the setup
    // hermetic.
    const contentConverter: ContentTypeConverter = {
        parseAsHTML: async () => '',
        serialize: () => '',
    };
    const noopImagePasted = (() =>
        undefined) as unknown as EditorPluginsOptions['onImagePasted'];

    const plugins = buildEditorPlugins({
        schema: schema,
        menuCommandFactory: factory,
        contentConverter: contentConverter,
        language: 'en',
        contentType: 'html',
        triggerCharacters: [],
        onNewLinkSelection: () => undefined,
        onImagePasted: noopImagePasted,
        onActiveItemsChange: () => undefined,
    });

    const builder = builders(schema, { p: { nodeType: 'paragraph' } });
    const doc = builder.doc as NodeBuilder;
    const p = builder.p as NodeBuilder;
    const strong = builder.strong as MarkBuilder;

    describe('A — the real stack instantiates', () => {
        it('builds the production schema (nodes + marks the editor uses)', () => {
            expect(schema.nodes.image).toBeDefined();
            expect(schema.nodes.table).toBeDefined();
            expect(schema.nodes.bullet_list).toBeDefined();
            expect(schema.marks.strikethrough).toBeDefined();
            expect(schema.marks.link).toBeDefined();
        });

        it('assembles the full ordered plugin set', () => {
            expect(Array.isArray(plugins)).toBe(true);
            expect(plugins.length).toBeGreaterThan(8);

            const state = EditorState.create({ doc: doc(p()), plugins });
            expect(state.plugins.length).toBe(plugins.length);
        });
    });

    describe('B — commands work against the real schema', () => {
        it('the Bold command applies the strong mark to the selection', () => {
            const startDoc = doc(p('<a>hello<b>'));
            let state = EditorState.create({
                doc: startDoc,
                plugins: plugins,
                selection: TextSelection.create(
                    startDoc,
                    startDoc.tag.a,
                    startDoc.tag.b
                ),
            });

            const bold = factory.getCommand(EditorMenuTypes.Bold);
            bold(state, (transaction) => {
                state = state.apply(transaction);
            });

            expect(eq(state.doc, doc(p(strong('hello'))))).toBe(true);
        });
    });

    describe('C — shared-event (paste) handler order', () => {
        const linkPlugin = plugins.find(
            (plugin) => plugin.spec.key === linkPluginKey
        );
        const imagePlugin = plugins.find(
            (plugin) => plugin.spec.key === imageInserterPluginKey
        );

        it('both the link and image plugins register handlePaste, link first', () => {
            expect(linkPlugin).toBeDefined();
            expect(imagePlugin).toBeDefined();
            expect(typeof linkPlugin.props.handlePaste).toBe('function');
            expect(typeof imagePlugin.props.handlePaste).toBe('function');

            // ProseMirror resolves handlePaste first-truthy-wins in plugin
            // order, so the relative order of these two decides which claims a
            // paste both could handle. This asserts the current order (link
            // before image); it does not assert that order is the right
            // outcome for a mixed image+link paste — that is a separate design
            // concern.
            expect(plugins.indexOf(linkPlugin)).toBeLessThan(
                plugins.indexOf(imagePlugin)
            );
        });

        it('neither plugin claims a plain paste, so others still run', () => {
            const view = {} as unknown as EditorView;
            const plainPaste = {
                clipboardData: {
                    getData: () => 'plain text without a link',
                    files: [],
                },
            } as unknown as ClipboardEvent;

            expect(
                linkPlugin.props.handlePaste(view, plainPaste, Slice.empty)
            ).toBeFalsy();
            expect(
                imagePlugin.props.handlePaste(view, plainPaste, Slice.empty)
            ).toBeFalsy();
        });
    });

    describe('D — transactions stay consistent across the plugin set', () => {
        it('keeps the document valid across a sequence of transactions', () => {
            const startDoc = doc(p('<a>Hello<b>'));
            let state = EditorState.create({
                doc: startDoc,
                plugins: plugins,
                selection: TextSelection.create(
                    startDoc,
                    startDoc.tag.a,
                    startDoc.tag.b
                ),
            });

            expect(() => {
                const bold = factory.getCommand(EditorMenuTypes.Bold);
                bold(state, (transaction) => {
                    state = state.apply(transaction);
                });

                state = state.apply(
                    state.tr.setSelection(TextSelection.atEnd(state.doc))
                );
                state = state.apply(state.tr.insertText(' world'));

                // Throws if any step produced an invalid document or a
                // mis-mapped position.
                state.doc.check();
            }).not.toThrow();

            expect(state.doc.textContent).toBe('Hello world');
        });
    });
});
