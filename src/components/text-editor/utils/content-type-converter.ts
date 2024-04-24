import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';

/**
 * Abstract class implementing a generic parser/serialiser
 * for different editor content types
 *
 * Acts as a parser/serialiser between document encodings (e.g., markdown, HTML) and the ProseMirror document
 *
 * @private
 */
export interface ContentTypeConverter {
    parseAsHTML: (text: string, schema: Schema) => Promise<string>;
    serialize: (view: EditorView, schema: Schema) => string;
}
