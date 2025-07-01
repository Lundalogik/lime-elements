import { EditorView } from 'prosemirror-view';
import {
    Trigger,
    TriggerEventDetail,
} from '../../../../../text-editor/text-editor.types';
import { ContentTypeConverter } from '../../../../utils/content-type-converter';
import { getTriggerEventDetail } from './get-trigger-event-detail';

export const sendTriggerEvent = (
    type: 'triggerStart' | 'triggerStop' | 'triggerChange',
    view: EditorView,
    contentConverter: ContentTypeConverter,
    trigger: Trigger,
    value: string
) => {
    const event = new CustomEvent<TriggerEventDetail>(type, {
        detail: getTriggerEventDetail(view, contentConverter, trigger, value),
        bubbles: true,
        composed: true,
    });
    view.dom.dispatchEvent(event);
};
