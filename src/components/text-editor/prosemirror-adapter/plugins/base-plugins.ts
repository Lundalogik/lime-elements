import { Plugin } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { buildInputRules } from './input-rules';

/**
 * Assembles the base ProseMirror plugins for the text editor.
 *
 * Replaces the opaque `exampleSetup()` call with explicit imports
 * from stable ProseMirror packages.
 * @param schema
 */
export function buildBasePlugins(schema: Schema): Plugin[] {
    return [
        buildInputRules(schema),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
        history(),
    ];
}
