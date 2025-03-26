import { Schema, Mark, Fragment, Node } from 'prosemirror-model';
import { createTestSchema } from './schema-builder';
import { createEditorState } from './editor-state-builder';
import { EditorState } from 'prosemirror-state';

/**
 * Creates a document with plain text content.
 *
 * @param text - The text content to include
 * @param schema - Optional schema to use (defaults to test schema)
 * @returns An EditorState with the specified text content
 */
export function createDocWithText(text: string, schema?: Schema): EditorState {
    const editorSchema = schema || createTestSchema();
    const content = text ? `<p>${text}</p>` : '<p></p>';

    return createEditorState(content, editorSchema);
}

/**
 * Creates a document from HTML content.
 *
 * @param html - The HTML content to parse
 * @param schema - Optional schema to use (defaults to test schema)
 * @returns An EditorState with the parsed HTML content
 */
export function createDocWithHTML(html: string, schema?: Schema): EditorState {
    const editorSchema = schema || createTestSchema();

    return createEditorState(html, editorSchema);
}

/**
 * Mark specification for applying formatting to text
 */
export interface MarkSpec {
    type: string;
    attrs?: Record<string, any>;
}

/**
 * Creates a document with formatted text.
 *
 * @param text - The text content to include
 * @param marks - Array of mark specifications to apply to the text
 * @param schema - Optional schema to use (defaults to test schema)
 * @returns An EditorState with the formatted text
 */
export function createDocWithFormattedText(
    text: string,
    marks: MarkSpec[],
    schema?: Schema,
): EditorState {
    const editorSchema = schema || createTestSchema();

    const paragraph = createTextNodeWithMarks(text, marks, editorSchema);

    const doc = editorSchema.nodes.doc.createAndFill(null, paragraph);

    return EditorState.create({ doc: doc });
}

/**
 * Creates text nodes with specified marks.
 *
 * @param text - The text content
 * @param marks - Array of mark specifications to apply
 * @param schema - The schema to use
 * @returns A paragraph node containing the formatted text
 */
function createTextNodeWithMarks(
    text: string,
    marks: MarkSpec[],
    schema: Schema,
): Node {
    const appliedMarks: Mark[] = marks.map((markSpec) => {
        const markType = schema.marks[markSpec.type];
        if (!markType) {
            throw new Error(`Mark type "${markSpec.type}" not found in schema`);
        }

        return markType.create(markSpec.attrs || {});
    });

    const textNode = schema.text(text, appliedMarks);

    return schema.nodes.paragraph.create(null, textNode);
}

/**
 * Creates a document with a bullet list.
 *
 * @param items - Array of text items for the list
 * @param schema - Optional schema to use (defaults to test schema)
 * @returns An EditorState with a bullet list
 */
export function createDocWithBulletList(
    items: string[],
    schema?: Schema,
): EditorState {
    const editorSchema = schema || createTestSchema();

    const listItems = items.map((text) => {
        const textNode = editorSchema.text(text);
        const paragraph = editorSchema.nodes.paragraph.create(null, textNode);

        return editorSchema.nodes.list_item.create(null, paragraph);
    });

    const bulletList = editorSchema.nodes.bullet_list.create(
        null,
        Fragment.from(listItems),
    );

    const doc = editorSchema.nodes.doc.createAndFill(null, bulletList);

    return EditorState.create({ doc: doc });
}

/**
 * Creates a document with a heading.
 *
 * @param text - The heading text
 * @param level - The heading level (1-6)
 * @param schema - Optional schema to use (defaults to test schema)
 * @returns An EditorState with a heading
 */
export function createDocWithHeading(
    text: string,
    level: number = 1,
    schema?: Schema,
): EditorState {
    const editorSchema = schema || createTestSchema();

    const textNode = editorSchema.text(text);
    const heading = editorSchema.nodes.heading.create(
        { level: level },
        textNode,
    );

    const doc = editorSchema.nodes.doc.createAndFill(null, heading);

    return EditorState.create({ doc: doc });
}

/**
 * Creates a document with a blockquote.
 *
 * @param text - The blockquote text
 * @param schema - Optional schema to use (defaults to test schema)
 * @returns An EditorState with a blockquote
 */
export function createDocWithBlockquote(
    text: string,
    schema?: Schema,
): EditorState {
    const editorSchema = schema || createTestSchema();

    const textNode = editorSchema.text(text);
    const paragraph = editorSchema.nodes.paragraph.create(null, textNode);
    const blockquote = editorSchema.nodes.blockquote.create(null, paragraph);

    const doc = editorSchema.nodes.doc.createAndFill(null, blockquote);

    return EditorState.create({ doc: doc });
}

/**
 * Creates a document with a code block.
 *
 * @param code - The code content
 * @param schema - Optional schema to use (defaults to test schema)
 * @returns An EditorState with a code block
 */
export function createDocWithCodeBlock(
    code: string,
    schema?: Schema,
): EditorState {
    const editorSchema = schema || createTestSchema();

    const textNode = editorSchema.text(code);
    const codeBlock = editorSchema.nodes.code_block.create(null, textNode);

    const doc = editorSchema.nodes.doc.createAndFill(null, codeBlock);

    return EditorState.create({ doc: doc });
}
