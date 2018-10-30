import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('limel-chip-set', async () => {
    let page: E2EPage;

    describe('basic chip set', () => {
        beforeEach(async () => {
            page = await createPage(`<limel-chip-set></limel-chip-set>`);

            const chipSet = await page.find('limel-chip-set');
            chipSet.setProperty('value', [
                {
                    id: '1',
                    text: 'Lime',
                },
                {
                    id: '2',
                    text: 'Apple',
                },
            ]);

            await page.waitForChanges();
        });

        it('renders the chips', async () => {
            const chips: E2EElement[] = await page.findAll(
                'limel-chip-set >>> .mdc-chip'
            );

            expect(chips.length).toEqual(2);
            expect(chips[0]).toEqualText('Lime');
            expect(chips[1]).toEqualText('Apple');
        });

        describe('when a chip is clicked', () => {
            let spy;

            beforeEach(async () => {
                const chipSet: E2EElement = await page.find('limel-chip-set');
                spy = await chipSet.spyOnEvent('interact');
                const chip: E2EElement = await page.find(
                    'limel-chip-set >>> .mdc-chip'
                );
                await chip.click();
            });

            it('emits an interact event', () => {
                expect(spy).toHaveReceivedEventDetail({
                    id: '1',
                    text: 'Lime',
                });
            });
        });
    });

    describe('basic chip set with removable chips', () => {
        beforeEach(async () => {
            page = await createPage(`<limel-chip-set></limel-chip-set>`);

            const chipSet = await page.find('limel-chip-set');

            const enableErrorLogger = disableErrorLogger();
            chipSet.setProperty('value', [
                {
                    id: '1',
                    text: 'Lime',
                    removable: true,
                },
                {
                    id: '2',
                    text: 'Apple',
                },
            ]);

            await page.waitForChanges();
            enableErrorLogger();
        });

        it('renders the chips correctly', async () => {
            const chips: E2EElement[] = await page.findAll(
                'limel-chip-set >>> .mdc-chip'
            );

            expect(chips.length).toEqual(2);
            expect(chips[0]).toEqualText('Lime');
            expect(chips[1]).toEqualText('Apple');

            let button = await chips[0].find(
                'limel-icon[name="Science/multiply"][role="button"]'
            );
            expect(button).toBeTruthy();

            button = await chips[1].find(
                'limel-icon[name="Science/multiply"][role="button"]'
            );
            expect(button).toBeFalsy();
        });

        describe('when a chip delete button is clicked', () => {
            let spy;

            beforeEach(async () => {
                const chipSet: E2EElement = await page.find('limel-chip-set');
                spy = await chipSet.spyOnEvent('change');
                const button: E2EElement = await page.find(
                    'limel-chip-set >>> .mdc-chip limel-icon[role="button"]'
                );
                await button.click();
            });

            it('emits an change event', () => {
                expect(spy).toHaveReceivedEventDetail([
                    {
                        id: '2',
                        text: 'Apple',
                    },
                ]);
            });
        });
    });

    describe('choice chip set', () => {
        beforeEach(async () => {
            page = await createPage(
                `<limel-chip-set type="choice"></limel-chip-set>`
            );

            const chipSet = await page.find('limel-chip-set');
            chipSet.setProperty('value', [
                {
                    id: '1',
                    text: 'Lime',
                    selected: true,
                },
                {
                    id: '2',
                    text: 'Apple',
                },
            ]);

            await page.waitForChanges();
        });

        it('renders the chips correctly', async () => {
            const chips: E2EElement[] = await page.findAll(
                'limel-chip-set >>> .mdc-chip'
            );

            expect(chips.length).toEqual(2);
            expect(chips[0]).toEqualText('Lime');
            expect(chips[1]).toEqualText('Apple');

            expect(chips[0]).toHaveClass('mdc-chip--selected');
            expect(chips[1]).not.toHaveClass('mdc-chip--selected');
        });

        describe('when the first chip is clicked', () => {
            let spy;

            beforeEach(async () => {
                const chipSet: E2EElement = await page.find('limel-chip-set');
                spy = await chipSet.spyOnEvent('change');
                const chip: E2EElement = await page.find(
                    'limel-chip-set >>> .mdc-chip'
                );
                await chip.click();
            });

            it('emits a change event', () => {
                expect(spy).toHaveReceivedEventDetail({
                    id: '1',
                    text: 'Lime',
                    selected: false,
                });
            });

            it('deselects the first chip', async () => {
                const chips: E2EElement[] = await page.findAll(
                    'limel-chip-set >>> .mdc-chip'
                );

                expect(chips[0]).not.toHaveClass('mdc-chip--selected');
            });

            it('does not select the second chip', async () => {
                const chips: E2EElement[] = await page.findAll(
                    'limel-chip-set >>> .mdc-chip'
                );

                expect(chips[1]).not.toHaveClass('mdc-chip--selected');
            });
        });

        describe('when the second chip is clicked', () => {
            let spy;

            beforeEach(async () => {
                const chipSet: E2EElement = await page.find('limel-chip-set');
                spy = await chipSet.spyOnEvent('change');
                const chips: E2EElement[] = await page.findAll(
                    'limel-chip-set >>> .mdc-chip'
                );
                await chips[1].click();
            });

            it('emits two change events', () => {
                expect(spy).toHaveReceivedEventTimes(2);
                expect(spy.events[0].detail).toEqual({
                    id: '1',
                    text: 'Lime',
                    selected: false,
                });
                expect(spy.events[1].detail).toEqual({
                    id: '2',
                    text: 'Apple',
                    selected: true,
                });
            });

            it('deselects the first chip', async () => {
                const chips: E2EElement[] = await page.findAll(
                    'limel-chip-set >>> .mdc-chip'
                );

                expect(chips[0]).not.toHaveClass('mdc-chip--selected');
            });

            it('selects the second chip', async () => {
                const chips: E2EElement[] = await page.findAll(
                    'limel-chip-set >>> .mdc-chip'
                );

                expect(chips[1]).toHaveClass('mdc-chip--selected');
            });
        });
    });

    describe('filter chip set', () => {
        beforeEach(async () => {
            page = await createPage(
                `<limel-chip-set type="filter"></limel-chip-set>`
            );

            const chipSet = await page.find('limel-chip-set');
            chipSet.setProperty('value', [
                {
                    id: '1',
                    text: 'Lime',
                    selected: true,
                },
                {
                    id: '2',
                    text: 'Apple',
                },
            ]);

            await page.waitForChanges();
        });

        it('renders the chips correctly', async () => {
            const chips: E2EElement[] = await page.findAll(
                'limel-chip-set >>> .mdc-chip'
            );

            expect(chips.length).toEqual(2);
            expect(chips[0]).toEqualText('Lime');
            expect(chips[1]).toEqualText('Apple');

            expect(chips[0]).toHaveClass('mdc-chip--selected');
            expect(chips[1]).not.toHaveClass('mdc-chip--selected');
        });

        describe('when the first chip is clicked', () => {
            let spy;

            beforeEach(async () => {
                const chipSet: E2EElement = await page.find('limel-chip-set');
                spy = await chipSet.spyOnEvent('change');
                const chip: E2EElement = await page.find(
                    'limel-chip-set >>> .mdc-chip'
                );
                await chip.click();
            });

            it('emits a change event', () => {
                expect(spy).toHaveReceivedEventDetail({
                    id: '1',
                    text: 'Lime',
                    selected: false,
                });
            });

            it('deselects the first chip', async () => {
                const chips: E2EElement[] = await page.findAll(
                    'limel-chip-set >>> .mdc-chip'
                );

                expect(chips[0]).not.toHaveClass('mdc-chip--selected');
            });

            it('does not select the second chip', async () => {
                const chips: E2EElement[] = await page.findAll(
                    'limel-chip-set >>> .mdc-chip'
                );

                expect(chips[1]).not.toHaveClass('mdc-chip--selected');
            });
        });

        describe('when the second chip is clicked', () => {
            let spy;

            beforeEach(async () => {
                const chipSet: E2EElement = await page.find('limel-chip-set');
                spy = await chipSet.spyOnEvent('change');
                const chips: E2EElement[] = await page.findAll(
                    'limel-chip-set >>> .mdc-chip'
                );
                await chips[1].click();
            });

            it('emits a change event', () => {
                expect(spy).toHaveReceivedEventDetail({
                    id: '2',
                    text: 'Apple',
                    selected: true,
                });
            });

            it('deselects the first chip', async () => {
                const chips: E2EElement[] = await page.findAll(
                    'limel-chip-set >>> .mdc-chip'
                );

                expect(chips[0]).toHaveClass('mdc-chip--selected');
            });

            it('selects the second chip', async () => {
                const chips: E2EElement[] = await page.findAll(
                    'limel-chip-set >>> .mdc-chip'
                );

                expect(chips[1]).toHaveClass('mdc-chip--selected');
            });
        });
    });

    describe('input chip set', () => {
        beforeEach(async () => {
            page = await createPage(
                `<limel-chip-set type="input"></limel-chip-set>`
            );

            const chipSet = await page.find('limel-chip-set');
            chipSet.setProperty('value', [
                {
                    id: '1',
                    text: 'Lime',
                },
                {
                    id: '2',
                    text: 'Apple',
                },
            ]);

            await page.waitForChanges();
        });

        it('renders the chips correctly', async () => {
            const chips: E2EElement[] = await page.findAll(
                'limel-chip-set >>> .mdc-chip'
            );

            expect(chips.length).toEqual(2);
            expect(chips[0]).toEqualText('Lime');
            expect(chips[1]).toEqualText('Apple');
        });

        // Typing in an input field does not seem to work
        describe.skip('when typing in the input field', () => {
            let spy;

            beforeEach(async () => {
                const chipSet: E2EElement = await page.find('limel-chip-set');
                spy = await chipSet.spyOnEvent('input');

                const input: E2EElement = await page.find(
                    'limel-chip-set >>> input'
                );
                await input.focus();
                await input.type('Banana');
                await page.waitForChanges();
            });

            it('emits an input event', async () => {
                expect(spy).toHaveReceivedEventDetail('Banana');
            });
        });
    });
});

async function createPage(content) {
    return newE2EPage({ html: content });
}

/**
 * Temporarily disable the error logger
 *
 * @returns {*} a function to enable it again
 */
// tslint:disable:no-console
function disableErrorLogger() {
    const logger = console.error;
    console.error = () => {}; // tslint:disable-line:no-empty

    return () => {
        console.error = logger;
    };
}
