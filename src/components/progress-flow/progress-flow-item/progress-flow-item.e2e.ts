import {
    E2EElement,
    E2EPage,
    newE2EPage,
    EventSpy,
} from '@stencil/core/testing';
import { FlowItem } from '../progress-flow.types';

describe('limel-progress-flow-item', () => {
    let page: E2EPage;
    let progressFlowItem: E2EElement;
    let flowItem: FlowItem;

    beforeEach(async () => {
        page = await createPage(`
        <limel-progress-flow-item></limel-progress-flow-item>
        `);
        progressFlowItem = await page.find('limel-progress-flow-item');
    });
    it('renders an empty component', () => {
        expect(progressFlowItem).toEqualHtml(`
        <limel-progress-flow-item class="hydrated"></limel-progress-flow-item>
        `);
    });

    describe('basic item', () => {
        beforeEach(async () => {
            flowItem = { text: 'Customer contact' };
            progressFlowItem.setProperty('item', flowItem);
            await page.waitForChanges();
        });

        it('renders the item', () => {
            expect(progressFlowItem).toEqualHtml(`
            <limel-progress-flow-item class="hydrated">
                <button class="step" tabindex=0 title="Customer contact" type="button">
                    <span class="text">Customer contact</span>
                    <div class="divider"></div>
                </button>
            </limel-progress-flow-item>
            `);
        });
    });

    describe('when the item is clicked', () => {
        let spy: EventSpy;
        beforeEach(async () => {
            spy = await progressFlowItem.spyOnEvent('interact');
            flowItem = { text: 'Customer contact' };
            progressFlowItem.setProperty('item', flowItem);
            await page.waitForChanges();
            const button = await page.find('button');
            await button.click();
        });

        it('emits an interact event', () => {
            expect(spy).toHaveReceivedEventTimes(1);
        });
    });

    describe('when secondary text is given', () => {
        let button: E2EElement;
        let secondaryText: E2EElement;
        beforeEach(async () => {
            flowItem = {
                text: 'Customer contact',
                secondaryText: 'Via phone support',
            };
            progressFlowItem.setProperty('item', flowItem);
            await page.waitForChanges();
            button = await page.find('button');
            secondaryText = await page.find('.secondary-text');
        });

        it('adds the secondary text to the title of the button', () => {
            expect(button.title).toEqual(
                'Customer contact · Via phone support'
            );
        });

        it('renders the secondary text', () => {
            expect(secondaryText).toEqualHtml(`
            <div class="secondary-text">
                Via phone support
            </div>
            `);
        });
    });

    describe('when icon is given', () => {
        let icon: E2EElement;
        beforeEach(async () => {
            flowItem = { text: 'Customer contact', icon: 'unit-test' };
            progressFlowItem.setProperty('item', flowItem);
            await page.waitForChanges();
            icon = await page.find('limel-icon');
        });

        it('renders the item with the icon', () => {
            expect(icon).toBeTruthy();
            expect(icon.getAttribute('name')).toEqual('unit-test');
        });
    });

    describe('when the flow item is selected', () => {
        let button: E2EElement;
        beforeEach(async () => {
            flowItem = { text: 'Customer contact', selected: true };
            progressFlowItem.setProperty('item', flowItem);
            await page.waitForChanges();
            button = await page.find('button');
        });

        it('is selected', () => {
            expect(button).toHaveClass('selected');
        });
    });

    describe('when the flow item is disabled', () => {
        let button: E2EElement;
        beforeEach(async () => {
            flowItem = { text: 'Customer contact', disabled: true };
            progressFlowItem.setProperty('item', flowItem);
            await page.waitForChanges();
            button = await page.find('button');
        });

        it('is disabled', () => {
            expect(button).toHaveAttribute('disabled');
            expect(button).toHaveClass('disabled');
        });
    });

    describe('when readonly is true', () => {
        let button: E2EElement;
        beforeEach(async () => {
            flowItem = { text: 'Customer contact' };
            progressFlowItem.setProperty('item', flowItem);
            progressFlowItem.setProperty('readonly', true);
            await page.waitForChanges();
            button = await page.find('button');
        });

        it('is readonly', () => {
            expect(button).toHaveClass('readonly');
            expect(button).toHaveClass('disabled');
            expect(button).toHaveAttribute('disabled');
        });
    });
});

async function createPage(content) {
    return newE2EPage({ html: content });
}
