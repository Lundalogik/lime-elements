import { NodeSpec } from 'prosemirror-model';

export const taskListNodeSpec: NodeSpec = {
    content: 'task_list_item+',
    group: 'block',
    parseDOM: [
        {
            tag: 'ul.task-list',
            getAttrs: (dom) => {
                if (dom instanceof HTMLElement) {
                    return {};
                }
                return false;
            },
        },
        {
            tag: 'ul.contains-task-list',
            getAttrs: (dom) => {
                if (dom instanceof HTMLElement) {
                    return {};
                }
                return false;
            },
        },
    ],
    toDOM: () => ['ul', { class: 'task-list' }, 0],
};

export const taskListItemNodeSpec: NodeSpec = {
    content: 'paragraph',
    attrs: {
        checked: { default: false },
    },
    parseDOM: [
        {
            tag: 'li.task-list-item',
            getAttrs: (dom) => {
                if (dom instanceof HTMLElement) {
                    const checkbox = dom.querySelector(
                        'input[type="checkbox"]'
                    );
                    return {
                        checked: checkbox
                            ? (checkbox as HTMLInputElement).checked
                            : false,
                    };
                }
                return false;
            },
        },
    ],
    toDOM: (node) => {
        const { checked } = node.attrs;
        return [
            'li',
            { class: 'task-list-item' },
            [
                'input',
                {
                    type: 'checkbox',
                    checked: checked ? 'checked' : null,
                    disabled: 'disabled', // Make checkbox non-interactive in HTML output
                },
            ],
            ['div', { class: 'task-list-item-content' }, 0],
        ];
    },
    defining: true,
};
