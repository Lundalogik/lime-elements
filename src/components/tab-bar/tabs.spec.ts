import { Tab } from './tab.types';
import { getTabReorder, setActiveTab } from './tabs';

describe('setActiveTab', () => {
    const tabs: Tab[] = [
        {
            id: 'foo',
            active: true,
        },
        {
            id: 'bar',
        },
        {
            id: 'baz',
        },
    ];

    describe('when bar is activated', () => {
        it('returns a list of the same size', () => {
            const newTabs = setActiveTab(tabs, 1);
            expect(newTabs.length).toEqual(3);
        });

        it('sets bar to active', () => {
            const newTabs = setActiveTab(tabs, 1);
            expect(newTabs[1].active).toBeTruthy();
        });

        it('sets foo to inactive', () => {
            const newTabs = setActiveTab(tabs, 1);
            expect(newTabs[0].active).toBeFalsy();
        });

        it('does not change baz', () => {
            const newTabs = setActiveTab(tabs, 1);
            expect(newTabs[2]).toBe(tabs[2]);
        });
    });

    describe('when foo is activated', () => {
        it('only changes foo', () => {
            const newTabs = setActiveTab(tabs, 0);
            expect(newTabs[0]).not.toBe(tabs[0]);
            expect(newTabs[1]).toBe(tabs[1]);
            expect(newTabs[2]).toBe(tabs[2]);
        });
    });
});

describe('getTabReorder', () => {
    const tabs: Tab[] = [{ id: 'foo' }, { id: 'bar' }, { id: 'baz' }];

    it('describes a move of a tab to a later place', () => {
        const reorder = getTabReorder(tabs, {
            order: ['bar', 'baz', 'foo'],
            fromIndex: 0,
            toIndex: 2,
        });

        expect(reorder).toEqual({ tab: tabs[0], fromIndex: 0, toIndex: 2 });
    });

    it('describes a move of a tab to an earlier place', () => {
        const reorder = getTabReorder(tabs, {
            order: ['baz', 'foo', 'bar'],
            fromIndex: 2,
            toIndex: 0,
        });

        expect(reorder).toEqual({ tab: tabs[2], fromIndex: 2, toIndex: 0 });
    });

    it('finds the tabs whose ids are numbers, since the ids of the drag are text', () => {
        const numbered: Tab[] = [{ id: 1 }, { id: 2 }, { id: 3 }];

        const reorder = getTabReorder(numbered, {
            order: ['3', '1', '2'],
            fromIndex: 2,
            toIndex: 0,
        });

        expect(reorder).toEqual({ tab: numbered[2], fromIndex: 2, toIndex: 0 });
    });

    it('describes nothing when the tabs were put in another order after the drag began', () => {
        const reorder = getTabReorder([tabs[1], tabs[0], tabs[2]], {
            order: ['bar', 'baz', 'foo'],
            fromIndex: 0,
            toIndex: 2,
        });

        expect(reorder).toBeUndefined();
    });

    it('describes nothing when a tab was removed after the drag began', () => {
        const reorder = getTabReorder([tabs[0], tabs[2]], {
            order: ['baz', 'foo'],
            fromIndex: 0,
            toIndex: 2,
        });

        expect(reorder).toBeUndefined();
    });

    it('describes nothing when the dragged tab was the last one, and another tab was removed after the drag began', () => {
        const reorder = getTabReorder([tabs[0], tabs[2]], {
            order: ['baz', 'foo'],
            fromIndex: 2,
            toIndex: 0,
        });

        expect(reorder).toBeUndefined();
    });

    it('describes nothing when a tab was added after the drag began', () => {
        const reorder = getTabReorder([...tabs, { id: 'qux' }], {
            order: ['bar', 'baz', 'foo'],
            fromIndex: 0,
            toIndex: 2,
        });

        expect(reorder).toBeUndefined();
    });

    it('describes nothing when the move begins at a place where there is no tab', () => {
        expect(
            getTabReorder(tabs, {
                order: ['baz', 'foo', 'bar'],
                fromIndex: 3,
                toIndex: 0,
            })
        ).toBeUndefined();
        expect(
            getTabReorder(tabs, {
                order: ['bar', 'foo', 'baz'],
                fromIndex: -1,
                toIndex: 0,
            })
        ).toBeUndefined();
    });

    it('describes nothing when the move ends at a place where there is no tab', () => {
        expect(
            getTabReorder(tabs, {
                order: ['foo', 'bar', 'baz'],
                fromIndex: 0,
                toIndex: 3,
            })
        ).toBeUndefined();
    });
});
