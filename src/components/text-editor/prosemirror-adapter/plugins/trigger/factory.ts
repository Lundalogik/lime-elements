import { Plugin, PluginKey, EditorState, Transaction } from 'prosemirror-state';
import { ReplaceStep, ReplaceAroundStep } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import { inserterFactory } from './inserter';
import {
    TriggerCharacter,
    TriggerEventDetail,
} from 'src/components/text-editor/text-editor.types';
import { ContentTypeConverter } from '../../../utils/content-type-converter';

const isTrigger = (
    key: string,
    validTriggers: TriggerCharacter[],
): key is TriggerCharacter => {
    return key.length === 1 && validTriggers.includes(key as TriggerCharacter);
};

const shouldTrigger = (state: EditorState): boolean => {
    const { $from } = state.selection;

    if ($from.pos === 1) {
        return true;
    }

    // Getting the position immediately before the current selection
    const prevPos = $from.pos - 1;

    if (prevPos > 0) {
        // allow trigger if the cursor is at the start of a new paragraph
        if ($from.parentOffset === 0) {
            return true;
        }

        const prevChar = state.doc.textBetween(prevPos, $from.pos);

        return prevChar === ' ' || prevChar === '\n';
    }

    return false;
};

const stillHasTrigger = (
    state: EditorState,
    activeTrigger: string,
    triggerPosition: number,
    triggerLength: number,
): boolean => {
    const cursorPosition = state.selection.$from.pos;

    if (
        cursorPosition < triggerPosition ||
        cursorPosition > triggerPosition + triggerLength + 1
    ) {
        return false;
    }

    return (
        state.doc.textBetween(triggerPosition, triggerPosition + 1) ===
        activeTrigger
    );
};

const getTriggerEventDetail = (
    view: EditorView,
    contentConverter: ContentTypeConverter,
    trigger: TriggerCharacter,
    value: string,
): TriggerEventDetail => {
    return {
        trigger: trigger,
        textEditor: inserterFactory(view, contentConverter),
        value: value,
    };
};

const sendTriggerEvent = (
    type: 'triggerStart' | 'triggerStop' | 'triggerChange',
    view: EditorView,
    contentConverter: ContentTypeConverter,
    trigger: TriggerCharacter,
    value: string,
) => {
    const event = new CustomEvent<TriggerEventDetail>(type, {
        detail: getTriggerEventDetail(view, contentConverter, trigger, value),
        bubbles: true,
        composed: true,
    });
    view.dom.dispatchEvent(event);
};

const processTransactions = (
    text: string,
    transactions: Transaction[],
    oldState: EditorState,
): string => {
    let textAdded = '';
    let textRemoved = '';

    transactions.forEach((transaction) => {
        if (transaction.docChanged) {
            transaction.steps.forEach((step) => {
                if (
                    step instanceof ReplaceStep ||
                    step instanceof ReplaceAroundStep
                ) {
                    const slice = step.slice;
                    const fromPos = step.from;
                    const toPos = step.to;

                    if (slice?.size) {
                        // Text added
                        textAdded += slice.content.textBetween(0, slice.size);
                    } else if (fromPos !== toPos) {
                        // Text removed
                        const removedText = oldState.doc.textBetween(
                            fromPos,
                            toPos,
                        );
                        textRemoved += removedText;
                    }
                }
            });
        }
    });

    if (textAdded) {
        text += textAdded;
    } else if (textRemoved) {
        text = text.slice(0, -textRemoved.length);
    }

    return text;
};

export const createTriggerPlugin = (
    triggerCharacters: TriggerCharacter[],
    contentConverter: ContentTypeConverter,
) => {
    let activeTrigger: TriggerCharacter | null = null;
    let triggerText = '';
    let pluginView: EditorView | null = null;
    let triggerPosition: number | null = null;

    const stopTrigger = () => {
        triggerText = '';
        sendTriggerEvent(
            'triggerStop',
            pluginView,
            contentConverter,
            activeTrigger,
            triggerText,
        );
        triggerPosition = null;
        activeTrigger = null;
    };

    const handleKeyDown = (_: EditorView, event: any) => {
        if (event.key === 'Escape') {
            stopTrigger();

            return true;
        }

        return false;
    };

    const handleInput = (view: EditorView, event: any) => {
        const { state } = view;

        if (
            event.inputType === 'insertText' &&
            isTrigger(event.data, triggerCharacters) &&
            shouldTrigger(state)
        ) {
            activeTrigger = event.data;
            triggerText = '';
            triggerPosition = state.selection.$from.pos - triggerText.length;
            sendTriggerEvent(
                'triggerStart',
                view,
                contentConverter,
                activeTrigger,
                triggerText,
            );

            return false;
        }

        return false;
    };

    const appendTransactions = (
        transactions: Transaction[],
        oldState: EditorState,
        newState: EditorState,
    ): Transaction => {
        if (!activeTrigger || !triggerPosition || !pluginView) {
            return;
        }

        if (
            !stillHasTrigger(
                newState,
                activeTrigger,
                triggerPosition,
                triggerText.length,
            )
        ) {
            stopTrigger();

            return;
        }

        const updatedText = processTransactions(
            triggerText,
            transactions,
            oldState,
        );

        if (updatedText !== triggerText) {
            triggerText = updatedText;
            sendTriggerEvent(
                'triggerChange',
                pluginView,
                contentConverter,
                activeTrigger,
                triggerText.slice(1),
            );
        }
    };

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
                    stopTrigger();
                }

                return {};
            },
        },
        props: {
            handleKeyDown: handleKeyDown,
            handleDOMEvents: {
                input: handleInput,
            },
        },
        appendTransaction: appendTransactions,
    });
};
