/* eslint-disable multiline-ternary */
import { EditorState, TextSelection, Plugin } from 'prosemirror-state';
import { DOMParser, Schema } from 'prosemirror-model';
import { createTestSchema } from './schema-builder';

/**
 * Creates a ProseMirror editor state for testing.
 *
 * @param content - Optional content to initialize the editor with (HTML string)
 * @param schema - Optional custom schema (uses createTestSchema by default)
 * @param plugins - Optional array of plugins to include
 * @returns A configured EditorState instance
 */
export function createEditorState(
    content?: string,
    schema?: Schema,
    plugins: Plugin[] = [],
): EditorState {
    const editorSchema = schema || createTestSchema();

    // eslint-disable-next-line prettier/prettier
    const doc = content? parseContentToDoc(content, editorSchema)
        : editorSchema.topNodeType.createAndFill();

    return EditorState.create({
        doc: doc,
        plugins: plugins,
    });
}

/**
 * Creates a ProseMirror editor state with a specific text selection.
 *
 * @param content - Content to initialize the editor with (HTML string)
 * @param from - Start position of the selection
 * @param to - End position of the selection
 * @param schema - Optional custom schema (uses createTestSchema by default)
 * @param plugins - Optional array of plugins to include
 * @returns A configured EditorState instance with selection
 */
export function createEditorStateWithSelection(
    content: string,
    from: number,
    to: number,
    schema?: Schema,
    plugins: Plugin[] = [],
): EditorState {
    const editorSchema = schema || createTestSchema();

    const doc = parseContentToDoc(content, editorSchema);

    const selection = TextSelection.create(doc, from, to);

    return EditorState.create({
        doc: doc,
        selection: selection,
        plugins: plugins,
    });
}

/**
 * Sets a text selection on an existing editor state.
 *
 * @param state - The editor state to modify
 * @param from - Start position of the selection
 * @param to - End position of the selection (defaults to from)
 * @returns A new editor state with the specified selection
 */
export function setTextSelection(
    state: EditorState,
    from: number,
    to: number = from,
): EditorState {
    const selection = TextSelection.create(state.doc, from, to);

    return state.apply(state.tr.setSelection(selection));
}

/**
 * Parses content string into a ProseMirror document.
 *
 * @param content - Content string (HTML)
 * @param schema - Schema to use for parsing
 * @returns A ProseMirror document node
 */
function parseContentToDoc(content: string, schema: Schema) {
    const domNode = document.createElement('div');
    domNode.innerHTML = content;

    return DOMParser.fromSchema(schema).parse(domNode);
}
