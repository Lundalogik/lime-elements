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

const TWO = 2;

const isTrigger = (
    char: string,
    validTriggers: TriggerCharacter[] | TriggerCharacter,
): char is TriggerCharacter => {
    return (
        char.length === 1 && validTriggers.includes(char as TriggerCharacter)
    );
};

const isWhitespace = (char: string): boolean => /\s/.test(char);

// const hasSingleWhitespace = (text: string): boolean => {
//     // Only one whitespace allowed between words within a trigger query
//     return text.trim().split(/\s+/).length <= TWO;
// };

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

export const findTriggerPosition = (
    state: EditorState,
    triggerCharacters: TriggerCharacter[] | TriggerCharacter,
): { trigger: TriggerCharacter; position: number } | null => {
    if (!triggerCharacters) {
        return null;
    }

    const { $from } = state.selection;
    let position = $from.pos;

    while (position > 0) {
        const currentChar = state.doc.textBetween(position - 1, position);

        if (isTrigger(currentChar, triggerCharacters)) {
            const previousPosition = position - TWO;
            let charBeforeTrigger: string | null = null;
            if (previousPosition >= 0) {
                charBeforeTrigger = state.doc.textBetween(
                    previousPosition, previousPosition + 1
                );
            }

            if (
                (charBeforeTrigger && isWhitespace(charBeforeTrigger)) ||
                isAtStartOfBlock(state.doc.resolve(position - 1))
            ) {
                return {
                    trigger: currentChar as TriggerCharacter,
                    position: position - 1,
                };
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
                    getPreviousCharacter(state.doc.resolve($from.pos - 1)),
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
        textEditor: inserterFactory(view, contentConverter, trigger),
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

    const stopTrigger = () => {
        sendTriggerEvent(
            'triggerStop',
            pluginView,
            contentConverter,
            activeTrigger,
            triggerText,
        );
        triggerText = '';
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
            activeTrigger = event.data as TriggerCharacter;

            triggerText = '';
            sendTriggerEvent(
                'triggerStart',
                view,
                contentConverter,
                activeTrigger,
                triggerText,
            );

            return true;
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
        const trigger: TriggerCharacter = foundTrigger?.trigger;

        if (activeTrigger && trigger === activeTrigger) {
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
                    triggerText,
                );
            }
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
