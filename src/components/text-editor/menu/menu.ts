import { Dropdown, MenuElement, MenuItem } from 'prosemirror-menu';
import { EditorButton } from './types';

const defaultItems: Record<EditorButton, string> = {
    strong: 'Toggle strong style',
    emphasis: 'Toggle emphasis',
    code: 'Toggle code font',
    link: 'Add or remove link',
    'horizontal rule': 'Insert horizontal rule',
    paragraph: 'Change to paragraph',
    'code block': 'Change to code block',
    'heading 1': 'Change to heading 1',
    'heading 2': 'Change to heading 2',
    'heading 3': 'Change to heading 3',
    'heading 4': 'Change to heading 4',
    'heading 5': 'Change to heading 5',
    'heading 6': 'Change to heading 6',
    undo: 'Undo last change',
    redo: 'Redo last undone change',
    'block quote': 'Wrap in block quote',
    'join above': 'Join with above block',
    'lift out': 'Lift out of enclosing block',
};

export const getFilteredMenu = (
    menu: MenuElement[],
    items: EditorButton[] | undefined,
): MenuElement[] => {
    let menuItems: string[];

    if (items === undefined) {
        menuItems = Object.values(defaultItems);
    } else {
        menuItems = items.map((item: EditorButton) => defaultItems[item]);
    }

    return menu
        .filter((item: MenuElement) => {
            if (isMenuItem(item)) {
                return Object.values(menuItems).includes(
                    item.spec.title as string,
                );
            } else if (isDropdown(item)) {
                return true;
            }

            return false;
        })
        .filter(Boolean)
        .map((item: MenuElement) => {
            if (isDropdown(item)) {
                return new Dropdown(getFilteredMenu(item.content, items), {
                    label: item.label,
                });
            }

            return item;
        });
};

const isMenuItem = (item: any): item is MenuItem => {
    return item.spec !== undefined;
};

const isDropdown = (
    item: any,
): item is Dropdown & { content: MenuItem[]; label: string } => {
    return item.content !== undefined;
};
