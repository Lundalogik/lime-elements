import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { sendTriggerEvent } from './send-trigger-event';
import { ContentTypeConverter } from '../../../../utils/content-type-converter';
import { Trigger } from '../../../../../text-editor/text-editor.types';
import { ReplaceStep } from 'prosemirror-transform'; // Import specific step types

export const detectTriggerRemoval = (
    transaction: Transaction,
    activeTrigger: Trigger | null,
    resetActiveTrigger: () => void,
    contentConverter: ContentTypeConverter,
    view: EditorView
): boolean => {
    if (!activeTrigger || activeTrigger.position < 1) {
        return false;
    }

    for (const step of transaction.steps) {
        if (step instanceof ReplaceStep) {
            const { from, to, slice } = step; // Access properties specific to ReplaceStep

            // Check if the step affects the trigger position
            if (
                from <= activeTrigger.position &&
                to >= activeTrigger.position
            ) {
                const text = slice.content.textBetween(
                    0,
                    slice.content.size,
                    ''
                );

                // Check if the trigger character has been removed
                // `text` is the text after the step has been applied
                if (!text.includes(activeTrigger.character)) {
                    resetActiveTrigger();
                    sendTriggerEvent(
                        'triggerStop',
                        view,
                        contentConverter,
                        activeTrigger,
                        ''
                    );

                    return true;
                }
            }
        }
    }

    return false;
};
