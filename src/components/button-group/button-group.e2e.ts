import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('limel-button-group', () => {
    let page: E2EPage;
    let buttonGroup: E2EElement;
    let buttons: E2EElement[];
    let spyForDeprecatedEvent;
    let spy;

    describe('basic button group', () => {
        beforeEach(async () => {
            page = await createPage(
                '<limel-button-group></limel-button-group>'
            );

            buttonGroup = await page.find('limel-button-group');
            buttonGroup.setProperty('value', [
                {
                    id: '1',
                    title: 'Lime',
                },
                {
                    id: '2',
                    title: 'Apple',
                    icon: 'unit-test',
                },
                {
                    id: '3',
                    title: 'Tasks',
                    badge: 10,
                },
            ]);
            await page.waitForChanges();

            buttons = await page.findAll('limel-button-group >>> .mdc-chip');

            spyForDeprecatedEvent = await buttonGroup.spyOnEvent('change');
            spy = await buttonGroup.spyOnEvent('limelChange');
        });

        it('renders the buttons', () => {
            expect(buttons.length).toEqual(3);
            expect(buttons[0]).toEqualText('Lime');
        });

        describe('when a button is clicked', () => {
            beforeEach(async () => {
                await buttons[0].click();
            });

            it('emits a change event (deprecated)', () => {
                expect(spyForDeprecatedEvent).toHaveReceivedEventTimes(1);
                expect(spyForDeprecatedEvent).toHaveReceivedEventDetail({
                    id: '1',
                    title: 'Lime',
                });
            });

            it('emits a limelChange event', () => {
                expect(spy).toHaveReceivedEventTimes(1);
                expect(spy).toHaveReceivedEventDetail({
                    id: '1',
                    title: 'Lime',
                });
            });
        });
    });
});

async function createPage(content) {
    return newE2EPage({ html: content });
}
