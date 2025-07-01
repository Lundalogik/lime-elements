import { EditorView } from 'prosemirror-view';
import { Trigger } from '../../../../../text-editor/text-editor.types';
import { ContentTypeConverter } from '../../../../../text-editor/utils/content-type-converter';
jest.mock('./send-trigger-event', () => ({
    sendTriggerEvent: jest.fn(),
}));
import { sendTriggerEvent } from './send-trigger-event';
import { monitorTriggeredText } from './monitor-triggered-text';

describe('monitorTriggeredText', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('excludes the trigger character in the extracted text', () => {
        const doc = { textBetween: jest.fn().mockReturnValue('A') }; // Simulate the text "A" after the trigger
        const activeTrigger: Trigger = { character: '@', position: 1 }; // Trigger character at position 1
        const contentTypeConverter = {
            mock: 'contentTypeConverter',
        } as unknown as ContentTypeConverter;
        const view = {
            dom: { dispatchEvent: jest.fn() },
        } as unknown as EditorView;

        const result = monitorTriggeredText(
            doc,
            activeTrigger,
            2, // Cursor position after "A"
            contentTypeConverter,
            view
        );

        // Ensure textBetween was called starting after the trigger position
        expect(doc.textBetween).toHaveBeenCalledWith(2, 2, '');
        expect(result).toBe('A'); // Only the text after the trigger character
        expect(sendTriggerEvent).toHaveBeenCalledWith(
            'triggerChange',
            view,
            contentTypeConverter,
            activeTrigger,
            'A'
        );
    });

    it('handles no text after the trigger character', () => {
        const doc = { textBetween: jest.fn().mockReturnValue('') }; // No text after trigger
        const activeTrigger: Trigger = { character: '@', position: 1 }; // Trigger character at position 1
        const contentTypeConverter = {
            mock: 'contentTypeConverter',
        } as unknown as ContentTypeConverter;
        const view = {
            dom: { dispatchEvent: jest.fn() },
        } as unknown as EditorView;

        const result = monitorTriggeredText(
            doc,
            activeTrigger,
            2, // Cursor position directly after trigger
            contentTypeConverter,
            view
        );

        expect(doc.textBetween).toHaveBeenCalledWith(2, 2, '');
        expect(result).toBe(''); // No text after trigger
        expect(sendTriggerEvent).toHaveBeenCalledWith(
            'triggerChange',
            view,
            contentTypeConverter,
            activeTrigger,
            ''
        );
    });

    it('handles multiple characters after the trigger character', () => {
        const doc = { textBetween: jest.fn().mockReturnValue('Some Text') };
        const activeTrigger: Trigger = { character: '@', position: 1 };
        const contentTypeConverter = {
            mock: 'contentTypeConverter',
        } as unknown as ContentTypeConverter;
        const view = {
            dom: { dispatchEvent: jest.fn() },
        } as unknown as EditorView;

        const result = monitorTriggeredText(
            doc,
            activeTrigger,
            11, // Cursor position at the end of "Some Text"
            contentTypeConverter,
            view
        );

        expect(doc.textBetween).toHaveBeenCalledWith(2, 11, '');
        expect(result).toBe('Some Text');
        expect(sendTriggerEvent).toHaveBeenCalledWith(
            'triggerChange',
            view,
            contentTypeConverter,
            activeTrigger,
            'Some Text'
        );
    });

    it('extracts whitespace correctly when typing after a trigger', () => {
        const doc = { textBetween: jest.fn().mockReturnValue(' ') }; // Text after trigger
        const activeTrigger: Trigger = { character: '@', position: 1 };
        const contentTypeConverter = {
            mock: 'contentTypeConverter',
        } as unknown as ContentTypeConverter;
        const view = {
            dom: { dispatchEvent: jest.fn() },
        } as unknown as EditorView;

        const result = monitorTriggeredText(
            doc,
            activeTrigger,
            2, // Cursor position after the whitespace
            contentTypeConverter,
            view
        );

        expect(doc.textBetween).toHaveBeenCalledWith(2, 2, '');
        expect(result).toBe(' ');
        expect(sendTriggerEvent).toHaveBeenCalledWith(
            'triggerChange',
            view,
            contentTypeConverter,
            activeTrigger,
            ' '
        );
    });

    it('handles a full sequence of typing a valid trigger and matching text', () => {
        const mockDoc = { textBetween: jest.fn() };
        mockDoc.textBetween
            .mockReturnValueOnce('w') // After typing 'w'
            .mockReturnValueOnce('wo') // After typing 'o'
            .mockReturnValueOnce('wol'); // After typing 'l'

        const activeTrigger: Trigger = { character: '@', position: 7 };
        const contentTypeConverter = {
            mock: 'contentTypeConverter',
        } as unknown as ContentTypeConverter;
        const view = {
            dom: { dispatchEvent: jest.fn() },
        } as unknown as EditorView;

        // Simulate typing
        monitorTriggeredText(
            mockDoc,
            activeTrigger,
            7,
            contentTypeConverter,
            view
        ); // '@'
        monitorTriggeredText(
            mockDoc,
            activeTrigger,
            8,
            contentTypeConverter,
            view
        ); // '@w'
        monitorTriggeredText(
            mockDoc,
            activeTrigger,
            9,
            contentTypeConverter,
            view
        ); // '@wo'
        monitorTriggeredText(
            mockDoc,
            activeTrigger,
            10,
            contentTypeConverter,
            view
        ); // '@wol'

        expect(mockDoc.textBetween).toHaveBeenNthCalledWith(1, 8, 8, '');
        expect(mockDoc.textBetween).toHaveBeenNthCalledWith(2, 8, 9, '');
        expect(mockDoc.textBetween).toHaveBeenNthCalledWith(3, 8, 10, '');
        expect(sendTriggerEvent).toHaveBeenNthCalledWith(
            1,
            'triggerChange',
            view,
            contentTypeConverter,
            activeTrigger,
            ''
        );
        expect(sendTriggerEvent).toHaveBeenNthCalledWith(
            2,
            'triggerChange',
            view,
            contentTypeConverter,
            activeTrigger,
            'w'
        );
        expect(sendTriggerEvent).toHaveBeenNthCalledWith(
            3,
            'triggerChange',
            view,
            contentTypeConverter,
            activeTrigger,
            'wo'
        );
        expect(sendTriggerEvent).toHaveBeenNthCalledWith(
            4,
            'triggerChange',
            view,
            contentTypeConverter,
            activeTrigger,
            'wol'
        );
    });
});
