import { isEqual } from 'lodash-es';
import type { ReorderEvent } from '../../util/drag-to-reorder';
import { Tab, TabReorderEvent } from './tab.types';

/**
 * Set a tabs `active` state to true in a list of tabs. The previous tab with
 * `active` set to true will have it set to `false` instead.
 *
 * @param tabs - list of tabs
 * @param index - the index of the tab to set to active
 * @returns a copy of the list of tabs with the changed tabs replaced
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

/**
 * Describe a move that the user has made, in the tabs that the user made it in.
 *
 * @param tabs - the tabs of the tab bar now
 * @param reorder - the move, as the list of tabs that the user dragged reported
 * it
 * @returns the move, or `undefined` when `tabs` are not the tabs that the user
 * began to drag, since the move would point to another tab then
 */
export function getTabReorder(
    tabs: Tab[],
    reorder: ReorderEvent
): TabReorderEvent | undefined {
    const { order, fromIndex, toIndex } = reorder;
    const isATab = (index: number) => index >= 0 && index < tabs.length;
    if (!isATab(fromIndex) || !isATab(toIndex)) {
        return undefined;
    }

    const orderBeforeTheMove = [...order];
    orderBeforeTheMove.splice(
        fromIndex,
        0,
        ...orderBeforeTheMove.splice(toIndex, 1)
    );

    if (
        !isEqual(
            orderBeforeTheMove,
            tabs.map(({ id }) => String(id))
        )
    ) {
        return undefined;
    }

    return { tab: tabs[fromIndex], fromIndex, toIndex };
}
