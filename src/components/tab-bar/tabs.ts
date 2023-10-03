import { Tab } from '../../interface';

/**
 * Set a tabs `active` state to true in a list of tabs. The previous tab with
 * `active` set to true will have it set to `false` instead.
 * @param {Tab[]} tabs list of tabs
 * @param {number} index the index of the tab to set to active
 * @returns {Tab[]} a copy of the list of tabs with the changed tabs replaced
 */
export function setActiveTab(tabs: Tab[], index: number): Tab[] {
    const oldSelectedTabIndex = tabs.findIndex((t) => t.active === true);
    const result = [...tabs];

    if (oldSelectedTabIndex !== -1) {
        result[oldSelectedTabIndex] = {
            ...tabs[oldSelectedTabIndex],
            active: false,
        };
    }

    result[index] = { ...tabs[index], active: true };

    return result;
}
