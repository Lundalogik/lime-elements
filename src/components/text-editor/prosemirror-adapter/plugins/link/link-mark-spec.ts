import { MarkSpec, DOMOutputSpec } from 'prosemirror-model';

export interface LinkMarkAttrs {
    href: string;
    title: string | null;
    target: string | null;
    rel: string | null;
    referrerpolicy: string | null;
}

export const linkMarkSpec: MarkSpec = {
    attrs: {
        href: { default: '' },
        title: { default: null },
        target: { default: null },
        rel: { default: null },
        referrerpolicy: { default: null },
    },
    inclusive: false,
    parseDOM: [
        {
            tag: 'a[href]',
            getAttrs: (dom: HTMLElement): LinkMarkAttrs => {
                return {
                    href: dom.getAttribute('href') || '',
                    title: dom.getAttribute('title'),
                    target: dom.getAttribute('target'),
                    rel: dom.getAttribute('rel'),
                    referrerpolicy: dom.getAttribute('referrerpolicy'),
                };
            },
        },
    ],
    toDOM: (mark): DOMOutputSpec => {
        const target = mark.attrs.target || null;

        const securityAttrs = {
            rel: target === '_blank' ? 'noopener noreferrer' : null,
            referrerpolicy: target === '_blank' ? 'noreferrer' : null,
        };

        return ['a', { ...mark.attrs, ...securityAttrs }, 0];
    },
};
