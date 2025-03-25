import { Schema } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { strikethrough } from '../prosemirror-adapter/menu/menu-schema-extender';

/**
 * Creates a standardized ProseMirror schema for testing the text editor.
 * This schema includes all the nodes and marks used in the actual text editor.
 *
 * @returns A ProseMirror Schema configured for testing
 */
export function createTestSchema(): Schema {
    const schema = new Schema({
        nodes: addListNodes(
            basicSchema.spec.nodes,
            'paragraph block*',
            'block',
        ),
        marks: basicSchema.spec.marks.append({
            strikethrough: strikethrough,
            underline: {
                parseDOM: [
                    { tag: 'u' },
                    { style: 'text-decoration=underline' },
                    { style: 'text-decoration-line=underline' },
                ],
                toDOM: () => ['u', 0],
            },
        }),
    });

    return schema;
}

/**
 * Creates a custom ProseMirror schema with specified configurations.
 * Allows for more flexibility in testing specific schema behaviors.
 *
 * @param options - Configuration options for the schema
 * @returns A customized ProseMirror Schema
 */
export function createCustomTestSchema(options: {
    addLists?: boolean;
    addStrikethrough?: boolean;
    addUnderline?: boolean;
    customMarks?: Record<string, any>;
    customNodes?: Record<string, any>;
}): Schema {
    let nodes = basicSchema.spec.nodes;

    if (options.addLists !== false) {
        nodes = addListNodes(nodes, 'paragraph block*', 'block');
    }

    let marks = basicSchema.spec.marks;

    if (options.addStrikethrough !== false) {
        marks = marks.append({
            strikethrough: strikethrough,
        });
    }

    if (options.addUnderline !== false) {
        marks = marks.append({
            underline: {
                parseDOM: [
                    { tag: 'u' },
                    { style: 'text-decoration=underline' },
                    { style: 'text-decoration-line=underline' },
                ],
                toDOM: () => ['u', 0],
            },
        });
    }

    if (options.customMarks) {
        marks = marks.append(options.customMarks);
    }

    if (options.customNodes) {
        Object.entries(options.customNodes).forEach(([name, spec]) => {
            nodes = nodes.addToEnd(name, spec);
        });
    }

    return new Schema({ nodes: nodes, marks: marks });
}
