import {
    newE2EPage,
    E2EPage,
    E2EElement,
    EventSpy,
} from '@stencil/core/testing';
import { Tab } from './tab.types';

describe('limel-tab-bar', () => {
    let page: E2EPage;
    let component: E2EElement;
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

    beforeEach(async () => {
        page = await newE2EPage();
        await page.setContent('<limel-tab-bar></limel-tab-bar>');
        component = await page.find('limel-tab-bar');
        component.setProperty('tabs', tabs);
        await page.waitForChanges();
    });

    describe('when bar tab is clicked', () => {
        let spy: EventSpy;
        beforeEach(async () => {
            spy = await page.spyOnEvent('changeTab');
            const buttons = await page.findAll('limel-tab-bar >>> button');
            await buttons[1].click();
        });

        it('emits an event with the old inactive tab', () => {
            expect(spy).toHaveReceivedEventTimes(2);
            const event = spy.events.find((e) => e.detail.id === 'bar');
            expect(event.detail).toEqual({
                id: 'bar',
                active: true,
            });
        });

        it('emits an event with the active tab', () => {
            expect(spy).toHaveReceivedEventTimes(2);
            const event = spy.events.find((e) => e.detail.id === 'foo');
            expect(event.detail).toEqual({
                id: 'foo',
                active: false,
            });
        });
    });

    describe('when tab clicked is to the left of the right one', () => {
        let spy: EventSpy;
        beforeEach(async () => {
            const newTabs = [
                { ...tabs[0], active: false },
                { ...tabs[1], active: true },
                tabs[2],
            ];
            component.setProperty('tabs', newTabs);
            await page.waitForChanges();

            spy = await page.spyOnEvent('changeTab');
            const buttons = await page.findAll('limel-tab-bar >>> button');
            await buttons[0].click();
        });

        it('emits the inactive tab before the active tab', () => {
            expect(spy.events[0].detail).toEqual({
                id: 'bar',
                active: false,
            });
            expect(spy.events[1].detail).toEqual({
                id: 'foo',
                active: true,
            });
        });
    });

    describe('when foo tab is clicked', () => {
        let spy: EventSpy;
        beforeEach(async () => {
            spy = await page.spyOnEvent('changeTab');
            const buttons = await page.findAll('limel-tab-bar >>> button');
            await buttons[0].click();
        });

        it('does not emit an event', () => {
            expect(spy).toHaveReceivedEventTimes(0);
        });
    });
});
