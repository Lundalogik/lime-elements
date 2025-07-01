import { Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
    Trigger,
    TriggerCharacter,
} from '../../../../text-editor/text-editor.types';
import { ContentTypeConverter } from '../../../utils/content-type-converter';
import { getTextInputHandler } from './factory-helpers/text-input-handler';
import { getAppendTransactionHandler } from './factory-helpers/append-transaction-handler';
import { sendTriggerEvent } from './factory-helpers/send-trigger-event';

export const createTriggerPlugin = (
    triggerCharacters: TriggerCharacter[],
    contentConverter: ContentTypeConverter
) => {
    let pluginView: EditorView | null = null;
    let activeTrigger: Trigger | null = null;

    const getCurrentView = () => {
        return pluginView;
    };

    const getActiveTrigger = () => {
        return activeTrigger;
    };

    const resetActiveTrigger = () => {
        activeTrigger = null;
    };

    const updateActiveTrigger = (trigger: Trigger) => {
        activeTrigger = trigger;
    };

    const textInputHandler = getTextInputHandler(
        contentConverter,
        triggerCharacters,
        updateActiveTrigger
    );

    const appendTransactionHandler = getAppendTransactionHandler(
        getCurrentView,
        getActiveTrigger,
        resetActiveTrigger,
        contentConverter
    );

    return new Plugin({
        key: new PluginKey('triggerPlugin'),
        view: (view: EditorView) => {
            pluginView = view;

            return {};
        },
        state: {
            init: () => {
                return {};
            },
            apply: (transaction: Transaction) => {
                if (transaction.getMeta('stopTrigger')) {
                    sendTriggerEvent(
                        'triggerStop',
                        pluginView,
                        contentConverter,
                        activeTrigger,
                        ''
                    );
                    resetActiveTrigger();
                }

                return {};
            },
        },
        props: {
            handleTextInput: textInputHandler,
        },
        appendTransaction: appendTransactionHandler,
    });
};
