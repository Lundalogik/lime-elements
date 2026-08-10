import { DOMParser, DOMSerializer } from 'prosemirror-model';
import { createEditorTestHarness } from './test/editor-test-harness';
import { EditorMenuTypes } from './menu/types';

describe('editor schema (real stack)', () => {
    const html = createEditorTestHarness({ contentType: 'html' });
    const markdown = createEditorTestHarness({ contentType: 'markdown' });

    const markNames = [
        EditorMenuTypes.Italic,
        EditorMenuTypes.Bold,
        EditorMenuTypes.Code,
        EditorMenuTypes.Strikethrough,
        EditorMenuTypes.Link,
    ];

    describe('content-type divergence', () => {
        it('html mode has all four table node types', () => {
            for (const name of [
                'table',
                'table_row',
                'table_cell',
                'table_header',
            ]) {
                expect(html.schema.nodes[name]).toBeDefined();
            }
        });

        it('markdown mode has no table node types', () => {
            for (const name of [
                'table',
                'table_row',
                'table_cell',
                'table_header',
            ]) {
                expect(markdown.schema.nodes[name]).toBeUndefined();
            }
        });

        it('html mode has the image node and all five marks', () => {
            expect(html.schema.nodes.image).toBeDefined();
            for (const name of markNames) {
                expect(html.schema.marks[name]).toBeDefined();
            }
        });

        it('markdown mode has the image node and all five marks', () => {
            expect(markdown.schema.nodes.image).toBeDefined();
            for (const name of markNames) {
                expect(markdown.schema.marks[name]).toBeDefined();
            }
        });
    });

    describe('node replacement semantics', () => {
        it('the image node is the custom spec, not schema-basic', () => {
            const image = html.schema.nodes.image;
            expect(image.spec.attrs.state.default).toBe('success');
            expect(image.spec.attrs.maxWidth.default).toBe('100%');
            expect(image.spec.attrs.src.default).toBe('');
        });

        it('a custom element named paragraph breaks schema construction', () => {
            expect(() =>
                createEditorTestHarness({
                    customElements: [
                        { tagName: 'paragraph', attributes: ['x'] },
                    ],
                })
            ).toThrow();
        });

        it('the link mark is the custom spec, not schema-basic', () => {
            const link = html.schema.marks.link;
            expect(link.spec.inclusive).toBe(false);
            expect(Object.keys(link.spec.attrs).sort()).toEqual([
                'href',
                'referrerpolicy',
                'rel',
                'target',
                'title',
            ]);
        });
    });

    describe('custom element node spec', () => {
        const harness = createEditorTestHarness({
            customElements: [{ tagName: 'test-el', attributes: ['a', 'b'] }],
        });
        const testEl = harness.schema.nodes['test-el'];

        it('requires every declared attribute to create a node', () => {
            expect(() => testEl.create({})).toThrow();
            expect(() => testEl.create({ a: '1', b: '2' })).not.toThrow();
        });

        it('is an inline, atom, selectable node in the inline group', () => {
            expect(testEl.spec.inline).toBe(true);
            expect(testEl.spec.atom).toBe(true);
            expect(testEl.spec.selectable).toBe(true);
            expect(testEl.spec.group).toBe('inline');
        });

        it('serializes without a content hole', () => {
            const node = testEl.create(
                { a: '1', b: '2' },
                harness.schema.text('x')
            );
            const dom = DOMSerializer.fromSchema(harness.schema).serializeNode(
                node
            ) as HTMLElement;

            expect(dom.getAttribute('a')).toBe('1');
            expect(dom.getAttribute('b')).toBe('2');
            expect(dom.childNodes).toHaveLength(0);
        });
    });

    describe('marks', () => {
        it('declares no excludes on any mark spec', () => {
            for (const markName in html.schema.marks) {
                expect(
                    html.schema.marks[markName].spec.excludes
                ).toBeUndefined();
            }
        });

        it('carries code, strong, em, strikethrough, and link marks on the same text node', () => {
            const marks = [
                html.schema.marks.code.create(),
                html.schema.marks.strong.create(),
                html.schema.marks.em.create(),
                html.schema.marks.strikethrough.create(),
                html.schema.marks.link.create({ href: 'https://example.com' }),
            ];

            expect(() => html.schema.text('x', marks)).not.toThrow();

            const text = html.schema.text('x', marks);
            expect(text.marks).toHaveLength(5);
        });

        it('disallows marks inside a code_block', () => {
            expect(html.schema.nodes.code_block.spec.marks).toBe('');
        });

        it('parses strikethrough from <s>, <del>, and <strike>, and serializes to <s>', () => {
            for (const tag of ['s', 'del', 'strike']) {
                const dom = document.createElement('div');
                dom.innerHTML = `<p><${tag}>x</${tag}></p>`;
                const parsed = DOMParser.fromSchema(html.schema).parse(dom);

                expect(
                    html.schema.marks.strikethrough.isInSet(
                        parsed.firstChild.firstChild.marks
                    )
                ).toBeTruthy();
            }

            const node = html.schema.text('x', [
                html.schema.marks.strikethrough.create(),
            ]);
            const dom = DOMSerializer.fromSchema(html.schema).serializeNode(
                node
            ) as HTMLElement;

            expect(dom.tagName.toLowerCase()).toBe('s');
        });

        it('does not parse a link mark from an <a> tag with no href', () => {
            const dom = document.createElement('div');
            dom.innerHTML = '<p><a>x</a></p>';
            const parsed = DOMParser.fromSchema(html.schema).parse(dom);

            expect(
                html.schema.marks.link.isInSet(
                    parsed.firstChild.firstChild.marks
                )
            ).toBeFalsy();
        });

        it('adds noopener/noreferrer rel and referrerpolicy for target _blank, overriding any stored rel', () => {
            const mark = html.schema.marks.link.create({
                href: 'https://example.com',
                target: '_blank',
                rel: 'x',
            });
            const dom = DOMSerializer.fromSchema(html.schema).serializeNode(
                html.schema.text('x', [mark])
            ) as HTMLElement;

            expect(dom.getAttribute('rel')).toBe('noopener noreferrer');
            expect(dom.getAttribute('referrerpolicy')).toBe('noreferrer');
        });

        it('omits rel and referrerpolicy entirely when there is no target', () => {
            const mark = html.schema.marks.link.create({
                href: 'https://example.com',
                target: null,
            });
            const dom = DOMSerializer.fromSchema(html.schema).serializeNode(
                html.schema.text('x', [mark])
            ) as HTMLElement;

            expect(dom.hasAttribute('rel')).toBe(false);
            expect(dom.hasAttribute('referrerpolicy')).toBe(false);
        });
    });

    describe('list structure', () => {
        it('list_item spec content is "paragraph block*"', () => {
            expect(html.schema.nodes.list_item.spec.content).toBe(
                'paragraph block*'
            );
        });

        it('allows a bullet_list to nest inside a list_item', () => {
            const b = html.builders;
            const list = b.bullet_list(
                b.list_item(b.p('a'), b.bullet_list(b.list_item(b.p('b'))))
            );

            expect(() => list.check()).not.toThrow();
        });

        it('lets an html-mode table_cell contain a bullet_list', () => {
            const b = html.builders;
            const cell = b.table_cell(b.bullet_list(b.list_item(b.p('a'))));

            expect(() => cell.check()).not.toThrow();
        });
    });

    describe('no underline', () => {
        it('has no command for underline, since the schema has no underline mark', () => {
            expect(() =>
                html.factory.getCommand('underline' as never)
            ).toThrow();
        });
    });
});
