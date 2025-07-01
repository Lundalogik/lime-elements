import {
    E2EElement,
    E2EPage,
    EventSpy,
    newE2EPage,
} from '@stencil/core/testing';
import { Action } from './action';

describe('limel-collapsible-section', () => {
    let page: E2EPage;
    let limelCollapsible: E2EElement;
    let collapsibleHeader: E2EElement;
    let collapsibleToggle: E2EElement;
    let collapsibleBody: E2EElement;

    describe('with a header and body', () => {
        beforeEach(async () => {
            page = await createPage(`
                <limel-collapsible-section header="Header text">
                    Body text <button>Test</button>
                </limel-collapsible-section>
            `);
            limelCollapsible = await page.find('limel-collapsible-section');
            collapsibleHeader = await page.find(
                'limel-collapsible-section >>> header'
            );
            collapsibleToggle = await page.find(
                'limel-collapsible-section >>> .open-close-toggle'
            );
            collapsibleBody = await page.find(
                'limel-collapsible-section >>> .body'
            );
        });
        it('displays the correct header', () => {
            expect(collapsibleHeader).toEqualText('Header text');
        });
        it('has a slot for the body', async () => {
            const slot = await collapsibleBody.find('slot');
            expect(slot).toEqualHtml('<slot></slot>');
        });
        it('is collapsed', async () => {
            expect(await limelCollapsible.getProperty('isOpen')).toEqual(false);
            expect(await collapsibleBody.getAttribute('aria-hidden')).toEqual(
                'true'
            );
            const slot = await collapsibleBody.find('slot');
            expect(await slot.isVisible()).toBeFalsy();
        });

        describe('when changing the header', () => {
            beforeEach(async () => {
                limelCollapsible.setProperty('header', 'new header');
                await page.waitForChanges();
            });
            it('displays the new header', () => {
                expect(collapsibleHeader).toEqualText('new header');
            });
        });

        describe('when clicking the header', () => {
            let openEventSpy: EventSpy;
            let closeEventSpy: EventSpy;
            beforeEach(async () => {
                openEventSpy = await page.spyOnEvent('open');
                closeEventSpy = await page.spyOnEvent('close');
                await collapsibleToggle.click();
                await page.waitForChanges();
            });

            it('opens', async () => {
                expect(await limelCollapsible.getProperty('isOpen')).toEqual(
                    true
                );
                expect(
                    await collapsibleBody.getAttribute('aria-hidden')
                ).toEqual('false');
                await new Promise((resolve) => setTimeout(resolve, 300));
                const slot = await collapsibleBody.find('slot');
                expect(await slot.isVisible()).toBeTruthy();
            });

            it('emits `open` event', async () => {
                expect(openEventSpy).toHaveReceivedEvent();
            });

            it('does NOT emit `close` event', async () => {
                expect(closeEventSpy).not.toHaveReceivedEvent();
            });

            describe('then clicking it again', () => {
                beforeEach(async () => {
                    openEventSpy = await page.spyOnEvent('open');
                    closeEventSpy = await page.spyOnEvent('close');
                    await collapsibleToggle.click();
                    await page.waitForChanges();
                });

                it('closes', async () => {
                    expect(
                        await limelCollapsible.getProperty('isOpen')
                    ).toEqual(false);
                    const slot = await collapsibleBody.find('slot');
                    expect(await slot.isVisible()).toBeFalsy();
                });

                it('does NOT emit `open` event', async () => {
                    expect(openEventSpy).not.toHaveReceivedEvent();
                });

                it('emits `close` event', async () => {
                    expect(closeEventSpy).toHaveReceivedEvent();
                });
            });

            describe('then clicking the body', () => {
                beforeEach(async () => {
                    openEventSpy = await page.spyOnEvent('open');
                    closeEventSpy = await page.spyOnEvent('close');
                    await collapsibleBody.click();
                    await page.waitForChanges();
                });

                it('does NOT close', async () => {
                    expect(
                        await limelCollapsible.getProperty('isOpen')
                    ).toEqual(true);
                    const slot = await collapsibleBody.find('slot');
                    expect(await slot.isVisible()).toBeTruthy();
                });

                it('does NOT emit `open` event', async () => {
                    expect(openEventSpy).not.toHaveReceivedEvent();
                });

                it('does NOT emit `close` event', async () => {
                    expect(closeEventSpy).not.toHaveReceivedEvent();
                });
            });
        });

        describe('when focusing the open-close-toggle button header and pressing ENTER', () => {
            let openEventSpy: EventSpy;
            let closeEventSpy: EventSpy;
            beforeEach(async () => {
                openEventSpy = await page.spyOnEvent('open');
                closeEventSpy = await page.spyOnEvent('close');
                await collapsibleToggle.focus();
                await page.keyboard.press('Enter');
                await page.waitForChanges();
            });

            it('opens', async () => {
                expect(await limelCollapsible.getProperty('isOpen')).toEqual(
                    true
                );
                const slot = await collapsibleBody.find('slot');
                await new Promise((resolve) => setTimeout(resolve, 300));
                expect(await slot.isVisible()).toBeTruthy();
            });

            it('emits `open` event', async () => {
                expect(openEventSpy).toHaveReceivedEvent();
            });

            it('does NOT emit `close` event', async () => {
                expect(closeEventSpy).not.toHaveReceivedEvent();
            });

            describe('then pressing ENTER again', () => {
                beforeEach(async () => {
                    openEventSpy = await page.spyOnEvent('open');
                    closeEventSpy = await page.spyOnEvent('close');
                    await page.keyboard.press('Enter');
                    await page.waitForChanges();
                });

                it('closes', async () => {
                    expect(
                        await limelCollapsible.getProperty('isOpen')
                    ).toEqual(false);
                    const slot = await collapsibleBody.find('slot');
                    expect(await slot.isVisible()).toBeFalsy();
                });

                it('does NOT emit `open` event', async () => {
                    expect(openEventSpy).not.toHaveReceivedEvent();
                });

                it('emits `close` event', async () => {
                    expect(closeEventSpy).toHaveReceivedEvent();
                });
            });

            describe('then focusing a button in the body and pressing ENTER', () => {
                beforeEach(async () => {
                    openEventSpy = await page.spyOnEvent('open');
                    closeEventSpy = await page.spyOnEvent('close');
                    const buttonInBody = await page.find('button');
                    await buttonInBody.focus();
                    await page.keyboard.press('Enter');
                    await page.waitForChanges();
                });

                it('does NOT close', async () => {
                    expect(
                        await limelCollapsible.getProperty('isOpen')
                    ).toEqual(true);
                    const slot = await collapsibleBody.find('slot');
                    expect(await slot.isVisible()).toBeTruthy();
                });

                it('does NOT emit `open` event', async () => {
                    expect(openEventSpy).not.toHaveReceivedEvent();
                });

                it('does NOT emit `close` event', async () => {
                    expect(closeEventSpy).not.toHaveReceivedEvent();
                });
            });
        });

        describe('when setting `isOpen` to `true`', () => {
            let openEventSpy: EventSpy;
            let closeEventSpy: EventSpy;
            beforeEach(async () => {
                openEventSpy = await page.spyOnEvent('open');
                closeEventSpy = await page.spyOnEvent('close');
                await page.$eval(
                    'limel-collapsible-section',
                    (element: HTMLLimelCollapsibleSectionElement) => {
                        element.isOpen = true;
                    }
                );
                await page.waitForChanges();
            });

            it('opens', async () => {
                expect(await limelCollapsible.getProperty('isOpen')).toEqual(
                    true
                );
                const slot = await collapsibleBody.find('slot');
                await new Promise((resolve) => setTimeout(resolve, 300));
                expect(await slot.isVisible()).toBeTruthy();
            });

            it('does NOT emit `open` event', async () => {
                expect(openEventSpy).not.toHaveReceivedEvent();
            });

            it('does NOT emit `close` event', async () => {
                expect(closeEventSpy).not.toHaveReceivedEvent();
            });

            describe('then setting `isOpen` to `false`', () => {
                beforeEach(async () => {
                    openEventSpy = await page.spyOnEvent('open');
                    closeEventSpy = await page.spyOnEvent('close');
                    await page.$eval(
                        'limel-collapsible-section',
                        (element: HTMLLimelCollapsibleSectionElement) => {
                            element.isOpen = false;
                        }
                    );
                    await page.waitForChanges();
                });

                it('closes', async () => {
                    expect(
                        await limelCollapsible.getProperty('isOpen')
                    ).toEqual(false);
                    const slot = await collapsibleBody.find('slot');
                    expect(await slot.isVisible()).toBeFalsy();
                });

                it('does NOT emit `open` event', async () => {
                    expect(openEventSpy).not.toHaveReceivedEvent();
                });

                it('does NOT emit `close` event', async () => {
                    expect(closeEventSpy).not.toHaveReceivedEvent();
                });
            });
        });

        describe('with an action', () => {
            let actions: Action[];
            let actionButton: E2EElement;
            let actionEventSpy;
            beforeEach(async () => {
                actions = [
                    {
                        id: 'abc',
                        icon: 'unit-test',
                    },
                ];
                await page.$eval(
                    'limel-collapsible-section',
                    (element: any, value) => {
                        element.actions = value;
                    },
                    actions as any[]
                );
                await page.waitForChanges();
                actionButton = await page.find(
                    'limel-collapsible-section >>> limel-icon-button'
                );
                actionEventSpy = await page.spyOnEvent('action');
            });

            it('has an action button', () => {
                expect(actionButton).toBeTruthy();
            });

            describe('when action button is clicked', () => {
                beforeEach(async () => {
                    await actionButton.click();
                });

                it('emits `action` event', async () => {
                    expect(actionEventSpy).toHaveReceivedEvent();
                    expect(actionEventSpy).toHaveReceivedEventDetail(
                        actions[0]
                    );
                });
            });
        });
    });
});

async function createPage(content) {
    return newE2EPage({ html: content });
}
