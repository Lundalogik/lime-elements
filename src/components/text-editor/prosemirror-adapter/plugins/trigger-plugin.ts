import { ListItem } from 'src/components/list/list-item.types';

import { Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { ReplaceStep, ReplaceAroundStep } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import { handleFullStopInput } from '../../utils/handle-keydown-utils/handle-full-stop';

export const triggerPluginKey = new PluginKey('triggerPlugin');

type Trigger = '@' | '#';

const triggers: Trigger[] = ['@', '#'];

type Saver = 'Tab';

const savers: Saver[] = ['Tab'];

const isTrigger = (key: string): key is Trigger => {
    return triggers.includes(key as Trigger);
};

const isSaver = (key: string): key is Saver => {
    return savers.includes(key as Saver);
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
) => {
    return (
        state.doc.textBetween(triggerPosition, triggerPosition + 1) ===
        activeTrigger
    );
};

const openPicker = (view: EditorView) => {
    const event = new CustomEvent<void>('open-picker', {
        bubbles: true,
        composed: true,
    });
    view.dom.dispatchEvent(event);
};

const closePicker = (view: EditorView) => {
    const event = new CustomEvent<void>('close-picker', {
        bubbles: true,
        composed: true,
    });
    view.dom.dispatchEvent(event);
};

const emitQueryString = (view: EditorView, query: string) => {
    const event = new CustomEvent<string>('mention-picker-change', {
        detail: query,
        bubbles: true,
        composed: true,
    });
    view.dom.dispatchEvent(event);
};

const emitSaver = (view: EditorView) => {
    const event = new CustomEvent<void>('mention-picker-saver', {
        bubbles: true,
        composed: true,
    });
    view.dom.dispatchEvent(event);
};

export const createMarker = (
    event: CustomEvent<ListItem>,
    view: EditorView,
    query: string,
    selectedItem?: ListItem,
) => {
    event.stopImmediatePropagation();
    event.preventDefault();

    const { state, dispatch } = view;
    const { schema, selection } = state;
    const { $from } = selection;

    // Find the position of the @ symbol
    const startPos = $from.pos - query.length;

    const textLength = selectedItem?.text?.length || 0;

    const mentionNode = schema.nodes.mention.create({
        type: selectedItem?.secondaryText || 'coworker',
        id: selectedItem?.value || 'some-id',
        name: query.length < textLength ? selectedItem?.text : query,
    });

    // add a blank space after the mention
    const spaceNode = schema.text(' ');

    const fragment = schema.nodes.doc.create(null, [mentionNode, spaceNode]);

    const transaction = state.tr.replaceWith(startPos - 1, $from.pos, fragment);
    dispatch(transaction);
};

export const createTriggerPlugin = () => {
    let activeTrigger: Trigger | null = null; // Track the active trigger type
    let queryString = ''; // queryString to track the input after a trigger
    let pluginView: EditorView | null = null;
    let triggerPosition: number | null = null;

    return new Plugin({
        key: triggerPluginKey,
        view: (view: EditorView) => {
            pluginView = view;

            view.dom.addEventListener(
                'item-selected',
                (event: CustomEvent<ListItem>) => {
                    const selectedItem = event.detail;
                    createMarker(
                        event,
                        view,
                        queryString.slice(1),
                        selectedItem,
                    );
                },
            );

            return {
                destroy: () => {
                    if (pluginView) {
                        pluginView.dom.removeEventListener(
                            'item-selected',
                            (event: CustomEvent<ListItem>) => {
                                const selectedItem = event.detail;
                                createMarker(
                                    event,
                                    pluginView as EditorView,
                                    queryString.slice(1),
                                    selectedItem,
                                );
                            },
                        );
                        pluginView = null;
                    }
                },
            };
        },
        props: {
            handleKeyDown: (view, event) => {
                const { state } = view;

                if (event.key === 'Escape') {
                    closePicker(view);
                    activeTrigger = null;
                    queryString = '';

                    return true;
                }

                if (isTrigger(event.key) && shouldTrigger(state)) {
                    activeTrigger = event.key;
                    queryString = '';
                    triggerPosition =
                        state.selection.$from.pos - queryString.length;
                    openPicker(view);

                    return false;
                }

                if (
                    (activeTrigger && event.key === 'ArrowUp') ||
                    event.key === 'ArrowDown'
                ) {
                    event.preventDefault();

                    const scrollEvent = new CustomEvent('picker-scroll', {
                        detail: {
                            direction: event.key === 'ArrowUp' ? 'up' : 'down',
                        },
                        bubbles: true,
                        composed: true,
                    });
                    view.dom.dispatchEvent(scrollEvent);

                    return true;
                }

                if (activeTrigger && isSaver(event.key)) {
                    event.preventDefault();
                    activeTrigger = null;
                    triggerPosition = null;
                    emitSaver(view);
                    closePicker(view);
                    queryString = '';

                    return true;
                }

                if (event.key === '.') {
                    return handleFullStopInput(view, event);
                }

                return false;
            },
        },
        appendTransaction: (transactions, oldState, newState) => {
            if (!transactions.some((transaction) => transaction.docChanged)) {
                return null;
            }

            if (activeTrigger && pluginView) {
                let textAdded = '';
                let textRemoved = '';
                const hasTrigger = stillHasTrigger(
                    newState,
                    activeTrigger,
                    triggerPosition,
                );

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

                                if (slice && slice.size) {
                                    // Text added
                                    textAdded += slice.content.textBetween(
                                        0,
                                        slice.size,
                                    );
                                } else if (fromPos !== toPos) {
                                    // Text removed
                                    const removedText =
                                        oldState.doc.textBetween(
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
                    queryString += textAdded;
                    emitQueryString(pluginView, queryString.slice(1));
                }

                if (textRemoved) {
                    queryString = queryString.slice(0, -textRemoved.length);
                    emitQueryString(pluginView, queryString.slice(1));
                }

                if (!hasTrigger) {
                    closePicker(pluginView);
                    activeTrigger = null;
                    queryString = '';
                    triggerPosition = null;

                    return null;
                }
            }

            return null;
        },
    });
};
