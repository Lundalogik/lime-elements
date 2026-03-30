import { Schema } from 'prosemirror-model';
import { CustomElementDefinition } from '../../../../global/shared-types/custom-element.types';
import { Languages } from '../../../date-picker/date.types';
import { buildNodes } from './nodes';
import { buildMarks } from './marks';

/**
 * Creates the ProseMirror schema for the text editor.
 *
 * Assembles nodes and marks from cherry-picked prosemirror-schema-basic
 * specs and our own custom specs (image, link, strikethrough, tables).
 */
export function createSchema(options: {
    customElements?: CustomElementDefinition[];
    contentType?: string;
    language?: Languages;
}): Schema {
    return new Schema({
        nodes: buildNodes(options),
        marks: buildMarks(),
    });
}
