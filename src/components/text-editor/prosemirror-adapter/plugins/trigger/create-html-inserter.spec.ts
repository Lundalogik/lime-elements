import { Schema } from 'prosemirror-model';
import { createHtmlInserter } from './create-html-inserter';

describe('createHtmlInserter', () => {
    let mockContentConverter: any;
    let mockDispatchTransaction: jest.Mock;
    let schema: Schema;

    beforeEach(() => {
        mockContentConverter = {
            parseAsHTML: jest.fn((input) => Promise.resolve(`<p>${input}</p>`)),
        };

        mockDispatchTransaction = jest.fn();

        schema = new Schema({
            nodes: {
                doc: { content: 'block+' },
                paragraph: { group: 'block', content: 'inline*' },
                text: { group: 'inline' },
            },
            marks: {},
        });
    });

    it('resolves after inserting valid HTML into the editor', async () => {
        const inserter = await createHtmlInserter(
            { state: { schema: schema } } as any, // Mock EditorView
            mockContentConverter,
            0, // startPos
            mockDispatchTransaction
        );

        const inputHtml = '<strong>Test</strong>';
        await inserter(inputHtml);

        expect(mockContentConverter.parseAsHTML).toHaveBeenCalledWith(
            inputHtml,
            schema
        );
        expect(mockDispatchTransaction).toHaveBeenCalledTimes(1);
    });

    it('resolves after handling invalid HTML gracefully', async () => {
        const inserter = await createHtmlInserter(
            { state: { schema: schema } } as any,
            mockContentConverter,
            0,
            mockDispatchTransaction
        );

        const inputHtml = '<div><p>Unclosed tag';
        await inserter(inputHtml);

        expect(mockContentConverter.parseAsHTML).toHaveBeenCalledWith(
            inputHtml,
            schema
        );
        expect(mockDispatchTransaction).toHaveBeenCalledTimes(1);
    });

    it('dispatches the correct fragment for nested HTML', async () => {
        const inserter = await createHtmlInserter(
            { state: { schema: schema } } as any,
            mockContentConverter,
            0,
            mockDispatchTransaction
        );

        const inputHtml = '<div><span color="#FF0000">Nested</span></div>';
        await inserter(inputHtml);

        expect(mockDispatchTransaction).toHaveBeenCalledTimes(1);

        // Convert the fragment to an array for easier testing
        const dispatchedArgs = mockDispatchTransaction.mock.calls[0];
        const dispatchedFragment = dispatchedArgs[2];
        const fragmentArray = dispatchedFragment.content.map((node) =>
            node.toJSON()
        );

        // Check the structure and content of the fragment
        // The reason that the structure doesn't completely match the input is
        // that ProseMirror will transform the input based on what the schema
        // allows. (At least I think that's why… /Ads)
        expect(fragmentArray).toEqual([
            {
                type: 'paragraph',
                content: [
                    {
                        type: 'text',
                        text: 'Nested',
                    },
                ],
            },
        ]);
    });
});
