vi.mock('./detect-trigger-removal', () => ({
    detectTriggerRemoval: vi.fn(),
}));
vi.mock('./monitor-triggered-text', () => ({
    monitorTriggeredText: vi.fn(),
}));
import { detectTriggerRemoval } from './detect-trigger-removal';
import { monitorTriggeredText } from './monitor-triggered-text';
import { getAppendTransactionHandler } from './append-transaction-handler';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { Trigger } from '../../../../../text-editor/text-editor.types';

describe('getAppendTransactionHandler', () => {
    let getActiveTrigger: Mock<any>;
    let resetActiveTrigger: Mock<any>;
    let mockView: any;
    let contentConverter: any;
    let oldState: EditorState;
    let newState: EditorState;
    let getCurrentView: () => EditorView | null;

    beforeEach(() => {
        getActiveTrigger = vi.fn();
        resetActiveTrigger = vi.fn();
        mockView = { dom: { dispatchEvent: vi.fn() } };
        getCurrentView = vi.fn(() => mockView);
        contentConverter = {};
        oldState = {
            doc: {},
            selection: { from: 0 },
        } as unknown as EditorState;
        newState = {
            doc: { textBetween: vi.fn() },
            selection: { from: 5 },
        } as unknown as EditorState;

        vi.resetAllMocks();
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
        vi.mocked(detectTriggerRemoval).mockReturnValue(true); // Ensure it returns true

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
        vi.mocked(detectTriggerRemoval).mockReturnValue(false);
        vi.mocked(monitorTriggeredText).mockReturnValue('abc'); // Simulate no change in value

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
        vi.mocked(detectTriggerRemoval).mockReturnValue(false);
        vi.mocked(monitorTriggeredText).mockReturnValue('abcd'); // Simulate a change in value

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

    it('maps the trigger position through document-changing transactions', () => {
        const schema = new Schema({
            nodes: {
                doc: { content: 'block+' },
                paragraph: { group: 'block', content: 'inline*' },
                text: { group: 'inline' },
            },
            marks: {},
        });

        const doc = schema.node('doc', null, [
            schema.node('paragraph', null, [schema.text('hello @world')]),
        ]);

        const state = EditorState.create({ doc, schema });

        // Insert text before the trigger position, shifting it right
        const transaction = state.tr.insertText('abc ', 1);

        const trigger: Trigger = { character: '@', position: 7 };
        getActiveTrigger.mockReturnValue(trigger);
        vi.mocked(detectTriggerRemoval).mockReturnValue(false);

        const handler = getAppendTransactionHandler(
            getCurrentView,
            getActiveTrigger,
            resetActiveTrigger,
            contentConverter
        );
        handler([transaction], oldState, newState);

        expect(trigger.position).toBe(11);
    });

    it('maps trigger position cumulatively across multiple transactions', () => {
        const schema = new Schema({
            nodes: {
                doc: { content: 'block+' },
                paragraph: { group: 'block', content: 'inline*' },
                text: { group: 'inline' },
            },
            marks: {},
        });

        const doc = schema.node('doc', null, [
            schema.node('paragraph', null, [schema.text('hello @world')]),
        ]);

        const state = EditorState.create({ doc, schema });

        // Two transactions that both insert before the trigger
        const tr1 = state.tr.insertText('ab ', 1);
        const state2 = state.apply(tr1);
        const tr2 = state2.tr.insertText('cd ', 1);

        const trigger: Trigger = { character: '@', position: 7 };
        getActiveTrigger.mockReturnValue(trigger);
        vi.mocked(detectTriggerRemoval).mockReturnValue(false);

        const handler = getAppendTransactionHandler(
            getCurrentView,
            getActiveTrigger,
            resetActiveTrigger,
            contentConverter
        );
        handler([tr1, tr2], oldState, newState);

        // Position 7 -> 10 (after 'ab ') -> 13 (after 'cd ')
        expect(trigger.position).toBe(13);
    });

    it('handles integration with monitorTriggeredText correctly', () => {
        getActiveTrigger.mockReturnValue({ character: '@', position: 5 });
        vi.mocked(detectTriggerRemoval).mockReturnValue(false);
        vi.mocked(monitorTriggeredText).mockImplementation(
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
