import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { clickElement } from '../../util/e2eClickElement';

describe('limel-collapsible-section.stateful', () => {
    let page: E2EPage;
    let statefulCollapsible: E2EElement;
    let limelCollapsible: E2EElement;

    afterEach(async () => {
        await page.$eval('body', () => {
            window.localStorage.clear();
        });
    });

    describe('with a header and body', () => {
        beforeEach(async () => {
            page = await createPage(`
                <limel-collapsible-section-stateful header="Header text">
                    Body text <button>Test</button>
                </limel-collapsible-section>
            `);
            statefulCollapsible = await page.find(
                'limel-collapsible-section-stateful'
            );
            await page.waitForChanges();
            limelCollapsible = await page.find(
                'limel-collapsible-section-stateful >>> limel-collapsible-section'
            );
        });
        it('renders a limel-collapsible-section', () => {
            expect(limelCollapsible).toBeTruthy();
        });
        it('passes on `header`', () => {
            expect(limelCollapsible).toEqualAttribute('header', 'Header text');
        });
        it('is collapsed', async () => {
            expect(await statefulCollapsible.getProperty('isOpen')).toEqual(
                false
            );
            expect(await limelCollapsible.getProperty('isOpen')).toEqual(false);
        });

        describe('when changing the header', () => {
            beforeEach(async () => {
                statefulCollapsible.setProperty('header', 'new header');
                await page.waitForChanges();
            });
            it('sets the new header', () => {
                expect(limelCollapsible).toEqualAttribute(
                    'header',
                    'new header'
                );
            });
        });

        describe('when setting `isOpen` to `true`', () => {
            let openEventSpy;
            let closeEventSpy;
            beforeEach(async () => {
                openEventSpy = await page.spyOnEvent('open');
                closeEventSpy = await page.spyOnEvent('close');
                await page.$eval(
                    'limel-collapsible-section-stateful',
                    (element: HTMLLimelCollapsibleSectionStatefulElement) => {
                        element.isOpen = true;
                    }
                );
                await page.waitForChanges();
            });
            it('opens', async () => {
                expect(await limelCollapsible.getProperty('isOpen')).toEqual(
                    true
                );
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
                        'limel-collapsible-section-stateful',
                        (
                            element: HTMLLimelCollapsibleSectionStatefulElement
                        ) => {
                            element.isOpen = false;
                        }
                    );
                    await page.waitForChanges();
                });
                it('closes', async () => {
                    expect(
                        await limelCollapsible.getProperty('isOpen')
                    ).toEqual(false);
                });
                it('does NOT emit `open` event', async () => {
                    expect(openEventSpy).not.toHaveReceivedEvent();
                });
                it('does NOT emit `close` event', async () => {
                    expect(closeEventSpy).not.toHaveReceivedEvent();
                });
            });
        });

        describe('when clicking the header', () => {
            let openEventSpy;
            let closeEventSpy;
            beforeEach(async () => {
                openEventSpy = await page.spyOnEvent('open');
                closeEventSpy = await page.spyOnEvent('close');
                await clickElement(page, [
                    limelCollapsible,
                    statefulCollapsible,
                ]);
                await page.waitForChanges();
            });
            it('opens', async () => {
                expect(await statefulCollapsible.getProperty('isOpen')).toEqual(
                    true
                );
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
                    await clickElement(page, [
                        limelCollapsible,
                        statefulCollapsible,
                    ]);
                    await page.waitForChanges();
                });
                it('closes', async () => {
                    expect(
                        await statefulCollapsible.getProperty('isOpen')
                    ).toEqual(false);
                });
                it('does NOT emit `open` event', async () => {
                    expect(openEventSpy).not.toHaveReceivedEvent();
                });
                it('emits `close` event', async () => {
                    expect(closeEventSpy).toHaveReceivedEvent();
                });
            });
        });
    });

    describe('with stored state `isOpen=true` and no value set by consumer', () => {
        let openEventSpy;
        beforeEach(async () => {
            page = await createPage('<div></div>');
            openEventSpy = await page.spyOnEvent('open');
            await page.$eval('div', (element: HTMLElement) => {
                window.localStorage.setItem(
                    'limel-collapsible-section-stateful.myStateKey.isOpen',
                    JSON.stringify(true)
                );
                const collapsible = document.createElement(
                    'limel-collapsible-section-stateful'
                );
                (collapsible as any).header = 'Header text';
                (collapsible as any).stateKey = 'myStateKey';
                element.appendChild(collapsible);
            });
            await page.waitForChanges();
            statefulCollapsible = await page.find(
                'limel-collapsible-section-stateful'
            );
            await page.waitForChanges();
            limelCollapsible = await page.find(
                'limel-collapsible-section-stateful >>> limel-collapsible-section'
            );
        });
        it('renders open', async () => {
            expect(await statefulCollapsible.getProperty('isOpen')).toEqual(
                true
            );
        });
        it('emits `open` event', async () => {
            expect(openEventSpy).toHaveReceivedEvent();
        });
    });

    describe('with stored state `isOpen=true` and `isOpen=false` set by consumer', () => {
        let openEventSpy;
        beforeEach(async () => {
            page = await createPage('<div></div>');
            openEventSpy = await page.spyOnEvent('open');
            await page.$eval('div', (element: HTMLElement) => {
                window.localStorage.setItem(
                    'limel-collapsible-section-stateful.myStateKey.isOpen',
                    JSON.stringify(true)
                );
                const collapsible = document.createElement(
                    'limel-collapsible-section-stateful'
                );
                (collapsible as any).header = 'Header text';
                (collapsible as any).stateKey = 'myStateKey';
                (collapsible as any).isOpen = false;
                element.appendChild(collapsible);
            });
            await page.waitForChanges();
            statefulCollapsible = await page.find(
                'limel-collapsible-section-stateful'
            );
            await page.waitForChanges();
            limelCollapsible = await page.find(
                'limel-collapsible-section-stateful >>> limel-collapsible-section'
            );
        });
        it('renders open', async () => {
            expect(await statefulCollapsible.getProperty('isOpen')).toEqual(
                true
            );
        });
        it('emits `open` event', async () => {
            expect(openEventSpy).toHaveReceivedEvent();
        });
    });

    describe('with stored state `isOpen=true` and `isOpen=true` set by consumer', () => {
        let openEventSpy;
        beforeEach(async () => {
            page = await createPage('<div></div>');
            openEventSpy = await page.spyOnEvent('open');
            await page.$eval('div', (element: HTMLElement) => {
                window.localStorage.setItem(
                    'limel-collapsible-section-stateful.myStateKey.isOpen',
                    JSON.stringify(true)
                );
                const collapsible = document.createElement(
                    'limel-collapsible-section-stateful'
                );
                (collapsible as any).header = 'Header text';
                (collapsible as any).stateKey = 'myStateKey';
                (collapsible as any).isOpen = true;
                element.appendChild(collapsible);
            });
            await page.waitForChanges();
            statefulCollapsible = await page.find(
                'limel-collapsible-section-stateful'
            );
            await page.waitForChanges();
            limelCollapsible = await page.find(
                'limel-collapsible-section-stateful >>> limel-collapsible-section'
            );
        });
        it('renders open', async () => {
            expect(await statefulCollapsible.getProperty('isOpen')).toEqual(
                true
            );
        });
        it('does NOT emit `open` event', async () => {
            expect(openEventSpy).not.toHaveReceivedEvent();
        });
    });

    describe('with stored state `isOpen=false` and no value set by consumer', () => {
        let closeEventSpy;
        beforeEach(async () => {
            page = await createPage('<div></div>');
            closeEventSpy = await page.spyOnEvent('close');
            await page.$eval('div', (element: HTMLElement) => {
                window.localStorage.setItem(
                    'limel-collapsible-section-stateful.myStateKey.isOpen',
                    JSON.stringify(false)
                );
                const collapsible = document.createElement(
                    'limel-collapsible-section-stateful'
                );
                (collapsible as any).header = 'Header text';
                (collapsible as any).stateKey = 'myStateKey';
                element.appendChild(collapsible);
            });
            await page.waitForChanges();
            statefulCollapsible = await page.find(
                'limel-collapsible-section-stateful'
            );
            await page.waitForChanges();
            limelCollapsible = await page.find(
                'limel-collapsible-section-stateful >>> limel-collapsible-section'
            );
        });
        it('renders closed', async () => {
            expect(await statefulCollapsible.getProperty('isOpen')).toEqual(
                false
            );
        });
        it('does NOT emit `close` event', async () => {
            expect(closeEventSpy).not.toHaveReceivedEvent();
        });
    });

    describe('with stored state `isOpen=false` and `isOpen=false` set by consumer', () => {
        let closeEventSpy;
        beforeEach(async () => {
            page = await createPage('<div></div>');
            closeEventSpy = await page.spyOnEvent('close');
            await page.$eval('div', (element: HTMLElement) => {
                window.localStorage.setItem(
                    'limel-collapsible-section-stateful.myStateKey.isOpen',
                    JSON.stringify(false)
                );
                const collapsible = document.createElement(
                    'limel-collapsible-section-stateful'
                );
                (collapsible as any).header = 'Header text';
                (collapsible as any).stateKey = 'myStateKey';
                (collapsible as any).isOpen = false;
                element.appendChild(collapsible);
            });
            await page.waitForChanges();
            statefulCollapsible = await page.find(
                'limel-collapsible-section-stateful'
            );
            await page.waitForChanges();
            limelCollapsible = await page.find(
                'limel-collapsible-section-stateful >>> limel-collapsible-section'
            );
        });
        it('renders closed', async () => {
            expect(await statefulCollapsible.getProperty('isOpen')).toEqual(
                false
            );
        });
        it('does NOT emit `close` event', async () => {
            expect(closeEventSpy).not.toHaveReceivedEvent();
        });
    });

    describe('with stored state `isOpen=false` and `isOpen=true` set by consumer', () => {
        let closeEventSpy;
        beforeEach(async () => {
            page = await createPage('<div></div>');
            closeEventSpy = await page.spyOnEvent('close');
            await page.$eval('div', (element: HTMLElement) => {
                window.localStorage.setItem(
                    'limel-collapsible-section-stateful.myStateKey.isOpen',
                    JSON.stringify(false)
                );
                const collapsible = document.createElement(
                    'limel-collapsible-section-stateful'
                );
                (collapsible as any).header = 'Header text';
                (collapsible as any).stateKey = 'myStateKey';
                (collapsible as any).isOpen = true;
                element.appendChild(collapsible);
            });
            await page.waitForChanges();
            statefulCollapsible = await page.find(
                'limel-collapsible-section-stateful'
            );
            await page.waitForChanges();
            limelCollapsible = await page.find(
                'limel-collapsible-section-stateful >>> limel-collapsible-section'
            );
        });
        it('renders closed', async () => {
            expect(await statefulCollapsible.getProperty('isOpen')).toEqual(
                false
            );
        });
        it('emits `close` event', async () => {
            expect(closeEventSpy).toHaveReceivedEvent();
        });
    });
});

async function createPage(content: string) {
    return newE2EPage({ html: content });
}
