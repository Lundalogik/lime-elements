import startCase from 'lodash/startCase';
export function createMenu(docs, guides, types) {
    let menu = [];
    guides.forEach(addGuide(menu, ''));
    menu = [...menu, createComponentMenu(docs), createTypeMenu(types)];
    return menu;
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const addGuide = (menu, path) => (guide) => {
    const subPath = guide.data.path.replace(path, '');
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
function getGuideTitle(guide) {
    const regex = /^#\s?(.+?)$/m;
    const match = guide.content.match(regex);
    return match === null || match === void 0 ? void 0 : match[1];
}
export function createComponentMenu(docs) {
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
export function isExample(component) {
    return !!component.dirPath.match(/\/examples?$/);
}
function isNotExample(component) {
    return !isExample(component);
}
export function isPublic(component) {
    return !component.docsTags.find((tag) => ['internal', 'private', 'ignore'].includes(tag.name));
}
export function getComponentMenu(component) {
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
function getComponentPropertyMenu(component) {
    if (!component.props.length) {
        return;
    }
    return {
        title: 'Properties',
        path: `/component/${component.tag}/properties/`,
    };
}
function getComponentEventMenu(component) {
    if (!component.events.length) {
        return;
    }
    return {
        title: 'Events',
        path: `/component/${component.tag}/events/`,
    };
}
function getComponentMethodMenu(component) {
    if (!component.methods.length) {
        return;
    }
    return {
        title: 'Methods',
        path: `/component/${component.tag}/methods/`,
    };
}
function getComponentSlotMenu(component) {
    if (!component.slots.length) {
        return;
    }
    return {
        title: 'Slots',
        path: `/component/${component.tag}/slots/`,
    };
}
function getComponentStyleMenu(component) {
    if (!component.styles.length) {
        return;
    }
    return {
        title: 'Styles',
        path: `/component/${component.tag}/styles/`,
    };
}
export function getComponentTitle(tag) {
    const title = tag.split('-').slice(1).join(' ');
    return title[0].toLocaleUpperCase() + title.slice(1);
}
export function createApiMenu() {
    return {
        path: '/api/',
        title: 'API',
    };
}
export function createVersionMenu() {
    return {
        path: '/version/',
        title: 'Versions',
    };
}
function createTypeMenu(types) {
    return {
        path: '/type/',
        title: 'Types',
        children: types.map(getTypeMenu),
    };
}
export function getTypeMenu(type) {
    return {
        path: `/type/${type.name}/`,
        title: type.name,
        children: [],
    };
}
