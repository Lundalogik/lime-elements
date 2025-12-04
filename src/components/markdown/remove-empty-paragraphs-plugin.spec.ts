import { createRemoveEmptyParagraphsPlugin } from './remove-empty-paragraphs-plugin';

describe('remove empty paragraphs plugin', () => {
    it('keeps empty paragraphs when disabled', () => {
        const tree = createRoot([createParagraph()]);

        runPlugin(tree, false);

        expect(tree.children).toHaveLength(1);
    });

    it('removes empty paragraphs with only whitespace content', () => {
        const tree = createRoot([
            createParagraph(),
            createParagraph([createText('   ')]),
            createParagraph([createText('\n')]),
            createParagraph([createText('\u00A0')]),
            createParagraph([createElement('span')]),
            createParagraph([createElement('span', [createText('\u00A0')])]),
        ]);

        runPlugin(tree, true);

        expect(tree.children).toHaveLength(0);
    });

    it('keeps paragraphs with meaningful content', () => {
        const paragraph = createParagraph([
            createElement('img', undefined, { src: 'test.jpg' }),
        ]);
        const tree = createRoot([paragraph]);

        runPlugin(tree, true);

        expect(tree.children).toHaveLength(1);
        expect(tree.children[0]).toBe(paragraph);
    });

    it('removes paragraphs containing only line breaks', () => {
        const tree = createRoot([
            createParagraph([createElement('br')]),
            createParagraph([createElement('span', [createElement('br')])]),
        ]);

        runPlugin(tree, true);

        expect(tree.children).toHaveLength(0);
    });

    it('removes paragraphs containing only zero-width whitespace characters', () => {
        const zeroWidthText = '\u200B\u200C\u200D\uFEFF';
        const tree = createRoot([
            createParagraph([createText(zeroWidthText)]),
            createParagraph([
                createElement('span', [createText(zeroWidthText)]),
            ]),
        ]);

        runPlugin(tree, true);

        expect(tree.children).toHaveLength(0);
    });

    it('keeps text content inside paragraphs', () => {
        const paragraph = createParagraph([
            createElement('span', [createText('Meaningful text')]),
        ]);
        const tree = createRoot([paragraph]);

        runPlugin(tree, true);

        expect(tree.children).toHaveLength(1);
        expect(tree.children[0]).toBe(paragraph);
    });
});

const runPlugin = (tree: any, enabled: boolean) => {
    const plugin = createRemoveEmptyParagraphsPlugin(enabled);
    const transformer = plugin.call(mockProcessor);

    if (typeof transformer === 'function') {
        transformer(tree);
    }
};

const mockProcessor: any = {};
mockProcessor.data = () => mockProcessor;

const createRoot = (children: any[] = []) => ({
    type: 'root',
    children,
});

const createParagraph = (children: any[] = []) => ({
    type: 'element',
    tagName: 'p',
    properties: {},
    children,
});

const createElement = (
    tagName: string,
    children: any[] = [],
    properties: Record<string, any> = {}
) => ({
    type: 'element',
    tagName,
    properties,
    children,
});

const createText = (value: string) => ({
    type: 'text',
    value,
});
