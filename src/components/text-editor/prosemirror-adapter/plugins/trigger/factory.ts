import { Plugin, PluginKey, EditorState, Transaction } from 'prosemirror-state';
import { ReplaceStep, ReplaceAroundStep } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import { inserterFactory } from './inserter';
import {
    TriggerCharacter,
    TriggerEventDetail,
} from 'src/components/text-editor/text-editor.types';
import { ContentTypeConverter } from '../../../utils/content-type-converter';
import { ResolvedPos } from 'prosemirror-model';
import { ESCAPE } from 'src/util/keycodes';

const isTrigger = (
    key: string,
    validTriggers: TriggerCharacter[],
): key is TriggerCharacter => {
    return key.length === 1 && validTriggers.includes(key as TriggerCharacter);
};

const isWhitespace = (char: string): boolean => /\s/.test(char);

const isAtStartOfBlock = ($pos: ResolvedPos): boolean => {
    return $pos.parentOffset === 0 || $pos.parentOffset === 1;
};

const getPreviousCharacter = ($from: ResolvedPos): string | null => {
    if ($from.parentOffset === 0) {
        return null;
    }

    const nodeBefore = $from.nodeBefore;

    if (!nodeBefore) {
        return null;
    }

    if (nodeBefore.isText) {
        const text = nodeBefore.text;
        if (text && text.length > 0) {
            return text.charAt(text.length - 1);
        }
    } else if (nodeBefore.type.name === 'hard_break') {
        return '\n';
    } else if (nodeBefore.isInline) {
        return '\uFFFC';
    }

    // Default case for unsupported nodes
    return null;
};


const findTriggerPosition = (
    state: EditorState,
    triggerCharacters: TriggerCharacter[],
): { trigger: TriggerCharacter; position: number } | null => {
    const { $from } = state.selection;
    let position = $from.pos;

    while (position > 0) {
        const charBefore = state.doc.textBetween(position - 1, position);

        if (isTrigger(charBefore, triggerCharacters)) {
            const previousPosition = position - 2; // Position of the character before the trigger
            const charBeforeTrigger =
                previousPosition >= 0
                    ? state.doc.textBetween(previousPosition, previousPosition + 1)
                    : null;

            if (
                (charBeforeTrigger && isWhitespace(charBeforeTrigger)) ||
                isAtStartOfBlock(state.doc.resolve(position - 1))
            ) {
                return { trigger: charBefore as TriggerCharacter, position: position - 1 };
            }
        }

        position -= 1;

        // Stop if we reach the start of the block
        const parentNodeStart = $from.start($from.depth);
        if (position <= parentNodeStart) {
            break;
        }
    }

    return null;
};


const shouldTrigger = (
    state: EditorState,
    triggerCharacters: TriggerCharacter[],
): boolean => {
    const { $from } = state.selection;

    if (!state.selection.empty) {
        return false;
    }

    // If cursor is at the very start of the document or block, trigger
    if ($from.pos === 0 || isAtStartOfBlock($from)) {
        return true;
    }

    const prevChar = getPreviousCharacter($from);

    return (
        prevChar === null ||
        isWhitespace(prevChar) ||
        (isTrigger(prevChar, triggerCharacters) &&
            (getPreviousCharacter(state.doc.resolve($from.pos - 1)) === null ||
                isWhitespace(
                    getPreviousCharacter(state.doc.resolve($from.pos - 1))
                )))
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
        if (event.key === ESCAPE) {
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
            shouldTrigger(state, triggerCharacters)
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
        if (!pluginView) {
            return;
        }

        const foundTrigger = findTriggerPosition(newState, triggerCharacters);

        if (foundTrigger) {
            const { trigger, position } = foundTrigger;

            if (
                activeTrigger &&
                position === triggerPosition &&
                trigger === activeTrigger
            ) {
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
            } else {
                // Start a new trigger
                activeTrigger = trigger;
                triggerPosition = position;
                triggerText = newState.doc.textBetween(
                    triggerPosition,
                    newState.selection.from,
                );

                sendTriggerEvent(
                    'triggerStart',
                    pluginView,
                    contentConverter,
                    activeTrigger,
                    triggerText.slice(1),
                );
            }
        } else if (activeTrigger) {
            stopTrigger();
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
