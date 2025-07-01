import { h } from '@stencil/core';
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { ActionBarItem, ListSeparator } from '@limetech/lime-elements';
import { ActionBar } from './action-bar';

let page: SpecPage;
let intersectionObserverMockedFunctions;
let intersectionObserverMock;
let intersectionCallback;
const actionsIn: Array<ActionBarItem | ListSeparator> = [
    {
        text: 'Add',
        icon: 'info',
    },
    {
        text: 'Edit',
        icon: 'idea',
    },
    {
        text: 'Delete',
        icon: 'multiply',
    },
    {
        separator: true,
    },
    {
        text: 'Settings',
        icon: 'external_link',
    },
];
describe('action-bar', () => {
    beforeEach(async () => {
        intersectionObserverMockedFunctions = {
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        };
        intersectionObserverMock = jest.fn((callback) => {
            intersectionCallback = callback;

            return intersectionObserverMockedFunctions;
        }) as any;
        global.IntersectionObserver = intersectionObserverMock;

        page = await newSpecPage({
            components: [ActionBar],
            template: () => (
                <limel-action-bar language="en" actions={actionsIn} />
            ),
        });

        await page.waitForChanges();
    });

    it('renders', () => {
        expect(page.root).toEqualHtml(`
            <limel-action-bar language="en" role="grid">
                <mock:shadow-root>
                    <div class=items role="rowgroup">
                        <limel-action-bar-item isvisible="" role="gridcell"></limel-action-bar-item>
                        <limel-action-bar-item isvisible="" role="gridcell"></limel-action-bar-item>
                        <limel-action-bar-item isvisible="" role="gridcell"></limel-action-bar-item>
                        <limel-action-bar-item isvisible="" role="gridcell"></limel-action-bar-item>
                        <limel-action-bar-item isvisible="" role="gridcell"></limel-action-bar-item>
                    </div>
                </mock:shadow-root>
            </limel-action-bar>
      `);
    });

    it('observes all actions in the intersection observer', () => {
        expect(
            intersectionObserverMockedFunctions.observe
        ).toHaveBeenCalledTimes(5);
    });

    it('disconnects the instersection observer when destroyed', async () => {
        page.root.remove();
        await page.waitForChanges();

        expect(
            intersectionObserverMockedFunctions.disconnect
        ).toHaveBeenCalledTimes(1);
    });

    it('observes all actions again if reconnected', async () => {
        page.root.remove();
        await page.waitForChanges();

        intersectionObserverMockedFunctions.observe.mockClear();
        page.body.append(page.root);
        await page.waitForChanges();
        expect(
            intersectionObserverMockedFunctions.observe
        ).toHaveBeenCalledTimes(5);
    });

    it('hides non-visable items in the menu', async () => {
        triggerIntersection([true, true, false, false, false]);

        await page.waitForChanges();
        expect(getNumVisibleActions()).toBe(2);
        expect(hasOverflowMenu()).toBeTruthy();
    });

    it('does not show the menu when all actions intersect', async () => {
        triggerIntersection([true, true, true, true, true]);

        await page.waitForChanges();
        expect(hasOverflowMenu()).toBeFalsy();
    });

    it('hides the menu when all actions intersect once more', async () => {
        // Set some of the actions visible as a start
        triggerIntersection([true, true, true, false, false]);

        await page.waitForChanges();
        expect(hasOverflowMenu()).toBeTruthy();

        // Now add two more actions intersecting
        triggerIntersection([true, true]);

        // The menu should no longer be needed, all actions intersect
        await page.waitForChanges();
        expect(hasOverflowMenu()).toBeFalsy();
    });

    it('handles one more intersecting actions', async () => {
        // Set some of the actions visible as a start
        triggerIntersection([true, true, false, false, false]);

        // Make one more item intersect
        triggerIntersection([true]);

        await page.waitForChanges();
        expect(getNumVisibleActions()).toBe(3);
    });

    it('handles one less intersecting actions', async () => {
        // Set some of the actions visible as a start
        triggerIntersection([true, true, true, true, false]);

        // Make one less item intersect
        triggerIntersection([false]);

        await page.waitForChanges();
        expect(getNumVisibleActions()).toBe(3);
    });

    it('handles zero intersecting actions', async () => {
        triggerIntersection([false, false, false, false, false]);

        await page.waitForChanges();
        expect(getNumVisibleActions()).toBe(0);
    });

    it('handles all actions intersecting', async () => {
        triggerIntersection([true, true, true, true, true]);

        await page.waitForChanges();
        expect(getNumVisibleActions()).toBe(5);
    });
});

const triggerIntersection = (intersectingElements: boolean[]) => {
    const entries = intersectingElements.map((entry) => ({
        isIntersecting: entry,
    }));

    intersectionCallback(entries);
};

const getNumVisibleActions = (): number => {
    const actions = page.root.shadowRoot.querySelectorAll(
        'limel-action-bar-item'
    );
    const visibleActions = [...actions].filter((action) =>
        action.hasAttribute('isvisible')
    );

    return visibleActions.length;
};

const hasOverflowMenu = () => {
    const overflowMenu = page.root.shadowRoot.querySelector(
        'limel-action-bar-overflow-menu'
    );

    return !!overflowMenu;
};
