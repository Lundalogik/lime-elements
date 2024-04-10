import { Dropdown, MenuElement, MenuItem } from 'prosemirror-menu';

const menuItems = [
    'Toggle strong style',
    'Toggle emphasis',
    'Toggle code font',
    'Add or remove link',
    'Insert horizontal rule',
    'Change to paragraph',
    'Change to code block',
    'Change to heading 1',
    'Change to heading 2',
    'Change to heading 3',
    'Change to heading 4',
    'Change to heading 5',
    'Change to heading 6',
    'Undo last change',
    'Redo last undone change',
    'Wrap in block quote',
    'Join with above block',
    'Lift out of enclosing block',
];

export const getFilteredMenu = (menu: MenuElement[]): MenuElement[] => {
    return menu
        .filter((item: MenuElement) => {
            if (isMenuItem(item)) {
                return menuItems.includes(item.spec.title as string);
            } else if (isDropdown(item)) {
                return true;
            }

            return false;
        })
        .filter(Boolean)
        .map((item: MenuElement) => {
            if (isDropdown(item)) {
                return new Dropdown(getFilteredMenu(item.content), {
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
