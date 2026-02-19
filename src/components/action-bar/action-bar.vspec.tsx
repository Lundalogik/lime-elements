import { render, h } from '@stencil/vitest';
import { ActionBarItem } from './action-bar.types';
import { ListSeparator } from '../../global/shared-types/separator.types';

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
    let root: HTMLElement;
    let waitForChanges: () => Promise<void>;
    let observeMock: Mock;
    let disconnectMock: Mock;

    function getLatestCallback(): Function | undefined {
        const mockFn = global.IntersectionObserver as any;
        if (mockFn?.mock?.calls?.length) {
            return mockFn.mock.calls.at(-1)[0];
        }

        return undefined;
    }

    beforeEach(async () => {
        observeMock = vi.fn();
        disconnectMock = vi.fn();

        const mockConstructor = vi.fn(function () {
            return {
                observe: observeMock,
                unobserve: vi.fn(),
                disconnect: disconnectMock,
                takeRecords: vi.fn().mockReturnValue([]),
            };
        }) as any;
        global.IntersectionObserver = mockConstructor;
        (globalThis as any).IntersectionObserver = mockConstructor;

        const result = await render(
            <limel-action-bar language="en" actions={actionsIn} />
        );
        root = result.root;
        waitForChanges = result.waitForChanges;

        await waitForChanges();
    });

    it('renders all action items', () => {
        const shadow = root.shadowRoot;
        expect(shadow).toBeTruthy();

        const items = shadow.querySelectorAll('limel-action-bar-item');
        expect(items.length).toBe(5);
    });

    it('observes all actions in the intersection observer', () => {
        expect(observeMock).toHaveBeenCalledTimes(5);
    });

    it('disconnects the intersection observer when destroyed', async () => {
        root.remove();
        await waitForChanges();

        expect(disconnectMock).toHaveBeenCalledTimes(1);
    });

    it('observes all actions again if reconnected', async () => {
        root.remove();
        await waitForChanges();

        observeMock.mockClear();
        document.body.append(root);
        await waitForChanges();
        expect(observeMock).toHaveBeenCalledTimes(5);
    });

    it('hides non-visible items in the menu', async () => {
        triggerIntersection([true, true, false, false, false]);

        await waitForChanges();
        expect(getNumVisibleActions()).toBe(2);
        expect(hasOverflowMenu()).toBeTruthy();
    });

    it('does not show the menu when all actions intersect', async () => {
        triggerIntersection([true, true, true, true, true]);

        await waitForChanges();
        expect(hasOverflowMenu()).toBeFalsy();
    });

    it('hides the menu when all actions intersect once more', async () => {
        triggerIntersection([true, true, true, false, false]);

        await waitForChanges();
        expect(hasOverflowMenu()).toBeTruthy();

        triggerIntersection([true, true]);

        await waitForChanges();
        expect(hasOverflowMenu()).toBeFalsy();
    });

    it('handles one more intersecting actions', async () => {
        triggerIntersection([true, true, false, false, false]);

        triggerIntersection([true]);

        await waitForChanges();
        expect(getNumVisibleActions()).toBe(3);
    });

    it('handles one less intersecting actions', async () => {
        triggerIntersection([true, true, true, true, false]);

        triggerIntersection([false]);

        await waitForChanges();
        expect(getNumVisibleActions()).toBe(3);
    });

    it('handles zero intersecting actions', async () => {
        triggerIntersection([false, false, false, false, false]);

        await waitForChanges();
        expect(getNumVisibleActions()).toBe(0);
    });

    it('handles all actions intersecting', async () => {
        triggerIntersection([true, true, true, true, true]);

        await waitForChanges();
        expect(getNumVisibleActions()).toBe(5);
    });

    const triggerIntersection = (intersectingElements: boolean[]) => {
        const entries = intersectingElements.map((entry) => ({
            isIntersecting: entry,
        }));

        const callback = getLatestCallback();
        callback?.(entries);
    };

    // In mock-doc, child component @Prop({ reflect: true }) attributes
    // aren't reflected on the element. Check the JS property instead.
    const getNumVisibleActions = (): number => {
        const actions = root.shadowRoot.querySelectorAll(
            'limel-action-bar-item'
        );

        return [...actions].filter((action) => (action as any).isVisible)
            .length;
    };

    const hasOverflowMenu = () => {
        return !!root.shadowRoot.querySelector(
            'limel-action-bar-overflow-menu'
        );
    };
});
