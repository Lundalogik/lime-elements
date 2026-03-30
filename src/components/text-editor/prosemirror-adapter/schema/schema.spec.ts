import { createSchema } from './index';

describe('createSchema', () => {
    describe('base schema (markdown mode)', () => {
        const schema = createSchema({});

        it('includes all cherry-picked base nodes', () => {
            expect(schema.nodes.doc).toBeDefined();
            expect(schema.nodes.paragraph).toBeDefined();
            expect(schema.nodes.blockquote).toBeDefined();
            expect(schema.nodes.horizontal_rule).toBeDefined();
            expect(schema.nodes.heading).toBeDefined();
            expect(schema.nodes.code_block).toBeDefined();
            expect(schema.nodes.text).toBeDefined();
            expect(schema.nodes.hard_break).toBeDefined();
        });

        it('includes list nodes', () => {
            expect(schema.nodes.ordered_list).toBeDefined();
            expect(schema.nodes.bullet_list).toBeDefined();
            expect(schema.nodes.list_item).toBeDefined();
        });

        it('includes custom image node', () => {
            expect(schema.nodes.image).toBeDefined();
        });

        it('does not include table nodes in non-html mode', () => {
            expect(schema.nodes.table).toBeUndefined();
            expect(schema.nodes.table_row).toBeUndefined();
            expect(schema.nodes.table_cell).toBeUndefined();
            expect(schema.nodes.table_header).toBeUndefined();
        });

        it('includes all expected marks', () => {
            expect(schema.marks.strong).toBeDefined();
            expect(schema.marks.em).toBeDefined();
            expect(schema.marks.code).toBeDefined();
            expect(schema.marks.strikethrough).toBeDefined();
            expect(schema.marks.link).toBeDefined();
        });

        it('uses our custom link mark with security attributes', () => {
            const linkSpec = schema.marks.link.spec;
            expect(linkSpec.attrs.target).toBeDefined();
            expect(linkSpec.attrs.rel).toBeDefined();
            expect(linkSpec.attrs.referrerpolicy).toBeDefined();
        });
    });

    describe('html mode', () => {
        const schema = createSchema({ contentType: 'html' });

        it('includes table nodes', () => {
            expect(schema.nodes.table).toBeDefined();
            expect(schema.nodes.table_row).toBeDefined();
            expect(schema.nodes.table_cell).toBeDefined();
            expect(schema.nodes.table_header).toBeDefined();
        });
    });

    describe('image node spec', () => {
        const schema = createSchema({});
        const imageSpec = schema.nodes.image.spec;

        it('is draggable', () => {
            expect(imageSpec.draggable).toBe(true);
        });

        it('supports title attribute', () => {
            expect(imageSpec.attrs.title).toBeDefined();
        });
    });

    describe('custom elements', () => {
        const schema = createSchema({
            customElements: [
                {
                    tagName: 'my-widget',
                    attributes: ['data-id', 'data-label'],
                },
            ],
        });

        it('includes the custom element as a node', () => {
            expect(schema.nodes['my-widget']).toBeDefined();
        });

        it('does not break base nodes', () => {
            expect(schema.nodes.paragraph).toBeDefined();
            expect(schema.nodes.heading).toBeDefined();
        });
    });
});
