import {
    E2EElement,
    E2EPage,
    newE2EPage,
    EventSpy,
} from '@stencil/core/testing';
import { FlowItem } from './progress-flow.types';

describe('limel-progress-flow', () => {
    let page: E2EPage;
    let progressFlow: E2EElement;
    let progressFlowItems: E2EElement[];

    beforeEach(async () => {
        page = await createPage(`
        <limel-progress-flow></limel-progress-flow>
        `);
        progressFlow = await page.find('limel-progress-flow');
    });
    it('renders the component without any steps', () => {
        expect(progressFlow).toBeTruthy();
    });

    describe('when the progress flow contains three steps', () => {
        beforeEach(async () => {
            const flowItems: FlowItem[] = [
                { text: 'Customer contact' },
                { text: 'Demand analysis', selected: true },
                { text: 'Agreement' },
            ];
            progressFlow.setProperty('flowItems', flowItems);
            await page.waitForChanges();
            progressFlowItems = await page.findAll(
                'limel-progress-flow >>> limel-progress-flow-item'
            );
        });

        it('renders the first step correctly ', () => {
            const firstStep = progressFlowItems[0];
            expect(firstStep).toEqualText('Customer contact');
            expect(firstStep).toHaveClass('flow-item');
            expect(firstStep).toHaveClass('first');
            expect(firstStep).not.toHaveClass('last');
        });

        it('renders the second step correctly ', () => {
            const secondStep = progressFlowItems[1];
            expect(secondStep).toEqualText('Demand analysis');
            expect(secondStep).toHaveClass('flow-item');
            expect(secondStep).not.toHaveClass('first');
            expect(secondStep).not.toHaveClass('last');
        });

        it('renders the third step correctly ', () => {
            const thirdStep = progressFlowItems[2];
            expect(thirdStep).toEqualText('Agreement');
            expect(thirdStep).toHaveClass('flow-item');
            expect(thirdStep).not.toHaveClass('first');
            expect(thirdStep).toHaveClass('last');
        });

        it('renders the passed step correctly', () => {
            const passedStep = progressFlowItems[0];
            expect(passedStep).toHaveClass('passed');
            expect(passedStep).not.toHaveClass('selected');
        });

        it('renders the selected step correctly', () => {
            const selectedStep = progressFlowItems[1];
            expect(selectedStep).toHaveClass('selected');
            expect(selectedStep).not.toHaveClass('passed');
        });

        it('renders forthcoming step correctly', () => {
            const forthcomingSteps = progressFlowItems[2];
            expect(forthcomingSteps).not.toHaveClass('passed');
            expect(forthcomingSteps).not.toHaveClass('selected');
        });

        describe('when disabled', () => {
            let disabledItems: boolean[];
            beforeEach(async () => {
                progressFlow.setProperty('disabled', true);

                await page.waitForChanges();
                disabledItems = await getPropertyValueOnItems(
                    progressFlowItems,
                    'disabled'
                );
            });

            it('sets the flow items to disabled', () => {
                expect(disabledItems).not.toContain(false);
            });
        });

        describe('when readonly', () => {
            let disabledItems: boolean[];
            let readonlyItems: boolean[];
            beforeEach(async () => {
                progressFlow.setProperty('readonly', true);

                await page.waitForChanges();
                disabledItems = await getPropertyValueOnItems(
                    progressFlowItems,
                    'disabled'
                );
                readonlyItems = await getPropertyValueOnItems(
                    progressFlowItems,
                    'readonly'
                );
            });

            it('sets the flow items to disabled', () => {
                expect(disabledItems).not.toContain(false);
            });

            it('sets the flow items to readonly', () => {
                expect(readonlyItems).not.toContain(false);
            });
        });
    });

    describe('when the progress flow contains off progress steps', () => {
        let offProgressItems: E2EElement[];
        beforeEach(async () => {
            const flowItems: FlowItem[] = [
                { text: 'Customer contact' },
                { text: 'Demand analysis', selected: true },
                { text: 'Agreement', isOffProgress: true },
                { text: 'Rejected', isOffProgress: true },
            ];
            progressFlow.setProperty('flowItems', flowItems);
            await page.waitForChanges();
            offProgressItems = await page.findAll(
                'limel-progress-flow >>> .off-progress-item'
            );
        });

        it('only renders the off progress steps as off progress steps', () => {
            expect(offProgressItems.length).toEqual(2);
        });

        it('renders the first off progress step correctly', () => {
            const firstOffProgressStep = offProgressItems[0];
            expect(firstOffProgressStep).toEqualText('Agreement');
            expect(firstOffProgressStep).toHaveClass('first-off-progress-item');
            expect(firstOffProgressStep).not.toHaveClass(
                'last-off-progress-item'
            );
        });

        it('renders the last off progress step correctly', () => {
            const firstOffProgressStep = offProgressItems[1];
            expect(firstOffProgressStep).toEqualText('Rejected');
            expect(firstOffProgressStep).not.toHaveClass(
                'first-off-progress-item'
            );
            expect(firstOffProgressStep).toHaveClass('last-off-progress-item');
        });
    });

    describe('when a flow item is clicked', () => {
        let spy: EventSpy;

        beforeEach(async () => {
            spy = await progressFlow.spyOnEvent('change');
        });

        describe('when the flow item was not already selected', () => {
            beforeEach(async () => {
                const flowItems: FlowItem[] = [{ text: 'Customer contact' }];
                progressFlow.setProperty('flowItems', flowItems);
                await page.waitForChanges();
                progressFlowItems = await page.findAll(
                    'limel-progress-flow >>> limel-progress-flow-item'
                );
                await progressFlowItems[0].click();
            });

            it('emits a change event', async () => {
                expect(spy).toHaveReceivedEventTimes(1);
                expect(spy).toHaveReceivedEventDetail({
                    text: 'Customer contact',
                });
            });
        });

        describe('when the flow item was already selected', () => {
            beforeEach(async () => {
                const flowItems: FlowItem[] = [
                    { text: 'Customer contact', selected: true },
                ];
                progressFlow.setProperty('flowItems', flowItems);
                await page.waitForChanges();
                progressFlowItems = await page.findAll(
                    'limel-progress-flow >>> limel-progress-flow-item'
                );
                await progressFlowItems[0].click();
            });

            it('does not emit a change event', () => {
                expect(spy).toHaveReceivedEventTimes(0);
            });
        });
    });
});

async function getPropertyValueOnItems(
    progressFlowItems: E2EElement[],
    property: string
) {
    return Promise.all(
        progressFlowItems.map(async (item) => item.getProperty(property))
    );
}

async function createPage(content) {
    return newE2EPage({ html: content });
}
