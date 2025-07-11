import { EditorView } from 'prosemirror-view';
import {
    Trigger,
    TriggerEventDetail,
} from '../../../../../text-editor/text-editor.types';
import { ContentTypeConverter } from '../../../../../text-editor/utils/content-type-converter';
import { inserterFactory } from '../inserter';

export const getTriggerEventDetail = (
    view: EditorView,
    contentConverter: ContentTypeConverter,
    trigger: Trigger,
    value: string
): TriggerEventDetail => {
    const returnValue = {
        trigger: trigger.character,
        textEditor: inserterFactory(view, contentConverter, trigger),
        value: value,
    };

    return returnValue;
};
