import { Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Mark, Fragment, Node, Schema } from 'prosemirror-model';
import { EditorMenuTypes, MouseButtons } from '../../menu/types';
import { EditorLink } from '../../../text-editor.types';
import { getLinkAttributes } from './utils';

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

/**
 * Regular expression for matching URLs, mailto links, and phone links
 */
const URL_REGEX = /(https?:\/\/[^\s<>"']+|mailto:[^\s<>"']+|tel:[^\s<>"']+)/g;

/**
 * Checks if the text contains any URLs, mailto links, or phone links
 * @param text
 */
const hasUrls = (text: string): boolean => {
    // Reset regex before use
    URL_REGEX.lastIndex = 0;

    return URL_REGEX.test(text);
};

/**
 * Creates a text node with the provided content
 * @param schema
 * @param content
 */
const createTextNode = (schema: Schema, content: string): Node => {
    return schema.text(content);
};

/**
 * Creates a link node with the provided URL
 * @param schema
 * @param url
 */
const createLinkNode = (schema: Schema, url: string): Node => {
    const linkMark = schema.marks.link.create(getLinkAttributes(url, url));

    return schema.text(url, [linkMark]);
};

/**
 * Finds all link matches in the provided text
 * @param text
 */
const findLinkMatches = (
    text: string
): Array<{ url: string; start: number; end: number }> => {
    const matches = [];
    let match: RegExpExecArray | null;

    // Reset regex before use
    URL_REGEX.lastIndex = 0;

    while ((match = URL_REGEX.exec(text)) !== null) {
        matches.push({
            url: match[0],
            start: match.index,
            end: match.index + match[0].length,
        });
    }

    return matches;
};

/**
 * Creates text nodes with links for any URLs, mailto links, or phone links found in the text
 * @param text
 * @param schema
 */
const createNodesWithLinks = (text: string, schema: Schema): Node[] => {
    const nodes: Node[] = [];
    const matches = findLinkMatches(text);

    if (matches.length === 0) {
        // No links found, just return the text as a single node
        return [createTextNode(schema, text)];
    }

    let lastIndex = 0;

    // Process each match
    for (const match of matches) {
        // Add text before the current link if any
        if (match.start > lastIndex) {
            nodes.push(
                createTextNode(schema, text.slice(lastIndex, match.start))
            );
        }

        // Add the link node
        nodes.push(createLinkNode(schema, match.url));

        lastIndex = match.end;
    }

    // Add any remaining text after the last link
    if (lastIndex < text.length) {
        nodes.push(createTextNode(schema, text.slice(lastIndex)));
    }

    return nodes;
};

/**
 * Pastes nodes at the current selection
 * @param view - The editor view
 * @param nodes - Array of nodes to paste
 */
const pasteAsLink = (view: EditorView, nodes: Node[]) => {
    if (nodes.length === 0) {
        return;
    }

    if (isSingleLinkNode(nodes)) {
        insertSingleLink(view, nodes[0]);
    } else {
        insertNodeFragment(view, nodes);
    }
};

/**
 * Checks if the nodes array contains just a single link node
 * @param nodes
 */
const isSingleLinkNode = (nodes: Node[]): boolean => {
    if (nodes.length !== 1) {
        return false;
    }

    const node = nodes[0];

    // Must be text with non-empty content
    if (!node.isText || !node.text || node.text.trim() === '') {
        return false;
    }

    // Must have a link mark (even if there are other marks, we just care about link presence)
    return node.marks.some((mark) => mark.type.name === 'link');
};

/**
 * Inserts a single link node, applying it to selected text if present
 * @param view
 * @param linkNode
 */
const insertSingleLink = (view: EditorView, linkNode: Node) => {
    const { state, dispatch } = view;
    const { from, to } = state.selection;

    const linkMark = linkNode.marks.find((mark) => mark.type.name === 'link');

    // Use selected text if there's a selection, otherwise use the URL
    const selectedText =
        state.doc.textBetween(from, to, ' ') || linkMark.attrs.href;

    // Insert the text and add the link mark
    dispatch(
        state.tr
            .insertText(selectedText, from, to)
            .addMark(from, from + selectedText.length, linkMark)
    );
};

/**
 * Inserts multiple nodes as a fragment at the current selection
 * @param view - The editor view
 * @param nodes - Array of nodes to insert
 */
const insertNodeFragment = (view: EditorView, nodes: Node[]) => {
    const { state, dispatch } = view;
    const { from, to } = state.selection;

    // Create a fragment from the array of nodes
    const fragment = Fragment.fromArray(nodes);

    // Replace the current selection with the fragment
    dispatch(state.tr.replaceWith(from, to, fragment));
};

/**
 * Handles pasted content, converting URLs to links
 * @param view
 * @param event
 */
const processPasteEvent = (
    view: EditorView,
    event: ClipboardEvent
): boolean => {
    const text = event.clipboardData?.getData('text/plain');
    if (!text || !hasUrls(text)) {
        return false;
    }

    const nodes = createNodesWithLinks(text, view.state.schema);
    pasteAsLink(view, nodes);

    return true;
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
