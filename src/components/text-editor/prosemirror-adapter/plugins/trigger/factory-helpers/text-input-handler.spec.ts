jest.mock('./send-trigger-event', () => ({
    sendTriggerEvent: jest.fn(),
}));

import { TriggerCharacter } from '@limetech/lime-elements';
import { sendTriggerEvent } from './send-trigger-event';
import { getTextInputHandler } from './text-input-handler';

describe('getTextInputHandler', () => {
    let mockEditorView: any;
    let contentConverter: any;
    let activeTrigger: any;
    let textInputHandler: Function;
    const validTriggerCharacters: TriggerCharacter[] = ['@', '!'];

    beforeEach(() => {
        mockEditorView = {
            state: {
                doc: {
                    textBetween: jest.fn(),
                },
            },
            dom: {
                dispatchEvent: jest.fn(),
            },
        };

        activeTrigger = null;
        const onTriggerStart = jest.fn((trigger) => (activeTrigger = trigger));
        contentConverter = {}; // Mock content converter
        textInputHandler = getTextInputHandler(
            contentConverter,
            validTriggerCharacters,
            onTriggerStart,
        );
        jest.clearAllMocks();
    });

    describe('trigger insertion with no text selection', () => {
        it('emits triggerStart when preceded by whitespace', () => {
            mockEditorView.state.doc.textBetween.mockReturnValue(' ');
            const from = 5;
            const to = 6;

            const result = textInputHandler(mockEditorView, from, to, '@');

            expect(result).toBe(false);
            expect(sendTriggerEvent).toHaveBeenCalledWith(
                'triggerStart',
                mockEditorView,
                contentConverter,
                { character: '@', position: from },
                '@',
            );
            expect(activeTrigger).toEqual({ character: '@', position: from });
        });

        it('emits triggerStart when at start of line', () => {
            mockEditorView.state.doc.textBetween.mockReturnValue('');
            const from = 0;
            const to = 1;

            const result = textInputHandler(mockEditorView, from, to, '@');

            expect(result).toBe(false); // Always returns false
            expect(sendTriggerEvent).toHaveBeenCalledWith(
                'triggerStart',
                mockEditorView,
                contentConverter,
                { character: '@', position: from },
                '@',
            );
            expect(activeTrigger).toEqual({ character: '@', position: from });
        });

        it('emits triggerStart when preceded by a newline', () => {
            mockEditorView.state.doc.textBetween.mockReturnValue('\n');
            const from = 5;
            const to = 6;

            const result = textInputHandler(mockEditorView, from, to, '@');

            expect(result).toBe(false); // Always returns false
            expect(sendTriggerEvent).toHaveBeenCalledWith(
                'triggerStart',
                mockEditorView,
                contentConverter,
                { character: '@', position: from },
                '@',
            );
            expect(activeTrigger).toEqual({ character: '@', position: from });
        });
    });

    describe('trigger insertion with text selection', () => {
        it('emits triggerStart when replacing selected text', () => {
            mockEditorView.state.doc.textBetween.mockReturnValue(' ');
            const from = 5; // Start of selection
            const to = 10; // End of selection

            const result = textInputHandler(mockEditorView, from, to, '@');

            expect(result).toBe(false); // Always returns false
            expect(sendTriggerEvent).toHaveBeenCalledWith(
                'triggerStart',
                mockEditorView,
                contentConverter,
                { character: '@', position: from },
                '@',
            );
            expect(activeTrigger).toEqual({ character: '@', position: from });
        });
    });

    describe('trigger validation scenarios', () => {
        const from = 5;
        const to = 6;

        it('does not emit triggerStart when preceded by non-whitespace', () => {
            mockEditorView.state.doc.textBetween.mockReturnValue('a');
            const result = textInputHandler(mockEditorView, from, to, '@');

            expect(result).toBe(false); // Always returns false
            expect(sendTriggerEvent).not.toHaveBeenCalled();
            expect(activeTrigger).toBeNull();
        });

        it('does not emit triggerStart for non-valid-trigger characters', () => {
            mockEditorView.state.doc.textBetween.mockReturnValue(' ');
            const result = textInputHandler(mockEditorView, from, to, '#');

            expect(result).toBe(false); // Always returns false
            expect(sendTriggerEvent).not.toHaveBeenCalled();
            expect(activeTrigger).toBeNull();
        });
    });

    // Test each valid trigger character
    validTriggerCharacters.forEach((char) => {
        it(`starts trigger session with ${char} character`, () => {
            const from = 5;
            const to = 6;
            mockEditorView.state.doc.textBetween.mockReturnValue(' '); // Space before trigger
            const result = textInputHandler(mockEditorView, from, to, char);

            expect(result).toBe(false); // Always returns false
            expect(sendTriggerEvent).toHaveBeenCalledWith(
                'triggerStart',
                mockEditorView,
                contentConverter,
                { character: char, position: from },
                char,
            );
            expect(activeTrigger).toEqual({
                character: char,
                position: from,
            });
        });
    });
});
