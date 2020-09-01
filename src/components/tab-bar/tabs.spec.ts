import { Tab } from './tab.types';
import { setActiveTab } from './tabs';

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
