import { MarkSpec } from 'prosemirror-model';
import { marks as basicMarks } from 'prosemirror-schema-basic';
import OrderedMap from 'orderedmap';
import { linkMarkSpec } from '../plugins/link/link-mark';
import { strikethrough } from '../menu/menu-schema-extender';

/**
 * Assembles the complete mark spec map for the text editor schema.
 *
 * Cherry-picks `strong`, `em`, and `code` from prosemirror-schema-basic.
 * Uses our own `link` mark (with security attributes) and `strikethrough`.
 * The basic `link` mark is intentionally excluded.
 */
export function buildMarks(): OrderedMap<MarkSpec> {
    return OrderedMap.from({
        strong: basicMarks.strong,
        em: basicMarks.em,
        code: basicMarks.code,
        strikethrough: strikethrough,
        link: linkMarkSpec,
    });
}
