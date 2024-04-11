import { Schema } from 'prosemirror-model';
import { MenuElement, Dropdown, MenuItem } from 'prosemirror-menu';
import { buildMenuItems } from 'prosemirror-example-setup';

/**
 * Creates the default menu for the text editor
 * based on the default menu already in prosemirror-example-setup
 * @param schema - the schema to use for the menu
 *
 * @returns the default menu for the text editor
 */
export const buildDefaultMenu = (schema: Schema): MenuElement[][] => {
    const menuItems = buildMenuItems(schema) as unknown as {
        blockMenu: MenuElement[][];
        fullMenu: MenuElement[][];
        inlineMenu: MenuElement[][];
        insertHorizontalRule: MenuItem;
        typeMenu: Dropdown & {
            content: MenuElement[];
        };
    };
    const { inlineMenu, insertHorizontalRule } = menuItems;
    const typeMenu = getNewMenu(menuItems.typeMenu);
    const newHorizontalRule = new MenuItem({
        ...insertHorizontalRule.spec,
        label: 'hr',
    });
    const historyButtons = menuItems.fullMenu[2];
    const blockMenu = getBlockMenu(menuItems.blockMenu);

    return [
        inlineMenu[0],
        [newHorizontalRule],
        ...typeMenu,
        historyButtons,
        blockMenu,
    ];
};

const getNewMenu = (
    typeMenu: Dropdown & { content: MenuElement[] },
): MenuElement[][] => {
    const headingDropdown: Dropdown = new Dropdown(
        (typeMenu.content[2] as Partial<{ content: MenuElement[] }>).content,
        {
            label: 'H',
        },
    );

    return [[typeMenu.content[0], typeMenu.content[1]], [headingDropdown]];
};

const getBlockMenu = (blockMenu: MenuElement[][]): MenuElement[] => {
    // eslint-disable-next-line no-magic-numbers
    return [...blockMenu[0].slice(0, 5)];
};
