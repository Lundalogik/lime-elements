import { Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { schema } from 'prosemirror-schema-basic';
import { Mark } from 'prosemirror-model';
import { isExternalLink, isValidUrl } from '../menu/menu-commands';
import { EditorMenuTypes } from '../menu/types';

export const linkPluginKey = new PluginKey('linkPlugin');

export type UpdateLinkCallback = (text: string, href: string) => void;

export interface EditorLinkMenuEventDetail {
    href: string;
    text: string;
}

const updateLink = (
    view: EditorView,
    updateLinkCallback?: UpdateLinkCallback,
) => {
    const { from, to } = view.state.selection;

    let text = '';
    let href = '';
    view.state.doc.nodesBetween(from, to, (node) => {
        if (node.type.name === 'text') {
            text = node.text;
            node.marks.forEach((mark: Mark) => {
                if (mark.type.name === 'link') {
                    href = mark.attrs.href;
                }
            });
        }
    });

    if (updateLinkCallback) {
        updateLinkCallback(text, href);
    }
};

/**
 * Finds the start position of the link node ensuring the href matches the original link's href.
 * @param doc - The ProseMirror document.
 * @param pos - The position to start searching from.
 * @param href - The href attribute of the original link mark.
 * @returns The start position of the link node.
 */
const findStart = (doc, pos, href) => {
    while (pos > 0) {
        const node = doc.nodeAt(pos - 1);
        if (
            !node?.isText ||
            !node.marks.some(
                (mark: Mark) =>
                    mark.type.name === EditorMenuTypes.Link &&
                    mark.attrs.href === href,
            )
        ) {
            break;
        }

        pos--;
    }

    return pos;
};

/**
 * Finds the end position of the link node ensuring the href matches the original link's href.
 * @param doc - The ProseMirror document.
 * @param pos - The position to start searching from.
 * @param href - The href attribute of the original link mark.
 * @returns The end position of the link node.
 */
const findEnd = (doc, pos, href) => {
    while (pos < doc.content.size) {
        const node = doc.nodeAt(pos);
        if (
            !node?.isText ||
            !node.marks.some(
                (mark) =>
                    mark.type.name === EditorMenuTypes.Link &&
                    mark.attrs.href === href,
            )
        ) {
            break;
        }

        pos++;
    }

    return pos;
};

/**
 * Gets the link data at the specified position.
 * @param view - The ProseMirror editor view.
 * @param event - The mouse event.
 * @returns An object containing the link data or null if no link is found.
 */
const getLinkDataAtPosition = (view: EditorView, event: MouseEvent) => {
    const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
    const node = view.state.doc.nodeAt(pos.pos);
    if (!node) {
        return null;
    }

    const linkMark = node.marks.find(
        (mark) => mark.type.name === EditorMenuTypes.Link,
    );
    if (!linkMark) {
        return null;
    }

    const href = linkMark.attrs.href;
    const from = findStart(view.state.doc, pos.pos, href);
    const to = findEnd(view.state.doc, pos.pos, href);
    const text = view.state.doc.textBetween(from, to, ' ');

    return { href: href, text: text, from: from, to: to };
};

const processModClickEvent = (view: EditorView, event: MouseEvent): boolean => {
    const { href } = getLinkDataAtPosition(view, event);
    if (href) {
        window.open(href, '_blank');

        return true;
    }

    return false;
};

const openLinkMenu = (view: EditorView, href: string, text: string) => {
    const event = new CustomEvent<EditorLinkMenuEventDetail>(
        'open-editor-link-menu',
        {
            detail: { href: href, text: text },
            bubbles: true,
            composed: true,
        },
    );
    view.dom.dispatchEvent(event);
};

let lastClickTime = 0;
const DOUBLE_CLICK_DELAY = 200;
let clickTimeout;

const processDoubleClickEvent = (
    view: EditorView,
    event: MouseEvent,
): boolean => {
    const now = Date.now();

    if (now - lastClickTime < DOUBLE_CLICK_DELAY) {
        clearTimeout(clickTimeout);
        lastClickTime = now; // Reset lastClickTime to prevent single-click action

        return false;
    }

    lastClickTime = now;

    clickTimeout = setTimeout(() => {
        const linkData = getLinkDataAtPosition(view, event);
        if (linkData) {
            const { href, text, from, to } = linkData;
            const transaction = view.state.tr.setSelection(
                TextSelection.create(view.state.doc, from, to),
            );
            view.dispatch(transaction);
            openLinkMenu(view, href, text);
        }
    }, DOUBLE_CLICK_DELAY);

    return true;
};

const processPasteEvent = (
    view: EditorView,
    event: ClipboardEvent,
): boolean => {
    const clipboardData = event.clipboardData;
    if (!clipboardData) {
        return false;
    }

    const text = clipboardData.getData('text/plain');

    if (!isValidUrl(text)) {
        return false;
    }

    pasteAsLink(view, text);

    return true;
};

const pasteAsLink = (view: EditorView, href: string) => {
    const { state, dispatch } = view;
    const { from, to } = state.selection;
    const linkMark = schema.marks.link.create({
        href: href,
        title: href,
        target: isExternalLink(href) ? '_blank' : null,
    });
    const selectedText = state.doc.textBetween(from, to, ' ') || href;
    const transaction = state.tr
        .insertText(selectedText, from, to)
        .addMark(from, from + selectedText.length, linkMark);

    dispatch(transaction);
};

export const createLinkPlugin = (updateLinkCallback?: UpdateLinkCallback) => {
    return new Plugin({
        key: linkPluginKey,
        props: {
            handlePaste: (view, event) => {
                return processPasteEvent(view, event);
            },
            handleDOMEvents: {
                mousedown: (view, event) => {
                    if (
                        (event.metaKey || event.ctrlKey) &&
                        event.button === 0
                    ) {
                        return processModClickEvent(view, event);
                    }

                    return processDoubleClickEvent(view, event);
                },
            },
        },
        view: () => ({
            update: (view) => {
                updateLink(view, updateLinkCallback);
            },
        }),
    });
};
