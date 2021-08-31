import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { Popover } from './popover';
import { Portal } from '../portal/portal';

describe('popover', () => {
    let page: SpecPage;
    let eventSpy: jest.Mock;
    beforeEach(async () => {
        page = await newSpecPage({
            components: [Popover, Portal],
            html: '<limel-popover open=true></limel-popover>',
        });
        eventSpy = jest.fn();
        page.body.addEventListener('close', eventSpy);
    });
    describe('when clicking outside the popover component', () => {
        it('emits a close event', async () => {
            page.doc.body.click();
            await page.waitForChanges();
            expect(eventSpy).toHaveBeenCalled();
        });
    });
    describe('when clicking inside the popover component', () => {
        xit('does not emit a close event', async () => {
            // The content of the popover is rendered in a portal on the document,
            // thus we need find the portal its inside instead and not
            // limel-popover
            const elem: HTMLElement = page.body.querySelector(
                '.limel-portal--container'
            );
            elem.click();
            await page.waitForChanges();
            expect(eventSpy).not.toHaveBeenCalled();
        });
    });
});
