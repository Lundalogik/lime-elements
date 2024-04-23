import { Dropdown, MenuElement, MenuItem } from 'prosemirror-menu';
import { EditorButton, EditorPluginButton } from './types';

/**
 * The available items for the editor toolbar
 * The values must match the titles of the menuItem
 *
 * {@link MenuItem.spec}
 */
const allItems: Record<EditorButton, string> = {
    strong: 'Toggle strong style',
    emphasis: 'Toggle emphasis',
    code: 'Toggle code font',
    link: 'Add or remove link',
    'horizontal rule': 'hr',
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
    'bullet list': 'Wrap in bullet list',
    'ordered list': 'Wrap in ordered list',
    'block quote': 'Wrap in block quote',
    'join above': 'Join with above block',
    'lift out': 'Lift out of enclosing block',
};

const defaultItems: EditorButton[] = [
    'strong',
    'emphasis',
    'link',
    'heading 1',
    'heading 2',
    'heading 3',
    'heading 4',
    'heading 5',
    'heading 6',
    'block quote',
    'bullet list',
    'ordered list',
];

/**
 * Filters the full menu recursively based on the items provided
 *
 * @param menu - The menu to filter
 * @param items - The menu items to display. If undefined, all items will be displayed
 * @returns The filtered menu
 */
export const getFilteredMenu = (
    menu: MenuElement[],
    items: EditorPluginButton[] | undefined,
): MenuElement[] => {
    let menuItems: string[] = defaultItems.map(
        (item: EditorButton) => allItems[item],
    );

    if (items !== undefined) {
        menuItems = menuItems.concat(
            items.map((item: EditorButton) => allItems[item]),
        );
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
        .map(createFilteredDropdown(items));
};

const createFilteredDropdown =
    (items: EditorPluginButton[]) => (item: MenuElement) => {
        if (isDropdown(item)) {
            return new Dropdown(getFilteredMenu(item.content, items), {
                label: item.label,
            });
        }

        return item;
    };

const isMenuItem = (item: any): item is MenuItem => {
    return item.spec !== undefined;
};

const isDropdown = (
    item: any,
): item is Dropdown & { content: MenuItem[]; label: string } => {
    return item.content !== undefined;
};
