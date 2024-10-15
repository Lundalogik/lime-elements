import { tableNodes, tableEditing } from 'prosemirror-tables';

export const tableEditingPlugin = tableEditing;

export const getTableNodes = () => {
    return tableNodes({
        tableGroup: 'block',
        cellContent: 'block+',
        cellAttributes: {
            background: {
                default: null,
                getFromDOM: (dom) => {
                    return dom.style.backgroundColor || null;
                },
                setDOMAttr: (value: string, attrs: Record<string, string>) => {
                    if (value) {
                        attrs.style =
                            (attrs.style || '') + `background-color: ${value};`;
                    }
                },
            },
            color: {
                default: null,
                getFromDOM: (dom) => {
                    return dom.style.color || null;
                },
                setDOMAttr: (value: string, attrs: Record<string, string>) => {
                    if (value) {
                        attrs.style = (attrs.style || '') + `color: ${value};`;
                    }
                },
            },
        },
    });
};
