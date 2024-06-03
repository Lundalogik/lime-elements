import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { schema } from 'prosemirror-schema-basic';
import { Mark } from 'prosemirror-model';
import { isExternalLink, isValidUrl } from '../menu/menu-commands';

export const linkPluginKey = new PluginKey('linkPlugin');

export type UpdateLinkCallback = (text: string, href: string) => void;

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

export const createLinkPlugin = (updateLinkCallback?: UpdateLinkCallback) => {
    return new Plugin({
        key: linkPluginKey,
        props: {
            handlePaste: (view, event) => {
                return processPasteEvent(view, event);
            },
        },
        view: () => ({
            update: (view) => {
                updateLink(view, updateLinkCallback);
            },
        }),
    });
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
