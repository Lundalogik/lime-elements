import { detectTriggerRemoval } from './detect-trigger-removal';
import { monitorTriggeredText } from './monitor-triggered-text';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ContentTypeConverter } from '../../../../utils/content-type-converter';
import { Trigger } from '../../../../../text-editor/text-editor.types';

export const getAppendTransactionHandler = (
    getCurrentView: () => EditorView | null,
    getActiveTrigger: () => Trigger | null,
    resetActiveTrigger: () => void,
    contentConverter: ContentTypeConverter
) => {
    return (
        transactions: Transaction[],
        _oldState: EditorState,
        newState: EditorState
    ): Transaction => {
        const activeTrigger = getActiveTrigger();

        if (!activeTrigger) {
            return;
        }

        const triggerRemoved = detectTriggerRemoval(
            transactions[0], // Pass the first transaction
            activeTrigger,
            resetActiveTrigger,
            contentConverter,
            getCurrentView()
        );

        if (triggerRemoved) {
            resetActiveTrigger();

            return;
        }

        for (const transaction of transactions) {
            if (transaction.docChanged) {
                activeTrigger.position = transaction.mapping.map(
                    activeTrigger.position,
                    // eslint-disable-next-line unicorn/no-array-method-this-argument -- ProseMirror Mapping#map(pos, assoc), not Array#map
                    -1
                );
            }
        }

        monitorTriggeredText(
            newState.doc,
            activeTrigger,
            newState.selection.from,
            contentConverter,
            getCurrentView()
        );
    };
};
