import { DOMParser, Node, Schema } from 'prosemirror-model';
import {
    createEditorTestHarness,
    createEditorTestState,
    mountView,
    EditorTestHarness,
} from './test/editor-test-harness';
import { MarkdownConverter } from '../utils/markdown-converter';
import { HTMLConverter } from '../utils/html-converter';
import { ContentTypeConverter } from '../utils/content-type-converter';
import { imageCache } from './plugins/image/node';
import { CustomElementDefinition } from '../../../global/shared-types/custom-element.types';

const chipDefinition: CustomElementDefinition = {
    tagName: 'test-chip',
    attributes: ['label'],
};

const mdHarness = createEditorTestHarness({ contentType: 'markdown' });
const htmlHarness = createEditorTestHarness({ contentType: 'html' });
const chipHarness = createEditorTestHarness({
    contentType: 'markdown',
    customElements: [chipDefinition],
});

const md = new MarkdownConverter([], 'en');
const mdChip = new MarkdownConverter([chipDefinition], 'en');
const html = new HTMLConverter([]);
const htmlChip = new HTMLConverter([chipDefinition]);

async function toDoc(
    value: string,
    converter: ContentTypeConverter,
    schema: Schema
): Promise<Node> {
    const parsed = await converter.parseAsHTML(value, schema);
    const container = document.createElement('div');
    container.innerHTML = parsed;

    return DOMParser.fromSchema(schema).parse(container);
}

function serialize(
    docNode: Node,
    converter: ContentTypeConverter,
    harness: EditorTestHarness
): string {
    const { view, cleanup } = mountView(
        createEditorTestState(harness, docNode)
    );
    try {
        return converter.serialize(view, harness.schema);
    } finally {
        cleanup();
    }
}

async function roundTrip(value: string): Promise<string> {
    const parsed = await toDoc(value, md, mdHarness.schema);

    return serialize(parsed, md, mdHarness).trimEnd();
}

beforeEach(() => {
    imageCache.clear();
});

describe('markdown round-trips', () => {
    it.each([
        'plain paragraph',
        '# H1',
        '## H2',
        '###### H6',
        '> quote',
        '*em* **strong** `code`',
        '~~struck~~',
        '[text](https://x.example/ "title")',
    ])('%j survives a full round-trip unchanged', async (value) => {
        expect(await roundTrip(value)).toBe(value);
    });

    it('serializes lists loose, with hyphen bullets normalized to asterisks', async () => {
        expect(await roundTrip('- a\n- b')).toBe('* a\n\n* b');
    });

    it('keeps the start number of an ordered list', async () => {
        expect(await roundTrip('3. third\n4. fourth')).toBe(
            '3. third\n\n4. fourth'
        );
    });

    it('appends a trailing newline to code block content', async () => {
        expect(await roundTrip('```\ncode\n```')).toBe('```\ncode\n\n```');
    });

    it('serializes a bare URL as an autolink', async () => {
        expect(await roundTrip('https://x.example/')).toBe(
            '<https://x.example/>'
        );
    });
});

describe('markdown serialization losses', () => {
    it('drops link target and rel attributes', () => {
        const b = mdHarness.builders as Record<string, any>;
        const built = b.doc(
            b.p(
                b.link(
                    {
                        href: 'https://x.example/',
                        target: '_blank',
                        rel: 'noopener noreferrer',
                    },
                    'text'
                )
            )
        );

        expect(serialize(built, md, mdHarness).trimEnd()).toBe(
            '[text](https://x.example/)'
        );
    });

    it('serializes a document of only a horizontal rule to an empty string', () => {
        const b = mdHarness.builders as Record<string, any>;

        expect(serialize(b.doc(b.horizontal_rule()), md, mdHarness)).toBe('');
    });

    it('serializes a document of only an empty code block to an empty string', () => {
        const b = mdHarness.builders as Record<string, any>;

        expect(serialize(b.doc(b.code_block()), md, mdHarness)).toBe('');
    });

    it('bakes localized status text into the output for a loading image', () => {
        const b = mdHarness.builders as Record<string, any>;
        const built = b.doc(
            b.p(
                b.image({
                    src: 's',
                    alt: 'photo.png',
                    fileInfoId: 'x',
                    state: 'loading',
                })
            )
        );
        const output = serialize(built, md, mdHarness);

        expect(output).toContain('<span>');
        expect(output).toContain('photo.png');
    });

    it('serializes a success image as raw img markup with a style attribute', () => {
        const b = mdHarness.builders as Record<string, any>;
        const built = b.doc(
            b.p(
                b.image({
                    src: 'https://cdn.example/x.png',
                    alt: 'photo.png',
                    fileInfoId: 'x',
                    state: 'success',
                    width: '100px',
                })
            )
        );
        const output = serialize(built, md, mdHarness);

        expect(output).toContain('<img src="https://cdn.example/x.png"');
        expect(output).toContain('style="');
        expect(output).toContain('width: 100px');
    });
});

