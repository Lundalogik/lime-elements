/* eslint-disable sonarjs/no-invariant-returns */
import { EditorView } from 'prosemirror-view';
import { sendTriggerEvent } from './send-trigger-event';
import {
    Trigger,
    TriggerCharacter,
} from 'src/components/text-editor/text-editor.types';
import { ContentTypeConverter } from '../../../../utils/content-type-converter';

export const getTextInputHandler = (
    contentConverter: ContentTypeConverter,
    triggerCharacters: TriggerCharacter[],
    updateActiveTrigger: (trigger: Trigger | null) => void,
) => {
    return (
        view: EditorView,
        _from: number,
        _to: number,
        text: string,
    ): boolean => {
        if (!triggerCharacters.includes(text as TriggerCharacter)) {
            return false;
        }

        const doc = view.state.doc;
        const precedingText = doc.textBetween(_from - 1, _from, '');

        if (/\s/.test(precedingText) || precedingText === '') {
            const trigger = {
                character: text as TriggerCharacter,
                position: _from,
            };

            updateActiveTrigger(trigger);
            sendTriggerEvent(
                'triggerStart',
                view,
                contentConverter,
                trigger,
                text,
            );
        }

        return false;
    };
};
