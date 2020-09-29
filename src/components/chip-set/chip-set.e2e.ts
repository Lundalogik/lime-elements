import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('limel-chip-set', () => {
    let page: E2EPage;
    let chipSet: E2EElement;
    let chips: E2EElement[];
    let spy;

    describe('basic chip set', () => {
        beforeEach(async () => {
            page = await createPage('<limel-chip-set></limel-chip-set>');

            chipSet = await page.find('limel-chip-set');
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

            chips = await page.findAll('limel-chip-set >>> .mdc-chip');

            spy = await chipSet.spyOnEvent('interact');
        });

        it('renders the chips', () => {
            expect(chips.length).toEqual(2);
            expect(chips[0]).toEqualText('Lime');
            expect(chips[1]).toEqualText('Apple');
        });

        describe('when a chip is clicked', () => {
            beforeEach(async () => {
                await chips[0].click();
            });

            it('emits an interact event', () => {
                expect(spy).toHaveReceivedEventTimes(1);
                expect(spy).toHaveReceivedEventDetail({
                    id: '1',
                    text: 'Lime',
                });
            });
        });
    });

    describe('choice chip set', () => {
        beforeEach(async () => {
            page = await createPage(
                '<limel-chip-set type="choice"></limel-chip-set>'
            );

            chipSet = await page.find('limel-chip-set');
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

            chips = await page.findAll('limel-chip-set >>> .mdc-chip');

            spy = await chipSet.spyOnEvent('change');
        });

        it('renders the chips correctly', () => {
            expect(chips.length).toEqual(2);
            expect(chips[0]).toEqualText('Lime');
            expect(chips[1]).toEqualText('Apple');

            expect(chips[0]).toHaveClass('mdc-chip--selected');
            expect(chips[1]).not.toHaveClass('mdc-chip--selected');
        });

        describe('when the first chip is clicked', () => {
            beforeEach(async () => {
                await chips[0].click();
            });

            it('emits a change event', () => {
                expect(spy).toHaveReceivedEventTimes(1);
                expect(spy).toHaveReceivedEventDetail({
                    id: '1',
                    text: 'Lime',
                    selected: false,
                });
            });

            it('deselects the first chip', () => {
                expect(chips[0]).not.toHaveClass('mdc-chip--selected');
            });

            it('does not select the second chip', () => {
                expect(chips[1]).not.toHaveClass('mdc-chip--selected');
            });
        });

        describe('when the second chip is clicked', () => {
            beforeEach(async () => {
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
                expect(chips[0]).not.toHaveClass('mdc-chip--selected');
            });

            it('selects the second chip', async () => {
                expect(chips[1]).toHaveClass('mdc-chip--selected');
            });
        });
    });

    describe('filter chip set', () => {
        beforeEach(async () => {
            page = await createPage(
                '<limel-chip-set type="filter"></limel-chip-set>'
            );

            chipSet = await page.find('limel-chip-set');
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

            chips = await page.findAll('limel-chip-set >>> .mdc-chip');

            spy = await chipSet.spyOnEvent('change');
        });

        it('renders the chips correctly', () => {
            expect(chips.length).toEqual(2);
            expect(chips[0]).toEqualText('Lime');
            expect(chips[1]).toEqualText('Apple');

            expect(chips[0]).toHaveClass('mdc-chip--selected');
            expect(chips[1]).not.toHaveClass('mdc-chip--selected');
        });

        describe('when the first chip is clicked', () => {
            beforeEach(async () => {
                await chips[0].click();
            });

            it('emits a change event', () => {
                expect(spy).toHaveReceivedEventTimes(1);
                expect(spy.events[0].detail).toEqual({
                    id: '1',
                    text: 'Lime',
                    selected: false,
                });
            });

            it('deselects the first chip', () => {
                expect(chips[0]).not.toHaveClass('mdc-chip--selected');
            });

            it('does not select the second chip', () => {
                expect(chips[1]).not.toHaveClass('mdc-chip--selected');
            });
        });

        describe('when the second chip is clicked', () => {
            beforeEach(async () => {
                await chips[1].click();
            });

            it('emits a change event', () => {
                expect(spy).toHaveReceivedEventTimes(1);
                expect(spy).toHaveReceivedEventDetail({
                    id: '2',
                    text: 'Apple',
                    selected: true,
                });
            });

            it('deselects the first chip', () => {
                expect(chips[0]).toHaveClass('mdc-chip--selected');
            });

            it('selects the second chip', () => {
                expect(chips[1]).toHaveClass('mdc-chip--selected');
            });
        });
    });

    describe('input chip set', () => {
        let firstChipRemoveButton;
        let secondChipRemoveButton;

        beforeEach(async () => {
            page = await createPage(
                '<limel-chip-set type="input"></limel-chip-set>'
            );

            chipSet = await page.find('limel-chip-set');
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

            chips = await page.findAll('limel-chip-set >>> .mdc-chip');

            firstChipRemoveButton = await chips[0].find('div[role="button"]');
            secondChipRemoveButton = await chips[1].find('div[role="button"]');
        });

        it('renders the chips correctly', () => {
            expect(chips.length).toEqual(2);
            expect(chips[0]).toEqualText('Lime');
            expect(chips[1]).toEqualText('Apple');

            expect(firstChipRemoveButton).toBeTruthy();
            expect(secondChipRemoveButton).toBeFalsy();
        });

        describe('when typing in the input field', () => {
            beforeEach(async () => {
                spy = await chipSet.spyOnEvent('input');

                const input: E2EElement = await page.find(
                    'limel-chip-set >>> input'
                );
                await input.focus();
                await input.type('Banana');
                await page.waitForChanges();
            });

            it('emits an input event', () => {
                expect(spy).toHaveReceivedEventTimes(6);
                expect(spy.events[0].detail).toEqual('B');
                expect(spy.events[5].detail).toEqual('Banana');
            });
        });

        describe('when a chip is clicked', () => {
            beforeEach(async () => {
                spy = await chipSet.spyOnEvent('interact');
                await chips[0].click();
            });

            it('emits an interact event with the clicked chip', () => {
                expect(spy).toHaveReceivedEventTimes(1);
                expect(spy.events[0].detail).toEqual({
                    id: '1',
                    text: 'Lime',
                    removable: true,
                });
            });
        });

        describe('when a chip delete button is clicked', () => {
            beforeEach(async () => {
                spy = await chipSet.spyOnEvent('change');
                await firstChipRemoveButton.click();
            });

            it('emits a change event where the removed chip is not present', () => {
                expect(spy).toHaveReceivedEventTimes(1);
                expect(spy.events[0].detail).toEqual([
                    {
                        id: '2',
                        text: 'Apple',
                    },
                ]);
            });
        });

        describe('when disabled', () => {
            beforeEach(async () => {
                chipSet.setAttribute('disabled', true);
                await page.waitForChanges();

                firstChipRemoveButton = await chips[0].find(
                    'div[role="button"]'
                );
                secondChipRemoveButton = await chips[1].find(
                    'div[role="button"]'
                );
            });

            it('renders the chips without delete-buttons', async () => {
                expect(chips.length).toEqual(2);
                expect(chips[0]).toEqualText('Lime');
                expect(chips[1]).toEqualText('Apple');

                expect(firstChipRemoveButton).toBeFalsy();
                expect(secondChipRemoveButton).toBeFalsy();
            });
        });

        describe('when readonly', () => {
            beforeEach(async () => {
                chipSet.setAttribute('readonly', true);
                await page.waitForChanges();

                firstChipRemoveButton = await chips[0].find(
                    'div[role="button"]'
                );
                secondChipRemoveButton = await chips[1].find(
                    'div[role="button"]'
                );
            });

            it('renders the chips without delete-buttons', async () => {
                expect(chips.length).toEqual(2);
                expect(chips[0]).toEqualText('Lime');
                expect(chips[1]).toEqualText('Apple');

                expect(firstChipRemoveButton).toBeFalsy();
                expect(secondChipRemoveButton).toBeFalsy();
            });
        });

        describe('when the clear chips button is pressed', () => {
            beforeEach(async () => {
                spy = await page.spyOnEvent('change');
                const deleteAllIconButton: E2EElement = await page.find(
                    'limel-chip-set >>> .clear-all-button'
                );
                await chipSet.hover();
                await deleteAllIconButton.click();
            });

            it('emits a change event where the all chips are removed', () => {
                expect(spy).toHaveReceivedEventTimes(1);
                expect(spy.events[0].detail).toEqual([]);
            });
        });
    });
});

async function createPage(content) {
    return newE2EPage({ html: content });
}
