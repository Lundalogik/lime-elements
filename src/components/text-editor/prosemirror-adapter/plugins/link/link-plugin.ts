import { Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Mark } from 'prosemirror-model';
import { EditorMenuTypes, MouseButtons } from '../../menu/types';
import { EditorLink } from '../../../text-editor.types';

export const linkPluginKey = new PluginKey('linkPlugin');

export type UpdateLinkCallback = (text: string, href: string) => void;

const updateLink = (
    view: EditorView,
    updateLinkCallback?: UpdateLinkCallback
) => {
    const { from, to } = view.state.selection;

    let text = '';
    let href = '';
    view.state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.type.name !== 'text') {
            return;
        }

        const fromInNode = Math.max(0, from - pos);
        const toInNode = Math.min(node.text.length, to - pos);

        text += node.text.slice(fromInNode, toInNode);

        // eslint-disable-next-line unicorn/no-array-for-each
        node.marks.forEach((mark: Mark) => {
            if (mark.type.name === 'link') {
                href = mark.attrs.href;
            }
        });
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
                    mark.attrs.href === href
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
                    mark.attrs.href === href
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
    const node = view.state.doc.nodeAt(pos?.pos);
    if (!node) {
        return null;
    }

    const linkMark = node.marks.find(
        (mark) => mark.type.name === EditorMenuTypes.Link
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
    const event = new CustomEvent<EditorLink>('open-editor-link-menu', {
        detail: { href: href, text: text },
        bubbles: true,
        composed: true,
    });
    view.dom.dispatchEvent(event);
};

let lastClickTime = 0;
const DOUBLE_CLICK_DELAY = 200;
let clickTimeout;

const processClickEvent = (view: EditorView, event: MouseEvent): boolean => {
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
                TextSelection.create(view.state.doc, from, to)
            );
            view.dispatch(transaction);
            openLinkMenu(view, href, text);
        }
    }, DOUBLE_CLICK_DELAY);

    return true;
};

export const createLinkPlugin = (updateLinkCallback?: UpdateLinkCallback) => {
    return new Plugin({
        key: linkPluginKey,
        props: {
            handleDOMEvents: {
                mousedown: (view, event) => {
                    if (
                        (event.metaKey || event.ctrlKey) &&
                        event.button === 0
                    ) {
                        return processModClickEvent(view, event);
                    }

                    if (event.button !== MouseButtons.Right) {
                        // We want to ignore right-clicks
                        return processClickEvent(view, event);
                    }

                    return true;
                },
                click: (_view, event) => {
                    if (!(event.target instanceof HTMLElement)) {
                        return;
                    }

                    // Prevent unhandled navigation and bubbling for link clicks
                    const link = event.target.closest('a');
                    if (link) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
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
