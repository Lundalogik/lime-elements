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
 * Provides infrastructure plugins only: input rules, base keymap
 * (Enter, Backspace, Delete), drop cursor, gap cursor, and history.
 * Schema-aware keybindings are handled by MenuCommandFactory.buildKeymap().
 * @param schema - The ProseMirror schema to build plugins for
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
