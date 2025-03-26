import { Schema, MarkType, NodeType } from 'prosemirror-model';
import { createTestSchema, createCustomTestSchema } from './schema-builder';

describe('Schema Utilities', () => {
    describe('createTestSchema', () => {
        it('should create a schema with basic marks and nodes', () => {
            const schema = createTestSchema();

            expect(schema).toBeInstanceOf(Schema);

            expect(schema.nodes.doc).toBeDefined();
            expect(schema.nodes.paragraph).toBeDefined();
            expect(schema.nodes.text).toBeDefined();

            expect(schema.nodes.bullet_list).toBeDefined();
            expect(schema.nodes.ordered_list).toBeDefined();
            expect(schema.nodes.list_item).toBeDefined();
            expect(schema.nodes.heading).toBeDefined();
            expect(schema.nodes.blockquote).toBeDefined();
            expect(schema.nodes.code_block).toBeDefined();

            expect(schema.marks.strong).toBeDefined();
            expect(schema.marks.em).toBeDefined();
            expect(schema.marks.code).toBeDefined();
            expect(schema.marks.link).toBeDefined();

            expect(schema.marks.strikethrough).toBeDefined();
            expect(schema.marks.underline).toBeDefined();
        });
    });

    describe('createCustomTestSchema', () => {
        it('should create a schema with specified options', () => {
            const customSchema = createCustomTestSchema({
                addLists: false,
                addStrikethrough: true,
                addUnderline: false,
            });

            expect(customSchema).toBeInstanceOf(Schema);

            expect(customSchema.nodes.bullet_list).toBeUndefined();
            expect(customSchema.nodes.ordered_list).toBeUndefined();
            expect(customSchema.nodes.list_item).toBeUndefined();

            expect(customSchema.marks.strikethrough).toBeDefined();
            expect(customSchema.marks.underline).toBeUndefined();
        });

        it('should support custom marks', () => {
            const highlightMark = {
                parseDOM: [{ tag: 'mark' }],
                toDOM: () => ['mark', 0],
            };

            const customSchema = createCustomTestSchema({
                customMarks: { highlight: highlightMark },
            });

            expect(customSchema.marks.highlight).toBeDefined();
            expect(customSchema.marks.highlight instanceof MarkType).toBe(true);
        });

        it('should support custom nodes', () => {
            const customNode = {
                content: 'inline*',
                group: 'block',
                parseDOM: [{ tag: 'div.custom' }],
                toDOM: () => ['div', { class: 'custom' }, 0],
            };

            const customSchema = createCustomTestSchema({
                customNodes: { custom: customNode },
            });

            expect(customSchema.nodes.custom).toBeDefined();
            expect(customSchema.nodes.custom instanceof NodeType).toBe(true);
        });
    });
});
