import { tableNodes, tableEditing } from 'prosemirror-tables';
import { Plugin } from 'prosemirror-state';

export const getTableEditingPlugins = (tablesEnabled: boolean): Plugin[] => {
    if (tablesEnabled) {
        return [tableEditing()];
    }

    return [];
};

const createStyleAttribute = (cssProperty: string) => ({
    default: null,
    getFromDOM: (dom: HTMLElement) => dom.style[cssProperty] || null,
    setDOMAttr: (value: string, attrs: Record<string, any>) => {
        if (value) {
            attrs.style = (attrs.style || '') + `${cssProperty}: ${value};`;
        }
    },
});

export const getTableNodes = () => {
    return tableNodes({
        tableGroup: 'block',
        cellContent: 'block+',
        cellAttributes: {
            background: createStyleAttribute('background-color'),
            color: createStyleAttribute('color'),
        },
    });
};
