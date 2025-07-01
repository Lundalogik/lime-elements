jest.mock('./detect-trigger-removal', () => ({
    detectTriggerRemoval: jest.fn(),
}));
jest.mock('./monitor-triggered-text', () => ({
    monitorTriggeredText: jest.fn(),
}));
import { detectTriggerRemoval } from './detect-trigger-removal';
import { monitorTriggeredText } from './monitor-triggered-text';
import { getAppendTransactionHandler } from './append-transaction-handler';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

describe('getAppendTransactionHandler', () => {
    let getActiveTrigger: jest.Mock;
    let resetActiveTrigger: jest.Mock;
    let mockView: any;
    let contentConverter: any;
    let oldState: EditorState;
    let newState: EditorState;
    let getCurrentView: () => EditorView | null;

    beforeEach(() => {
        getActiveTrigger = jest.fn();
        resetActiveTrigger = jest.fn();
        mockView = { dom: { dispatchEvent: jest.fn() } };
        getCurrentView = jest.fn(() => mockView);
        contentConverter = {};
        oldState = {
            doc: {},
            selection: { from: 0 },
        } as unknown as EditorState;
        newState = {
            doc: { textBetween: jest.fn() },
            selection: { from: 5 },
        } as unknown as EditorState;

        jest.clearAllMocks();

        (detectTriggerRemoval as jest.Mock).mockClear();
        (monitorTriggeredText as jest.Mock).mockClear();
    });

    it('calls getActiveTrigger', () => {
        const handler = getAppendTransactionHandler(
            getCurrentView,
            getActiveTrigger,
            resetActiveTrigger,
            contentConverter
        );
        handler([], oldState, newState);

        expect(getActiveTrigger).toHaveBeenCalled();
    });

    it('does nothing if there is no active trigger', () => {
        getActiveTrigger.mockReturnValue(null);

        const handler = getAppendTransactionHandler(
            getCurrentView,
            getActiveTrigger,
            resetActiveTrigger,
            contentConverter
        );
        handler([], oldState, newState);

        expect(getActiveTrigger).toHaveBeenCalled();
        expect(detectTriggerRemoval).not.toHaveBeenCalled();
        expect(monitorTriggeredText).not.toHaveBeenCalled();
    });

    it('emits triggerStop if the trigger is removed', () => {
        getActiveTrigger.mockReturnValue({ character: '@', position: 5 });
        (detectTriggerRemoval as jest.Mock).mockReturnValue(true); // Ensure it returns true

        const handler = getAppendTransactionHandler(
            getCurrentView,
            getActiveTrigger,
            resetActiveTrigger,
            contentConverter
        );
        handler(
            [{ mock: 'transaction' } as unknown as Transaction],
            oldState,
            newState
        );

        expect(getActiveTrigger).toHaveBeenCalled();
        expect(detectTriggerRemoval).toHaveBeenCalledWith(
            { mock: 'transaction' },
            { character: '@', position: 5 },
            resetActiveTrigger,
            contentConverter,
            mockView
        );
        expect(resetActiveTrigger).toHaveBeenCalled(); // Confirm callback is called
        expect(monitorTriggeredText).not.toHaveBeenCalled(); // Ensure no further calls are made
    });

    it('emits triggerChange with no text changes', () => {
        getActiveTrigger.mockReturnValue({ character: '@', position: 5 });
        (detectTriggerRemoval as jest.Mock).mockReturnValue(false);
        (monitorTriggeredText as jest.Mock).mockReturnValue('abc'); // Simulate no change in value

        const handler = getAppendTransactionHandler(
            getCurrentView,
            getActiveTrigger,
            resetActiveTrigger,
            contentConverter
        );
        handler([], oldState, newState);

        expect(getActiveTrigger).toHaveBeenCalled();
        expect(detectTriggerRemoval).toHaveBeenCalled();
        expect(monitorTriggeredText).toHaveBeenCalledWith(
            newState.doc,
            { character: '@', position: 5 },
            newState.selection.from,
            contentConverter,
            mockView
        );
    });

    it('emits triggerChange when text after the trigger changes', () => {
        getActiveTrigger.mockReturnValue({ character: '@', position: 5 });
        (detectTriggerRemoval as jest.Mock).mockReturnValue(false);
        (monitorTriggeredText as jest.Mock).mockReturnValue('abcd'); // Simulate a change in value

        const handler = getAppendTransactionHandler(
            getCurrentView,
            getActiveTrigger,
            resetActiveTrigger,
            contentConverter
        );
        handler([], oldState, newState);

        expect(getActiveTrigger).toHaveBeenCalled();
        expect(detectTriggerRemoval).toHaveBeenCalled();
        expect(monitorTriggeredText).toHaveBeenCalledWith(
            newState.doc,
            { character: '@', position: 5 },
            newState.selection.from,
            contentConverter,
            getCurrentView()
        );
    });

    it('handles integration with monitorTriggeredText correctly', () => {
        getActiveTrigger.mockReturnValue({ character: '@', position: 5 });
        (detectTriggerRemoval as jest.Mock).mockReturnValue(false);
        (monitorTriggeredText as jest.Mock).mockImplementation(
            (doc, activeTrigger, cursorPosition) => {
                expect(doc).toEqual(newState.doc);
                expect(activeTrigger).toEqual({ character: '@', position: 5 });
                expect(cursorPosition).toEqual(newState.selection.from);

                return 'some text';
            }
        );

        const handler = getAppendTransactionHandler(
            getCurrentView,
            getActiveTrigger,
            resetActiveTrigger,
            contentConverter
        );
        handler([], oldState, newState);

        expect(getActiveTrigger).toHaveBeenCalled();
        expect(detectTriggerRemoval).toHaveBeenCalled();
        expect(monitorTriggeredText).toHaveBeenCalled();
    });
});
