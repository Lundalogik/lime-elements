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
