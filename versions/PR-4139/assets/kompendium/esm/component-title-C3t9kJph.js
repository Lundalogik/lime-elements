/**
 * Get a human readable title for a component, e.g. `my-button` => `Button`
 * @param {string} tag the tag name of the component
 * @returns {string} the title of the component
 */
function getComponentTitle(tag) {
    const title = tag.split('-').slice(1).join(' ');
    return title[0].toLocaleUpperCase() + title.slice(1);
}

export { getComponentTitle as g };
//# sourceMappingURL=component-title-C3t9kJph.js.map

//# sourceMappingURL=component-title-C3t9kJph.js.map