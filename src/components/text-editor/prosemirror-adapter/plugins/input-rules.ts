import {
    inputRules,
    smartQuotes,
    emDash,
    ellipsis,
    wrappingInputRule,
    textblockTypeInputRule,
    InputRule,
} from 'prosemirror-inputrules';
import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';

/**
 * Builds input rules for the text editor schema.
 *
 * Includes smart quotes, ellipsis, em dash, and markdown-style
 * shortcuts for blockquote, lists, code block, and headings.
 * Only creates rules for nodes that exist in the given schema.
 * @param schema
 */
export function buildInputRules(schema: Schema): Plugin {
    const rules: InputRule[] = [...smartQuotes, ellipsis, emDash];

    if (schema.nodes.blockquote) {
        rules.push(wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote));
    }

    if (schema.nodes.ordered_list) {
        rules.push(
            wrappingInputRule(
                /^(\d+)\.\s$/,
                schema.nodes.ordered_list,
                (match) => ({ order: +match[1] }),
                (match, node) =>
                    node.childCount + node.attrs.order === +match[1]
            )
        );
    }

    if (schema.nodes.bullet_list) {
        rules.push(
            wrappingInputRule(/^\s*([-+*])\s$/, schema.nodes.bullet_list)
        );
    }

    if (schema.nodes.code_block) {
        rules.push(textblockTypeInputRule(/^```$/, schema.nodes.code_block));
    }

    if (schema.nodes.heading) {
        rules.push(
            textblockTypeInputRule(
                /^(#{1,6})\s$/,
                schema.nodes.heading,
                (match) => ({ level: match[1].length })
            )
        );
    }

    return inputRules({ rules });
}
