import { EditorView } from 'prosemirror-view';
import { Trigger } from '../../../../../text-editor/text-editor.types';
import { ContentTypeConverter } from '../../../../../text-editor/utils/content-type-converter';
import { sendTriggerEvent } from './send-trigger-event';

export const monitorTriggeredText = (
    doc: any,
    activeTrigger: Trigger,
    cursorPosition: number,
    contentConverter: ContentTypeConverter,
    view: EditorView,
): string => {
    let newValue = '';
    if (cursorPosition > activeTrigger.position) {
        // Start extracting text after the trigger character
        newValue = doc.textBetween(
            activeTrigger.position + 1,
            cursorPosition,
            '',
        );
    }

    sendTriggerEvent(
        'triggerChange',
        view,
        contentConverter,
        activeTrigger,
        newValue,
    );

    return newValue;
};