describe('custom element serialization', () => {
    it('keeps children and raw attributes in markdown output', () => {
        const b = chipHarness.builders as Record<string, any>;
        const built = b.doc(b.p(b['test-chip']({ label: 'x' }, 'inner')));
        const output = serialize(built, mdChip, chipHarness);

        expect(output).toContain('<test-chip label="x">');
        expect(output).toContain('inner');
        expect(output).toContain('</test-chip>');
    });

    it('writes a null attribute as the literal string null in markdown output', () => {
        const b = chipHarness.builders as Record<string, any>;
        const built = b.doc(b.p(b['test-chip']({ label: null })));
        const output = serialize(built, mdChip, chipHarness);

        expect(output).toContain('label="null"');
    });

    it('drops children in html output', () => {
        const b = chipHarness.builders as Record<string, any>;
        const built = b.doc(b.p(b['test-chip']({ label: 'x' }, 'inner')));
        const output = serialize(built, htmlChip, chipHarness);

        expect(output).toContain('<test-chip');
        expect(output).not.toContain('inner');
    });
});

describe('html converter', () => {
    it('does not interpret markdown syntax', async () => {
        const parsed = await toDoc('# not a heading', html, htmlHarness.schema);

        let foundHeading = false;
        parsed.descendants((node) => {
            if (node.type.name === 'heading') {
                foundHeading = true;
            }
        });

        expect(foundHeading).toBe(false);
        expect(parsed.textContent).toBe('# not a heading');
    });

    it('emits security attributes for target=_blank links', () => {
        const b = htmlHarness.builders as Record<string, any>;
        const built = b.doc(
            b.p(
                b.link({ href: 'https://x.example/', target: '_blank' }, 'text')
            )
        );
        const output = serialize(built, html, htmlHarness);

        expect(output).toContain('rel="noopener noreferrer"');
        expect(output).toContain('referrerpolicy="noreferrer"');
    });

    it('keeps table cell styles', () => {
        const b = htmlHarness.builders as Record<string, any>;
        const built = b.doc(
            b.table(b.table_row(b.table_cell({ background: 'red' }, b.p('x'))))
        );
        const output = serialize(built, html, htmlHarness);

        expect(output).toContain('<td');
        expect(output).toContain('background-color: red');
    });
});

describe('sanitizer whitelist plumbing', () => {
    it.each([
        ['markdown', mdChip, md],
        ['html', htmlChip, html],
    ])(
        'the %s converter keeps declared custom tags and strips undeclared ones',
        async (
            _,
            withChip: ContentTypeConverter,
            without: ContentTypeConverter
        ) => {
            const value = '<test-chip label="x">t</test-chip>';

            const kept = await withChip.parseAsHTML(value, chipHarness.schema);
            expect(kept).toContain('<test-chip');

            const stripped = await without.parseAsHTML(value, mdHarness.schema);
            expect(stripped).not.toContain('<test-chip');
            expect(stripped).toContain('t');
        }
    );
});

describe('table parsing per content type', () => {
    const tableMarkdown = '| a | b |\n| - | - |\n| c | d |';

    it('flattens a markdown table in markdown mode', async () => {
        const parsed = await toDoc(tableMarkdown, md, mdHarness.schema);

        let foundTable = false;
        parsed.descendants((node) => {
            if (node.type.name === 'table') {
                foundTable = true;
            }
        });

        expect(foundTable).toBe(false);
        expect(parsed.textContent).toContain('a');
        expect(parsed.textContent).toContain('d');
    });

    it('keeps a markdown table as table nodes in the html schema', async () => {
        const parsed = await toDoc(tableMarkdown, md, htmlHarness.schema);

        let foundTable = false;
        parsed.descendants((node) => {
            if (node.type.name === 'table') {
                foundTable = true;
            }
        });

        expect(foundTable).toBe(true);
    });
});

describe('image round-trip identity', () => {
    it('keeps src and alt but regenerates fileInfoId', async () => {
        const b = mdHarness.builders as Record<string, any>;
        const built = b.doc(
            b.p(
                b.image({
                    src: 'https://cdn.example/x.png',
                    alt: 'photo.png',
                    fileInfoId: 'original-id',
                    state: 'success',
                })
            )
        );
        const output = serialize(built, md, mdHarness);
        const reparsed = await toDoc(output, md, mdHarness.schema);

        let image: Node;
        reparsed.descendants((node) => {
            if (node.type.name === 'image') {
                image = node;
            }
        });

        expect(image.attrs.src).toBe('https://cdn.example/x.png');
        expect(image.attrs.alt).toBe('photo.png');
        expect(image.attrs.fileInfoId).not.toBe('original-id');
    });
});
