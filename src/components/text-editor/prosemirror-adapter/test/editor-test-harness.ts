import { DOMParser, Mark, Node, Schema } from 'prosemirror-model';
import {
    Command,
    EditorState,
    Plugin,
    PluginKey,
    Selection,
    TextSelection,
    Transaction,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { builders } from 'prosemirror-test-builder';
import {
    buildEditorSchema,
    buildEditorPlugins,
    EditorPluginsOptions,
    EditorSchemaOptions,
} from '../editor-config';
import { MenuCommandFactory } from '../menu/menu-commands';
import { ContentTypeConverter } from '../../utils/content-type-converter';

type EditorTestHarnessOverrides = Partial<
    Pick<EditorSchemaOptions, 'customElements' | 'contentType'> &
        Pick<
            EditorPluginsOptions,
            | 'triggerCharacters'
            | 'contentConverter'
            | 'onNewLinkSelection'
            | 'onImagePasted'
            | 'onActiveItemsChange'
        >
>;

/**
 * The real editor schema, plugin list, command factory and node builders,
 * assembled from the same `editor-config` functions the production
 * `limel-prosemirror-adapter` uses.
 */
export interface EditorTestHarness {
    schema: ReturnType<typeof buildEditorSchema>;
    plugins: Plugin[];
    factory: MenuCommandFactory;
    builders: ReturnType<typeof builders>;
}

const noopConverter: ContentTypeConverter = {
    parseAsHTML: async () => '',
    serialize: () => '',
};

/**
 * Builds the real schema, plugin list, command factory, and node builders
 * for a test, using sensible no-op defaults for any callback or converter
 * a test does not care about.
 *
 * @param overrides - schema and plugin options to set explicitly
 * @returns the assembled editor test harness
 */
export function createEditorTestHarness(
    overrides: EditorTestHarnessOverrides = {}
): EditorTestHarness {
    const schema = buildEditorSchema({
        customElements: overrides.customElements ?? [],
        contentType: overrides.contentType ?? 'html',
        language: 'en',
    });
    const factory = new MenuCommandFactory(schema);
    const plugins = buildEditorPlugins({
        schema: schema,
        menuCommandFactory: factory,
        contentConverter: overrides.contentConverter ?? noopConverter,
        language: 'en',
        contentType: overrides.contentType ?? 'html',
        triggerCharacters: overrides.triggerCharacters ?? [],
        onNewLinkSelection: overrides.onNewLinkSelection ?? (() => undefined),
        onImagePasted:
            overrides.onImagePasted ?? (() => new CustomEvent('imagePasted')),
        onActiveItemsChange: overrides.onActiveItemsChange ?? (() => undefined),
    });
    const b = builders(schema, { p: { nodeType: 'paragraph' } });

    return { schema: schema, plugins: plugins, factory: factory, builders: b };
}

/**
 * Finds the plugin registered under the given key in a harness's plugin
 * list. Throws when the plugin is missing, so a lookup failure surfaces
 * inside the test that needs the plugin rather than as a module load error.
 *
 * @param harness - the harness whose plugin list is searched
 * @param key - the plugin key to look for
 * @returns the matching plugin
 */
export function findPluginByKey(
    harness: EditorTestHarness,
    key: PluginKey
): Plugin {
    const plugin = harness.plugins.find(
        (candidate) => candidate.spec.key === key
    );
    if (!plugin) {
        throw new Error(
            'the requested plugin is missing from the production plugin list'
        );
    }

    return plugin;
}

/**
 * Creates an `EditorState` from a harness's schema and plugins.
 *
 * @param harness - the editor test harness the state is built from
 * @param doc - the initial document; defaults to an empty document
 * @param selection - the initial selection; defaults to the document start
 * @returns the created editor state
 */
export function createEditorTestState(
    harness: EditorTestHarness,
    doc?: Node,
    selection?: Selection
): EditorState {
    return EditorState.create({
        schema: harness.schema,
        doc: doc,
        selection: selection,
        plugins: harness.plugins,
    });
}

/**
 * Mounts a real `EditorView` on a detached host element appended to the
 * document body, so view-driven behaviour (DOM event props, selection)
 * can be exercised.
 *
 * @param state - the editor state to mount
 * @returns the mounted view and a `cleanup` function that destroys the
 * view and removes the host element
 */
export function mountView(state: EditorState): {
    view: EditorView;
    cleanup: () => void;
} {
    const host = document.createElement('div');
    document.body.append(host);
    const view = new EditorView(host, { state: state });

    return {
        view: view,
        cleanup: () => {
            view.destroy();
            host.remove();
        },
    };
}

/**
 * Types text into a view one character at a time, the way a real
 * keystroke would arrive: each character is first offered to
 * `handleTextInput`, and only inserted directly when no plugin handles it.
 *
 * @param view - the view to type into
 * @param text - the text to type
 */
export function typeText(view: EditorView, text: string): void {
    for (const char of text) {
        const { from, to } = view.state.selection;
        const handled = view.someProp('handleTextInput', (handler) =>
            handler(view, from, to, char, () =>
                view.state.tr.insertText(char, from, to)
            )
        );
        if (!handled) {
            view.dispatch(view.state.tr.insertText(char, from, to));
        }
    }
}

/**
 * Simulates a keydown on a view by offering a plain-object `KeyboardEvent`
 * to `handleKeyDown`.
 *
 * @param view - the view the key is pressed on
 * @param init - the key and modifier state to simulate
 * @param init.key - the `KeyboardEvent.key` value
 * @param init.keyCode - the `KeyboardEvent.keyCode` value
 * @param init.mod - whether the platform command modifier is held: Meta on
 * macOS, Ctrl elsewhere, mirroring how `Mod-` bindings resolve
 * @param init.ctrlKey - whether Ctrl is held; defaults to `false`
 * @param init.metaKey - whether Meta/Cmd is held; defaults to `false`
 * @param init.shiftKey - whether Shift is held; defaults to `false`
 * @param init.altKey - whether Alt is held; defaults to `false`
 * @returns whether a plugin's `handleKeyDown` claimed the event
 */
export function pressKey(
    view: EditorView,
    init: {
        key: string;
        keyCode: number;
        mod?: boolean;
        ctrlKey?: boolean;
        metaKey?: boolean;
        shiftKey?: boolean;
        altKey?: boolean;
    }
): boolean {
    const isMac =
        typeof navigator !== 'undefined' &&
        /Mac|iP(hone|[oa]d)/.test(navigator.platform);
    const event = {
        key: init.key,
        keyCode: init.keyCode,
        ctrlKey: (init.ctrlKey ?? false) || (!!init.mod && !isMac),
        metaKey: (init.metaKey ?? false) || (!!init.mod && isMac),
        shiftKey: init.shiftKey ?? false,
        altKey: init.altKey ?? false,
        preventDefault: () => undefined,
        stopPropagation: () => undefined,
    } as unknown as KeyboardEvent;

    return !!view.someProp('handleKeyDown', (handler) => handler(view, event));
}

/**
 * Runs a command against a state, applying every dispatched transaction to
 * the accumulated result.
 *
 * @param state - the state the command runs against
 * @param command - the command to run
 * @returns the resulting state and whether the command handled the call
 */
export function runCommand(
    state: EditorState,
    command: Command
): { state: EditorState; handled: boolean } {
    let next = state;
    const handled = command(state, (tr) => {
        next = next.apply(tr);
    });

    return { state: next, handled: handled };
}

/**
 * A stand-in for an `EditorView` that applies every dispatched transaction
 * to an internal state, for exercising plugin props state-side without
 * mounting a real view.
 */
export interface FakeViewHolder {
    view: EditorView;
    current: () => EditorState;
    dom: HTMLElement;
}

/**
 * Creates a fake view over an initial state. Dispatched transactions are
 * applied to the held state, mirroring a real view's dispatch contract.
 *
 * @param initial - the state the fake view starts from
 * @returns the fake view, a `current` accessor for the latest state, and
 * the detached element exposed as the view's `dom`
 */
export function createFakeView(initial: EditorState): FakeViewHolder {
    let state = initial;
    const dom = document.createElement('div');
    const view = {
        get state() {
            return state;
        },
        dispatch: (tr: Transaction) => {
            state = state.apply(tr);
        },
        dom: dom,
    } as unknown as EditorView;

    return { view: view, current: () => state, dom: dom };
}

/**
 * Parses an HTML string into a document node using a schema's DOM parser.
 *
 * @param schema - the schema the document is parsed against
 * @param html - the HTML to parse
 * @returns the parsed document node
 */
export function parseHTML(schema: Schema, html: string): Node {
    const container = document.createElement('div');
    container.innerHTML = html;

    return DOMParser.fromSchema(schema).parse(container);
}

/**
 * Picks the link mark off a node, when one is present.
 *
 * @param node - the node whose marks are searched
 * @returns the link mark, or `undefined` when the node has none
 */
export function getLinkMark(node: Node): Mark | undefined {
    return node.marks.find((mark) => mark.type.name === 'link');
}

/**
 * Builds a text selection at the given document positions.
 *
 * @param doc - the document the selection is resolved against
 * @param from - the anchor position
 * @param to - the head position; defaults to `from` for a collapsed selection
 * @returns the resolved text selection
 */
export function textSelection(
    doc: Node,
    from: number,
    to?: number
): TextSelection {
    return TextSelection.create(doc, from, to ?? from);
}
