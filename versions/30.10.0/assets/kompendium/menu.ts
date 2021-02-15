import { JsonDocsComponent, JsonDocs } from '@stencil/core/internal';
import startCase from 'lodash/startCase';
import { MenuItem, KompendiumGuide, TypeDescription } from '../types';

export function createMenu(
    docs: JsonDocs,
    guides: KompendiumGuide[],
    types: TypeDescription[]
): MenuItem[] {
    let menu = [];

    guides.forEach(addGuide(menu, ''));
    menu = [...menu, createComponentMenu(docs), createTypeMenu(types)];

    return menu;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const addGuide = (menu: MenuItem[], path: string) => (
    guide: KompendiumGuide
) => {
    const subPath: string = guide.data.path.replace(path, '');
    const parts = subPath.split('/');
    const parentPath = `${path}/${parts[1]}`;
    let submenu = menu.find((item) => item.path === parentPath + '/');

    if (!submenu && parts.length === 2) {
        const title = getGuideTitle(guide);
        menu.push({
            path: guide.data.path + '/',
            title: title,
            children: [],
        });
        return;
    }

    if (!submenu) {
        submenu = {
            path: parentPath + '/',
            title: startCase(parts[1]),
            children: [],
        };
        menu.push(submenu);
    }

    addGuide(submenu.children, parentPath)(guide);
};

function getGuideTitle(guide: KompendiumGuide): string {
    const regex = /^#\s?(.+?)$/m;
    const match = guide.content.match(regex);

    return match?.[1];
}

export function createComponentMenu(docs: JsonDocs): MenuItem {
    const components = docs.components || [];

    return {
        path: '/component/',
        title: 'Components',
        children: components
            .filter(isNotExample)
            .filter(isPublic)
            .map(getComponentMenu),
    };
}

export function isExample(component: JsonDocsComponent): boolean {
    return !!component.dirPath.match(/\/examples?$/);
}

function isNotExample(component: JsonDocsComponent) {
    return !isExample(component);
}

export function isPublic(component: JsonDocsComponent): boolean {
    return !component.docsTags.find((tag) =>
        ['internal', 'private', 'ignore'].includes(tag.name)
    );
}

export function getComponentMenu(component: JsonDocsComponent): MenuItem {
    return {
        path: `/component/${component.tag}/`,
        title: getComponentTitle(component.tag),
        children: [
            getComponentPropertyMenu(component),
            getComponentEventMenu(component),
            getComponentMethodMenu(component),
            getComponentSlotMenu(component),
            getComponentStyleMenu(component),
        ].filter((item) => !!item),
    };
}

function getComponentPropertyMenu(component: JsonDocsComponent): MenuItem {
    if (!component.props.length) {
        return;
    }

    return {
        title: 'Properties',
        path: `/component/${component.tag}/properties/`,
    };
}

function getComponentEventMenu(component: JsonDocsComponent): MenuItem {
    if (!component.events.length) {
        return;
    }

    return {
        title: 'Events',
        path: `/component/${component.tag}/events/`,
    };
}

function getComponentMethodMenu(component: JsonDocsComponent): MenuItem {
    if (!component.methods.length) {
        return;
    }

    return {
        title: 'Methods',
        path: `/component/${component.tag}/methods/`,
    };
}

function getComponentSlotMenu(component: JsonDocsComponent): MenuItem {
    if (!component.slots.length) {
        return;
    }

    return {
        title: 'Slots',
        path: `/component/${component.tag}/slots/`,
    };
}

function getComponentStyleMenu(component: JsonDocsComponent): MenuItem {
    if (!component.styles.length) {
        return;
    }

    return {
        title: 'Styles',
        path: `/component/${component.tag}/styles/`,
    };
}

export function getComponentTitle(tag: string): string {
    const title = tag.split('-').slice(1).join(' ');

    return title[0].toLocaleUpperCase() + title.slice(1);
}

export function createApiMenu(): MenuItem {
    return {
        path: '/api/',
        title: 'API',
    };
}

export function createVersionMenu(): MenuItem {
    return {
        path: '/version/',
        title: 'Versions',
    };
}

function createTypeMenu(types: TypeDescription[]): MenuItem {
    return {
        path: '/type/',
        title: 'Types',
        children: types.map(getTypeMenu),
    };
}

export function getTypeMenu(type: TypeDescription): MenuItem {
    return {
        path: `/type/${type.name}/`,
        title: type.name,
        children: [],
    };
}
